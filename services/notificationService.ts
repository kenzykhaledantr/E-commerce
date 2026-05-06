// src/services/notificationService.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// ─── Configure how notifications appear when app is foregrounded ──
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ─── Request permission ────────────────────────────────────────────
export const requestNotificationPermission =
  async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Elite Retail',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2D6A4F',
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    if (existingStatus === 'granted') return true;

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  };

// ─── Order confirmed ───────────────────────────────────────────────
export const sendOrderConfirmationNotification = async (
  orderId: string,
  total: number
): Promise<void> => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '✓ Order Confirmed!',
      body: `Your order #${orderId
        .slice(-6)
        .toUpperCase()} for $${total.toFixed(2)} is confirmed.`,
      data: { screen: 'Profile', orderId },
      sound: true,
    },
    trigger: null, // null = show immediately
  });
};

// ─── Welcome notification ──────────────────────────────────────────
export const sendWelcomeNotification = async (
  name: string
): Promise<void> => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Welcome to Elite Retail, ${name}! 🎉`,
      body: 'Discover luxury curated just for you. Enjoy free shipping on your first order.',
      data: { screen: 'Home' },
      sound: true,
    },
    trigger: {
  type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
  seconds: 3,
}, // slight delay so app is fully loaded
  });
};

// ─── Price drop alert ──────────────────────────────────────────────
export const sendPriceDropNotification = async (
  productName: string,
  newPrice: number,
  productId: string
): Promise<void> => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🏷 Price Drop Alert!',
      body: `${productName} is now $${newPrice.toFixed(2)}. Grab it before it's gone!`,
      data: { screen: 'ProductDetail', productId },
      sound: true,
    },
    trigger: null,
  });
};

// ─── Scheduled reminder (e.g. "You left items in cart") ───────────
export const sendCartReminderNotification = async (): Promise<void> => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🛍 Items waiting in your cart',
      body: 'Complete your purchase before they sell out.',
      data: { screen: 'Cart' },
      sound: true,
    },
    trigger: {
  type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
  seconds: 60 * 60,
}, // 1 hour later
  });
};

// ─── Cancel all pending notifications ─────────────────────────────
export const cancelAllNotifications = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};