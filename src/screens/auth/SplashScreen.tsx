// src/screens/auth/SplashScreen.tsx
import React, { useEffect,useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator,Animated,
  Dimensions, } from 'react-native';
import type { AuthScreenProps } from '../../../types/navigation';
import { COLORS } from '../../../utils/constants';





const { height } = Dimensions.get('window');

export default function SplashScreen({ navigation }: AuthScreenProps<'Splash'>) {
  const logoScale   = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const tagOpacity  = useRef(new Animated.Value(0)).current;
  const lineWidth   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Logo appears
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 6,
          bounciness: 10,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Line expands
      Animated.timing(lineWidth, {
        toValue: 120,
        duration: 400,
        useNativeDriver: false,
      }),
      // Tagline fades in
      Animated.timing(tagOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Auto-navigate to Login after 2 seconds
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Text style={styles.logo}>ELITE</Text>
        <Animated.View style={[styles.line, { width: lineWidth }]} />
        <Text style={styles.logoSub}>RETAIL</Text>
      </Animated.View>

      <Animated.Text style={[styles.tagline, { opacity: tagOpacity }]}>
        LUXURY · CURATED · DELIVERED
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  logoContainer: {
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: 12,
    color: COLORS.white,
  },
  line: {
    height: 1,
    backgroundColor: COLORS.accentLight,
  },
  logoSub: {
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  tagline: {
    fontSize: 10,
    letterSpacing: 4,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '500',
  },
});