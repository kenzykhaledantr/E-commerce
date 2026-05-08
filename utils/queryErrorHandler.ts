// src/utils/queryErrorHandler.ts
import { Alert } from 'react-native';

export const onQueryError = (error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : 'Something went wrong. Please try again.';

  // Only show alerts for non-network errors
  if (!message.includes('network') && !message.includes('fetch')) {
    Alert.alert('Error', message);
  }
};