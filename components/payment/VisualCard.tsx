// src/components/payment/VisualCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import type { PaymentCard } from '../../types';
import { SPACING, RADIUS } from '../../utils/constants';

const { width } = Dimensions.get('window');
const CARD_W    = width - SPACING.md * 2;
const CARD_H    = CARD_W * 0.56;    // standard credit card ratio

interface VisualCardProps {
  card: PaymentCard;
  style?: object;
}

const CARD_LOGOS: Record<PaymentCard['cardType'], string> = {
  visa:       'VISA',
  mastercard: 'MC',
  amex:       'AMEX',
  other:      '💳',
};

export default function VisualCard({ card, style }: VisualCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: card.color }, style]}>
      {/* Decorative circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      {/* Top row */}
      <View style={styles.topRow}>
        <View style={styles.chip}>
          <View style={styles.chipLine} />
          <View style={styles.chipLine} />
          <View style={styles.chipLine} />
        </View>
        <Text style={styles.cardTypeBadge}>
          {CARD_LOGOS[card.cardType]}
        </Text>
      </View>

      {/* Card number */}
      <Text style={styles.cardNumber}>
        ••••  ••••  ••••  {card.lastFour}
      </Text>

      {/* Bottom row */}
      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.fieldLabel}>CARD HOLDER</Text>
          <Text style={styles.fieldValue} numberOfLines={1}>
            {card.cardHolder.toUpperCase()}
          </Text>
        </View>
        <View style={styles.expiryBlock}>
          <Text style={styles.fieldLabel}>EXPIRES</Text>
          <Text style={styles.fieldValue}>{card.expiry}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width:         CARD_W,
    height:        CARD_H,
    borderRadius:  RADIUS.xl,
    padding:       SPACING.lg,
    justifyContent: 'space-between',
    overflow:      'hidden',
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius:  16,
    elevation:     10,
  },
  // Decorative background circles
  circle1: {
    position:        'absolute',
    top:             -CARD_H * 0.3,
    right:           -CARD_W * 0.15,
    width:           CARD_H * 0.9,
    height:          CARD_H * 0.9,
    borderRadius:    CARD_H * 0.45,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  circle2: {
    position:        'absolute',
    bottom:          -CARD_H * 0.2,
    right:           CARD_W * 0.1,
    width:           CARD_H * 0.7,
    height:          CARD_H * 0.7,
    borderRadius:    CARD_H * 0.35,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  topRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  chip: {
    width:           38,
    height:          28,
    backgroundColor: 'rgba(255,220,100,0.85)',
    borderRadius:    6,
    padding:         5,
    gap:             4,
    justifyContent:  'center',
  },
  chipLine: {
    height:          2,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius:    1,
  },
  cardTypeBadge: {
    fontSize:   18,
    fontWeight: '900',
    color:      'rgba(255,255,255,0.9)',
    letterSpacing: 1,
  },
  cardNumber: {
    fontSize:      20,
    color:         'rgba(255,255,255,0.9)',
    letterSpacing: 3,
    fontWeight:    '500',
    textAlign:     'center',
  },
  bottomRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'flex-end',
  },
  fieldLabel: {
    fontSize:      9,
    color:         'rgba(255,255,255,0.55)',
    letterSpacing: 2,
    fontWeight:    '600',
    marginBottom:  3,
  },
  fieldValue: {
    fontSize:   14,
    color:      'rgba(255,255,255,0.9)',
    fontWeight: '600',
    letterSpacing: 1,
    maxWidth:   160,
  },
  expiryBlock: { alignItems: 'flex-end' },
});