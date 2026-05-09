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
import { SPACING, RADIUS } from '../../utils/constants';
import { useTheme } from '../../hook/useTheme';

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
  const { colors: C } = useTheme();

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: C.textSecondary }]}>{label}</Text>

      <View
        style={[
          styles.inputRow,
          { backgroundColor: C.inputBg, borderColor: error ? C.error : isFocused ? C.accent : C.border },
        ]}
      >
        <TextInput
          style={[styles.input, { color: C.text }]}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={C.textLight}
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeBtn}
          >
            <Text style={[styles.eyeText, { color: C.textSecondary }]}>
              {showPassword ? 'HIDE' : 'SHOW'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={[styles.error, { color: C.error }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
  },
  eyeBtn: { padding: SPACING.xs },
  eyeText: {
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: '700',
  },
  error: {
    fontSize: 12,
    marginTop: 2,
  },
});