// src/store/favoritesStore.ts
import { create } from 'zustand';

interface FavoritesState {
  ids: string[];
  toggle: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: [],

  toggle: (productId) => {
    const current = get().ids;
    const exists = current.includes(productId);
    set({
      ids: exists
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    });
  },

  isFavorite: (productId) => get().ids.includes(productId),
}));