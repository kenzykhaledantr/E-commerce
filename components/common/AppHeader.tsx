import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  Keyboard,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCartStore } from '../../store/cartStore';
import { useProducts } from '../../api/useProducts';
import { SPACING, RADIUS } from '../../utils/constants';
import { useTheme } from '../../hook/useTheme';
import type { Product } from '../../types';

export default function AppHeader({ showSearch = true }: { showSearch?: boolean }) {
  const navigation = useNavigation<any>();
  const totalItems = useCartStore((s) => s.totalItems());
  const badgeScale = useRef(new Animated.Value(1)).current;
  const { colors: C } = useTheme();

  // ── Search state ──────────────────────────────────────────
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchBarWidth = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef<TextInput>(null);

  const { data: allProducts } = useProducts();

  // Filter products by name/tags
  const results: Product[] =
    query.length >= 2
      ? (allProducts ?? []).filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.tags?.some((t) => t.toLowerCase().includes(query.toLowerCase()))
        )
      : [];

  // ── Badge animation ───────────────────────────────────────
  useEffect(() => {
    if (totalItems > 0) {
      Animated.sequence([
        Animated.spring(badgeScale, {
          toValue: 1.6,
          useNativeDriver: true,
          speed: 40,
          bounciness: 12,
        }),
        Animated.spring(badgeScale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 6,
        }),
      ]).start();
    }
  }, [totalItems]);

  // ── Toggle search bar ─────────────────────────────────────
  const toggleSearch = useCallback(() => {
    if (searchOpen) {
      // Close
      Keyboard.dismiss();
      Animated.timing(searchBarWidth, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start(() => {
        setSearchOpen(false);
        setQuery('');
      });
    } else {
      // Open
      setSearchOpen(true);
      Animated.timing(searchBarWidth, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [searchOpen, searchBarWidth]);

  // ── Navigate to product ───────────────────────────────────
  const goToProduct = useCallback(
    (product: Product) => {
      setQuery('');
      setSearchOpen(false);
      searchBarWidth.setValue(0);
      Keyboard.dismiss();
      navigation.navigate('ProductDetail', {
        productId: product.id,
        productName: product.name,
      });
    },
    [navigation, searchBarWidth]
  );

  // ── Interpolate search bar width ──────────────────────────
  const animatedSearchStyle = {
    flex: searchBarWidth.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    opacity: searchBarWidth,
  };

  return (
    <View style={{ zIndex: 100 }}>
      {/* ── Header Row ── */}
      <View
        style={[
          styles.container,
          {
            backgroundColor: C.surface,
            borderBottomColor: C.border,
          },
        ]}
      >
        

        {/* Brand — hide when search is open */}
        {!searchOpen && (
          <Text style={[styles.brand, { color: C.text }]}>ELITE RETAIL</Text>
        )}

        {/* Animated search bar */}
        {searchOpen && (
          <Animated.View
            style={[
              styles.searchBar,
              {
                backgroundColor: C.background,
                borderColor: C.border,
              },
              animatedSearchStyle,
            ]}
          >
            <Ionicons
              name="search-outline"
              size={16}
              color={C.textSecondary}
              style={{ marginRight: 6 }}
            />
            <TextInput
              ref={searchInputRef}
              style={[styles.searchInput, { color: C.text }]}
              placeholder="Search products..."
              placeholderTextColor={C.textSecondary}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              autoCorrect={false}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color={C.textSecondary} />
              </TouchableOpacity>
            )}
          </Animated.View>
        )}

        {/* Right icons */}
        <View style={styles.rightRow}>
          {showSearch && (
            <TouchableOpacity
              style={styles.iconBtn}
              activeOpacity={0.7}
              onPress={toggleSearch}
            >
              <Ionicons
                name={searchOpen ? 'close-outline' : 'search-outline'}
                size={22}
                color={C.text}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.iconBtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="bag-handle-outline" size={22} color={C.text} />
            {totalItems > 0 && (
              <Animated.View
                style={[
                  styles.badge,
                  {
                    backgroundColor: C.error,
                    transform: [{ scale: badgeScale }],
                  },
                ]}
              >
                <Text style={styles.badgeText}>
                  {totalItems > 9 ? '9+' : totalItems}
                </Text>
              </Animated.View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Search Results Dropdown ── */}
      {searchOpen && results.length > 0 && (
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: C.surface,
              borderColor: C.border,
            },
          ]}
        >
          <FlatList
            data={results.slice(0, 8)}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.resultRow, { borderBottomColor: C.border }]}
                activeOpacity={0.7}
                onPress={() => goToProduct(item)}
              >
                {item.images?.[0] && (
                  <Image
                    source={{ uri: item.images[0] }}
                    style={[styles.resultImage, { backgroundColor: C.background }]}
                  />
                )}
                <View style={styles.resultInfo}>
                  <Text
                    style={[styles.resultName, { color: C.text }]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text style={[styles.resultPrice, { color: C.accent }]}>
                    ${item.price.toFixed(2)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={C.textSecondary} />
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* ── No results message ── */}
      {searchOpen && query.length >= 2 && results.length === 0 && (
        <View
          style={[
            styles.dropdown,
            styles.noResults,
            {
              backgroundColor: C.surface,
              borderColor: C.border,
            },
          ]}
        >
          <Ionicons name="search" size={28} color={C.textSecondary} />
          <Text style={[styles.noResultsText, { color: C.textSecondary }]}>
            No products found for "{query}"
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 0.5,
  },
  brand: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 4,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 2,
    borderRadius: 999,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },

  // ── Search bar ──────────────────────────────────────────────
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.sm,
    height: 36,
    marginHorizontal: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },

  // ── Dropdown ────────────────────────────────────────────────
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomLeftRadius: RADIUS.md,
    borderBottomRightRadius: RADIUS.md,
    maxHeight: 360,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 0.5,
  },
  resultImage: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    marginRight: SPACING.sm,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultPrice: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  noResultsText: {
    fontSize: 13,
    textAlign: 'center',
  },
});