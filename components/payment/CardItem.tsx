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
import { SPACING, RADIUS } from '../../utils/constants';
import { useTheme } from '../../hook/useTheme';
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
  const { colors: C } = useTheme();
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
          { backgroundColor: C.card, borderColor: card.isDefault ? C.accent : C.border },
          card.isDefault && { borderWidth: 1.5 },
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
            <Text style={[styles.cardType, { color: C.textSecondary }]}>
              {card.cardType.toUpperCase()}
            </Text>
            {card.isDefault && (
              <View style={[styles.defaultBadge, { backgroundColor: C.accent }]}>
                <Text style={[styles.defaultBadgeText, { color: C.textInverse }]}>DEFAULT</Text>
              </View>
            )}
          </View>
          <Text style={[styles.cardNumber, { color: C.text }]}>
            •••• •••• •••• {card.lastFour}
          </Text>
          <View style={styles.metaRow}>
            <Text style={[styles.holder, { color: C.textSecondary }]} numberOfLines={1}>
              {card.cardHolder}
            </Text>
            <Text style={[styles.expiry, { color: C.textLight }]}>{card.expiry}</Text>
          </View>
        </View>

        {/* Right — actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: C.skeletonBase }]}
            onPress={handleDelete}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.deleteIcon, { color: C.textSecondary }]}>🗑</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Set as default */}
      {!card.isDefault && (
        <TouchableOpacity
          style={[styles.setDefaultBtn, { borderColor: C.border }]}
          onPress={onSetDefault}
        >
          <Text style={[styles.setDefaultText, { color: C.textSecondary }]}>SET AS DEFAULT</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection:   'row',
    alignItems:      'center',
    borderRadius:    RADIUS.md,
    borderWidth:     1,
    overflow:        'hidden',
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.05,
    shadowRadius:    8,
    elevation:       2,
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
  },
  defaultBadge: {
    paddingHorizontal: 6,
    paddingVertical:   2,
    borderRadius:     RADIUS.full,
  },
  defaultBadgeText: {
    fontSize:      9,
    fontWeight:    '700',
    letterSpacing: 1,
  },
  cardNumber: {
    fontSize:      16,
    fontWeight:    '600',
    letterSpacing: 2,
  },
  metaRow: {
    flexDirection: 'row',
    gap:           SPACING.md,
    alignItems:    'center',
  },
  holder: {
    fontSize: 12,
    flex:     1,
  },
  expiry: {
    fontSize:   12,
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
    borderRadius:      RADIUS.full,
  },
  setDefaultText: {
    fontSize:      10,
    letterSpacing: 1.5,
    fontWeight:    '600',
  },
});