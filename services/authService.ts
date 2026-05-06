// src/services/authService.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import type { User } from '../types';

// ─── Convert Firebase user → our User type ─────────────────────
const formatUser = (firebaseUser: FirebaseUser): User => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email ?? '',
  displayName: firebaseUser.displayName ?? 'User',
  photoURL: firebaseUser.photoURL ?? undefined,
  createdAt: new Date(),
});

// ─── Register ──────────────────────────────────────────────────
export const registerUser = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  const { user: firebaseUser } = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  // Add display name to Firebase Auth profile
  await updateProfile(firebaseUser, { displayName });

  const user = formatUser(firebaseUser);

  // Save user profile to Firestore users collection
  await setDoc(doc(db, 'users', firebaseUser.uid), {
    uid: user.uid,
    email: user.email,
    displayName,
    photoURL: null,
    createdAt: serverTimestamp(),
  });

  return { ...user, displayName };
};

// ─── Login ─────────────────────────────────────────────────────
export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  const { user: firebaseUser } = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return formatUser(firebaseUser);
};

// ─── Logout ────────────────────────────────────────────────────
export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

// ─── Auth state listener ───────────────────────────────────────
// Call this once on app start. It fires immediately with the
// current user (or null), which sets isLoading → false.
// src/services/authService.ts (update subscribeToAuthState)
export const subscribeToAuthState = (
  onUser: (user: User | null) => void
): (() => void) => {
  console.log('🔥 Setting up auth state listener...');
  
  return onAuthStateChanged(auth, async (firebaseUser) => {
    console.log('🔥 Auth state changed:', firebaseUser ? 'User exists' : 'No user');
    
    if (firebaseUser) {
      console.log('👤 Firebase user:', {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
      });
      
      // Fetch extra profile data from Firestore
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          console.log('✅ Firestore user doc found');
          const data = userDoc.data();
          const user = {
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? '',
            displayName: data.displayName ?? firebaseUser.displayName ?? 'User',
            photoURL: data.photoURL ?? undefined,
            createdAt: data.createdAt?.toDate() ?? new Date(),
          };
          console.log('✅ Calling onUser with:', user);
          onUser(user);
        } else {
          console.log('⚠️ No Firestore doc, using Firebase user');
          onUser(formatUser(firebaseUser));
        }
      } catch (error) {
        console.error('❌ Firestore fetch error:', error);
        onUser(formatUser(firebaseUser));
      }
    } else {
      console.log('🚪 No user, calling onUser(null)');
      onUser(null); // Not logged in
    }
  });
};