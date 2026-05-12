// src/screens/main/MyOrdersScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView }  from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useUserOrders } from '../../../api/useOrders';
import OrderCard         from '../../../components/order/OrderCard';
import { useTheme }      from '../../../hook/useTheme';
import { SPACING, RADIUS } from '../../../utils/constants';

const STATUS_FILTERS = ['All', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function MyOrdersScreen() {
  const navigation        = useNavigation<any>();
  const { colors: C }     = useTheme();
  const [filter, setFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const { data: orders, isLoading, refetch } = useUserOrders();

  const filtered = orders?.filter((o) =>
    filter === 'All' ? true : o.status === filter
  ) ?? [];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

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
          MY ORDERS
        </Text>
        <Text style={[styles.orderCount, { color: C.textSecondary }]}>
          {orders?.length ?? 0}
        </Text>
      </View>

      {/* Status filter chips */}
      <View style={[styles.filterBar, { backgroundColor: C.surface, borderBottomColor: C.border }]}>
        <FlatList
          data={STATUS_FILTERS}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
          renderItem={({ item }) => {
            const active = filter === item;
            return (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  { borderColor: active ? C.primary : C.border },
                  active && { backgroundColor: C.primary },
                ]}
                onPress={() => setFilter(item)}
              >
                <Text style={[
                  styles.filterText,
                  { color: active ? C.surface : C.textSecondary },
                ]}>
                  {item === 'All' ? 'All Orders' :
                   item.charAt(0).toUpperCase() + item.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Loading */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={C.accent} />
          <Text style={[styles.loadingText, { color: C.textSecondary }]}>
            Loading your orders...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={{ height: SPACING.sm }} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={C.text}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={[styles.emptyTitle, { color: C.text }]}>
                {filter === 'All'
                  ? 'No orders yet'
                  : `No ${filter} orders`}
              </Text>
              <Text style={[styles.emptySubtitle, { color: C.textSecondary }]}>
                {filter === 'All'
                  ? 'Your orders will appear here once you place one.'
                  : 'Try selecting a different filter.'}
              </Text>
              {filter === 'All' && (
                <TouchableOpacity
                  style={[styles.shopBtn, { backgroundColor: C.primary }]}
                  onPress={() => {
  navigation.navigate('MainTabs', {
    screen: 'Home',
  });
}}
                >
                  <Text style={[styles.shopBtnText, { color: C.surface }]}>
                    START SHOPPING
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() =>
                navigation.navigate('OrderDetail', { orderId: item.id })
              }
            />
          )}
        />
      )}
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
      paddingTop:30

  },
  backText:    { fontSize: 24, width: 40 },
  headerTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 3 },
  orderCount:  { fontSize: 15, fontWeight: '600', width: 40, textAlign: 'right' },
  filterBar: {
    borderBottomWidth: 0.5,
    paddingVertical:   SPACING.sm,
  },
  filterScroll: {
    paddingHorizontal: SPACING.md,
    gap:               SPACING.xs,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical:   6,
    borderRadius:      999,
    borderWidth:       1,
  },
  filterText: { fontSize: 12, fontWeight: '600' },
  loadingContainer: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    gap:            SPACING.md,
  },
  loadingText: { fontSize: 14 },
  listContent: {
    padding:       SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  emptyContainer: {
    alignItems:        'center',
    paddingTop:        80,
    gap:               SPACING.sm,
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon:     { fontSize: 64, marginBottom: SPACING.md },
  emptyTitle: {
    fontSize:   22,
    fontWeight: '700',
    textAlign:  'center',
  },
  emptySubtitle: {
    fontSize:  14,
    textAlign: 'center',
    lineHeight: 22,
  },
  shopBtn: {
    marginTop:         SPACING.lg,
    paddingVertical:   14,
    paddingHorizontal: SPACING.xl,
    borderRadius:      RADIUS.md,
  },
  shopBtnText: { fontSize: 12, fontWeight: '700', letterSpacing: 2 },
});