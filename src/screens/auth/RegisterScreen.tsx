// src/screens/auth/RegisterScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { AuthScreenProps } from '../../../types/navigation';
import { COLORS, SPACING, RADIUS } from '../../../utils/constants';
import { registerUser } from '../../../services/authService';
import { useAuthStore } from '../../../store/authStore';
import { sendWelcomeNotification } from '../../../services/notificationService';
import CustomAlert      from '../../../components/common/CustomAlert';
import { useCustomAlert } from '../../../hook/useCustomAlert';


export default function RegisterScreen({ navigation }: AuthScreenProps<'Register'>) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();
  const { alertState, hideAlert, showError } = useCustomAlert();

  const handleRegister = async () => {
    if (!displayName.trim() || !email.trim() || !password.trim()) {
      showError('Missing Fields',   'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      showError('Password Mismatch', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      showError('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await registerUser(email.trim(), password, displayName.trim());
      setUser(user);
      await sendWelcomeNotification(displayName.trim()); // Send welcome notification after successful registration
    } catch (error: any) {
      const message =
        error.code === 'auth/email-already-in-use'
          ? 'This email is already registered.'
          : 'Registration failed. Please try again.';
      showError('Registration Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <CustomAlert
        visible={alertState.visible}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        buttons={alertState.buttons}
        onClose={hideAlert}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.brand}>ELITE RETAIL</Text>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Join the Elite community</Text>
          </View>

          <View style={styles.form}>
            {[
              {
                label: 'FULL NAME',
                value: displayName,
                setter: setDisplayName,
                placeholder: 'Julian Alexander',
                keyboardType: 'default' as const,
                secure: false,
              },
              {
                label: 'EMAIL',
                value: email,
                setter: setEmail,
                placeholder: 'you@example.com',
                keyboardType: 'email-address' as const,
                secure: false,
              },
              {
                label: 'PASSWORD',
                value: password,
                setter: setPassword,
                placeholder: '••••••••',
                keyboardType: 'default' as const,
                secure: true,
              },
              {
                label: 'CONFIRM PASSWORD',
                value: confirmPassword,
                setter: setConfirmPassword,
                placeholder: '••••••••',
                keyboardType: 'default' as const,
                secure: true,
              },
            ].map(({ label, value, setter, placeholder, keyboardType, secure }) => (
              <View style={styles.inputGroup} key={label}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={setter}
                  placeholder={placeholder}
                  placeholderTextColor={COLORS.textLight}
                  keyboardType={keyboardType}
                  autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
                  autoCorrect={false}
                  secureTextEntry={secure}
                />
              </View>
            ))}

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>SIGN IN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  flex: { flex: 1 },
  container: { flexGrow: 1, padding: SPACING.lg },
  header: { paddingTop: SPACING.xl, paddingBottom: SPACING.xl },
  brand: { fontSize: 12, letterSpacing: 4, color: COLORS.accent, fontWeight: '600', marginBottom: SPACING.lg },
  title: { fontSize: 32, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.xs },
  subtitle: { fontSize: 16, color: COLORS.textSecondary },
  form: { gap: SPACING.md },
  inputGroup: { gap: SPACING.xs },
  label: { fontSize: 11, letterSpacing: 2, fontWeight: '600', color: COLORS.textSecondary },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 16,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.offWhite,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
    height: 54,
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: COLORS.white, fontWeight: '700', fontSize: 14, letterSpacing: 2 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.md },
  footerText: { color: COLORS.textSecondary, fontSize: 14 },
  footerLink: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 14, letterSpacing: 1 },
});