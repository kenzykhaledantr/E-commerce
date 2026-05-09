// src/components/common/SkeletonCard.tsx
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../utils/constants';
import { useTheme } from '../../hook/useTheme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.44;

function SkeletonCard() {
  const shimmer = useRef(new Animated.Value(0)).current;
  const { colors:C } = useTheme();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View style={[styles.card, { opacity,backgroundColor:C.background }]}>
      <View style={styles.image} />
      <View style={[styles.body, { backgroundColor: C.background }]}>
        <View style={[styles.lineShort,{backgroundColor:C.background}]} />
        <View style={styles.lineLong} />
        <View style={[styles.linePrice,{backgroundColor:C.text}]} />
      </View>
    </Animated.View>
  );
}
export default React.memo(SkeletonCard);
const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginRight: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.offWhite,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: CARD_WIDTH * 1.2,
    backgroundColor: COLORS.border,
  },
  body: { padding: SPACING.sm, gap: 6 },
  lineShort: {
    height: 10,
    width: '50%',
    backgroundColor: COLORS.border,
    borderRadius: 4,
  },
  lineLong: {
    height: 12,
    width: '80%',
    backgroundColor: COLORS.border,
    borderRadius: 4,
  },
  linePrice: {
    height: 12,
    width: '35%',
    backgroundColor: COLORS.border,
    borderRadius: 4,
  },
});