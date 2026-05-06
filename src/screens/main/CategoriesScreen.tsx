// src/screens/main/CategoriesScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useProductsByCategory } from '../../../api/useProducts';
import ProductCard from '../../../components/product/ProductCard';
import SkeletonCard from '../../../components/common/SkeletonCard';
import { useFavoritesStore } from '../../../store/favoritesStore';
import { COLORS, SPACING, RADIUS } from '../../../utils/constants';
import type { ProductCategory } from '../../../types';

const { width } = Dimensions.get('window');

const CATEGORIES: { key: ProductCategory; label: string; emoji: string; color: string }[] = [
  { key: 'handbags',    label: 'Handbags',     emoji: '👜', color: '#F5E6D3' },
  { key: 'clothing',   label: 'Clothing',     emoji: '👕', color: '#D3E4F5' },
  { key: 'electronics',label: 'Electronics',  emoji: '🎧', color: '#D3F5E4' },
  { key: 'footwear',   label: 'Footwear',     emoji: '👟', color: '#F5D3D3' },
  { key: 'watches',    label: 'Watches',      emoji: '⌚', color: '#E4D3F5' },
  { key: 'accessories',label: 'Accessories',  emoji: '💍', color: '#F5F5D3' },
];

export default function CategoriesScreen() {
  const navigation              = useNavigation<any>();
  const [selected, setSelected] = useState<ProductCategory>('handbags');
  const { toggle, isFavorite }  = useFavoritesStore();

  const { data: products, isLoading } = useProductsByCategory(selected);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ELITE RETAIL</Text>
      </View>

      <FlatList
        data={products ?? []}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Category chips */}
            <View style={styles.chipGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    styles.chip,
                    { backgroundColor: cat.color },
                    selected === cat.key && styles.chipActive,
                  ]}
                  onPress={() => setSelected(cat.key)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.chipEmoji}>{cat.emoji}</Text>
                  <Text
                    style={[
                      styles.chipLabel,
                      selected === cat.key && styles.chipLabelActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Section title */}
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>
                {CATEGORIES.find((c) => c.key === selected)?.label}
              </Text>
              <Text style={styles.count}>
                {products?.length ?? 0} items
              </Text>
            </View>

            {/* Skeleton grid */}
            {isLoading && (
              <View style={styles.skeletonGrid}>
                {[1, 2, 3, 4].map((k) => (
                  <SkeletonCard key={k} />
                ))}
              </View>
            )}
          </View>
        }
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) =>
          isLoading ? null : (
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
              isFavorite={isFavorite(item.id)}
            />
          )
        }
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
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipActive: { borderColor: COLORS.primary },
  chipEmoji: { fontSize: 16 },
  chipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  chipLabelActive: { color: COLORS.textPrimary },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  count: { fontSize: 13, color: COLORS.textSecondary },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  columnWrapper: {
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  listContent: { paddingBottom: SPACING.xl },
});