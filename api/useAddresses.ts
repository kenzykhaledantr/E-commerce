// src/api/useAddresses.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../services/addressService';
import { useAuthStore } from '../store/authStore';
import type { Address } from '../types';

const addressKeys = {
  all: ['addresses'] as const,
  byUser: (uid: string) => [...addressKeys.all, uid] as const,
};

// ─── Fetch ─────────────────────────────────────────────────────
export const useAddresses = () => {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: addressKeys.byUser(user?.uid ?? ''),
    queryFn: () => getAddresses(user!.uid),
    enabled: !!user,
  });
};

// ─── Add ───────────────────────────────────────────────────────
export const useAddAddress = () => {
  const queryClient = useQueryClient();
  const user        = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (address: Omit<Address, 'id'>) =>
      addAddress(user!.uid, address),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: addressKeys.byUser(user?.uid ?? ''),
      }),
  });
};

// ─── Update ────────────────────────────────────────────────────
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  const user        = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Omit<Address, 'id'>>;
    }) => updateAddress(user!.uid, id, updates),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: addressKeys.byUser(user?.uid ?? ''),
      }),
  });
};

// ─── Delete ────────────────────────────────────────────────────
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  const user        = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (addressId: string) =>
      deleteAddress(user!.uid, addressId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: addressKeys.byUser(user?.uid ?? ''),
      }),
  });
};

// ─── Set default ───────────────────────────────────────────────
export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();
  const user        = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (addressId: string) =>
      setDefaultAddress(user!.uid, addressId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: addressKeys.byUser(user?.uid ?? ''),
      }),
  });
};