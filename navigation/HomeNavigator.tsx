// src/navigation/HomeNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../types/navigation';
import { COLORS } from '../utils/constants';

import HomeScreen from '../src/screens/main/HomeScreen';
import ProductDetailScreen from '../src/screens/main/ProductDetailScreen';
import CartScreen from '../src/screens/main/CartScreen';
import CheckoutScreen from '../src/screens/main/CheckoutScreen';
import CartTabIcon from '../components/common/CartTabIcon';
import OrderSuccessScreen from '../src/screens/main/OrderSuccessScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.white },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: { fontWeight: '700', fontSize: 14 },
        headerShadowVisible: false,
        headerBackTitle: '',       // hide "Back" text on iOS
      }}
    >
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{  headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={() => ({
          animation: 'slide_from_right',
          headerShown: false
        })}
      />
      <Stack.Screen
        name="Cart"
              component={CartScreen}
              
        options={{
          title: 'YOUR CART',
          animation: 'slide_from_bottom',   // cart slides up from bottom
          presentation: 'modal',
            headerShown: false,
          
              }}
              
          />
          <Stack.Screen
  name="Checkout"
  component={CheckoutScreen}
  options={{ headerShown: false }}
      />
      <Stack.Screen
  name="OrderSuccess"
  component={OrderSuccessScreen}
  options={{
    headerShown: false,
    gestureEnabled: false, // prevent swipe back after order
  }}
/>
    </Stack.Navigator>
  );
}