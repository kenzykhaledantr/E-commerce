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
import { SPACING, RADIUS } from '../../../utils/constants';
import { useTheme } from '../../../hook/useTheme';
import { useAddToCartAnimation } from '../../../hook/useAddToCartAnimation';
import * as Haptics from 'expo-haptics';
import QuantityControl from '../../../components/common/QuantityControl';
import Toast from '../../../components/common/Toast';
import { useToast } from '../../../hook/useToast';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({
  route,
  navigation,
}: HomeScreenProps<'ProductDetail'>) {
  const { productId } = route.params;
  const { data: product, isLoading } = useProduct(productId);
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isFavorite } = useFavoritesStore();
  const { colors: C } = useTheme();
  const [quantity, setQuantity] = useState(1);
  const { triggerAnimation, dotStyle } = useAddToCartAnimation();
const { toast, showToast, hideToast } = useToast();
  if (isLoading || !product) {
    return (
      <View style={[styles.loading, { backgroundColor: C.background }]}>
        <Text style={[styles.loadingText, { color: C.textSecondary }]}>Loading...</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
  addItem(product, quantity);
  showToast(`${product.name} added to cart`, 'success');
};

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]} edges={['bottom']}>
      <Toast
      message={toast.message}
      type={toast.type}
      visible={toast.visible}
      onHide={hideToast}
    />
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
            style={[styles.backBtn, { backgroundColor: C.surface }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backIcon, { color: C.text }]}>←</Text>
          </TouchableOpacity>

          {/* Favorite */}
          <TouchableOpacity
            style={[styles.favoriteBtn, { backgroundColor: C.surface }]}
            onPress={() => toggle(product.id)}
          >
            <Text style={[styles.favoriteIcon, { color: isFavorite(product.id) ? C.accent : C.textSecondary }]}>
              {isFavorite(product.id) ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Product Info */}
        <View style={styles.info}>
          <Text style={[styles.category, { color: C.textLight }]}>
            {product.category.toUpperCase()} COLLECTION
          </Text>
          <Text style={[styles.name, { color: C.text }]}>{product.name}</Text>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: C.text }]}>€{product.price.toFixed(2)}</Text>
            {product.originalPrice && (
              <Text style={[styles.originalPrice, { color: C.textLight }]}>
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
            <Text style={[styles.reviewCount, { color: C.textSecondary }]}>
              ({product.reviewCount} reviews)
            </Text>
          </View>

          {/* Description */}
          <Text style={[styles.description, { color: C.textSecondary }]}>{product.description}</Text>

          {/* Tags */}
          <View style={styles.tags}>
            {product.tags.map((tag) => (
              <View key={tag} style={[styles.tag, { backgroundColor: C.skeletonBase, borderColor: C.border }]}>
                <Text style={[styles.tagText, { color: C.textSecondary }]}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Quantity */}
          <View style={styles.quantityRow}>
  <Text style={[styles.quantityLabel, { color: C.textSecondary }]}>QUANTITY</Text>
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
  <Text style={[styles.stock, { color: C.textSecondary }]}>
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
        backgroundColor: C.accent,
        zIndex: 99,
      },
      dotStyle,
    ]}
    pointerEvents="none"
  />

  <View style={[styles.bottomBar, { backgroundColor: C.surface, borderTopColor: C.border }]}>
    <View style={styles.totalContainer}>
      <Text style={[styles.totalLabel, { color: C.textLight }]}>TOTAL</Text>
      <Text style={[styles.total, { color: C.text }]}>
        €{(product.price * quantity).toFixed(2)}
      </Text>
    </View>
    <TouchableOpacity
      style={[
        styles.addToCartBtn,
        { backgroundColor: product.stock === 0 ? C.border : C.primary },
      ]}
      onPress={handleAddToCart}
      disabled={product.stock === 0}
      activeOpacity={0.85}
    >
      <Text style={[styles.addToCartText, { color: C.textInverse }]}>
        {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
      </Text>
    </TouchableOpacity>
  </View>
</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: { fontSize: 14 },
  imageContainer: {
    width,
    height: width * 1.1,
  },
  image: { width: '100%', height: '100%' },
  backBtn: {
    position: 'absolute',
    top: SPACING.lg,
    left: SPACING.md,
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: SPACING.sm,
  },
  backIcon: { fontSize: 30, bottom: 5 },
  favoriteBtn: {
    position: 'absolute',
    top: SPACING.lg,
    right: SPACING.md,
    width: 40,
    height: 40,
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
    fontWeight: '600',
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 34,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  price: { fontSize: 22, fontWeight: '700' },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  star: { fontSize: 16 },
  starFilled: { color: '#F4A261' },
  starEmpty: { fontSize: 16 },
  reviewCount: {
    fontSize: 13,
    marginLeft: 4,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  tag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 0.5,
  },
  tagText: {
    fontSize: 11,
    textTransform: 'capitalize',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  quantityLabel: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '600',
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
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qBtnText: { fontSize: 18, lineHeight: 22 },
  qValue: { fontSize: 16, fontWeight: '600', minWidth: 20, textAlign: 'center' },
  stock: { fontSize: 12 },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderTopWidth: 0.5,
    gap: SPACING.md,
  },
  totalContainer: { flex: 1 },
  totalLabel: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '600',
  },
  total: { fontSize: 20, fontWeight: '700' },
  addToCartBtn: {
    flex: 2,
    height: 52,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {
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
  // Gray - will be set dynamically
},
});