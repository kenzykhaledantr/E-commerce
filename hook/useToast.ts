// src/hooks/useToast.ts
import { useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

export function useToast() {
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success' as ToastType,
  });

  const showToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      setToast({ visible: true, message, type });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  return { toast, showToast, hideToast };
}