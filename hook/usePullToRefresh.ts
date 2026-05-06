// src/hooks/usePullToRefresh.ts
import { useState, useCallback } from 'react';
import * as Haptics from 'expo-haptics';

export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Light haptic when pull starts
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await onRefresh();
    setRefreshing(false);
    // Success haptic when done
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [onRefresh]);

  return { refreshing, handleRefresh };
}