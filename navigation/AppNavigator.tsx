// src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../types/navigation';

import MainNavigator from './MainNavigator';
import SavedAddressesScreen from '../src/screens/main/SavedAddressesScreen';
import PaymentMethodsScreen from '../src/screens/main/PaymentMethodsScreen';
import AccountSettingsScreen from '../src/screens/main/AccountSettingsScreen';
import MyOrdersScreen from '../src/screens/main/MyOrdersScreen';
import OrderDetailScreen from '../src/screens/main/OrderDetailScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main tabs — first screen, no header */}
      <Stack.Screen name="MainTabs" component={MainNavigator} />

      {/* Shared screens accessible from ANY tab */}
      <Stack.Screen
        name="SavedAddresses"
        component={SavedAddressesScreen}
        options={{
          headerShown:  false,
          animation:    'slide_from_right',
        }}
      />
      <Stack.Screen
  name="PaymentMethods"
  component={PaymentMethodsScreen}
  options={{
    headerShown: false,
    animation:   'slide_from_right',
  }}
      />
      <Stack.Screen
  name="AccountSettings"
  component={AccountSettingsScreen}
  options={{ headerShown: false, animation: 'slide_from_right' }}
      />
      
      <Stack.Screen
  name="MyOrders"
  component={MyOrdersScreen}
  options={{ headerShown: false, animation: 'slide_from_right' }}
/>
<Stack.Screen
  name="OrderDetail"
  component={OrderDetailScreen}
  options={{ headerShown: false, animation: 'slide_from_right' }}
/>
    </Stack.Navigator>
  );
}