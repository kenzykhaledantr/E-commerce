// src/utils/constants.ts
export const APP_NAME = 'Elite Retail';

export const COLORS = {
  // Brand
  primary: '#1a1a1a',        // dark charcoal
  accent: '#2D6A4F',         // deep green
  accentLight: '#52B788',

  // Neutrals
  white: '#FFFFFF',
  offWhite: '#F8F8F8',
  border: '#E8E8E8',
  borderDark: '#2C2C2C',

  // Text
  textPrimary: '#1a1a1a',
  textSecondary: '#6B6B6B',
  textLight: '#9B9B9B',
  textWhite: '#FFFFFF',

  // Status
  success: '#2D6A4F',
  error: '#D62828',
  warning: '#F4A261',

  // Dark surfaces
  dark: {
    background: '#0F0F0F',
    surface: '#1A1A1A',
    card: '#242424',
    border: '#2C2C2C',
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const RADIUS = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

