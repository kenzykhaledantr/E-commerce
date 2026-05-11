// src/components/order/OrderStatusBadge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RADIUS } from '../../utils/constants';

type Status =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

interface StatusConfig {
  label: string;
  bg:    string;
  text:  string;
  icon:  string;
}

const CONFIG: { [key in Status]: StatusConfig } = {
  pending:   { label: 'Pending',   bg: '#FFF3CD', text: '#856404', icon: '🕐' },
  confirmed: { label: 'Confirmed', bg: '#D1ECF1', text: '#0C5460', icon: '✓'  },
  shipped:   { label: 'Shipped',   bg: '#CCE5FF', text: '#004085', icon: '🚚' },
  delivered: { label: 'Delivered', bg: '#D4EDDA', text: '#155724', icon: '✅' },
  cancelled: { label: 'Cancelled', bg: '#F8D7DA', text: '#721C24', icon: '✕'  },
};

const DEFAULT_CONFIG: StatusConfig = {
  label: 'Pending',
  bg:    '#FFF3CD',
  text:  '#856404',
  icon:  '🕐',
};

export default function OrderStatusBadge({ status }: { status: string }) {
  const cfg = CONFIG[status as Status] ?? DEFAULT_CONFIG;

  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <Text style={styles.icon}>{cfg.icon}</Text>
      <Text style={[styles.label, { color: cfg.text }]}>
        {cfg.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               4,
    paddingVertical:   4,
    paddingHorizontal: 10,
    borderRadius:      999,
    alignSelf:         'flex-start',
  },
  icon:  { fontSize: 11 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
});