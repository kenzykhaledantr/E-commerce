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
import { SPACING, RADIUS } from '../../../utils/constants';
import { loginUser } from '../../../services/authService';
import { useAuthStore } from '../../../store/authStore';
import FormInput from '../../../components/common/FormInput';
import { validators, validateForm } from '../../../utils/validation';
import { useTheme } from '../../../hook/useTheme';

export default function LoginScreen({ navigation }: AuthScreenProps<'Login'>) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [errors,   setErrors]   = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();
  const { colors: C } = useTheme();

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
    <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
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
            <Text style={[styles.brand, { color: C.accent }]}>ELITE RETAIL</Text>
            <Text style={[styles.title, { color: C.text }]}>Welcome back</Text>
            <Text style={[styles.subtitle, { color: C.textSecondary }]}>Sign in to your account</Text>
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
                { backgroundColor: C.primary },
                isLoading && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color={C.textInverse} />
              ) : (
                <Text style={[styles.buttonText, { color: C.textInverse }]}>SIGN IN</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: C.textSecondary }]}>
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={[styles.footerLink, { color: C.text }]}>CREATE ACCOUNT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  container: { flexGrow: 1, padding: SPACING.lg },
  header: { paddingTop: SPACING.xl, paddingBottom: SPACING.xl },
  brand: {
    fontSize: 12,
    letterSpacing: 4,
    fontWeight: '600',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  subtitle: { fontSize: 16 },
  form: { gap: SPACING.md },
  button: {
    height: 54,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  footerText: { fontSize: 14 },
  footerLink: {
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
  },
});