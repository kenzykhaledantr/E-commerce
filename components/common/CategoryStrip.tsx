// src/components/common/CategoryStrip.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../utils/constants';
import type { ProductCategory } from '../../types';
import * as Haptics from 'expo-haptics';

interface Category {
  key: ProductCategory | 'all';
  label: string;
  emoji: string;
}

const CATEGORIES: Category[] = [
  { key: 'all', label: 'All', emoji: '✦' },
  { key: 'handbags', label: 'Bags', emoji: '👜' },
  { key: 'clothing', label: 'Clothes', emoji: '👕' },
  { key: 'electronics', label: 'Tech', emoji: '🎧' },
  { key: 'footwear', label: 'Shoes', emoji: '👟' },
  { key: 'watches', label: 'Watches', emoji: '⌚' },
  { key: 'accessories', label: 'Accessories', emoji: '💍' },
];

interface CategoryStripProps {
  onSelect: (category: ProductCategory | 'all') => void;
  selected?: ProductCategory | 'all';
}

export default function CategoryStrip({
  onSelect,
  selected = 'all',
}: CategoryStripProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Shop by Category</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>VIEW ALL</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selected === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={async () => {
                await Haptics.selectionAsync();
                onSelect(cat.key)
              }}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.emojiContainer,
                  isActive && styles.emojiContainerActive,
                ]}
              >
                <Text style={styles.emoji}>{cat.emoji}</Text>
              </View>
              <Text
                style={[styles.label, isActive && styles.labelActive]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.white,
    paddingTop: SPACING.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  viewAll: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  scroll: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  chip: {
    alignItems: 'center',
    gap: 6,
    width: 68,
  },
  chipActive: {},
  emojiContainer: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  emojiContainerActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  emoji: {
    fontSize: 26,
  },
  label: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  labelActive: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
});