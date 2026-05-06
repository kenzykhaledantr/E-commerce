// src/hooks/useNotifications.ts
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import { requestNotificationPermission } from '../services/notificationService';

export function useNotifications(): void {
  const navigation = useNavigation<any>();

  const notificationListener =
    useRef<Notifications.EventSubscription | null>(null);

  const responseListener =
    useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    // Request permission
    const setupNotifications = async () => {
      await requestNotificationPermission();
    };

    setupNotifications();

    // Foreground notifications
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(
          'Notification received:',
          notification.request.content.title
        );
      });

    // Notification tap handling
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data as any;

        if (data?.screen === 'Profile') {
          navigation.navigate('Profile');
        } else if (data?.screen === 'Cart') {
          navigation.navigate('Cart');
        } else if (
          data?.screen === 'ProductDetail' &&
          data?.productId
        ) {
          navigation.navigate('ProductDetail', {
            productId: data.productId,
            productName: 'Product',
          });
        }
      });

    return () => {
  notificationListener.current?.remove();
  responseListener.current?.remove();
};
  }, [navigation]);
}