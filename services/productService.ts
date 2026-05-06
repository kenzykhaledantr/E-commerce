// src/services/productService.ts
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Product, ProductCategory } from '../types';

const fromDoc = (docSnap: any): Product => ({
  id: docSnap.id,
  ...docSnap.data(),
  createdAt: docSnap.data().createdAt?.toDate() ?? new Date(),
});

// Fetch all products
export const getProducts = async (): Promise<Product[]> => {
  const snap = await getDocs(
    query(collection(db, 'products'), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map(fromDoc);
};

// Fetch by category
export const getProductsByCategory = async (
  category: ProductCategory
): Promise<Product[]> => {
  const snap = await getDocs(
    query(
      collection(db, 'products'),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    )
  );
  return snap.docs.map(fromDoc);
};

// Fetch single product
export const getProduct = async (id: string): Promise<Product | null> => {
  const snap = await getDoc(doc(db, 'products', id));
  return snap.exists() ? fromDoc(snap) : null;
};

// Fetch new arrivals (last 4)
export const getNewArrivals = async (): Promise<Product[]> => {
  const snap = await getDocs(
    query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(4))
  );
  return snap.docs.map(fromDoc);
};