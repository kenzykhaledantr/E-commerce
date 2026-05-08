// src/screens/main/ProfileScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../../store/authStore';
import { useOrders } from '../../../api/useOrders';
import { useFavoritesStore } from '../../../store/favoritesStore';
import { logoutUser } from '../../../services/authService';
import { COLORS, SPACING, RADIUS } from '../../../utils/constants';




export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const user            = useAuthStore((s) => s.user);
  const logout          = useAuthStore((s) => s.logout);
  const { data: orders } = useOrders();
  const favoriteIds     = useFavoritesStore((s) => s.ids);

const MENU_ITEMS = [
  {
    icon:    '📍',
    label:   'Saved Addresses',
    onPress: () => navigation.navigate('SavedAddresses'),
  },
  {
    icon:    '💳',
    label:   'Payment Methods',
    onPress: () => {},
  },
  {
    icon:    '⚙️',
    label:   'Account Settings',
    onPress: () => {},
  },
];

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logoutUser();
          logout();
        },
      },
    ]);
  };

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ELITE RETAIL</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(user?.displayName ?? 'U')}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.displayName}>{user?.displayName}</Text>
            <Text style={styles.memberLabel}>Platinum Member since 2024</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{orders?.length ?? 0}</Text>
            <Text style={styles.statLabel}>MY ORDERS</Text>
            <Text style={styles.statSub}>
              {orders?.filter((o) => o.status === 'confirmed').length ?? 0} Active
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{favoriteIds.length}</Text>
            <Text style={styles.statLabel}>WISHLIST</Text>
            <Text style={styles.statSub}>{favoriteIds.length} Items</Text>
          </View>
        </View>

        {/* Menu items */}
        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.menuItem}
              onPress={item.onPress} 
              activeOpacity={0.7}
              
            >
              <View style={styles.menuLeft}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}

          {/* Logout */}
          <TouchableOpacity
            style={[styles.menuItem, styles.logoutItem]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>↪</Text>
              <Text style={[styles.menuLabel, styles.logoutLabel]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Orders */}
        {orders && orders.length > 0 && (
          <View style={styles.ordersSection}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {orders.slice(0, 3).map((order) => (
              <View key={order.id} style={styles.orderRow}>
                <View
                  style={[
                    styles.orderDot,
                    order.status === 'confirmed' && styles.orderDotActive,
                  ]}
                />
                <View style={styles.orderInfo}>
                  <Text style={styles.orderTitle}>
                    Order #{order.id.slice(-6).toUpperCase()}
                  </Text>
                  <Text style={styles.orderMeta}>
                    {order.status} · ${order.total.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Tailored for you */}
        <View style={styles.tailoredSection}>
          <View style={styles.tailoredHeader}>
            <Text style={styles.sectionTitle}>Tailored for You</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.tailoredSub}>
            Based on your browsing and purchase history
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 13, fontWeight: '700', letterSpacing: 4, color: COLORS.textPrimary },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.accent,
  },
  avatarText: { fontSize: 24, fontWeight: '700', color: COLORS.white },
  profileInfo: { flex: 1 },
  displayName: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  memberLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginTop: SPACING.sm,
    padding: SPACING.lg,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: COLORS.border,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statDivider: { width: 0.5, backgroundColor: COLORS.border },
  statValue: { fontSize: 28, fontWeight: '700', color: COLORS.textPrimary },
  statLabel: { fontSize: 9, letterSpacing: 2, fontWeight: '700', color: COLORS.textSecondary },
  statSub: { fontSize: 11, color: COLORS.textLight },
  menuSection: {
    backgroundColor: COLORS.white,
    marginTop: SPACING.sm,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: COLORS.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  logoutItem: { borderBottomWidth: 0 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  menuIcon: { fontSize: 18, width: 28 },
  menuLabel: { fontSize: 15, color: COLORS.textPrimary },
  logoutLabel: { color: COLORS.error },
  menuArrow: { fontSize: 20, color: COLORS.textLight },
  ordersSection: {
    backgroundColor: COLORS.white,
    marginTop: SPACING.sm,
    padding: SPACING.lg,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  orderRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  orderDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border },
  orderDotActive: { backgroundColor: COLORS.accent },
  orderInfo: { flex: 1 },
  orderTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  orderMeta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2, textTransform: 'capitalize' },
  tailoredSection: {
    backgroundColor: COLORS.white,
    marginTop: SPACING.sm,
    padding: SPACING.lg,
    gap: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  tailoredHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAll: { fontSize: 10, letterSpacing: 2, fontWeight: '600', color: COLORS.textSecondary },
  tailoredSub: { fontSize: 13, color: COLORS.textSecondary },
});