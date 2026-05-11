// src/store/cartStore.ts
import { create } from 'zustand';
import type { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, selectedSize?: string) => void;
  removeItem: (productId: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product, quantity = 1, selectedSize) => {
    const existing = get().items.find((i) => 
      i.product.id === product.id && i.selectedSize === selectedSize
    );
    if (existing) {
      set({
        items: get().items.map((i) =>
          i.product.id === product.id && i.selectedSize === selectedSize
            ? { ...i, quantity: i.quantity + quantity }
            : i
        ),
      });
    } else {
      set({ items: [...get().items, { product, quantity, selectedSize }] });
    }
  },

  removeItem: (productId, selectedSize) =>
    set({ items: get().items.filter((i) => i.product.id !== productId || i.selectedSize !== selectedSize) }),

  updateQuantity: (productId, quantity, selectedSize) => {
    if (quantity <= 0) {
      get().removeItem(productId, selectedSize);
      return;
    }
    set({
      items: get().items.map((i) =>
        i.product.id === productId && i.selectedSize === selectedSize 
          ? { ...i, quantity } 
          : i
      ),
    });
  },

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  totalPrice: () =>
    get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
}));