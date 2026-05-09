// src/store/themeStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeState {
  isDark:       boolean;
  hydrated:     boolean;
  toggleTheme:  () => void;
  setDark:      (val: boolean) => void;
  hydrate:      () => Promise<void>;
}

const STORAGE_KEY = '@elite_retail_theme';

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDark:    false,
  hydrated:  false,

  toggleTheme: async () => {
    const next = !get().isDark;
    set({ isDark: next });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  },

  setDark: async (val: boolean) => {
    set({ isDark: val });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(val));
  },

  // Call once on app start to restore saved preference
  hydrate: async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        set({ isDark: JSON.parse(saved) });
      }
    } catch (e) {
      console.warn('Failed to load theme:', e);
    } finally {
      set({ hydrated: true });
    }
  },
}));