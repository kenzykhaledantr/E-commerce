// src/hooks/useCustomAlert.ts
import { useState, useCallback } from 'react';

type AlertType = 'error' | 'success' | 'warning' | 'info';

interface AlertButton {
  text:     string;
  onPress?: () => void;
  style?:   'default' | 'cancel' | 'destructive';
}

interface AlertOptions {
  type?:    AlertType;
  title:    string;
  message:  string;
  buttons?: AlertButton[];
}

interface AlertState extends AlertOptions {
  visible: boolean;
  type:    AlertType;
}

export function useCustomAlert() {
  const [alertState, setAlertState] = useState<AlertState>({
    visible: false,
    type:    'error',
    title:   '',
    message: '',
    buttons: [{ text: 'OK' }],
  });

  const showAlert = useCallback((options: AlertOptions) => {
    setAlertState({
      visible: true,
      type:    options.type    ?? 'error',
      title:   options.title,
      message: options.message,
      buttons: options.buttons ?? [{ text: 'OK' }],
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState((prev) => ({ ...prev, visible: false }));
  }, []);

  const showError = useCallback(
    (title: string, message: string, buttons?: AlertButton[]) =>
      showAlert({ type: 'error', title, message, buttons }),
    [showAlert]
  );

  const showSuccess = useCallback(
    (title: string, message: string, buttons?: AlertButton[]) =>
      showAlert({ type: 'success', title, message, buttons }),
    [showAlert]
  );

  const showWarning = useCallback(
    (title: string, message: string, buttons?: AlertButton[]) =>
      showAlert({ type: 'warning', title, message, buttons }),
    [showAlert]
  );

  const showInfo = useCallback(
    (title: string, message: string, buttons?: AlertButton[]) =>
      showAlert({ type: 'info', title, message, buttons }),
    [showAlert]
  );

  return {
    alertState,
    showAlert,
    hideAlert,
    showError,
    showSuccess,
    showWarning,
    showInfo,
  };
}