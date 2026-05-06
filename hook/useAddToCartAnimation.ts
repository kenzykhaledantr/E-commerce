// src/hooks/useAddToCartAnimation.ts
import { useRef } from 'react';
import { Animated } from 'react-native';

// A lightweight flying dot animation using the standard Animated API
// (Reanimated layout animations would need extra setup for cross-component)
export function useAddToCartAnimation() {
  const dotOpacity = useRef(new Animated.Value(0)).current;
  const dotScale  = useRef(new Animated.Value(0)).current;
  const dotY      = useRef(new Animated.Value(0)).current;

  const triggerAnimation = (onComplete?: () => void) => {
    // Reset
    dotOpacity.setValue(1);
    dotScale.setValue(1);
    dotY.setValue(0);

    Animated.parallel([
      // Fly upward
      Animated.timing(dotY, {
        toValue: -80,
        duration: 600,
        useNativeDriver: true,
      }),
      // Fade out
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(dotOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      // Scale up then shrink
      Animated.sequence([
        Animated.spring(dotScale, {
          toValue: 1.4,
          useNativeDriver: true,
          speed: 40,
        }),
        Animated.timing(dotScale, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => onComplete?.());
  };

  const dotStyle = {
    opacity: dotOpacity,
    transform: [
      { translateY: dotY },
      { scale: dotScale },
    ],
  };

  return { triggerAnimation, dotStyle };
}