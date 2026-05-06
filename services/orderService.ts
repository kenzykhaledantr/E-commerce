// src/services/orderService.ts
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { CartItem, Order, Address, DeliveryMethod } from '../types';

export const createOrder = async (
  userId: string,
  items: CartItem[],
  total: number,
  shippingAddress: Address,
  deliveryMethod: DeliveryMethod,
  paymentMethod: string
): Promise<string> => {
  const ref = await addDoc(collection(db, 'orders'), {
    userId,
    items: items.map((i) => ({
      productId: i.product.id,
      productName: i.product.name,
      productImage: i.product.images[0],
      price: i.product.price,
      quantity: i.quantity,
    })),
    total,
    status: 'confirmed',
    shippingAddress,
    deliveryMethod,
    paymentMethod,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const snap = await getDocs(
    query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as any),
    createdAt: d.data().createdAt?.toDate() ?? new Date(),
    updatedAt: d.data().updatedAt?.toDate() ?? new Date(),
  }));
};