// src/components/common/OfflineBanner.tsx
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  StyleSheet,
} from 'react-native';
import { useNetworkStatus } from '../../hook/useNetworkStatus';
import { COLORS, SPACING } from '../../utils/constants';

export default function OfflineBanner() {
  const { isConnected } = useNetworkStatus();
  const translateY      = useRef(new Animated.Value(-50)).current;
  const opacity         = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isConnected) {
      // Slide down
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide back up
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isConnected]);

  return (
    <Animated.View
      style={[
        styles.banner,
        { transform: [{ translateY }], opacity },
      ]}
      pointerEvents="none"
    >
      <Text style={styles.icon}>📡</Text>
      <Text style={styles.text}>No internet connection</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    backgroundColor: '#1a1a1a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  icon: { fontSize: 14 },
  text: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});