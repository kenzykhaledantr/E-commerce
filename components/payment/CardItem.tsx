// src/components/payment/CardItem.tsx
import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Alert,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../utils/constants';
import type { PaymentCard } from '../../types';

const TYPE_ICONS: Record<PaymentCard['cardType'], string> = {
  visa:       '💙',
  mastercard: '🔴',
  amex:       '🟦',
  other:      '💳',
};

interface CardItemProps {
  card:         PaymentCard;
  onDelete:     () => void;
  onSetDefault: () => void;
}

export default function CardItem({
  card,
  onDelete,
  onSetDefault,
}: CardItemProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, {
      toValue: 0.98, useNativeDriver: true,
      speed: 50, bounciness: 0,
    }).start();

  const handlePressOut = () =>
    Animated.spring(scale, {
      toValue: 1, useNativeDriver: true,
      speed: 20, bounciness: 4,
    }).start();

  const handleDelete = () =>
    Alert.alert(
      'Remove Card',
      `Remove card ending in ${card.lastFour}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: onDelete },
      ]
    );

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[
          styles.card,
          card.isDefault && styles.cardDefault,
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* Left — card info */}
        <View style={[styles.colorBar, { backgroundColor: card.color }]}>
          <Text style={styles.colorBarText}>
            {TYPE_ICONS[card.cardType]}
          </Text>
        </View>

        <View style={styles.info}>
          <View style={styles.topRow}>
            <Text style={styles.cardType}>
              {card.cardType.toUpperCase()}
            </Text>
            {card.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>DEFAULT</Text>
              </View>
            )}
          </View>
          <Text style={styles.cardNumber}>
            •••• •••• •••• {card.lastFour}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.holder} numberOfLines={1}>
              {card.cardHolder}
            </Text>
            <Text style={styles.expiry}>{card.expiry}</Text>
          </View>
        </View>

        {/* Right — actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handleDelete}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.deleteIcon}>🗑</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Set as default */}
      {!card.isDefault && (
        <TouchableOpacity
          style={styles.setDefaultBtn}
          onPress={onSetDefault}
        >
          <Text style={styles.setDefaultText}>SET AS DEFAULT</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: COLORS.white,
    borderRadius:    RADIUS.md,
    borderWidth:     1,
    borderColor:     COLORS.border,
    overflow:        'hidden',
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.05,
    shadowRadius:    8,
    elevation:       2,
  },
  cardDefault: {
    borderColor: COLORS.accent,
    borderWidth: 1.5,
  },
  colorBar: {
    width:          52,
    alignSelf:      'stretch',
    alignItems:     'center',
    justifyContent: 'center',
  },
  colorBarText: { fontSize: 22 },
  info: {
    flex:    1,
    padding: SPACING.md,
    gap:     4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING.xs,
  },
  cardType: {
    fontSize:      10,
    letterSpacing: 2,
    fontWeight:    '700',
    color:         COLORS.textSecondary,
  },
  defaultBadge: {
    backgroundColor:  COLORS.accent,
    paddingHorizontal: 6,
    paddingVertical:   2,
    borderRadius:     RADIUS.full,
  },
  defaultBadgeText: {
    fontSize:      9,
    fontWeight:    '700',
    color:         COLORS.white,
    letterSpacing: 1,
  },
  cardNumber: {
    fontSize:      16,
    fontWeight:    '600',
    color:         COLORS.textPrimary,
    letterSpacing: 2,
  },
  metaRow: {
    flexDirection: 'row',
    gap:           SPACING.md,
    alignItems:    'center',
  },
  holder: {
    fontSize: 12,
    color:    COLORS.textSecondary,
    flex:     1,
  },
  expiry: {
    fontSize:   12,
    color:      COLORS.textLight,
    fontWeight: '500',
  },
  actions: {
    padding:        SPACING.sm,
    alignItems:     'center',
    justifyContent: 'center',
  },
  actionBtn: {
    width:          36,
    height:         36,
    alignItems:     'center',
    justifyContent: 'center',
    backgroundColor: COLORS.offWhite,
    borderRadius:   RADIUS.sm,
  },
  deleteIcon:    { fontSize: 15 },
  setDefaultBtn: {
    alignSelf:         'flex-end',
    marginTop:         6,
    marginRight:       SPACING.sm,
    paddingVertical:   5,
    paddingHorizontal: SPACING.sm,
    borderWidth:       1,
    borderColor:       COLORS.border,
    borderRadius:      RADIUS.full,
  },
  setDefaultText: {
    fontSize:      10,
    letterSpacing: 1.5,
    fontWeight:    '600',
    color:         COLORS.textSecondary,
  },
});