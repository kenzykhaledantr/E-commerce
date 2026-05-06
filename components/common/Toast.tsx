// src/components/common/Toast.tsx
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../utils/constants';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  visible: boolean;
  onHide: () => void;
}

const ICONS = { success: '✓', error: '✕', info: 'ℹ' };
const BG    = {
  success: COLORS.accent,
  error:   COLORS.error,
  info:    COLORS.primary,
};

export default function Toast({
  message,
  type = 'success',
  visible,
  onHide,
}: ToastProps) {
  const translateY = useRef(new Animated.Value(-80)).current;
  const opacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide down + fade in
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          speed: 20,
          bounciness: 8,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after 2.5s
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -80,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start(onHide);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: BG[type] },
        { transform: [{ translateY }], opacity },
      ]}
    >
      <Text style={styles.icon}>{ICONS[type]}</Text>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: SPACING.md,
    right: SPACING.md,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  icon: { fontSize: 16, color: COLORS.white, fontWeight: '700' },
  message: { flex: 1, color: COLORS.white, fontSize: 14, fontWeight: '500' },
});