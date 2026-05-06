// src/api/useOrders.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder, getUserOrders } from '../services/orderService';
import { useAuthStore } from '../store/authStore';
import type { CartItem, Address, DeliveryMethod } from '../types';

export const orderKeys = {
  all: ['orders'] as const,
  byUser: (uid: string) => [...orderKeys.all, uid] as const,
};

export const useOrders = () => {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: orderKeys.byUser(user?.uid ?? ''),
    queryFn: () => getUserOrders(user!.uid),
    enabled: !!user,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: ({
      items,
      total,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
    }: {
      items: CartItem[];
      total: number;
      shippingAddress: Address;
      deliveryMethod: DeliveryMethod;
      paymentMethod: string;
    }) =>
      createOrder(
        user!.uid,
        items,
        total,
        shippingAddress,
        deliveryMethod,
        paymentMethod
      ),
    onSuccess: () => {
      // Invalidate orders cache so profile screen refetches
      queryClient.invalidateQueries({
        queryKey: orderKeys.byUser(user?.uid ?? ''),
      });
    },
  });
};