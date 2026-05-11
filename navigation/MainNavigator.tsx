// src/navigation/MainNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { MainTabParamList } from '../types/navigation';
import { COLORS } from '../utils/constants';
import { useTheme } from '../hook/useTheme';
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
  iconName,
  focused,
}: {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  focused: boolean;
}) {
  const { colors: C } = useTheme();
  return (
    <View style={styles.tabItem}>
      <Ionicons name={iconName} size={20} color={focused ? C.text : C.textLight} />
      <Text style={[styles.tabLabel, { color: focused ? C.text : C.textLight, fontWeight: focused ? '700' : '200' }]}>
        {label}
      </Text>
    </View>
  );
}

export default function MainNavigator() {
  const { colors: C } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor:  C.tabBar,
          borderTopColor:   C.border,
          borderTopWidth:   0.5,
          height:           Platform.OS === 'ios' ? 85 : 65,
          paddingBottom:    Platform.OS === 'ios' ? 28 : 8,
          paddingTop:       8,
          elevation:        0,
          shadowOpacity:    0,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="HOME" iconName="home-outline" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="CATEGORIES" iconName="grid-outline" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="SAVED" iconName="heart-outline" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="PROFILE" iconName="person-outline" focused={focused} />
          ),
        }}
          />
         
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 9,
    letterSpacing: 0.2,
  },
});