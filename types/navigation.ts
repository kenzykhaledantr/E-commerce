// src/types/navigation.ts

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

// ─── Auth Stack ────────────────────────────────────────────────
// Each key is a screen name. The value is its params (undefined = no params).
export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
};

// ─── Home Stack (nested inside the Home tab) ───────────────────
// src/types/navigation.ts — update HomeStackParamList
export type HomeStackParamList = {
  HomeScreen: undefined;
  ProductDetail: { productId: string; productName: string };
  Cart: undefined;
  Checkout: undefined;
  OrderSuccess: { orderId: string };
  SavedAddresses: undefined; // ← add this
};

export type AppStackParamList = {
  MainTabs:       undefined;          // the bottom tabs
  SavedAddresses: undefined;
  PaymentMethods: undefined;
  AccountSettings: undefined;
  MyOrders:        undefined;           // ← add
  OrderDetail:     { orderId: string }// ← moved here
  // add more shared screens here as needed
};



// ─── Bottom Tabs ───────────────────────────────────────────────
export type MainTabParamList = {
  Home: undefined;       // renders HomeStack
  Categories: undefined;
  Saved: undefined;
  Profile: undefined;
};

// ─── Screen prop helpers ───────────────────────────────────────
// Use these types in your screen components so you get typed navigation + route

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type HomeScreenProps<T extends keyof HomeStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HomeStackParamList, T>,
    BottomTabScreenProps<MainTabParamList>
  >;

  export type AppScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;
// ─── Global navigation type override ──────────────────────────
// This tells React Navigation's useNavigation() hook about ALL screens
declare global {
  namespace ReactNavigation {
    interface RootParamList extends HomeStackParamList, AuthStackParamList {}
  }
}