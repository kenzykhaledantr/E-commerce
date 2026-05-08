// src/screens/auth/LoginScreen.tsx — full updated version
import React, { useState } from 'react';
import {
  View,
  Text,
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
import { loginUser } from '../../../services/authService';
import { useAuthStore } from '../../../store/authStore';
import FormInput from '../../../components/common/FormInput';
import { validators, validateForm } from '../../../utils/validation';

export default function LoginScreen({ navigation }: AuthScreenProps<'Login'>) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [errors,   setErrors]   = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();

  const handleLogin = async () => {
    // Clear previous errors
    setErrors({});

    const emailErr    = validators.email(email);
    const passwordErr = validators.password(password);

    if (emailErr || passwordErr) {
      setErrors({
        ...(emailErr    && { email:    emailErr }),
        ...(passwordErr && { password: passwordErr }),
      });
      return;
    }

    setIsLoading(true);
    try {
      const user = await loginUser(email.trim(), password);
      setUser(user);
    } catch (error: any) {
      const message =
        error.code === 'auth/invalid-credential'
          ? 'Invalid email or password.'
          : error.code === 'auth/too-many-requests'
          ? 'Too many attempts. Try again later.'
          : 'Login failed. Please try again.';
      Alert.alert('Login Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.brand}>ELITE RETAIL</Text>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          <View style={styles.form}>
            <FormInput
              label="EMAIL"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setErrors((e) => ({ ...e, email: '' }));
              }}
              placeholder="you@example.com"
              keyboardType="email-address"
              error={errors.email}
            />

            <FormInput
              label="PASSWORD"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                setErrors((e) => ({ ...e, password: '' }));
              }}
              placeholder="••••••••"
              isPassword
              error={errors.password}
            />

            <TouchableOpacity
              style={[
                styles.button,
                isLoading && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>SIGN IN</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.footerLink}>CREATE ACCOUNT</Text>
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
  brand: {
    fontSize: 12,
    letterSpacing: 4,
    color: COLORS.accent,
    fontWeight: '600',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: { fontSize: 16, color: COLORS.textSecondary },
  form: { gap: SPACING.md },
  button: {
    backgroundColor: COLORS.primary,
    height: 54,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  footerText: { color: COLORS.textSecondary, fontSize: 14 },
  footerLink: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
  },
});