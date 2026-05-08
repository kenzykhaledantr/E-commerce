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
// src/services/authService.ts
// Update subscribeToAuthState to ensure user doc exists

export const subscribeToAuthState = (
  onUser: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc    = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          onUser({
            uid:         firebaseUser.uid,
            email:       firebaseUser.email ?? '',
            displayName: data.displayName ?? firebaseUser.displayName ?? 'User',
            photoURL:    data.photoURL ?? undefined,
            createdAt:   data.createdAt?.toDate() ?? new Date(),
          });
        } else {
          // ← User doc missing — create it now
          // This handles users who registered before Firestore write was added
          await setDoc(userDocRef, {
            uid:         firebaseUser.uid,
            email:       firebaseUser.email ?? '',
            displayName: firebaseUser.displayName ?? 'User',
            photoURL:    null,
            createdAt:   serverTimestamp(),
          });
          onUser({
            uid:         firebaseUser.uid,
            email:       firebaseUser.email ?? '',
            displayName: firebaseUser.displayName ?? 'User',
            photoURL:    undefined,
            createdAt:   new Date(),
          });
        }
      } catch (error) {
        console.error('Auth state error:', error);
        onUser(null);
      }
    } else {
      onUser(null);
    }
  });
};