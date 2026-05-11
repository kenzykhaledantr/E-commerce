// src/components/order/OrderCard.tsx
import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Image,
} from 'react-native';
import { useTheme }       from '../../hook/useTheme';
import OrderStatusBadge  from './OrderStatusBadge';
import { SPACING, RADIUS } from '../../utils/constants';
import type { OrderDetail } from '../../services/orderService';

interface OrderCardProps {
  order:   OrderDetail;
  onPress: () => void;
}

export default function OrderCard({ order, onPress }: OrderCardProps) {
  const { colors: C } = useTheme();
  const scale         = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, {
      toValue: 0.98, useNativeDriver: true,
      speed: 50, bounciness: 0,
    }).start();

  const handlePressOut = () =>
    Animated.spring(scale, {
      toValue: 1, useNativeDriver: true,
      speed: 20, bounciness: 4,
    }).start();

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      day:   'numeric',
      month: 'short',
      year:  'numeric',
    });

  // Show max 3 product images
  const previewImages = order.items.slice(0, 3);
  const extraCount    = order.items.length - 3;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[styles.card, {
          backgroundColor: C.card,
          borderColor:     C.border,
        }]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={1}
      >
        {/* Top row — order ID + date */}
        <View style={styles.topRow}>
          <View>
            <Text style={[styles.orderId, { color: C.text }]}>
              Order #{order.id.slice(-8).toUpperCase()}
            </Text>
            <Text style={[styles.date, { color: C.textSecondary }]}>
              {formatDate(order.createdAt)}
            </Text>
          </View>
          <OrderStatusBadge status={order.status} />
        </View>

        {/* Product image previews */}
        <View style={styles.imagesRow}>
          {previewImages.map((item, i) => (
            <View
              key={i}
              style={[styles.imageWrapper, {
                borderColor: C.border,
                zIndex:      previewImages.length - i,
                marginLeft:  i > 0 ? -12 : 0,
              }]}
            >
              <Image
                source={{ uri: item.productImage }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          ))}
          {extraCount > 0 && (
            <View style={[styles.extraBadge, {
              backgroundColor: C.background,
              borderColor:     C.border,
              marginLeft:      -12,
            }]}>
              <Text style={[styles.extraText, { color: C.textSecondary }]}>
                +{extraCount}
              </Text>
            </View>
          )}

          {/* Item count label */}
          <Text style={[styles.itemCount, { color: C.textSecondary }]}>
            {order.items.length}{' '}
            {order.items.length === 1 ? 'item' : 'items'}
          </Text>
        </View>

        {/* Bottom row — total + arrow */}
        <View style={[styles.bottomRow, { borderTopColor: C.border }]}>
          <View>
            <Text style={[styles.totalLabel, { color: C.textSecondary }]}>
              ORDER TOTAL
            </Text>
            <Text style={[styles.total, { color: C.text }]}>
              ${order.total.toFixed(2)}
            </Text>
          </View>
          <View style={styles.bottomRight}>
            {order.deliveryMethod?.label && (
              <Text style={[styles.delivery, { color: C.textSecondary }]}>
                {order.deliveryMethod.label}
              </Text>
            )}
            <Text style={[styles.arrow, { color: C.textLight }]}>›</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius:  RADIUS.md,
    borderWidth:   0.5,
    overflow:      'hidden',
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius:  8,
    elevation:     2,
  },
  topRow: {
    flexDirection:   'row',
    justifyContent:  'space-between',
    alignItems:      'flex-start',
    padding:         SPACING.md,
    paddingBottom:   SPACING.sm,
  },
  orderId: { fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },
  date:    { fontSize: 12, marginTop: 2 },
  imagesRow: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingHorizontal: SPACING.md,
    paddingVertical:   SPACING.sm,
  },
  imageWrapper: {
    width:        52,
    height:       52,
    borderRadius: RADIUS.sm,
    borderWidth:  2,
    overflow:     'hidden',
  },
  image:  { width: '100%', height: '100%' },
  extraBadge: {
    width:          52,
    height:         52,
    borderRadius:   RADIUS.sm,
    borderWidth:    2,
    alignItems:     'center',
    justifyContent: 'center',
  },
  extraText:  { fontSize: 13, fontWeight: '700' },
  itemCount:  { fontSize: 13, marginLeft: SPACING.md },
  bottomRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    padding:        SPACING.md,
    paddingTop:     SPACING.sm,
    borderTopWidth: 0.5,
  },
  totalLabel: { fontSize: 10, letterSpacing: 2, fontWeight: '600' },
  total:      { fontSize: 18, fontWeight: '700', marginTop: 2 },
  bottomRight: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING.xs,
  },
  delivery: { fontSize: 12 },
  arrow:    { fontSize: 22 },
});