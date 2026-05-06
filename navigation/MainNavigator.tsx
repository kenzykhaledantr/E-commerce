// src/navigation/MainNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';
import type { MainTabParamList } from '../types/navigation';
import { COLORS } from '../utils/constants';

import HomeNavigator from './HomeNavigator';
import CategoriesScreen from '../src/screens/main/CategoriesScreen';
import SavedScreen from '../src/screens/main/SavedScreen';
import ProfileScreen from '../src/screens/main/ProfileScreen';
import CartTabIcon from '../components/common/CartTabIcon';
import AnimatedTabBar from './AnimatedTabBar';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Tab icon labels with active/inactive styles
function TabIcon({
  label,
  symbol,
  focused,
}: {
  label: string;
  symbol: string;
  focused: boolean;
}) {
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.tabSymbol, focused && styles.tabSymbolActive]}>
        {symbol}
      </Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        {label}
      </Text>
    </View>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,    // we render custom labels inside TabIcon
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="HOME" symbol="⌂" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="CATEGORIES" symbol="⊞" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="SAVED" symbol="♡" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="PROFILE" symbol="◎" focused={focused} />
          ),
        }}
          />
         
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    height: Platform.OS === 'ios' ? 85 : 65,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    elevation: 0,              // remove Android shadow
    shadowOpacity: 0,          // remove iOS shadow
  },
  tabItem: {
    alignItems: 'center',
    gap: 5,
  },
  tabSymbol: {
    fontSize: 20,
    color: COLORS.textLight,
  },
  tabSymbolActive: {
    color: COLORS.textPrimary,
  },
  tabLabel: {
    fontSize: 9,
    letterSpacing: 0.3,
    color: COLORS.textLight,
    fontWeight: '200',
  },
  tabLabelActive: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
});