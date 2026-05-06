// src/screens/main/CheckoutScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useCartStore } from '../../../store/cartStore';
import { useAuthStore } from '../../../store/authStore';
import { useCreateOrder } from '../../../api/useOrders';
import { COLORS, SPACING, RADIUS } from '../../../utils/constants';
import type { Address } from '../../../types';
import {
  sendOrderConfirmationNotification,
  cancelAllNotifications,
} from '../../../services/notificationService';

const STEPS = ['Shipping', 'Delivery', 'Payment'];

const DEFAULT_ADDRESS: Address = {
  label: 'Home',
  fullName: '',
  street: '',
  city: '',
  postalCode: '',
  phone: '',
};

const DELIVERY_OPTIONS = [
  { id: 'standard', label: 'Standard Delivery', description: '3-5 business days', price: 0, estimatedDays: 5 },
  { id: 'express', label: 'Express Shipping', description: 'Next day delivery', price: 12.5, estimatedDays: 1 },
];

const PAYMENT_OPTIONS = [
  { id: 'card', label: 'Credit or Debit Card', icon: '💳' },
  { id: 'paypal', label: 'PayPal', icon: '🅿' },
];

export default function CheckoutScreen() {
  const navigation   = useNavigation<any>();
  const { items, totalPrice, clearCart } = useCartStore();
  const user         = useAuthStore((s) => s.user);
  const createOrder  = useCreateOrder();

  const [step, setStep]             = useState(0);
  const [address, setAddress]       = useState<Address>({
    ...DEFAULT_ADDRESS,
    fullName: user?.displayName ?? '',
  });
  const [delivery, setDelivery]     = useState(DELIVERY_OPTIONS[0]);
  const [payment, setPayment]       = useState(PAYMENT_OPTIONS[0].id);

  const subtotal = totalPrice();
  const total    = subtotal + delivery.price;

  const handlePlaceOrder = async () => {
    if (!address.fullName || !address.street || !address.city) {
      Alert.alert('Missing info', 'Please fill in your shipping address.');
      setStep(0);
      return;
    }

    try {
      const orderId = await createOrder.mutateAsync({
        items,
        total,
        shippingAddress: address,
        deliveryMethod: delivery,
        paymentMethod: payment,
      });
      clearCart();
      await cancelAllNotifications();   
      await sendOrderConfirmationNotification(orderId, total); 
      navigation.replace('OrderSuccess', { orderId });
    } catch (e) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };

  // ── Step indicators ──────────────────────────────────────
  const StepIndicator = () => (
    <View style={styles.stepRow}>
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <TouchableOpacity
            style={styles.stepItem}
            onPress={() => i < step && setStep(i)}
          >
            <View
              style={[
                styles.stepCircle,
                i <= step && styles.stepCircleActive,
                i < step && styles.stepCircleDone,
              ]}
            >
              {i < step ? (
                <Text style={styles.stepCheckmark}>✓</Text>
              ) : (
                <Text
                  style={[
                    styles.stepNumber,
                    i === step && styles.stepNumberActive,
                  ]}
                >
                  {i + 1}
                </Text>
              )}
            </View>
            <Text
              style={[
                styles.stepLabel,
                i === step && styles.stepLabelActive,
              ]}
            >
              {s}
            </Text>
          </TouchableOpacity>
          {i < STEPS.length - 1 && (
            <View
              style={[styles.stepLine, i < step && styles.stepLineDone]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  // ── Step 0: Shipping Address ─────────────────────────────
  const ShippingStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.sectionTitle}>Shipping Address</Text>

      {/* Saved address card (pre-filled) */}
      <View style={styles.addressCard}>
        <View style={styles.addressCardTop}>
          <Text style={styles.addressLabel}>HOME</Text>
          <View style={styles.selectedDot} />
        </View>
        {[
          { field: 'fullName', label: 'Full Name', placeholder: 'Julian Alexander' },
          { field: 'street',   label: 'Street Address', placeholder: '42 Palatine Hill Rd' },
          { field: 'city',     label: 'City', placeholder: 'Rome' },
          { field: 'postalCode', label: 'Postal Code', placeholder: '00186' },
          { field: 'phone',    label: 'Phone', placeholder: '+39 06 1234 5678' },
        ].map(({ field, label, placeholder }) => (
          <View key={field} style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{label}</Text>
            <View style={styles.inputBox}>
              <Text style={styles.inputValue}>
                {(address as any)[field] || placeholder}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.nextBtn}
        onPress={() => setStep(1)}
      >
        <Text style={styles.nextBtnText}>CONTINUE TO DELIVERY →</Text>
      </TouchableOpacity>
    </View>
  );

  // ── Step 1: Delivery Method ──────────────────────────────
  const DeliveryStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.sectionTitle}>Delivery Method</Text>
      {DELIVERY_OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt.id}
          style={[
            styles.optionCard,
            delivery.id === opt.id && styles.optionCardActive,
          ]}
          onPress={() => setDelivery(opt)}
          activeOpacity={0.8}
        >
          <View style={styles.optionLeft}>
            <View
              style={[
                styles.radio,
                delivery.id === opt.id && styles.radioActive,
              ]}
            >
              {delivery.id === opt.id && <View style={styles.radioDot} />}
            </View>
            <View>
              <Text style={styles.optionTitle}>{opt.label}</Text>
              <Text style={styles.optionDesc}>{opt.description}</Text>
            </View>
          </View>
          <Text style={styles.optionPrice}>
            {opt.price === 0 ? 'Free' : `$${opt.price.toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      ))}

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setStep(0)}>
          <Text style={styles.backBtnText}>← BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(2)}>
          <Text style={styles.nextBtnText}>CONTINUE →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ── Step 2: Payment ──────────────────────────────────────
  const PaymentStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.sectionTitle}>Payment Method</Text>

      {PAYMENT_OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt.id}
          style={[
            styles.optionCard,
            payment === opt.id && styles.optionCardActive,
          ]}
          onPress={() => setPayment(opt.id)}
          activeOpacity={0.8}
        >
          <View style={styles.optionLeft}>
            <View
              style={[
                styles.radio,
                payment === opt.id && styles.radioActive,
              ]}
            >
              {payment === opt.id && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.optionTitle}>
              {opt.icon}  {opt.label}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Order summary */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>ORDER SUMMARY</Text>
        {items.map((item) => (
          <View key={item.product.id} style={styles.summaryRow}>
            <Text style={styles.summaryItem} numberOfLines={1}>
              {item.product.name} × {item.quantity}
            </Text>
            <Text style={styles.summaryPrice}>
              ${(item.product.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryItem}>Delivery</Text>
          <Text style={styles.summaryPrice}>
            {delivery.price === 0 ? 'Free' : `$${delivery.price.toFixed(2)}`}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryItem, { fontWeight: '700' }]}>Total</Text>
          <Text style={[styles.summaryPrice, { fontWeight: '700', fontSize: 18 }]}>
            ${total.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setStep(1)}>
          <Text style={styles.backBtnText}>← BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.placeOrderBtn, createOrder.isPending && styles.btnDisabled]}
          onPress={handlePlaceOrder}
          disabled={createOrder.isPending}
        >
          {createOrder.isPending ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.placeOrderText}>PLACE ORDER</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerBack}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CHECKOUT</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <StepIndicator />
        {step === 0 && <ShippingStep />}
        {step === 1 && <DeliveryStep />}
        {step === 2 && <PaymentStep />}
      </ScrollView>
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
  headerBack: { fontSize: 24, color: COLORS.textPrimary, width: 40 },
  headerTitle: { fontSize: 13, fontWeight: '700', letterSpacing: 3, color: COLORS.textPrimary },
  scrollContent: { paddingBottom: SPACING.xxl },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  stepItem: { alignItems: 'center', gap: 6 },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  stepCircleActive: { borderColor: COLORS.primary },
  stepCircleDone: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  stepNumber: { fontSize: 13, fontWeight: '600', color: COLORS.textLight },
  stepNumberActive: { color: COLORS.primary },
  stepCheckmark: { fontSize: 14, color: COLORS.white, fontWeight: '700' },
  stepLabel: { fontSize: 10, color: COLORS.textLight, letterSpacing: 1 },
  stepLabelActive: { color: COLORS.textPrimary, fontWeight: '700' },
  stepLine: { flex: 1, height: 1, backgroundColor: COLORS.border, marginHorizontal: 8, marginBottom: 20 },
  stepLineDone: { backgroundColor: COLORS.primary },
  stepContent: { padding: SPACING.md, gap: SPACING.md },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.xs },
  addressCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  addressCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addressLabel: { fontSize: 10, letterSpacing: 2, fontWeight: '700', color: COLORS.textSecondary },
  selectedDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.accent },
  inputGroup: { gap: 4 },
  inputLabel: { fontSize: 10, letterSpacing: 1, color: COLORS.textLight, fontWeight: '600' },
  inputBox: {
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    paddingVertical: 6,
  },
  inputValue: { fontSize: 15, color: COLORS.textPrimary },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  optionCardActive: { borderColor: COLORS.primary },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: COLORS.primary },
  radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: COLORS.primary },
  optionTitle: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  optionDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  optionPrice: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  summaryBox: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.sm,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  summaryTitle: { fontSize: 11, letterSpacing: 2, fontWeight: '700', color: COLORS.textSecondary, marginBottom: SPACING.xs },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryItem: { fontSize: 14, color: COLORS.textSecondary, flex: 1, marginRight: SPACING.sm },
  summaryPrice: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '500' },
  summaryDivider: { height: 0.5, backgroundColor: COLORS.border, marginVertical: SPACING.xs },
  btnRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
  backBtn: {
    flex: 1,
    height: 52,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: { fontSize: 12, fontWeight: '700', letterSpacing: 2, color: COLORS.textSecondary },
  nextBtn: {
    flex: 2,
    height: 52,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: { fontSize: 12, fontWeight: '700', letterSpacing: 2, color: COLORS.white },
  placeOrderBtn: {
    flex: 2,
    height: 52,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeOrderText: { fontSize: 13, fontWeight: '700', letterSpacing: 2, color: COLORS.white },
  btnDisabled: { opacity: 0.6 },
});