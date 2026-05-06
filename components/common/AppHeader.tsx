import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCartStore } from '../../store/cartStore';
import { COLORS, SPACING } from '../../utils/constants';

export default function AppHeader({ showSearch = true }: { showSearch?: boolean }) {
  const navigation = useNavigation<any>();
  const totalItems = useCartStore((s) => s.totalItems());
  const badgeScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (totalItems > 0) {
      Animated.sequence([
        Animated.spring(badgeScale, {
          toValue: 1.6,
          useNativeDriver: true,
          speed: 40,
          bounciness: 12,
        }),
        Animated.spring(badgeScale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 6,
        }),
      ]).start();
    }
  }, [totalItems]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
        <View style={styles.menuLine} />
        <View style={[styles.menuLine, { width: 16 }]} />
        <View style={styles.menuLine} />
      </TouchableOpacity>

      <Text style={styles.brand}>ELITE RETAIL</Text>

      <View style={styles.rightRow}>
        {showSearch && (
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Text style={styles.iconText}>⌕</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.iconBtn}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.iconText}>🛍</Text>
          {totalItems > 0 && (
            <Animated.View
              style={[styles.badge, { transform: [{ scale: badgeScale }] }]}
            >
              <Text style={styles.badgeText}>
                {totalItems > 9 ? '9+' : totalItems}
              </Text>
            </Animated.View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  brand: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 4,
    color: COLORS.textPrimary,
  },
  rightRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconText: { fontSize: 20, color: COLORS.textPrimary },
  menuLine: {
    width: 20,
    height: 1.5,
    backgroundColor: COLORS.textPrimary,
    marginVertical: 2.5,
    borderRadius: 2,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 4,
    backgroundColor: COLORS.error,
    borderRadius: 999,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: COLORS.white, fontSize: 9, fontWeight: '700' },
});