import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../utils/constants';
import type { Product } from '../../types';

const { width } = Dimensions.get('window');
export const CARD_WIDTH = width * 0.44;

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  width?: number;
}

 function ProductCard({
  product,
  onPress,
  onFavorite,
  isFavorite = false,
  width: cardWidth = CARD_WIDTH,
}: ProductCardProps) {
  // Use React Native's built-in Animated — works everywhere
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <Animated.View style={[{ transform: [{ scale }] }, { width: cardWidth }]}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.images[0] }}
            style={styles.image}
            resizeMode="cover"
          />

          {discount ? (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          ) : (
            <View style={styles.newBadge}>
              <Text style={styles.newText}>NEW</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={onFavorite}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[
              styles.favoriteIcon,
              isFavorite && styles.favoriteIconActive,
            ]}>
              {isFavorite ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.info}>
          <Text style={styles.category} numberOfLines={1}>
            {product.category.toUpperCase()}
          </Text>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          <View style={styles.ratingRow}>
            <Text style={styles.star}>★</Text>
            <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>
                ${product.originalPrice.toFixed(2)}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
export default React.memo(ProductCard, (prev, next) => {
  // Only re-render if these props changed
  return (
    prev.product.id    === next.product.id &&
    prev.isFavorite    === next.isFavorite &&
    prev.width         === next.width
  );
});
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 0.85,
    backgroundColor: COLORS.offWhite,
    position: 'relative',
  },
  image: { width: '100%', height: '100%' },
  discountBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: COLORS.error,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  discountText: { color: COLORS.white, fontSize: 10, fontWeight: '700' },
  newBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  newText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  favoriteBtn: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIcon: { fontSize: 16, color: COLORS.textLight },
  favoriteIconActive: { color: '#E63946' },
  info: { padding: SPACING.sm, gap: 4 },
  category: {
    fontSize: 9,
    letterSpacing: 2,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  star: { fontSize: 11, color: '#F4A261' },
  rating: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '500' },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: 2,
  },
  price: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  originalPrice: {
    fontSize: 12,
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
  },
});