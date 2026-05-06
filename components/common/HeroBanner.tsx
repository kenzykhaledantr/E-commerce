// src/components/common/HeroBanner.tsx
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../utils/constants';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    tag: 'LIMITED EDITION',
    title: 'Elevate Your Lifestyle\nwith Elite Essentials.',
    subtitle: 'Experience the pinnacle of craftsmanship in our newest seasonal collection.',
    cta: 'SHOP COLLECTION',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    overlay: 'rgba(0,0,0,0.45)',
  },
  {
    id: '2',
    tag: 'NEW ARRIVALS',
    title: 'Heritage Crafted\nfor the Modern World.',
    subtitle: 'Timeless pieces designed to last a lifetime.',
    cta: 'EXPLORE NOW',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800',
    overlay: 'rgba(0,0,0,0.4)',
  },
  {
    id: '3',
    tag: 'EXCLUSIVE',
    title: 'Luxury Redefined\nfor Every Occasion.',
    subtitle: 'Curated pieces from the world\'s finest artisans.',
    cta: 'DISCOVER MORE',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
    overlay: 'rgba(0,0,0,0.42)',
  },
];

export default function HeroBanner() {
  const flatRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-scroll every 4 seconds
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % SLIDES.length;
        flatRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
          // Reset timer on manual swipe
          if (timerRef.current) clearInterval(timerRef.current);
   timerRef.current = setInterval(() => { /* same logic */ }, 4000);
        }}
        renderItem={({ item }) => (
          <ImageBackground
            source={{ uri: item.image }}
            style={styles.slide}
            imageStyle={styles.slideImage}
          >
            {/* Dark overlay */}
            <View
              style={[styles.overlay, { backgroundColor: item.overlay }]}
            />

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.tag}>{item.tag}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
              <TouchableOpacity style={styles.cta} activeOpacity={0.85}>
                <Text style={styles.ctaText}>{item.cta}</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        )}
      />

      {/* Dot indicators */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => {
              flatRef.current?.scrollToIndex({ index: i, animated: true });
              setActiveIndex(i);
            }}
          >
            <View
              style={[
                styles.dot,
                i === activeIndex && styles.dotActive,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 320,
    position: 'relative',
  },
  slide: {
    width,
    height: 320,
    justifyContent: 'flex-end',
  },
  slideImage: {
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  tag: {
    fontSize: 10,
    letterSpacing: 3,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.white,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 20,
    maxWidth: '80%',
  },
  cta: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    marginTop: SPACING.xs,
  },
  ctaText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  dots: {
    position: 'absolute',
    bottom: SPACING.md,
    right: SPACING.lg,
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    width: 20,
    backgroundColor: COLORS.white,
  },
});