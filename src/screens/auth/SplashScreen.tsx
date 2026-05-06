// src/screens/auth/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import type { AuthScreenProps } from '../../../types/navigation';
import { COLORS } from '../../../utils/constants';

export default function SplashScreen({ navigation }: AuthScreenProps<'Splash'>) {
  useEffect(() => {
    // Auto-navigate to Login after 2 seconds
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.tagline}>LUXURY · CURATED · DELIVERED</Text>
      <Text style={styles.logo}>ELITE RETAIL</Text>
      <ActivityIndicator color={COLORS.white} size="large" style={{ marginTop: 48 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagline: {
    fontSize: 10,
    letterSpacing: 4,
    color: COLORS.accentLight,
    marginBottom: 12,
    fontWeight: '500',
  },
  logo: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: 8,
    color: COLORS.white,
  },
});