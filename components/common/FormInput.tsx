// src/components/common/FormInput.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  type TextInputProps,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../utils/constants';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string | null;
  isPassword?: boolean;
}

export default function FormInput({
  label,
  error,
  isPassword = false,
  ...props
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused,    setIsFocused]    = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputRow,
          isFocused && styles.inputRowFocused,
          !!error && styles.inputRowError,
        ]}
      >
        <TextInput
          style={styles.input}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={COLORS.textLight}
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeBtn}
          >
            <Text style={styles.eyeText}>
              {showPassword ? 'HIDE' : 'SHOW'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.offWhite,
    paddingHorizontal: SPACING.md,
  },
  inputRowFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  inputRowError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  eyeBtn: { padding: SPACING.xs },
  eyeText: {
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  error: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 2,
  },
});