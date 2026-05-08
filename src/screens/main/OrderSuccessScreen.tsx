// src/screens/main/OrderSuccessScreen.tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SPACING, RADIUS } from '../../../utils/constants';

export default function OrderSuccessScreen() {
  const navigation = useNavigation<any>();
  const route      = useRoute<any>();
  const { orderId } = route.params;

  // Celebration animation
  const scale   = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 8,
        bounciness: 14,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[styles.container, { opacity }]}>
        {/* Success icon */}
        <Animated.View
          style={[styles.iconContainer, { transform: [{ scale }] }]}
        >
          <Text style={styles.icon}>✓</Text>
        </Animated.View>

        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.subtitle}>
          Your order has been placed successfully.
        </Text>

        <View style={styles.orderIdBox}>
          <Text style={styles.orderIdLabel}>ORDER ID</Text>
          <Text style={styles.orderId}>#{orderId.slice(-8).toUpperCase()}</Text>
        </View>

        <Text style={styles.message}>
          You will receive a confirmation notification shortly. Track your order in the Profile section.
        </Text>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('HomeScreen')}
        >
          <Text style={styles.primaryBtnText}>CONTINUE SHOPPING</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.secondaryBtnText}>VIEW MY ORDERS</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  icon: { fontSize: 42, color: COLORS.white, fontWeight: '700' },
  title: { fontSize: 28, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: 16, color: COLORS.textSecondary, textAlign: 'center' },
  orderIdBox: {
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    width: '100%',
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  orderIdLabel: { fontSize: 10, letterSpacing: 3, color: COLORS.textLight, fontWeight: '600' },
  orderId: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary, marginTop: 4 },
  message: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  primaryBtn: {
    width: '100%',
    height: 54,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  primaryBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 13, letterSpacing: 2 },
  secondaryBtn: {
    width: '100%',
    height: 54,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 13, letterSpacing: 2 },
});