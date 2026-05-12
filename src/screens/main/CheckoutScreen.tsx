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
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../../store/cartStore';
import { useAuthStore } from '../../../store/authStore';
import { useCreateOrder } from '../../../api/useOrders';
import { useAddresses } from '../../../api/useAddresses';
import { sendOrderConfirmationNotification } from '../../../services/notificationService';
import { SPACING, RADIUS } from '../../../utils/constants';
import { useTheme } from '../../../hook/useTheme';
import type { Address } from '../../../types';
import CustomAlert      from '../../../components/common/CustomAlert';
import { useCustomAlert } from '../../../hook/useCustomAlert';


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
  { id: 'card',   label: 'Credit or Debit Card', icon: 'card-outline' as const },
  { id: 'paypal', label: 'PayPal',                icon: 'logo-paypal' as const },
];

export default function CheckoutScreen() {
  const navigation  = useNavigation<any>();
  const { colors: C } = useTheme();
  const { items, totalPrice, clearCart } = useCartStore();
  const user        = useAuthStore((s) => s.user);
  const createOrder = useCreateOrder();
    const {
    alertState,
    hideAlert,
    showError,
    showSuccess,
  } = useCustomAlert();

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
      showError(
        'No Address Selected',
        'Please select a shipping address to continue.'
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
      showError(
        'Payment Failed',
        "We couldn't process your transaction. Please verify your payment details and try again."
      );
    }
  };

  // ── Step indicator ─────────────────────────────────────────
  const StepIndicator = () => (
    <View style={[styles.stepRow, { backgroundColor: C.surface, borderBottomColor: C.border }]}>
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <TouchableOpacity
            style={styles.stepItem}
            onPress={() => i < step && setStep(i)}
          >
            <View style={[
              styles.stepCircle,
              { backgroundColor: C.surface, borderColor: C.border },
              i <= step && { borderColor: C.primary },
              i < step  && { backgroundColor: C.primary, borderColor: C.primary },
            ]}>
              {i < step ? (
                <Ionicons name="checkmark" size={18} color={C.textInverse} />
              ) : (
                <Text style={[
                  styles.stepNumber,
                  { color: C.textLight },
                  i === step && { color: C.primary },
                ]}>
                  {i + 1}
                </Text>
              )}
            </View>
            <Text style={[
              styles.stepLabel,
              { color: C.textLight },
              i === step && { color: C.text, fontWeight: '700' },
            ]}>
              {s}
            </Text>
          </TouchableOpacity>

          {i < STEPS.length - 1 && (
            <View style={[
              styles.stepLine,
              { backgroundColor: C.border },
              i < step && { backgroundColor: C.primary },
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
          <Text style={[styles.sectionTitle, { color: C.text }]}>Shipping Address</Text>
          <View style={[styles.loadingBox, { backgroundColor: C.skeletonBase }]}>
            <ActivityIndicator color={C.primary} />
            <Text style={[styles.loadingText, { color: C.textSecondary }]}>Loading your addresses...</Text>
          </View>
        </View>
      );
    }

    // No addresses saved yet
    if (!savedAddresses || savedAddresses.length === 0) {
      return (
        <View style={styles.stepContent}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>Shipping Address</Text>
          <View style={[styles.emptyAddressBox, { backgroundColor: C.card, borderColor: C.border }]}>
            <Ionicons name="location-outline" size={40} color={C.textSecondary} />
            <Text style={[styles.emptyAddressTitle, { color: C.text }]}>No saved addresses</Text>
            <Text style={[styles.emptyAddressSub, { color: C.textSecondary }]}>
              Add a delivery address to continue
            </Text>
            <TouchableOpacity
              style={[styles.addAddressBtn, { backgroundColor: C.primary }]}
              onPress={() => navigation.navigate('SavedAddresses')}
            >
              <Text style={[styles.addAddressBtnText, { color: C.textInverse }]}>
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
          <Text style={[styles.sectionTitle, { color: C.text }]}>Shipping Address</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SavedAddresses')}
          >
            <Text style={[styles.manageText, { color: C.accent }]}>+ NEW ADDRESS</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.addressList}>
          {savedAddresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.addressOption,
                { backgroundColor: C.card, borderColor: C.border },
                selectedAddress?.id === address.id && { borderColor: C.primary },
              ]}
              onPress={() => setSelectedAddress(address)}
              activeOpacity={0.8}
            >
              {/* Radio */}
              <View style={[
                styles.radio,
                { borderColor: C.border },
                selectedAddress?.id === address.id && { borderColor: C.primary },
              ]}>
                {selectedAddress?.id === address.id && (
                  <View style={[styles.radioDot, { backgroundColor: C.primary }]} />
                )}
              </View>

              {/* Address info */}
              <View style={styles.addressInfo}>
                <View style={styles.addressLabelRow}>
                  <Text style={[styles.addressLabel, { color: C.textSecondary }]}>
                    <Ionicons
                      name={
                        address.label === 'Home' ? 'home-outline' :
                        address.label === 'Office' ? 'business-outline' : 'location-outline'
                      }
                      size={11}
                      color={C.textSecondary}
                    />
                    {'  '}
                    {address.label.toUpperCase()}
                  </Text>
                  {address.isDefault && (
                    <View style={[styles.defaultBadge, { backgroundColor: C.accent }]}>
                      <Text style={[styles.defaultBadgeText, { color: C.textInverse }]}>DEFAULT</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.addressName, { color: C.text }]}>{address.fullName}</Text>
                <Text style={[styles.addressText, { color: C.textSecondary }]}>{address.street}</Text>
                <Text style={[styles.addressText, { color: C.textSecondary }]}>
                  {address.city}, {address.postalCode}
                </Text>
                <Text style={[styles.addressPhone, { color: C.textLight }]}>{address.phone}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.nextBtn,
            { backgroundColor: C.primary },
            !selectedAddress && styles.btnDisabled,
          ]}
          onPress={() => {
            if (!selectedAddress) {
              showError(
        'No Address Selected',
        'Please select a shipping address to continue.'
      );
              return;
            }
            setStep(1);
          }}
          disabled={!selectedAddress}
        >
          <Text style={[styles.nextBtnText, { color: C.textInverse }]}>
            CONTINUE TO DELIVERY →
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // ── Step 1: Delivery Method ────────────────────────────────
  const DeliveryStep = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.sectionTitle, { color: C.text }]}>Delivery Method</Text>

      {DELIVERY_OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt.id}
          style={[
            styles.optionCard,
            { backgroundColor: C.card, borderColor: C.border },
            delivery.id === opt.id && { borderColor: C.primary },
          ]}
          onPress={() => setDelivery(opt)}
          activeOpacity={0.8}
        >
          <View style={styles.optionLeft}>
            <View style={[
              styles.radio,
              { borderColor: C.border },
              delivery.id === opt.id && { borderColor: C.primary },
            ]}>
              {delivery.id === opt.id && (
                <View style={[styles.radioDot, { backgroundColor: C.primary }]} />
              )}
            </View>
            <View>
              <Text style={[styles.optionTitle, { color: C.text }]}>{opt.label}</Text>
              <Text style={[styles.optionDesc, { color: C.textSecondary }]}>{opt.description}</Text>
            </View>
          </View>
          <Text style={[styles.optionPrice, { color: C.text }]}>
            {opt.price === 0 ? 'Free' : `$${opt.price.toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Selected address preview */}
      {selectedAddress && (
        <View style={[styles.addressPreview, { backgroundColor: C.skeletonBase, borderColor: C.border }]}>
          <Text style={[styles.previewLabel, { color: C.textLight }]}>DELIVERING TO</Text>
          <Text style={[styles.previewName, { color: C.text }]}>{selectedAddress.fullName}</Text>
          <Text style={[styles.previewText, { color: C.textSecondary }]}>
            {selectedAddress.street}, {selectedAddress.city}
          </Text>
        </View>
      )}

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.backBtn, { borderColor: C.border }]}
          onPress={() => setStep(0)}
        >
          <Text style={[styles.backBtnText, { color: C.textSecondary }]}>← BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: C.primary }]}
          onPress={() => setStep(2)}
        >
          <Text style={[styles.nextBtnText, { color: C.textInverse }]}>CONTINUE →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ── Step 2: Payment ────────────────────────────────────────
  const PaymentStep = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.sectionTitle, { color: C.text }]}>Payment Method</Text>

      {PAYMENT_OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt.id}
          style={[
            styles.optionCard,
            { backgroundColor: C.card, borderColor: C.border },
            payment === opt.id && { borderColor: C.primary },
          ]}
          onPress={() => setPayment(opt.id)}
          activeOpacity={0.8}
        >
          <View style={styles.optionLeft}>
            <View style={[
              styles.radio,
              { borderColor: C.border },
              payment === opt.id && { borderColor: C.primary },
            ]}>
              {payment === opt.id && (
                <View style={[styles.radioDot, { backgroundColor: C.primary }]} />
              )}
            </View>
            <Text style={[styles.optionTitle, { color: C.text }]}>
              <Ionicons name={opt.icon} size={15} color={C.text} />{'  '}{opt.label}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Full order summary */}
      <View style={[styles.summaryBox, { backgroundColor: C.card, borderColor: C.border }]}>
        <Text style={[styles.summaryTitle, { color: C.textSecondary }]}>ORDER SUMMARY</Text>

        {/* Delivery address */}
        {selectedAddress && (
          <View style={styles.summaryAddressRow}>
            <Text style={[styles.summaryAddressLabel, { color: C.textSecondary }]}>
              <Ionicons name="location-outline" size={13} color={C.textSecondary} /> Ship to
            </Text>
            <Text style={[styles.summaryAddressValue, { color: C.text }]} numberOfLines={1}>
              {selectedAddress.street}, {selectedAddress.city}
            </Text>
          </View>
        )}

        <View style={[styles.summaryDivider, { backgroundColor: C.border }]} />

        {/* Items */}
        {items.map((item) => (
          <View key={item.product.id} style={styles.summaryRow}>
            <Text style={[styles.summaryItem, { color: C.textSecondary }]} numberOfLines={1}>
              {item.product.name} × {item.quantity}
            </Text>
            <Text style={[styles.summaryPrice, { color: C.text }]}>
              ${(item.product.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}

        <View style={[styles.summaryDivider, { backgroundColor: C.border }]} />

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryItem, { color: C.textSecondary, fontWeight: '700' }]}>Delivery</Text>
          <Text style={[styles.summaryPrice, { color: C.text }]}>{delivery.price === 0 ? 'Free' : `$${delivery.price.toFixed(2)}`}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryItem, { color: C.text, fontWeight: '700' }]}>Total</Text>
          <Text style={[styles.summaryPrice, styles.summaryTotal, { color: C.text }]}>${total.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.backBtn, { borderColor: C.border }]}
          onPress={() => setStep(1)}
        >
          <Text style={[styles.backBtnText, { color: C.textSecondary }]}>← BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.placeOrderBtn,
            { backgroundColor: C.accent },
            createOrder.isPending && styles.btnDisabled,
          ]}
          onPress={handlePlaceOrder}
          disabled={createOrder.isPending}
        >
          {createOrder.isPending ? (
            <ActivityIndicator color={C.textInverse} />
          ) : (
            <Text style={[styles.placeOrderText, { color: C.textInverse }]}>PLACE ORDER</Text>
          )}
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
        <Text style={[styles.headerTitle, { color: C.text }]}>CHECKOUT</Text>
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
  safe: { flex: 1 },
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical:   SPACING.sm,
    borderBottomWidth: 0.5,
  },
  headerBack:  { fontSize: 24, width: 40 },
  headerTitle: {
    fontSize:      13,
    fontWeight:    '700',
    letterSpacing: 3,
  },
  scrollContent: { paddingBottom: SPACING.xxl },

  // Steps
  stepRow: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'center',
    paddingVertical:   SPACING.lg,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 0.5,
  },
  stepItem:   { alignItems: 'center', gap: 6 },
  stepCircle: {
    width:           32,
    height:          32,
    borderRadius:    16,
    borderWidth:     1.5,
    alignItems:      'center',
    justifyContent:  'center',
  },
  stepNumber:       { fontSize: 13, fontWeight: '600' },
  stepCheckmark:    { fontSize: 14, fontWeight: '700' },
  stepLabel:        { fontSize: 10, letterSpacing: 1 },
  stepLine:         {
    flex:            1,
    height:          1,
    marginHorizontal: 8,
    marginBottom:    20,
  },

  // Shared step content
  stepContent: { padding: SPACING.md, gap: SPACING.md },
  sectionTitle: {
    fontSize:   18,
    fontWeight: '700',
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
  },

  // Loading
  loadingBox: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             SPACING.sm,
    padding:         SPACING.xl,
    borderRadius:    RADIUS.md,
  },
  loadingText: { fontSize: 14 },

  // Empty address
  emptyAddressBox: {
    alignItems:      'center',
    padding:         SPACING.xl,
    borderRadius:    RADIUS.md,
    borderWidth:     1,
    gap:             SPACING.sm,
  },
  emptyAddressIcon:  { fontSize: 40 },
  emptyAddressTitle: {
    fontSize:   16,
    fontWeight: '700',
  },
  emptyAddressSub: {
    fontSize:  13,
    textAlign: 'center',
  },
  addAddressBtn: {
    marginTop:         SPACING.sm,
    paddingVertical:   12,
    paddingHorizontal: SPACING.lg,
    borderRadius:      RADIUS.md,
  },
  addAddressBtnText: {
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
    borderRadius:    RADIUS.md,
    borderWidth:     1.5,
  },
  radio: {
    width:           22,
    height:          22,
    borderRadius:    11,
    borderWidth:     1.5,
    alignItems:      'center',
    justifyContent:  'center',
    marginTop:       2,
  },
  radioDot: {
    width:           11,
    height:          11,
    borderRadius:    6,
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
  },
  defaultBadge: {
    paddingHorizontal: 6,
    paddingVertical:   2,
    borderRadius:     RADIUS.full,
  },
  defaultBadgeText: {
    fontSize:      9,
    fontWeight:    '700',
    letterSpacing: 1,
  },
  addressName: {
    fontSize:   15,
    fontWeight: '600',
  },
  addressText:  { fontSize: 13, lineHeight: 20 },
  addressPhone: { fontSize: 12, marginTop: 2 },

  // Delivery preview
  addressPreview: {
    padding:         SPACING.md,
    borderRadius:    RADIUS.md,
    gap:             4,
    borderWidth:     0.5,
  },
  previewLabel: {
    fontSize:      10,
    letterSpacing: 2,
    fontWeight:    '700',
  },
  previewName: {
    fontSize:   14,
    fontWeight: '600',
  },
  previewText: { fontSize: 13 },

  // Option cards (delivery + payment)
  optionCard: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    padding:         SPACING.md,
    borderRadius:    RADIUS.md,
    borderWidth:     1.5,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING.sm,
  },
  optionTitle: { fontSize: 15, fontWeight: '600' },
  optionDesc:  { fontSize: 12, marginTop: 2 },
  optionPrice: { fontSize: 15, fontWeight: '600' },

  // Order summary
  summaryBox: {
    borderRadius:    RADIUS.md,
    padding:         SPACING.md,
    gap:             SPACING.sm,
    borderWidth:     0.5,
  },
  summaryTitle: {
    fontSize:      11,
    letterSpacing: 2,
    fontWeight:    '700',
    marginBottom:  SPACING.xs,
  },
  summaryAddressRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING.sm,
  },
  summaryAddressLabel: {
    fontSize:  13,
    minWidth: 60,
  },
  summaryAddressValue: {
    flex:       1,
    fontSize:   13,
    fontWeight: '500',
  },
  summaryDivider: {
    height:          0.5,
    marginVertical:  SPACING.xs,
  },
  summaryRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  summaryItem:  {
    fontSize: 14,
    flex:     1,
    marginRight: SPACING.sm,
  },
  summaryPrice: { fontSize: 14, fontWeight: '500' },
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
    alignItems:     'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize:      12,
    fontWeight:    '700',
    letterSpacing: 2,
  },
  nextBtn: {
    flex:           2,
    height:         52,
    borderRadius:   RADIUS.md,
    alignItems:     'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    fontSize:      12,
    fontWeight:    '700',
    letterSpacing: 2,
  },
  placeOrderBtn: {
    flex:           2,
    height:         52,
    borderRadius:   RADIUS.md,
    alignItems:     'center',
    justifyContent: 'center',
  },
  placeOrderText: {
    fontSize:      13,
    fontWeight:    '700',
    letterSpacing: 2,
  },
  btnDisabled: { opacity: 0.6 },
});