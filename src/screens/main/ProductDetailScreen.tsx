// src/screens/main/ProductDetailScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { HomeScreenProps } from '../../../types/navigation';
import { useProduct } from '../../../api/useProducts';
import { useCartStore } from '../../../store/cartStore';
import { useFavoritesStore } from '../../../store/favoritesStore';
import { COLORS, SPACING, RADIUS } from '../../../utils/constants';
import { useAddToCartAnimation } from '../../../hook/useAddToCartAnimation';
import * as Haptics from 'expo-haptics';
import QuantityControl from '../../../components/common/QuantityControl';


const { width } = Dimensions.get('window');

export default function ProductDetailScreen({
  route,
  navigation,
}: HomeScreenProps<'ProductDetail'>) {
  const { productId } = route.params;
  const { data: product, isLoading } = useProduct(productId);
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isFavorite } = useFavoritesStore();
  const [quantity, setQuantity] = useState(1);
  const { triggerAnimation, dotStyle } = useAddToCartAnimation();

  if (isLoading || !product) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const handleAddToCart = async () => {
  // Haptic feedback — physical response on real device
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

  // Trigger flying dot animation
  triggerAnimation();

  // Add to cart store
  addItem(product, quantity);
};

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.images[0] }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* Back button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          {/* Favorite */}
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={() => toggle(product.id)}
          >
            <Text style={styles.favoriteIcon}>
              {isFavorite(product.id) ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Product Info */}
        <View style={styles.info}>
          <Text style={styles.category}>
            {product.category.toUpperCase()} COLLECTION
          </Text>
          <Text style={styles.name}>{product.name}</Text>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>€{product.price.toFixed(2)}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>
                €{product.originalPrice.toFixed(2)}
              </Text>
            )}
          </View>

          {/* Rating */}
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Text
                key={i}
                style={[
                  styles.star,
                  i <= Math.round(product.rating)
                    ? styles.starFilled
                    : styles.starEmpty,
                ]}
              >
                ★
              </Text>
            ))}
            <Text style={styles.reviewCount}>
              ({product.reviewCount} reviews)
            </Text>
          </View>

          {/* Description */}
          <Text style={styles.description}>{product.description}</Text>

          {/* Tags */}
          <View style={styles.tags}>
            {product.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Quantity */}
          <View style={styles.quantityRow}>
  <Text style={styles.quantityLabel}>QUANTITY</Text>
  <QuantityControl
    value={quantity}
    onDecrement={() => setQuantity(Math.max(1, quantity - 1))}
    onIncrement={() => setQuantity(Math.min(product.stock, quantity + 1))}
    min={1}
    max={product.stock}
  />
</View>

          {/* Stock */}
         {/* Stock with colored dot */}
<View style={styles.stockRow}>
  <View
    style={[
      styles.stockDot,
      product.stock === 0
        ? styles.stockDotOut
        : product.stock < 5
        ? styles.stockDotLow
        : styles.stockDotIn,
    ]}
  />
  <Text style={styles.stock}>
    {product.stock > 5
      ? `${product.stock} in stock`
      : product.stock > 0
      ? `Only ${product.stock} left!`
      : 'Out of stock'}
  </Text>
</View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={{ position: 'relative' }}>
  {/* Flying dot — absolutely positioned over the button */}
  <Animated.View
    style={[
      {
        position: 'absolute',
        top: -10,
        alignSelf: 'center',
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: COLORS.accent,
        zIndex: 99,
      },
      dotStyle,
    ]}
    pointerEvents="none"
  />

  <View style={styles.bottomBar}>
    <View style={styles.totalContainer}>
      <Text style={styles.totalLabel}>TOTAL</Text>
      <Text style={styles.total}>
        €{(product.price * quantity).toFixed(2)}
      </Text>
    </View>
    <TouchableOpacity
      style={[
        styles.addToCartBtn,
        product.stock === 0 && styles.addToCartBtnDisabled,
      ]}
      onPress={handleAddToCart}
      disabled={product.stock === 0}
      activeOpacity={0.85}
    >
      <Text style={styles.addToCartText}>
        {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
      </Text>
    </TouchableOpacity>
  </View>
</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  scroll: { flex: 1 },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  loadingText: { color: COLORS.textSecondary },
  imageContainer: {
    width,
    height: width * 1.1,
    backgroundColor: COLORS.offWhite,
  },
  image: { width: '100%', height: '100%' },
  backBtn: {
    position: 'absolute',
    top: SPACING.lg,
    left: SPACING.md,
    width: 40,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: SPACING.sm,
  },
  backIcon: { fontSize: 30, color: COLORS.textPrimary,bottom: 5 },
  favoriteBtn: {
    position: 'absolute',
    top: SPACING.lg,
    right: SPACING.md,
    width: 40,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: SPACING.sm,
  },
  favoriteIcon: { fontSize: 20 },
  info: { padding: SPACING.md, gap: SPACING.sm },
  category: {
    fontSize: 10,
    letterSpacing: 3,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 34,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  price: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary },
  originalPrice: {
    fontSize: 16,
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  star: { fontSize: 16 },
  starFilled: { color: '#F4A261' },
  starEmpty: { color: COLORS.border },
  reviewCount: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  description: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  tag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.full,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  tagText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: COLORS.border,
  },
  quantityLabel: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  qBtn: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qBtnText: { fontSize: 18, color: COLORS.textPrimary, lineHeight: 22 },
  qValue: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, minWidth: 20, textAlign: 'center' },
  stock: { fontSize: 12, color: COLORS.textSecondary },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
    gap: SPACING.md,
  },
  totalContainer: { flex: 1 },
  totalLabel: {
    fontSize: 10,
    letterSpacing: 2,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  total: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  addToCartBtn: {
    flex: 2,
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartBtnDisabled: { backgroundColor: COLORS.border },
  addToCartText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 2,
  },
  stockRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
},
stockDot: {
  width: 8,
  height: 8,
  borderRadius: RADIUS.full,
},
stockDotIn: {
  backgroundColor: '#22C55E', // Green
},
stockDotLow: {
  backgroundColor: '#EF4444', // Red
},
stockDotOut: {
  backgroundColor: COLORS.textLight, // Gray
},
// stock: {
//   fontSize: 12,
//   color: COLORS.textSecondary,
// },
});