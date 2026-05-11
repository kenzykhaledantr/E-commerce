// src/screens/main/OrderDetailScreen.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView }   from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery }       from '@tanstack/react-query';
import { useTheme }       from '../../../hook/useTheme';
import OrderStatusBadge  from '../../../components/order/OrderStatusBadge';
import { getUserOrders } from '../../../services/orderService';
import { useAuthStore }  from '../../../store/authStore';
import { SPACING, RADIUS } from '../../../utils/constants';

export default function OrderDetailScreen() {
  const navigation = useNavigation<any>();
  const route      = useRoute<any>();
  const { orderId } = route.params as { orderId: string };
  const { colors: C } = useTheme();
  const user          = useAuthStore((s) => s.user);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', user?.uid],
    queryFn:  () => getUserOrders(user!.uid),
    enabled:  !!user,
  });

  const order = orders?.find((o) => o.id === orderId);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={C.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.errorText, { color: C.textSecondary }]}>
            Order not found.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      weekday: 'long',
      day:     'numeric',
      month:   'long',
      year:    'numeric',
    });

  const Row = ({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) => (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: C.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.infoValue, { color: C.text }]}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: C.background }]}
      edges={['bottom']}
    >
      {/* Header */}
      <View style={[styles.header, {
        backgroundColor:   C.surface,
        borderBottomColor: C.border,
      }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backText, { color: C.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: C.text }]}>
          ORDER DETAILS
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ── Status card ─────────────────────────────── */}
        <View style={[styles.card, {
          backgroundColor: C.card,
          borderColor:     C.border,
        }]}>
          <View style={styles.statusRow}>
            <View>
              <Text style={[styles.orderIdText, { color: C.text }]}>
                #{order.id.slice(-8).toUpperCase()}
              </Text>
              <Text style={[styles.dateText, { color: C.textSecondary }]}>
                {formatDate(order.createdAt)}
              </Text>
            </View>
            <OrderStatusBadge status={order.status} />
          </View>

          {/* Progress bar */}
          <View style={styles.progressSection}>
            {['confirmed', 'shipped', 'delivered'].map((s, i) => {
              const statuses = ['confirmed', 'shipped', 'delivered'];
              const current  = statuses.indexOf(order.status);
              const isDone   = i <= current;
              const isActive = i === current;
              return (
                <React.Fragment key={s}>
                  <View style={styles.progressStep}>
                    <View style={[
                      styles.progressDot,
                      { borderColor: isDone ? C.accent : C.border },
                      isDone && { backgroundColor: C.accent },
                    ]}>
                      {isDone && (
                        <Text style={styles.progressCheck}>✓</Text>
                      )}
                    </View>
                    <Text style={[
                      styles.progressLabel,
                      { color: isDone ? C.accent : C.textLight },
                      isActive && { fontWeight: '700' },
                    ]}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </Text>
                  </View>
                  {i < 2 && (
                    <View style={[
                      styles.progressLine,
                      { backgroundColor: i < current ? C.accent : C.border },
                    ]} />
                  )}
                </React.Fragment>
              );
            })}
          </View>
        </View>

        {/* ── Items ───────────────────────────────────── */}
        <View style={[styles.card, {
          backgroundColor: C.card,
          borderColor:     C.border,
        }]}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>
            Items ({order.items.length})
          </Text>
          {order.items.map((item, i) => (
            <View key={i}>
              <View style={styles.itemRow}>
                <Image
                  source={{ uri: item.productImage }}
                  style={[styles.itemImage, { backgroundColor: C.background }]}
                  resizeMode="cover"
                />
                <View style={styles.itemInfo}>
                  <Text
                    style={[styles.itemName, { color: C.text }]}
                    numberOfLines={2}
                  >
                    {item.productName}
                  </Text>
                  <Text style={[styles.itemQty, { color: C.textSecondary }]}>
                    Qty: {item.quantity}
                  </Text>
                  <Text style={[styles.itemPrice, { color: C.text }]}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              </View>
              {i < order.items.length - 1 && (
                <View style={[styles.divider, { backgroundColor: C.border }]} />
              )}
            </View>
          ))}
        </View>

        {/* ── Order summary ────────────────────────────── */}
        <View style={[styles.card, {
          backgroundColor: C.card,
          borderColor:     C.border,
        }]}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>
            Order Summary
          </Text>
          <View style={styles.summaryRows}>
            <Row
              label="Subtotal"
              value={`$${(order.total - (order.deliveryMethod?.price ?? 0)).toFixed(2)}`}
            />
            <View style={[styles.divider, { backgroundColor: C.border }]} />
            <Row
              label="Delivery"
              value={
                order.deliveryMethod?.price === 0
                  ? 'Free'
                  : `$${order.deliveryMethod?.price?.toFixed(2) ?? '0.00'}`
              }
            />
            <View style={[styles.divider, { backgroundColor: C.border }]} />
            <View style={styles.infoRow}>
              <Text style={[styles.totalLabel, { color: C.text }]}>
                Total
              </Text>
              <Text style={[styles.totalValue, { color: C.text }]}>
                ${order.total.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Shipping address ─────────────────────────── */}
        {order.shippingAddress && (
          <View style={[styles.card, {
            backgroundColor: C.card,
            borderColor:     C.border,
          }]}>
            <Text style={[styles.sectionTitle, { color: C.text }]}>
              Shipping Address
            </Text>
            <View style={styles.addressBlock}>
              <Text style={[styles.addressName, { color: C.text }]}>
                {order.shippingAddress.fullName}
              </Text>
              <Text style={[styles.addressLine, { color: C.textSecondary }]}>
                {order.shippingAddress.street}
              </Text>
              <Text style={[styles.addressLine, { color: C.textSecondary }]}>
                {order.shippingAddress.city},{' '}
                {order.shippingAddress.postalCode}
              </Text>
              <Text style={[styles.addressLine, { color: C.textSecondary }]}>
                {order.shippingAddress.phone}
              </Text>
            </View>
          </View>
        )}

        {/* ── Payment method ───────────────────────────── */}
        <View style={[styles.card, {
          backgroundColor: C.card,
          borderColor:     C.border,
        }]}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>
            Payment Method
          </Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentIcon}>
              {order.paymentMethod === 'card' ? '💳' : '🅿'}
            </Text>
            <Text style={[styles.paymentText, { color: C.text }]}>
              {order.paymentMethod === 'card'
                ? 'Credit or Debit Card'
                : 'PayPal'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:             { flex: 1,paddingTop:20 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText:        { fontSize: 16 },
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical:   SPACING.sm,
    borderBottomWidth: 0.5,
  },
  backText:    { fontSize: 24, width: 40 },
  headerTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 3 },
  content: {
    padding:       SPACING.md,
    gap:           SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  card: {
    borderRadius: RADIUS.md,
    borderWidth:  0.5,
    padding:      SPACING.md,
    gap:          SPACING.sm,
    shadowColor:  '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation:    2,
  },

  // Status
  statusRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'flex-start',
  },
  orderIdText: { fontSize: 17, fontWeight: '700', letterSpacing: 0.5 },
  dateText:    { fontSize: 13, marginTop: 3 },

  // Progress
  progressSection: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    marginTop:      SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  progressStep: { alignItems: 'center', gap: 6 },
  progressDot: {
    width:          28,
    height:         28,
    borderRadius:   14,
    borderWidth:    2,
    alignItems:     'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  progressCheck: { fontSize: 12, color: '#fff', fontWeight: '700' },
  progressLabel: { fontSize: 10, letterSpacing: 0.5 },
  progressLine: {
    flex:   1,
    height: 2,
    marginHorizontal: 4,
    marginBottom:     20,
  },

  // Items
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: SPACING.xs },
  itemRow: {
    flexDirection: 'row',
    gap:           SPACING.md,
    paddingVertical: SPACING.xs,
  },
  itemImage: {
    width:        72,
    height:       72,
    borderRadius: RADIUS.sm,
  },
  itemInfo:  { flex: 1, gap: 4 },
  itemName:  { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  itemQty:   { fontSize: 13 },
  itemPrice: { fontSize: 15, fontWeight: '700' },
  divider:   { height: 0.5, marginVertical: SPACING.xs },

  // Summary
  summaryRows: { gap: SPACING.xs },
  infoRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingVertical: 4,
  },
  infoLabel:  { fontSize: 14 },
  infoValue:  { fontSize: 14, fontWeight: '500' },
  totalLabel: { fontSize: 16, fontWeight: '700' },
  totalValue: { fontSize: 20, fontWeight: '700' },

  // Address
  addressBlock: { gap: 4 },
  addressName:  { fontSize: 15, fontWeight: '600' },
  addressLine:  { fontSize: 14, lineHeight: 22 },

  // Payment
  paymentRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  paymentIcon: { fontSize: 24 },
  paymentText: { fontSize: 15, fontWeight: '500' },
});