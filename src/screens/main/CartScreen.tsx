// src/screens/main/CartScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../utils/constants';

export default function CartScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      <Text style={styles.sub}>Cart items — Phase 9</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 24 },
  title: { fontSize: 28, fontWeight: '700', color: COLORS.textPrimary },
  sub: { fontSize: 14, color: COLORS.textSecondary, marginTop: 8 },
});