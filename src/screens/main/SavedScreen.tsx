// src/screens/main/SavedScreen.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useFavoritesStore } from '../../../store/favoritesStore';
import { useProducts } from '../../../api/useProducts';
import ProductCard from '../../../components/product/ProductCard';
import { useCartStore } from '../../../store/cartStore';
import {
  sendPriceDropNotification,
} from '../../../services/notificationService';
import { COLORS, SPACING, RADIUS } from '../../../utils/constants';
import type { Product } from '../../../types';
import { useTheme } from '../../../hook/useTheme';

const { width } = Dimensions.get('window');

export default function SavedScreen() {
  const navigation          = useNavigation<any>();
  const { ids, toggle }     = useFavoritesStore();
  const { data: allProducts } = useProducts();
  const addItem = useCartStore((s) => s.addItem);
  const { colors: C } = useTheme();

  // Filter only favorited products
  const savedProducts = allProducts?.filter((p) => ids.includes(p.id)) ?? [];

  const handleTestPriceDrop = async () => {
    if (savedProducts.length > 0) {
      const p = savedProducts[0];
      await sendPriceDropNotification(p.name, p.price * 0.8, p.id);
    }
  };

  if (savedProducts.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
        <View style={[styles.header, {
          backgroundColor:  C.surface,
          borderBottomColor: C.border,
        }]}>
          <Text style={[styles.headerTitle, { color: C.text }]}>ELITE RETAIL</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyIcon, { color: C.text }]}>♡</Text>
          <Text style={[styles.emptyTitle, { color: C.text }]}>Your wishlist is empty</Text>
          <Text style={styles.emptySubtitle}>
            Tap the heart icon on any product to save it here.
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.browseBtnText}>BROWSE PRODUCTS</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={[styles.header, {
        backgroundColor:  C.surface,
        borderBottomColor: C.border,
      }]}>
        <Text style={[styles.headerTitle, { color: C.text }]}>ELITE RETAIL</Text>
      </View>

      {/* Title row */}
      <View style={[styles.titleRow, {
        backgroundColor:  C.surface,
        borderBottomColor: C.border,
      }]}>
        <View>
          <Text style={[styles.title, { color: C.text }]}>Saved Items</Text>
          <Text style={[styles.subtitle, { color: C.textSecondary }]}>{savedProducts.length} items</Text>
        </View>
        {/* Test price drop notification button */}
        {/* <TouchableOpacity
          style={styles.testBtn}
          onPress={handleTestPriceDrop}
        >
          <Text style={styles.testBtnText}>Test 🔔</Text>
        </TouchableOpacity> */}
      </View>

      <FlatList
        data={savedProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ProductCard
              product={item}
              width={(width - SPACING.md * 2 - SPACING.sm) / 2}
              onPress={() =>
                navigation.navigate('Home', {
                  screen: 'ProductDetail',
                  params: { productId: item.id, productName: item.name },
                })
              }
              onFavorite={() => toggle(item.id)}
              isFavorite={true}
            />
            {/* Quick Add to Cart */}
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => addItem(item, 1)}
            >
              <Text style={styles.addBtnText}>+ ADD TO CART</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 4,
    color: COLORS.textPrimary,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  
  grid: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  columnWrapper: { gap: SPACING.sm, marginBottom: SPACING.sm },
  cardWrapper: { width: (width - SPACING.md * 2 - SPACING.sm) / 2 },
  addBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    borderBottomLeftRadius: RADIUS.md,
    borderBottomRightRadius: RADIUS.md,
    alignItems: 'center',
    marginTop: -RADIUS.sm,
   
  },
  addBtnText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    padding: SPACING.xl,
  },
  emptyIcon: { fontSize: 72, marginBottom: SPACING.md },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary },
  emptySubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  browseBtn: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.md,
  },
  browseBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
});