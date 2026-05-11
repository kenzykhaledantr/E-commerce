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

export interface OrderItem {
  productId:    string;
  productName:  string;
  productImage: string;
  price:        number;
  quantity:     number;
}

export interface OrderDetail {
  id:              string;
  userId:          string;
  items:           OrderItem[];
  total:           number;
  status:          string;
  shippingAddress: any;
  deliveryMethod:  any;
  paymentMethod:   string;
  createdAt:       Date;
}



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

// src/services/orderService.ts
export const getUserOrders = async (
  userId: string
): Promise<OrderDetail[]> => {
  try {
    console.log('Fetching orders for userId:', userId);

    const snap = await getDocs(
      query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
    );

    console.log('Orders found:', snap.docs.length);
    console.log('Order IDs:', snap.docs.map(d => d.id));

    // Log the userId stored in each doc
    snap.docs.forEach(d => {
      console.log('Doc userId field:', d.data().userId);
    });

    return snap.docs.map((d) => ({
      id:       d.id,
      ...(d.data() as any),
      createdAt: d.data().createdAt?.toDate() ?? new Date(),
    }));
  } catch (error: any) {
    console.error('getUserOrders error:', error.code, error.message);
    throw error;
  }
};

