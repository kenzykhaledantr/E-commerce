// src/types/index.ts

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;       // for showing discounts
  category: ProductCategory;
  images: string[];             // array of storage URLs
  rating: number;               // 0–5
  reviewCount: number;
  stock: number;
  tags: string[];
  createdAt: Date;
}

export type ProductCategory =
  | 'handbags'
  | 'clothing'
  | 'electronics'
  | 'footwear'
  | 'watches'
  | 'accessories';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

// src/types/index.ts — update Address interface
export interface Address {
  id: string;
  label: string;          // 'Home' | 'Office' | 'Other'
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

export interface DeliveryMethod {
  id: string;
  label: string;
  description: string;
  price: number;
  estimatedDays: number;
}



export type PaymentMethod = 'card' | 'paypal' | 'apple_pay';

export type Wishlist = {
  id: string;
  userId: string;
  productIds: string[];
  createdAt: string; // ISO date string
};