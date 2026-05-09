// src/hooks/useTheme.ts
import { useThemeStore } from '../store/themeStore';

// Light palette
const light = {
  background:   '#F8F8F8',
  surface:      '#FFFFFF',
  card:         '#FFFFFF',
  border:       '#E8E8E8',
  borderStrong: '#D0D0D0',
  text:         '#1a1a1a',
  textSecondary:'#6B6B6B',
  textLight:    '#9B9B9B',
  textInverse:  '#FFFFFF',
  primary:      '#1a1a1a',
  accent:       '#2D6A4F',
  accentLight:  '#52B788',
  error:        '#D62828',
  inputBg:      '#F8F8F8',
  skeletonBase: '#E8E8E8',
  skeletonHigh: '#F5F5F5',
  statusBar:    'dark' as const,
  tabBar:       '#FFFFFF',
  overlay:      'rgba(0,0,0,0.5)',
};

// Dark palette
const dark = {
  background:   '#0F0F0F',
  surface:      '#1A1A1A',
  card:         '#242424',
  border:       '#2C2C2C',
  borderStrong: '#3C3C3C',
  text:         '#FFFFFF',
  textSecondary:'#A0A0A0',
  textLight:    '#606060',
  textInverse:  '#1a1a1a',
  primary:      '#FFFFFF',
  accent:       '#52B788',
  accentLight:  '#74C69D',
  error:        '#FF6B6B',
  inputBg:      '#242424',
  skeletonBase: '#2C2C2C',
  skeletonHigh: '#3C3C3C',
  statusBar:    'light' as const,
  tabBar:       '#1A1A1A',
  overlay:      'rgba(0,0,0,0.75)',
};

export type ThemeColors = typeof light;

export function useTheme() {
  const { isDark, toggleTheme } = useThemeStore();
  const colors = isDark ? dark : light;
  return { colors, isDark, toggleTheme };
}