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
import { Ionicons } from '@expo/vector-icons';
import { SPACING, RADIUS } from '../../utils/constants';
import { useTheme } from '../../hook/useTheme';
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
  const { colors: C } = useTheme();
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
        style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={[styles.imageContainer, { backgroundColor: C.skeletonBase }]}>
          <Image
            source={{ uri: product.images[0] }}
            style={styles.image}
            resizeMode="cover"
          />

          {discount ? (
            <View style={[styles.discountBadge, { backgroundColor: C.error }]}>
              <Text style={[styles.discountText, { color: C.textInverse }]}>-{discount}%</Text>
            </View>
          ) : (
            <View style={[styles.newBadge, { backgroundColor: C.primary }]}>
              <Text style={[styles.newText, { color: C.textInverse }]}>NEW</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.favoriteBtn, { backgroundColor: C.card }]}
            onPress={onFavorite}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={16}
              color={isFavorite ? '#E63946' : C.textLight}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.info}>
          <Text style={[styles.category, { color: C.textLight }]} numberOfLines={1}>
            {product.category.toUpperCase()}
          </Text>
          <Text style={[styles.name, { color: C.text }]} numberOfLines={2}>
            {product.name}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={11} color="#F4A261" />
            <Text style={[styles.rating, { color: C.textSecondary }]}>{product.rating.toFixed(1)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: C.text }]}>${product.price.toFixed(2)}</Text>
            {product.originalPrice && (
              <Text style={[styles.originalPrice, { color: C.textLight }]}>
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
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 0.85,
    position: 'relative',
  },
  image: { width: '100%', height: '100%' },
  discountBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  discountText: { fontSize: 10, fontWeight: '700' },
  newBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  newText: {
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
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIcon: { fontSize: 16 },
  info: { padding: SPACING.sm, gap: 4 },
  category: {
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: '600',
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  star: { fontSize: 11, color: '#F4A261' },
  rating: { fontSize: 11, fontWeight: '500' },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: 2,
  },
  price: { fontSize: 15, fontWeight: '700' },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
});