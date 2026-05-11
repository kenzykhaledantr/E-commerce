// src/components/cart/CartItemCard.tsx
import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../store/cartStore';
import { COLORS, SPACING, RADIUS } from '../../utils/constants';
import type { CartItem } from '../../types';

interface CartItemCardProps {
  item: CartItem;
}

 function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeItem } = useCartStore();

  // Slide-out animation on delete
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity    = useRef(new Animated.Value(1)).current;

  const handleRemove = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 400,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start(() => removeItem(item.product.id));
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateX }], opacity },
      ]}
    >
      {/* Product image */}
      <Image
        source={{ uri: item.product.images[0] }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.topRow}>
          <View style={styles.nameBlock}>
            <Text style={styles.category}>
              {item.product.category.toUpperCase()}
            </Text>
            <Text style={styles.name} numberOfLines={2}>
              {item.product.name}
            </Text>
          </View>

          {/* Delete */}
          <TouchableOpacity
            onPress={handleRemove}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.deleteBtn}
          >
            <Ionicons name="trash-outline" size={16} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Price + Quantity */}
        <View style={styles.bottomRow}>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qBtn}
              onPress={() =>
                updateQuantity(item.product.id, item.quantity - 1)
              }
            >
              <Text style={styles.qBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qValue}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.qBtn}
              onPress={() =>
                updateQuantity(item.product.id, item.quantity + 1)
              }
            >
              <Text style={styles.qBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.price}>
            ${(item.product.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default React.memo(CartItemCard);
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    padding: SPACING.sm,
    gap: SPACING.sm,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 90,
    height: 110,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.offWhite,
  },
  info: { flex: 1, justifyContent: 'space-between' },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameBlock: { flex: 1, marginRight: SPACING.sm },
  category: {
    fontSize: 9,
    letterSpacing: 2,
    color: COLORS.textLight,
    fontWeight: '600',
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  deleteBtn: { padding: 4 },
  deleteIcon: { fontSize: 16 },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  qBtn: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  qBtnText: { fontSize: 18, color: COLORS.textPrimary, lineHeight: 22 },
  qValue: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary, minWidth: 20, textAlign: 'center' },
  price: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
});