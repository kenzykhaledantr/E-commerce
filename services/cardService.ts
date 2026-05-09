// src/services/cardService.ts
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
import type { PaymentCard } from '../types';

const cardsRef = (uid: string) =>
  collection(db, 'users', uid, 'cards');

// ─── Detect card type from number ─────────────────────────────
export const detectCardType = (
  number: string
): PaymentCard['cardType'] => {
  const clean = number.replace(/\s/g, '');
  if (/^4/.test(clean))          return 'visa';
  if (/^5[1-5]/.test(clean))     return 'mastercard';
  if (/^3[47]/.test(clean))      return 'amex';
  return 'other';
};

// ─── Card color per type ───────────────────────────────────────
export const getCardColor = (type: PaymentCard['cardType']): string => {
  const colors = {
    visa:       '#1a1a2e',
    mastercard: '#16213e',
    amex:       '#0f3460',
    other:      '#2d3561',
  };
  return colors[type];
};

// ─── Format card number with spaces ───────────────────────────
export const formatCardNumber = (value: string): string => {
  const clean = value.replace(/\D/g, '').slice(0, 16);
  return clean.replace(/(\d{4})(?=\d)/g, '$1 ');
};

// ─── Format expiry MM/YY ──────────────────────────────────────
export const formatExpiry = (value: string): string => {
  const clean = value.replace(/\D/g, '').slice(0, 4);
  if (clean.length >= 2) {
    return clean.slice(0, 2) + '/' + clean.slice(2);
  }
  return clean;
};

// ─── Fetch all cards ──────────────────────────────────────────
export const getCards = async (uid: string): Promise<PaymentCard[]> => {
  const snap = await getDocs(
    query(cardsRef(uid), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<PaymentCard, 'id'>),
  }));
};

// ─── Add card ─────────────────────────────────────────────────
export const addCard = async (
  uid:  string,
  card: Omit<PaymentCard, 'id'>
): Promise<string> => {
  if (card.isDefault) await clearDefaultCards(uid);
  const ref = await addDoc(cardsRef(uid), {
    ...card,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

// ─── Delete card ──────────────────────────────────────────────
export const deleteCard = async (
  uid:    string,
  cardId: string
): Promise<void> => {
  await deleteDoc(doc(db, 'users', uid, 'cards', cardId));
};

// ─── Set default card ─────────────────────────────────────────
export const setDefaultCard = async (
  uid:    string,
  cardId: string
): Promise<void> => {
  const batch = writeBatch(db);
  const snap  = await getDocs(cardsRef(uid));
  snap.docs.forEach((d) => {
    batch.update(d.ref, { isDefault: d.id === cardId });
  });
  await batch.commit();
};

// ─── Clear all defaults ───────────────────────────────────────
const clearDefaultCards = async (uid: string): Promise<void> => {
  const batch = writeBatch(db);
  const snap  = await getDocs(cardsRef(uid));
  snap.docs.forEach((d) => {
    if (d.data().isDefault) batch.update(d.ref, { isDefault: false });
  });
  await batch.commit();
};