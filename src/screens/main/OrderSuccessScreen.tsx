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
import { SPACING, RADIUS } from '../../../utils/constants';
import { useTheme } from '../../../hook/useTheme';

export default function OrderSuccessScreen() {
  const navigation = useNavigation<any>();
  const route      = useRoute<any>();
  const { colors: C } = useTheme();
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
    <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
      <Animated.View style={[styles.container, { opacity }]}>
        {/* Success icon */}
        <Animated.View
          style={[styles.iconContainer, { backgroundColor: C.accent, transform: [{ scale }] }]}
        >
          <Text style={[styles.icon, { color: C.textInverse }]}>✓</Text>
        </Animated.View>

        <Text style={[styles.title, { color: C.text }]}>Order Confirmed!</Text>
        <Text style={[styles.subtitle, { color: C.textSecondary }]}>
          Your order has been placed successfully.
        </Text>

        <View style={[styles.orderIdBox, { backgroundColor: C.skeletonBase, borderColor: C.border }]}>
          <Text style={[styles.orderIdLabel, { color: C.textLight }]}>ORDER ID</Text>
          <Text style={[styles.orderId, { color: C.text }]}>#{orderId.slice(-8).toUpperCase()}</Text>
        </View>

        <Text style={[styles.message, { color: C.textSecondary }]}>
          You will receive a confirmation notification shortly. Track your order in the Profile section.
        </Text>

        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: C.primary }]}
          onPress={() => navigation.navigate('HomeScreen')}
        >
          <Text style={[styles.primaryBtnText, { color: C.textInverse }]}>CONTINUE SHOPPING</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryBtn, { borderColor: C.border }]}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={[styles.secondaryBtnText, { color: C.text }]}>VIEW MY ORDERS</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  icon: { fontSize: 42, fontWeight: '700' },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center' },
  subtitle: { fontSize: 16, textAlign: 'center' },
  orderIdBox: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    width: '100%',
    borderWidth: 0.5,
  },
  orderIdLabel: { fontSize: 10, letterSpacing: 3, fontWeight: '600' },
  orderId: { fontSize: 22, fontWeight: '700', marginTop: 4 },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  primaryBtn: {
    width: '100%',
    height: 54,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  primaryBtnText: { fontWeight: '700', fontSize: 13, letterSpacing: 2 },
  secondaryBtn: {
    width: '100%',
    height: 54,
    borderWidth: 1.5,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { fontWeight: '700', fontSize: 13, letterSpacing: 2 },
});