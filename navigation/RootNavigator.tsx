// src/navigation/RootNavigator.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../store/authStore';
import AuthNavigator from './AuthNavigator';
import AppNavigator  from './AppNavigator'; 
import { COLORS } from '../utils/constants';
import OfflineBanner from '../components/common/OfflineBanner';
import { useThemeStore } from '../store/themeStore';
import { useTheme }      from '../hook/useTheme';

function MainApp() {
  // Import here to use inside NavigationContainer
  const { useNotifications } = require('../hook/useNotifications');
  useNotifications();
  return <AppNavigator />;
}
// src/navigation/RootNavigator.tsx
export default function RootNavigator() {
  const { isAuthenticated, isLoading, setUser, setLoading } = useAuthStore();
  const { hydrated } = useThemeStore();
  const { colors, isDark } = useTheme();

  // Check for existing user session on app start
  // NOTE: This must be above any early returns to satisfy Rules of Hooks
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        // Check AsyncStorage for saved user data
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUser(user);
        } else {
          // No saved session - set loading to false to proceed to auth flow
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setLoading(false);
      }
    };

    checkExistingSession();
  }, [setUser, setLoading]);

  console.log('📱 Navigator render:', { isLoading, isAuthenticated });

  if (isLoading || !hydrated) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <OfflineBanner />
      {isAuthenticated ? <MainApp /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});