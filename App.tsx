// App.tsx
import 'react-native-gesture-handler';

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import RootNavigator from './navigation/RootNavigator';
import { useAuthStore } from './store/authStore';
import { subscribeToAuthState } from './services/authService';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 2 },
  },
});

// Separate component so we can use Zustand inside
// App.tsx (update AppContent)
function AppContent() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    console.log('🚀 App mounted, subscribing to auth state...');
    
    const unsubscribe = subscribeToAuthState((user) => {
      console.log('📞 Auth callback received:', user ? 'User object' : 'null');
      setUser(user);
    });

    return () => {
      console.log('🛑 App unmounting, unsubscribing...');
      unsubscribe();
    };
  }, []);

  return <RootNavigator />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <AppContent />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
  
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});