// src/screens/main/CheckoutScreen.tsx
// Full updated file

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useCartStore } from '../../../store/cartStore';
import { useAuthStore } from '../../../store/authStore';
import { useCreateOrder } from '../../../api/useOrders';
import { useAddresses } from '../../../api/useAddresses';
import { sendOrderConfirmationNotification } from '../../../services/notificationService';
import { COLORS, SPACING, RADIUS } from '../../../utils/constants';
import type { Address } from '../../../types';

const STEPS = ['Shipping', 'Delivery', 'Payment'];

const DELIVERY_OPTIONS = [
  {
    id:           'standard',
    label:        'Standard Delivery',
    description:  '3-5 business days',
    price:        0,
    estimatedDays: 5,
  },
  {
    id:           'express',
    label:        'Express Shipping',
    description:  'Next day delivery',
    price:        12.5,
    estimatedDays: 1,
  },
];

const PAYMENT_OPTIONS = [
  { id: 'card',   label: 'Credit or Debit Card', icon: '💳' },
  { id: 'paypal', label: 'PayPal',                icon: '🅿' },
];

export default function CheckoutScreen() {
  const navigation  = useNavigation<any>();
  const { items, totalPrice, clearCart } = useCartStore();
  const user        = useAuthStore((s) => s.user);
  const createOrder = useCreateOrder();

  // ── Fetch saved addresses from Firebase ───────────────────
  const { data: savedAddresses, isLoading: loadingAddresses } =
    useAddresses();

  const [step,            setStep]          = useState(0);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [delivery,        setDelivery]      = useState(DELIVERY_OPTIONS[0]);
  const [payment,         setPayment]       = useState(PAYMENT_OPTIONS[0].id);

  // Auto-select default address when addresses load
  React.useEffect(() => {
    if (savedAddresses && savedAddresses.length > 0 && !selectedAddress) {
      // Pick default address first, otherwise pick first one
      const defaultAddr = savedAddresses.find((a) => a.isDefault);
      setSelectedAddress(defaultAddr ?? savedAddresses[0]);
    }
  }, [savedAddresses]);

  const subtotal = totalPrice();
  const total    = subtotal + delivery.price;

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert(
        'No address selected',
        'Please select a shipping address.',
      );
      setStep(0);
      return;
    }

    try {
      const orderId = await createOrder.mutateAsync({
        items,
        total,
        shippingAddress: selectedAddress,
        deliveryMethod:  delivery,
        paymentMethod:   payment,
      });
      clearCart();
      await sendOrderConfirmationNotification(orderId, total);
      navigation.replace('OrderSuccess', { orderId });
    } catch (e) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };

  // ── Step indicator ─────────────────────────────────────────
  const StepIndicator = () => (
    <View style={styles.stepRow}>
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <TouchableOpacity
            style={styles.stepItem}
            onPress={() => i < step && setStep(i)}
          >
            <View style={[
              styles.stepCircle,
              i <= step && styles.stepCircleActive,
              i < step  && styles.stepCircleDone,
            ]}>
              {i < step ? (
                <Text style={styles.stepCheckmark}>✓</Text>
              ) : (
                <Text style={[
                  styles.stepNumber,
                  i === step && styles.stepNumberActive,
                ]}>
                  {i + 1}
                </Text>
              )}
            </View>
            <Text style={[
              styles.stepLabel,
              i === step && styles.stepLabelActive,
            ]}>
              {s}
            </Text>
          </TouchableOpacity>

          {i < STEPS.length - 1 && (
            <View style={[
              styles.stepLine,
              i < step && styles.stepLineDone,
            ]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  // ── Step 0: Shipping Address ───────────────────────────────
  const ShippingStep = () => {
    // Loading state
    if (loadingAddresses) {
      return (
        <View style={styles.stepContent}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <View style={styles.loadingBox}>
            <ActivityIndicator color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading your addresses...</Text>
          </View>
        </View>
      );
    }

    // No addresses saved yet
    if (!savedAddresses || savedAddresses.length === 0) {
      return (
        <View style={styles.stepContent}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <View style={styles.emptyAddressBox}>
            <Text style={styles.emptyAddressIcon}>📍</Text>
            <Text style={styles.emptyAddressTitle}>No saved addresses</Text>
            <Text style={styles.emptyAddressSub}>
              Add a delivery address to continue
            </Text>
            <TouchableOpacity
              style={styles.addAddressBtn}
              onPress={() => navigation.navigate('SavedAddresses')}
            >
              <Text style={styles.addAddressBtnText}>
                + ADD ADDRESS
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // Address selector
    return (
      <View style={styles.stepContent}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SavedAddresses')}
          >
            <Text style={styles.manageText}>+ NEW ADDRESS</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.addressList}>
          {savedAddresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.addressOption,
                selectedAddress?.id === address.id &&
                  styles.addressOptionActive,
              ]}
              onPress={() => setSelectedAddress(address)}
              activeOpacity={0.8}
            >
              {/* Radio */}
              <View style={[
                styles.radio,
                selectedAddress?.id === address.id && styles.radioActive,
              ]}>
                {selectedAddress?.id === address.id && (
                  <View style={styles.radioDot} />
                )}
              </View>

              {/* Address info */}
              <View style={styles.addressInfo}>
                <View style={styles.addressLabelRow}>
                  <Text style={styles.addressLabel}>
                    {address.label === 'Home'   ? '🏠' :
                     address.label === 'Office' ? '🏢' : '📍'}
                    {'  '}
                    {address.label.toUpperCase()}
                  </Text>
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.addressName}>{address.fullName}</Text>
                <Text style={styles.addressText}>{address.street}</Text>
                <Text style={styles.addressText}>
                  {address.city}, {address.postalCode}
                </Text>
                <Text style={styles.addressPhone}>{address.phone}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.nextBtn,
            !selectedAddress && styles.btnDisabled,
          ]}
          onPress={() => {
            if (!selectedAddress) {
              Alert.alert('Select an address', 'Please select a shipping address.');
              return;
            }
            setStep(1);
          }}
          disabled={!selectedAddress}
        >
          <Text style={styles.nextBtnText}>
            CONTINUE TO DELIVERY →
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // ── Step 1: Delivery Method ────────────────────────────────
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
            <View style={[
              styles.radio,
              delivery.id === opt.id && styles.radioActive,
            ]}>
              {delivery.id === opt.id && (
                <View style={styles.radioDot} />
              )}
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

      {/* Selected address preview */}
      {selectedAddress && (
        <View style={styles.addressPreview}>
          <Text style={styles.previewLabel}>DELIVERING TO</Text>
          <Text style={styles.previewName}>{selectedAddress.fullName}</Text>
          <Text style={styles.previewText}>
            {selectedAddress.street}, {selectedAddress.city}
          </Text>
        </View>
      )}

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setStep(0)}
        >
          <Text style={styles.backBtnText}>← BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextBtn}
          onPress={() => setStep(2)}
        >
          <Text style={styles.nextBtnText}>CONTINUE →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ── Step 2: Payment ────────────────────────────────────────
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
            <View style={[
              styles.radio,
              payment === opt.id && styles.radioActive,
            ]}>
              {payment === opt.id && (
                <View style={styles.radioDot} />
              )}
            </View>
            <Text style={styles.optionTitle}>
              {opt.icon}{'  '}{opt.label}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Full order summary */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>ORDER SUMMARY</Text>

        {/* Delivery address */}
        {selectedAddress && (
          <View style={styles.summaryAddressRow}>
            <Text style={styles.summaryAddressLabel}>📍 Ship to</Text>
            <Text style={styles.summaryAddressValue} numberOfLines={1}>
              {selectedAddress.street}, {selectedAddress.city}
            </Text>
          </View>
        )}

        <View style={styles.summaryDivider} />

        {/* Items */}
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
            {delivery.price === 0
              ? 'Free'
              : `$${delivery.price.toFixed(2)}`}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryItem, { fontWeight: '700' }]}>
            Total
          </Text>
          <Text style={[styles.summaryPrice, styles.summaryTotal]}>
            ${total.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setStep(1)}
        >
          <Text style={styles.backBtnText}>← BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.placeOrderBtn,
            createOrder.isPending && styles.btnDisabled,
          ]}
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
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical:   SPACING.sm,
    backgroundColor:   COLORS.white,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  headerBack:  { fontSize: 24, color: COLORS.textPrimary, width: 40 },
  headerTitle: {
    fontSize:      13,
    fontWeight:    '700',
    letterSpacing: 3,
    color:         COLORS.textPrimary,
  },
  scrollContent: { paddingBottom: SPACING.xxl },

  // Steps
  stepRow: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'center',
    paddingVertical:   SPACING.lg,
    paddingHorizontal: SPACING.md,
    backgroundColor:   COLORS.white,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  stepItem:   { alignItems: 'center', gap: 6 },
  stepCircle: {
    width:           32,
    height:          32,
    borderRadius:    16,
    borderWidth:     1.5,
    borderColor:     COLORS.border,
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: COLORS.white,
  },
  stepCircleActive: { borderColor:     COLORS.primary },
  stepCircleDone:   { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  stepNumber:       { fontSize: 13, fontWeight: '600', color: COLORS.textLight },
  stepNumberActive: { color: COLORS.primary },
  stepCheckmark:    { fontSize: 14, color: COLORS.white, fontWeight: '700' },
  stepLabel:        { fontSize: 10, color: COLORS.textLight, letterSpacing: 1 },
  stepLabelActive:  { color: COLORS.textPrimary, fontWeight: '700' },
  stepLine:         {
    flex:            1,
    height:          1,
    backgroundColor: COLORS.border,
    marginHorizontal: 8,
    marginBottom:    20,
  },
  stepLineDone: { backgroundColor: COLORS.primary },

  // Shared step content
  stepContent: { padding: SPACING.md, gap: SPACING.md },
  sectionTitle: {
    fontSize:   18,
    fontWeight: '700',
    color:      COLORS.textPrimary,
  },
  sectionTitleRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
  },
  manageText: {
    fontSize:      11,
    letterSpacing: 1,
    fontWeight:    '700',
    color:         COLORS.accent,
  },

  // Loading
  loadingBox: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             SPACING.sm,
    padding:         SPACING.xl,
    backgroundColor: COLORS.offWhite,
    borderRadius:    RADIUS.md,
  },
  loadingText: { color: COLORS.textSecondary, fontSize: 14 },

  // Empty address
  emptyAddressBox: {
    alignItems:      'center',
    padding:         SPACING.xl,
    backgroundColor: COLORS.white,
    borderRadius:    RADIUS.md,
    borderWidth:     1,
    borderColor:     COLORS.border,
    gap:             SPACING.sm,
  },
  emptyAddressIcon:  { fontSize: 40 },
  emptyAddressTitle: {
    fontSize:   16,
    fontWeight: '700',
    color:      COLORS.textPrimary,
  },
  emptyAddressSub: {
    fontSize:  13,
    color:     COLORS.textSecondary,
    textAlign: 'center',
  },
  addAddressBtn: {
    marginTop:         SPACING.sm,
    backgroundColor:   COLORS.primary,
    paddingVertical:   12,
    paddingHorizontal: SPACING.lg,
    borderRadius:      RADIUS.md,
  },
  addAddressBtnText: {
    color:         COLORS.white,
    fontWeight:    '700',
    fontSize:      12,
    letterSpacing: 2,
  },

  // Address selector
  addressList: { gap: SPACING.sm },
  addressOption: {
    flexDirection:   'row',
    alignItems:      'flex-start',
    gap:             SPACING.sm,
    padding:         SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius:    RADIUS.md,
    borderWidth:     1.5,
    borderColor:     COLORS.border,
  },
  addressOptionActive: {
    borderColor:     COLORS.primary,
    backgroundColor: '#FAFFFE',
  },
  radio: {
    width:           22,
    height:          22,
    borderRadius:    11,
    borderWidth:     1.5,
    borderColor:     COLORS.border,
    alignItems:      'center',
    justifyContent:  'center',
    marginTop:       2,
  },
  radioActive: { borderColor: COLORS.primary },
  radioDot: {
    width:           11,
    height:          11,
    borderRadius:    6,
    backgroundColor: COLORS.primary,
  },
  addressInfo:     { flex: 1, gap: 3 },
  addressLabelRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING.xs,
    marginBottom:  2,
  },
  addressLabel: {
    fontSize:      11,
    letterSpacing: 1.5,
    fontWeight:    '700',
    color:         COLORS.textSecondary,
  },
  defaultBadge: {
    backgroundColor:  COLORS.accent,
    paddingHorizontal: 6,
    paddingVertical:   2,
    borderRadius:     RADIUS.full,
  },
  defaultBadgeText: {
    fontSize:      9,
    fontWeight:    '700',
    color:         COLORS.white,
    letterSpacing: 1,
  },
  addressName: {
    fontSize:   15,
    fontWeight: '600',
    color:      COLORS.textPrimary,
  },
  addressText:  { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  addressPhone: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },

  // Delivery preview
  addressPreview: {
    backgroundColor: COLORS.offWhite,
    padding:         SPACING.md,
    borderRadius:    RADIUS.md,
    gap:             4,
    borderWidth:     0.5,
    borderColor:     COLORS.border,
  },
  previewLabel: {
    fontSize:      10,
    letterSpacing: 2,
    fontWeight:    '700',
    color:         COLORS.textLight,
  },
  previewName: {
    fontSize:   14,
    fontWeight: '600',
    color:      COLORS.textPrimary,
  },
  previewText: { fontSize: 13, color: COLORS.textSecondary },

  // Option cards (delivery + payment)
  optionCard: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    padding:         SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius:    RADIUS.md,
    borderWidth:     1.5,
    borderColor:     COLORS.border,
  },
  optionCardActive: { borderColor: COLORS.primary },
  optionLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING.sm,
  },
  optionTitle: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  optionDesc:  { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  optionPrice: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },

  // Order summary
  summaryBox: {
    backgroundColor: COLORS.white,
    borderRadius:    RADIUS.md,
    padding:         SPACING.md,
    gap:             SPACING.sm,
    borderWidth:     0.5,
    borderColor:     COLORS.border,
  },
  summaryTitle: {
    fontSize:      11,
    letterSpacing: 2,
    fontWeight:    '700',
    color:         COLORS.textSecondary,
    marginBottom:  SPACING.xs,
  },
  summaryAddressRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING.sm,
  },
  summaryAddressLabel: {
    fontSize:  13,
    color:     COLORS.textSecondary,
    minWidth:  60,
  },
  summaryAddressValue: {
    flex:       1,
    fontSize:   13,
    color:      COLORS.textPrimary,
    fontWeight: '500',
  },
  summaryDivider: {
    height:          0.5,
    backgroundColor: COLORS.border,
    marginVertical:  SPACING.xs,
  },
  summaryRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  summaryItem:  {
    fontSize: 14,
    color:    COLORS.textSecondary,
    flex:     1,
    marginRight: SPACING.sm,
  },
  summaryPrice: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '500' },
  summaryTotal: { fontSize: 18, fontWeight: '700' },

  // Buttons
  btnRow: {
    flexDirection: 'row',
    gap:           SPACING.sm,
    marginTop:     SPACING.sm,
  },
  backBtn: {
    flex:           1,
    height:         52,
    borderRadius:   RADIUS.md,
    borderWidth:    1.5,
    borderColor:    COLORS.border,
    alignItems:     'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize:      12,
    fontWeight:    '700',
    letterSpacing: 2,
    color:         COLORS.textSecondary,
  },
  nextBtn: {
    flex:           2,
    height:         52,
    borderRadius:   RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems:     'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    fontSize:      12,
    fontWeight:    '700',
    letterSpacing: 2,
    color:         COLORS.white,
  },
  placeOrderBtn: {
    flex:           2,
    height:         52,
    borderRadius:   RADIUS.md,
    backgroundColor: COLORS.accent,
    alignItems:     'center',
    justifyContent: 'center',
  },
  placeOrderText: {
    fontSize:      13,
    fontWeight:    '700',
    letterSpacing: 2,
    color:         COLORS.white,
  },
  btnDisabled: { opacity: 0.6 },
});