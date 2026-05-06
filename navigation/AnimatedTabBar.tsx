// src/navigation/AnimatedTabBar.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { COLORS, SPACING } from '../utils/constants';

const { width } = Dimensions.get('window');
const TAB_COUNT = 4;
const TAB_WIDTH = width / TAB_COUNT;

const TABS = [
  { key: 'Home',       label: 'HOME',       icon: '⌂' },
  { key: 'Categories', label: 'CATEGORIES', icon: '⊞' },
  { key: 'Saved',      label: 'SAVED',      icon: '♡' },
  { key: 'Profile',    label: 'PROFILE',    icon: '◎' },
];

interface AnimatedTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function AnimatedTabBar({
  state,
  descriptors,
  navigation,
}: AnimatedTabBarProps) {

  const activeIndex = state.index;

  return (
    <View style={styles.container}>
      {/* Sliding top indicator */}
      <View
        style={[
          styles.indicator,
          { left: activeIndex * TAB_WIDTH, width: TAB_WIDTH },
        ]}
      />

      {/* Tab buttons */}
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const tab = TABS[index];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tab}
            onPress={onPress}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabIcon,
                isFocused && styles.tabIconActive,
              ]}
            >
              {tab.icon}
            </Text>
            <Text
              style={[
                styles.tabLabel,
                isFocused && styles.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    height: Platform.OS === 'ios' ? 85 : 65,
    paddingBottom: Platform.OS === 'ios' ? 24 : 4,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: TAB_WIDTH,
    height: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.sm,
    gap: 3,
  },
  tabIcon: {
    fontSize: 20,
    color: COLORS.textLight,
  },
  tabIconActive: {
    color: COLORS.textPrimary,
  },
  tabLabel: {
    fontSize: 8,
    letterSpacing: 1,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
});