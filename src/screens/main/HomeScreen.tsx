// src/screens/main/HomeScreen.tsx
import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Animated } from 'react-native';
import { useScreenAnimation } from '../../../hook/useScreenAnimation';
import AppHeader from '../../../components/common/AppHeader';
import HeroBanner from '../../../components/common/HeroBanner';
import CategoryStrip from '../../../components/common/CategoryStrip';
import SectionHeader from '../../../components/common/SectionHeader';
import ProductCard, { CARD_WIDTH } from '../../../components/product/ProductCard';
import SkeletonCard from '../../../components/common/SkeletonCard';

import { useProducts, useNewArrivals, useProductsByCategory } from '../../../api/useProducts';
import { useFavoritesStore } from '../../../store/favoritesStore';
import { COLORS, SPACING } from '../../../utils/constants';
import type { Product, ProductCategory } from '../../../types';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const newArrivalsRef = useRef<FlatList>(null);

  const { toggle, isFavorite } = useFavoritesStore();

  // React Query hooks — automatic caching + loading states
  const {
    data: newArrivals,
    isLoading: loadingNew,
    refetch: refetchNew,
  } = useNewArrivals();

  const {
    data: allProducts,
    isLoading: loadingAll,
    refetch: refetchAll,
  } = useProducts();

  const {
    data: categoryProducts,
    isLoading: loadingCategory,
  } = useProductsByCategory(
    selectedCategory !== 'all' ? selectedCategory : 'handbags' // fallback
  );

  // Determine which products to show in the grid
  const gridProducts =
    selectedCategory === 'all' ? allProducts : categoryProducts;

  const isGridLoading =
    selectedCategory === 'all' ? loadingAll : loadingCategory;

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchNew(), refetchAll()]);
    setRefreshing(false);
  }, [refetchNew, refetchAll]);

  const goToProduct = (product: Product) => {
    navigation.navigate('ProductDetail', {
      productId: product.id,
      productName: product.name,
    });
  };

  // ── Render pieces ──────────────────────────────────────────

  const renderNewArrivalItem = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => goToProduct(item)}
      onFavorite={() => toggle(item.id)}
      isFavorite={isFavorite(item.id)}
    />
  );

  const renderGridItem = ({ item, index }: { item: Product; index: number }) => (
    <ProductCard
      product={item}
      onPress={() => goToProduct(item)}
      onFavorite={() => toggle(item.id)}
      isFavorite={isFavorite(item.id)}
      width={(width - SPACING.md * 2 - SPACING.sm) / 2}
    />
  );

  const renderSkeletons = () => (
    <View style={styles.skeletonRow}>
      {[1, 2, 3].map((k) => <SkeletonCard key={k} />)}
    </View>
  );

  // ── Main list data ─────────────────────────────────────────
  // We use a single FlatList with ListHeaderComponent so the
  // entire screen scrolls as one unit (no nested ScrollView)

  function ListHeader() {
    const heroAnim = useScreenAnimation(0);
    const categoryAnim = useScreenAnimation(1);
    const newArrivalAnim = useScreenAnimation(2);
    return (
    <View>
      {/* Hero Banner */}
      <Animated.View style={heroAnim}>
        <HeroBanner />
      </Animated.View>


      {/* Categories */}
      <Animated.View style={categoryAnim}>
      <CategoryStrip
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        />
        </Animated.View>

      <View style={styles.divider} />

      {/* New Arrivals */}
      <Animated.View style={newArrivalAnim}>
      <SectionHeader
        title="New Arrivals"
        showArrows
        onPrev={() =>
          newArrivalsRef.current?.scrollToOffset({ offset: 0, animated: true })
        }
        onNext={() =>
          newArrivalsRef.current?.scrollToEnd({ animated: true })
        }
        />

      {loadingNew ? (
        renderSkeletons()
      ) : (
        <FlatList
          ref={newArrivalsRef}
          data={newArrivals}
          keyExtractor={(item) => item.id}
          renderItem={renderNewArrivalItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
        )}
        </Animated.View>
        

      <View style={styles.divider} />

      {/* Grid section header */}
      <SectionHeader
        title={
          selectedCategory === 'all'
            ? 'Recommended for You'
            : selectedCategory.charAt(0).toUpperCase() +
            selectedCategory.slice(1)
        }
        onViewAll={() => { }}
      />
    </View>
  );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader />

      {isGridLoading ? (
        <View style={styles.gridSkeletons}>
          <ListHeader />
          <View style={styles.gridRow}>
            <SkeletonCard />
            <SkeletonCard />
          </View>
          <View style={styles.gridRow}>
            <SkeletonCard />
            <SkeletonCard />
          </View>
        </View>
      ) : (
        <FlatList
          data={gridProducts ?? []}
          keyExtractor={(item) => item.id}
          renderItem={renderGridItem}
          numColumns={2}
          ListHeaderComponent={<ListHeader />}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.textPrimary}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  horizontalList: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    gap: SPACING.sm,
  },
  skeletonRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    gap: SPACING.sm,
  },
  gridContent: {
    paddingBottom: SPACING.xl,
    backgroundColor: COLORS.offWhite,
  },
  columnWrapper: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    gap: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  divider: {
    height: SPACING.sm,
    backgroundColor: COLORS.offWhite,
  },
  gridSkeletons: {
    flex: 1,
  },
  gridRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    backgroundColor: COLORS.white,
    paddingTop: SPACING.sm,
  },
  empty: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
});