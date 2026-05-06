// src/components/common/TabBarIcon.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';

interface TabBarIconProps {
  name: 'home' | 'grid' | 'heart' | 'user';
  color: string;
  size?: number;
}

// Icon map using unicode symbols — replace with react-native-vector-icons later
const ICONS: Record<TabBarIconProps['name'], string> = {
  home: '⌂',
  grid: '⊞',
  heart: '♡',
  user: '◎',
};

const ICONS_ACTIVE: Record<TabBarIconProps['name'], string> = {
  home: '⌂',
  grid: '⊞',
  heart: '♥',
  user: '◉',
};

export default function TabBarIcon({ name, color, size = 24 }: TabBarIconProps) {
  return (
    <Text style={{ fontSize: size * 0.8, color, lineHeight: size * 1.0 }}>
      {ICONS[name]}
    </Text>
  );
}