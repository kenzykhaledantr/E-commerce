// src/components/common/LoadingButton.tsx
import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import { COLORS, RADIUS } from '../../utils/constants';

interface LoadingButtonProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
}

export default function LoadingButton({
  label,
  onPress,
  isLoading = false,
  disabled = false,
  variant  = 'primary',
  style,
}: LoadingButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  const bg = {
    primary:   COLORS.primary,
    secondary: COLORS.accent,
    outline:   'transparent',
  }[variant];

  const textColor = variant === 'outline' ? COLORS.primary : COLORS.white;
  const border    = variant === 'outline'
    ? { borderWidth: 1.5, borderColor: COLORS.primary }
    : {};

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: bg }, border, style,
          (disabled || isLoading) && styles.disabled,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || isLoading}
        activeOpacity={1}
      >
        {isLoading ? (
          <ActivityIndicator color={textColor} size="small" />
        ) : (
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 54,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  label: { fontSize: 13, fontWeight: '700', letterSpacing: 2 },
  disabled: { opacity: 0.55 },
});