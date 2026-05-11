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
import { SPACING, RADIUS } from '../../utils/constants';
import { useTheme } from '../../hook/useTheme';
import { Ionicons } from '@expo/vector-icons';
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
  const { colors: C } = useTheme();
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

  const LABEL_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
    Home:   'home-outline',
    Office: 'business-outline',
    Other:  'location-outline',
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: C.card, borderColor: address.isDefault ? C.accent : C.border },
          address.isDefault && { borderWidth: 1.5 },
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onEdit}
        activeOpacity={1}
      >
        {/* Top row */}
        <View style={styles.topRow}>
          <View style={styles.labelRow}>
            <Ionicons name={LABEL_ICONS[address.label] ?? 'location-outline'} size={16} color={C.textSecondary} />
            <Text style={[styles.label, { color: C.textSecondary }]}>{address.label.toUpperCase()}</Text>
            {address.isDefault && (
              <View style={[styles.defaultBadge, { backgroundColor: C.accent }]}>
                <Text style={[styles.defaultBadgeText, { color: C.textInverse }]}>DEFAULT</Text>
              </View>
            )}
          </View>

          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: C.skeletonBase }]}
              onPress={onEdit}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="pencil-outline" size={15} color={C.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: C.skeletonBase }]}
              onPress={handleDelete}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={15} color={C.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Address details */}
        <View style={styles.details}>
          <Text style={[styles.name, { color: C.text }]}>{address.fullName}</Text>
          <Text style={[styles.addressLine, { color: C.textSecondary }]}>{address.street}</Text>
          <Text style={[styles.addressLine, { color: C.textSecondary }]}>
            {address.city}, {address.postalCode}
          </Text>
          <Text style={[styles.phone, { color: C.textLight }]}>{address.phone}</Text>
        </View>

        {/* Set as default */}
        {!address.isDefault && (
          <TouchableOpacity
            style={[styles.setDefaultBtn, { borderColor: C.border }]}
            onPress={onSetDefault}
          >
            <Text style={[styles.setDefaultText, { color: C.textSecondary }]}>SET AS DEFAULT</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius:     RADIUS.md,
    padding:          SPACING.md,
    borderWidth:      1,
    gap:              SPACING.sm,
    shadowColor:      '#000',
    shadowOffset:     { width: 0, height: 2 },
    shadowOpacity:    0.05,
    shadowRadius:     8,
    elevation:        2,
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
  },
  defaultBadge: {
    paddingHorizontal: 6,
    paddingVertical:   2,
    borderRadius:      RADIUS.full,
    marginLeft:        SPACING.xs,
  },
  defaultBadgeText: {
    fontSize:      9,
    fontWeight:    '700',
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
    borderRadius:   RADIUS.sm,
  },
  actionText:  { fontSize: 15 },
  deleteText:  { fontSize: 13 },
  details:     { gap: 4 },
  name: {
    fontSize:   15,
    fontWeight: '600',
  },
  addressLine: {
    fontSize:   14,
    lineHeight: 20,
  },
  phone: {
    fontSize:   13,
    marginTop: 2,
  },
  setDefaultBtn: {
    alignSelf:       'flex-start',
    marginTop:       SPACING.xs,
    paddingVertical: 6,
    paddingHorizontal: SPACING.sm,
    borderWidth:     1,
    borderRadius:    RADIUS.full,
  },
  setDefaultText: {
    fontSize:      10,
    letterSpacing: 1.5,
    fontWeight:    '600',
  },
});