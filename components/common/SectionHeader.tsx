// src/components/common/SectionHeader.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS, SPACING } from '../../utils/constants';

interface SectionHeaderProps {
  title: string;
  onViewAll?: () => void;
  showArrows?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
}

export default function SectionHeader({
  title,
  onViewAll,
  showArrows = false,
  onPrev,
  onNext,
}: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.right}>
        {showArrows && (
          <>
            <TouchableOpacity style={styles.arrowBtn} onPress={onPrev}>
              <Text style={styles.arrow}>‹</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.arrowBtn} onPress={onNext}>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </>
        )}
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text style={styles.viewAll}>VIEW ALL</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
const RADIUS_FULL = 999;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  arrowBtn: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS_FULL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    fontSize: 18,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  viewAll: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});

