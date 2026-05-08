// src/services/addressService.ts
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  writeBatch,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Address } from '../types';

// Helper — addresses live as a subcollection under users/{uid}/addresses
const addressesRef = (uid: string) =>
  collection(db, 'users', uid, 'addresses');

// ─── Fetch all addresses ───────────────────────────────────────
export const getAddresses = async (uid: string): Promise<Address[]> => {
  const snap = await getDocs(
    query(addressesRef(uid), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Address, 'id'>),
  }));
};

// ─── Add new address ───────────────────────────────────────────
// src/services/addressService.ts
// Update addAddress with better error handling

export const addAddress = async (
  uid: string,
  address: Omit<Address, 'id'>
): Promise<string> => {
  try {
    if (address.isDefault) {
      await clearDefaultAddresses(uid);
    }

    const ref = await addDoc(addressesRef(uid), {
      ...address,
      createdAt: serverTimestamp(),
    });

    return ref.id;
  } catch (error: any) {
    console.error('addAddress error:', error.code, error.message);
    // Re-throw with readable message
    if (error.code === 'permission-denied') {
      throw new Error(
        'Permission denied. Please log out and log back in, then try again.'
      );
    }
    throw error;
  }
};
// ─── Update address ────────────────────────────────────────────
export const updateAddress = async (
  uid: string,
  addressId: string,
  updates: Partial<Omit<Address, 'id'>>
): Promise<void> => {
  if (updates.isDefault) {
    await clearDefaultAddresses(uid);
  }
  await updateDoc(
    doc(db, 'users', uid, 'addresses', addressId),
    { ...updates, updatedAt: serverTimestamp() }
  );
};

// ─── Delete address ────────────────────────────────────────────
export const deleteAddress = async (
  uid: string,
  addressId: string
): Promise<void> => {
  await deleteDoc(doc(db, 'users', uid, 'addresses', addressId));
};

// ─── Set as default ────────────────────────────────────────────
export const setDefaultAddress = async (
  uid: string,
  addressId: string
): Promise<void> => {
  // Use batch to unset all defaults + set new one atomically
  const batch = writeBatch(db);
  const snap  = await getDocs(addressesRef(uid));

  snap.docs.forEach((d) => {
    batch.update(d.ref, { isDefault: d.id === addressId });
  });

  await batch.commit();
};

// ─── Helper — clear all defaults ──────────────────────────────
const clearDefaultAddresses = async (uid: string): Promise<void> => {
  const batch = writeBatch(db);
  const snap  = await getDocs(addressesRef(uid));
  snap.docs.forEach((d) => {
    if (d.data().isDefault) {
      batch.update(d.ref, { isDefault: false });
    }
  });
  await batch.commit();
};