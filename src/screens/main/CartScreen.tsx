// src/screens/main/CartScreen.tsx
import React, { useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useCartStore } from '../../../store/cartStore';
import CartItemCard from '../../../components/cart/CartItemCard';
import { COLORS, SPACING, RADIUS } from '../../../utils/constants';
import type { CartItem } from '../../../types';

const DELIVERY_METHODS = [
  {
    id: 'standard',
    label: 'Standard Delivery',
    description: '3-5 business days',
    price: 0,
    estimatedDays: 5,
  },
  {
    id: 'express',
    label: 'Express Shipping',
    description: 'Next day delivery',
    price: 12.5,
    estimatedDays: 1,
  },
];

export default function CartScreen() {
  const navigation = useNavigation<any>();
  const { items, totalPrice, totalItems, clearCart } = useCartStore();
  const [selectedDelivery, setSelectedDelivery] = React.useState(
    DELIVERY_METHODS[0]
  );

  // Animate checkout button
  const btnScale = useRef(new Animated.Value(1)).current;

  const handleCheckoutPress = () => {
    Animated.sequence([
      Animated.spring(btnScale, {
        toValue: 0.96,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }),
      Animated.spring(btnScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 6,
      }),
    ]).start(() => {
      navigation.navigate('Checkout');
    });
  };

  const subtotal  = totalPrice();
  const delivery  = selectedDelivery.price;
  const total     = subtotal + delivery;

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>YOUR CART</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛍</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add items to get started
          </Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.shopBtnText}>CONTINUE SHOPPING</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const ListHeader = () => (
    <View>
      <Text style={styles.subTitle}>
        Review your selections before heading to checkout.
      </Text>
    </View>
  );

  const ListFooter = () => (
    <View style={styles.footer}>
      {/* Delivery Methods */}
      <Text style={styles.sectionLabel}>DELIVERY METHOD</Text>
      {DELIVERY_METHODS.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.deliveryOption,
            selectedDelivery.id === method.id && styles.deliveryOptionActive,
          ]}
          onPress={() => setSelectedDelivery(method)}
          activeOpacity={0.8}
        >
          <View style={styles.deliveryLeft}>
            <View
              style={[
                styles.radio,
                selectedDelivery.id === method.id && styles.radioActive,
              ]}
            >
              {selectedDelivery.id === method.id && (
                <View style={styles.radioDot} />
              )}
            </View>
            <View>
              <Text style={styles.deliveryLabel}>{method.label}</Text>
              <Text style={styles.deliveryDesc}>{method.description}</Text>
            </View>
          </View>
          <Text style={styles.deliveryPrice}>
            {method.price === 0 ? 'Free' : `$${method.price.toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Order Summary */}
      <View style={styles.summaryBox}>
        <Text style={styles.sectionLabel}>ORDER SUMMARY</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Subtotal ({totalItems()} items)
          </Text>
          <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery</Text>
          <Text style={styles.summaryValue}>
            {delivery === 0 ? 'Free' : `$${delivery.toFixed(2)}`}
          </Text>
        </View>
        <View style={[styles.summaryRow, styles.summaryTotal]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Looking for more */}
      <View style={styles.lookingMore}>
        <Text style={styles.lookingIcon}>♡</Text>
        <Text style={styles.lookingTitle}>Looking for more?</Text>
        <Text style={styles.lookingSubtitle}>
          Explore items from your wishlist or our latest premium arrivals.
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.continueLink}>CONTINUE SHOPPING</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>YOUR CART</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>CLEAR</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id}
        renderItem={({ item }) => <CartItemCard item={item} />}
        ListHeaderComponent={<ListHeader />}
        ListFooterComponent={<ListFooter />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Checkout Button */}
      <View style={styles.checkoutBar}>
        <View>
          <Text style={styles.checkoutTotalLabel}>TOTAL</Text>
          <Text style={styles.checkoutTotal}>${total.toFixed(2)}</Text>
        </View>
        <Animated.View style={{ transform: [{ scale: btnScale }], flex: 1 }}>
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={handleCheckoutPress}
            activeOpacity={0.9}
          >
            <Text style={styles.checkoutBtnText}>
              CHECKOUT ({totalItems()})
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  backText: { fontSize: 24, color: COLORS.textPrimary, width: 40 },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 3,
    color: COLORS.textPrimary,
  },
  clearText: {
    fontSize: 11,
    letterSpacing: 1,
    color: COLORS.textSecondary,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
  listContent: { paddingTop: SPACING.md, paddingBottom: 120 },
  subTitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  footer: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md, gap: SPACING.sm },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  deliveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  deliveryOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  deliveryLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: COLORS.primary },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  deliveryLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  deliveryDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  deliveryPrice: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  summaryBox: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    gap: SPACING.sm,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: { fontSize: 14, color: COLORS.textSecondary },
  summaryValue: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '500' },
  summaryTotal: {
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
    marginTop: SPACING.xs,
  },
  totalLabel: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  totalValue: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  lookingMore: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginTop: SPACING.sm,
    alignItems: 'center',
    gap: SPACING.xs,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  lookingIcon: { fontSize: 28, marginBottom: SPACING.xs },
  lookingTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  lookingSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  continueLink: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
    textDecorationLine: 'underline',
  },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    paddingBottom: SPACING.lg,
  },
  checkoutTotalLabel: {
    fontSize: 10,
    letterSpacing: 2,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  checkoutTotal: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  checkoutBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    padding: SPACING.xl,
  },
  emptyIcon: { fontSize: 64, marginBottom: SPACING.md },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary },
  emptySubtitle: { fontSize: 15, color: COLORS.textSecondary },
  shopBtn: {
    marginTop: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.md,
  },
  shopBtnText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.textPrimary,
  },
});