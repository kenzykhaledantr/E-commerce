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
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../../store/cartStore';
import CartItemCard from '../../../components/cart/CartItemCard';
import { SPACING, RADIUS } from '../../../utils/constants';
import { useTheme } from '../../../hook/useTheme';
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
  const { colors: C } = useTheme();
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
      <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
        <View style={[styles.header, { backgroundColor: C.surface, borderBottomColor: C.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 40 }}>
            <Ionicons name="arrow-back" size={24} color={C.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: C.text }]}>YOUR CART</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="bag-handle-outline" size={64} color={C.textLight} style={{ marginBottom: SPACING.md }} />
          <Text style={[styles.emptyTitle, { color: C.text }]}>Your cart is empty</Text>
          <Text style={[styles.emptySubtitle, { color: C.textSecondary }]}>
            Add items to get started
          </Text>
          <TouchableOpacity
            style={[styles.shopBtn, { borderColor: C.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.shopBtnText, { color: C.primary }]}>CONTINUE SHOPPING</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const ListHeader = () => (
    <View>
      <Text style={[styles.subTitle, { color: C.textSecondary }]}>
        Review your selections before heading to checkout.
      </Text>
    </View>
  );

  const ListFooter = () => (
    <View style={styles.footer}>
      {/* Delivery Methods */}
      <Text style={[styles.sectionLabel, { color: C.textSecondary }]}>DELIVERY METHOD</Text>
      {DELIVERY_METHODS.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.deliveryOption,
            { backgroundColor: C.card, borderColor: C.border },
            selectedDelivery.id === method.id && { borderColor: C.primary, borderWidth: 2 },
          ]}
          onPress={() => setSelectedDelivery(method)}
          activeOpacity={0.8}
        >
          <View style={styles.deliveryLeft}>
            <View
              style={[
                styles.radio,
                { borderColor: C.border },
                selectedDelivery.id === method.id && { borderColor: C.primary },
              ]}
            >
              {selectedDelivery.id === method.id && (
                <View style={[styles.radioDot, { backgroundColor: C.primary }]} />
              )}
            </View>
            <View>
              <Text style={[styles.deliveryLabel, { color: C.text }]}>{method.label}</Text>
              <Text style={[styles.deliveryDesc, { color: C.textSecondary }]}>{method.description}</Text>
            </View>
          </View>
          <Text style={[styles.deliveryPrice, { color: C.text }]}>
            {method.price === 0 ? 'Free' : `$${method.price.toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Order Summary */}
      <View style={[styles.summaryBox, { backgroundColor: C.card, borderColor: C.border }]}>
        <Text style={[styles.sectionLabel, { color: C.textSecondary }]}>ORDER SUMMARY</Text>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: C.textSecondary }]}>
            Subtotal ({totalItems()} items)
          </Text>
          <Text style={[styles.summaryValue, { color: C.text }]}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: C.textSecondary }]}>Delivery</Text>
          <Text style={[styles.summaryValue, { color: C.text }]}>
            {delivery === 0 ? 'Free' : `$${delivery.toFixed(2)}`}
          </Text>
        </View>
        <View style={[styles.summaryRow, styles.summaryTotal, { borderTopColor: C.border }]}>
          <Text style={[styles.totalLabel, { color: C.text }]}>Total</Text>
          <Text style={[styles.totalValue, { color: C.text }]}>${total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Looking for more */}
      <View style={[styles.lookingMore, { backgroundColor: C.card, borderColor: C.border }]}>
        <Ionicons name="heart-outline" size={28} color={C.textSecondary} style={{ marginBottom: SPACING.xs }} />
        <Text style={[styles.lookingTitle, { color: C.text }]}>Looking for more?</Text>
        <Text style={[styles.lookingSubtitle, { color: C.textSecondary }]}>
          Explore items from your wishlist or our latest premium arrivals.
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.continueLink, { color: C.text }]}>CONTINUE SHOPPING</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.surface, borderBottomColor: C.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 40 }}>
          <Ionicons name="arrow-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: C.text }]}>YOUR CART</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={[styles.clearText, { color: C.textSecondary }]}>CLEAR</Text>
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
      <View style={[styles.checkoutBar, { backgroundColor: C.surface, borderTopColor: C.border }]}>
        <View>
          <Text style={[styles.checkoutTotalLabel, { color: C.textLight }]}>TOTAL</Text>
          <Text style={[styles.checkoutTotal, { color: C.text }]}>${total.toFixed(2)}</Text>
        </View>
        <Animated.View style={{ transform: [{ scale: btnScale }], flex: 1 }}>
          <TouchableOpacity
            style={[styles.checkoutBtn, { backgroundColor: C.primary }]}
            onPress={handleCheckoutPress}
            activeOpacity={0.9}
          >
            <Text style={[styles.checkoutBtnText, { color: C.textInverse }]}>
              CHECKOUT ({totalItems()})
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 0.5,
  },
  backText: { fontSize: 24, width: 40 },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 3,
  },
  clearText: {
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
  listContent: { paddingTop: SPACING.md, paddingBottom: 120 },
  subTitle: {
    fontSize: 13,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  footer: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md, gap: SPACING.sm },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  deliveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    marginBottom: SPACING.sm,
  },
  deliveryLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  deliveryLabel: { fontSize: 14, fontWeight: '600' },
  deliveryDesc: { fontSize: 12, marginTop: 2 },
  deliveryPrice: { fontSize: 14, fontWeight: '600' },
  summaryBox: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    gap: SPACING.sm,
    borderWidth: 0.5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 14, fontWeight: '500' },
  summaryTotal: {
    borderTopWidth: 0.5,
    paddingTop: SPACING.sm,
    marginTop: SPACING.xs,
  },
  totalLabel: { fontSize: 16, fontWeight: '700' },
  totalValue: { fontSize: 20, fontWeight: '700' },
  lookingMore: {
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginTop: SPACING.sm,
    alignItems: 'center',
    gap: SPACING.xs,
    borderWidth: 0.5,
  },
  lookingIcon: { fontSize: 28, marginBottom: SPACING.xs },
  lookingTitle: { fontSize: 16, fontWeight: '700' },
  lookingSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  continueLink: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '700',
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
    borderTopWidth: 0.5,
    paddingBottom: SPACING.lg,
  },
  checkoutTotalLabel: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '600',
  },
  checkoutTotal: { fontSize: 20, fontWeight: '700' },
  checkoutBtn: {
    height: 52,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  checkoutBtnText: {
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
  emptyTitle: { fontSize: 22, fontWeight: '700' },
  emptySubtitle: { fontSize: 15 },
  shopBtn: {
    marginTop: SPACING.md,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.md,
  },
  shopBtnText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
});