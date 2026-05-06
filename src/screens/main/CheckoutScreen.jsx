// src/screens/main/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../utils/constants';

export default function CheckoutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>ELITE RETAIL</Text>
      <Text style={styles.sub}>Home — Phase 4 will fill this</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite, padding: 24 },
  header: { fontSize: 20, fontWeight: '700', letterSpacing: 4, color: COLORS.textPrimary },
  sub: { fontSize: 14, color: COLORS.textSecondary, marginTop: 8 },
});