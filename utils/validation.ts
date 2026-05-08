// src/utils/validation.ts

export const validators = {
  email: (value: string): string | null => {
    if (!value.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Enter a valid email address';
    return null;
  },

  password: (value: string): string | null => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return null;
  },

  displayName: (value: string): string | null => {
    if (!value.trim()) return 'Name is required';
    if (value.trim().length < 2) return 'Name must be at least 2 characters';
    return null;
  },

  required: (value: string, label: string): string | null => {
    if (!value.trim()) return `${label} is required`;
    return null;
  },
};

// Validate all fields and return first error
export const validateForm = (
  rules: Array<() => string | null>
): string | null => {
  for (const rule of rules) {
    const error = rule();
    if (error) return error;
  }
  return null;
};