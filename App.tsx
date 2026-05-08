// App.tsx — final production version
import 'react-native-gesture-handler';

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, LogBox } from 'react-native';

import RootNavigator from './navigation/RootNavigator';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useAuthStore } from './store/authStore';
import { subscribeToAuthState } from './services/authService';
import { onQueryError } from './utils/queryErrorHandler';

// Suppress known harmless warnings in Expo Go
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'VirtualizedLists should never be nested',
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: (failureCount, error: any) => {
        if (error?.code === 'permission-denied') return false;
        return failureCount < 2;
      },
      gcTime: 1000 * 60 * 10,
    },
    mutations: {
      onError: onQueryError,
    },
  },
});

function AppContent() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((user) => setUser(user));
    return unsubscribe;
  }, []);

  return <RootNavigator />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <StatusBar style="dark" />
            <AppContent />
          </ErrorBoundary>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});