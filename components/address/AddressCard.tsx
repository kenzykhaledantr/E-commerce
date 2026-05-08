// src/components/address/AddressCard.tsx
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
import type { Address } from '../../types';

interface AddressCardProps {
  address: Address;
  onEdit:       () => void;
  onDelete:     () => void;
  onSetDefault: () => void;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, {
      toValue:     0.98,
      useNativeDriver: true,
      speed:       50,
      bounciness:  0,
    }).start();

  const handlePressOut = () =>
    Animated.spring(scale, {
      toValue:     1,
      useNativeDriver: true,
      speed:       20,
      bounciness:  4,
    }).start();

  const handleDelete = () => {
    Alert.alert(
      'Delete Address',
      `Remove "${address.label}" address?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  const LABEL_ICONS: Record<string, string> = {
    Home:   '🏠',
    Office: '🏢',
    Other:  '📍',
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[styles.card, address.isDefault && styles.cardDefault]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onEdit}
        activeOpacity={1}
      >
        {/* Top row */}
        <View style={styles.topRow}>
          <View style={styles.labelRow}>
            <Text style={styles.labelIcon}>
              {LABEL_ICONS[address.label] ?? '📍'}
            </Text>
            <Text style={styles.label}>{address.label.toUpperCase()}</Text>
            {address.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>DEFAULT</Text>
              </View>
            )}
          </View>

          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={onEdit}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.actionText}>✎</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleDelete}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[styles.actionText, styles.deleteText]}>🗑</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Address details */}
        <View style={styles.details}>
          <Text style={styles.name}>{address.fullName}</Text>
          <Text style={styles.addressLine}>{address.street}</Text>
          <Text style={styles.addressLine}>
            {address.city}, {address.postalCode}
          </Text>
          <Text style={styles.phone}>{address.phone}</Text>
        </View>

        {/* Set as default */}
        {!address.isDefault && (
          <TouchableOpacity
            style={styles.setDefaultBtn}
            onPress={onSetDefault}
          >
            <Text style={styles.setDefaultText}>SET AS DEFAULT</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor:  COLORS.white,
    borderRadius:     RADIUS.md,
    padding:          SPACING.md,
    borderWidth:      1,
    borderColor:      COLORS.border,
    gap:              SPACING.sm,
    shadowColor:      '#000',
    shadowOffset:     { width: 0, height: 2 },
    shadowOpacity:    0.05,
    shadowRadius:     8,
    elevation:        2,
  },
  cardDefault: {
    borderColor: COLORS.accent,
    borderWidth: 1.5,
  },
  topRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING.xs,
  },
  labelIcon: { fontSize: 16 },
  label: {
    fontSize:      11,
    letterSpacing: 2,
    fontWeight:    '700',
    color:         COLORS.textSecondary,
  },
  defaultBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 6,
    paddingVertical:   2,
    borderRadius:      RADIUS.full,
    marginLeft:        SPACING.xs,
  },
  defaultBadgeText: {
    fontSize:      9,
    fontWeight:    '700',
    color:         COLORS.white,
    letterSpacing: 1,
  },
  actions: {
    flexDirection: 'row',
    gap:           SPACING.sm,
  },
  actionBtn: {
    width:          32,
    height:         32,
    alignItems:     'center',
    justifyContent: 'center',
    backgroundColor: COLORS.offWhite,
    borderRadius:   RADIUS.sm,
  },
  actionText:  { fontSize: 15 },
  deleteText:  { fontSize: 13 },
  details:     { gap: 4 },
  name: {
    fontSize:   15,
    fontWeight: '600',
    color:      COLORS.textPrimary,
  },
  addressLine: {
    fontSize: 14,
    color:    COLORS.textSecondary,
    lineHeight: 20,
  },
  phone: {
    fontSize:   13,
    color:      COLORS.textLight,
    marginTop:  2,
  },
  setDefaultBtn: {
    alignSelf:       'flex-start',
    marginTop:       SPACING.xs,
    paddingVertical: 6,
    paddingHorizontal: SPACING.sm,
    borderWidth:     1,
    borderColor:     COLORS.border,
    borderRadius:    RADIUS.full,
  },
  setDefaultText: {
    fontSize:      10,
    letterSpacing: 1.5,
    fontWeight:    '600',
    color:         COLORS.textSecondary,
  },
});