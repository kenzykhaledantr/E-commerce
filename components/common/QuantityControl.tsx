// src/components/common/QuantityControl.tsx
import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, RADIUS } from '../../utils/constants';

interface QuantityButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

function QuantityButton({ label, onPress, disabled }: QuantityButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.btn, disabled && styles.btnDisabled]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

interface QuantityControlProps {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  min?: number;
  max?: number;
}

export default function QuantityControl({
  value,
  onDecrement,
  onIncrement,
  min = 1,
  max = 99,
}: QuantityControlProps) {
  return (
    <View style={styles.row}>
      <QuantityButton
        label="−"
        onPress={onDecrement}
        disabled={value <= min}
      />
      <Text style={styles.value}>{value}</Text>
      <QuantityButton
        label="+"
        onPress={onIncrement}
        disabled={value >= max}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  btn: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    opacity: 0.35,
  },
  label: {
    fontSize: 20,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  value: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
    minWidth: 28,
    textAlign: 'center',
  },
});