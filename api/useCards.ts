// src/api/useCards.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCards,
  addCard,
  deleteCard,
  setDefaultCard,
} from '../services/cardService';
import { useAuthStore } from '../store/authStore';
import type { PaymentCard } from '../types';

const cardKeys = {
  all:    ['cards'] as const,
  byUser: (uid: string) => [...cardKeys.all, uid] as const,
};

export const useCards = () => {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: cardKeys.byUser(user?.uid ?? ''),
    queryFn:  () => getCards(user!.uid),
    enabled:  !!user,
  });
};

export const useAddCard = () => {
  const queryClient = useQueryClient();
  const user        = useAuthStore((s) => s.user);
  return useMutation({
    mutationFn: (card: Omit<PaymentCard, 'id'>) =>
      addCard(user!.uid, card),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: cardKeys.byUser(user?.uid ?? ''),
      }),
  });
};

export const useDeleteCard = () => {
  const queryClient = useQueryClient();
  const user        = useAuthStore((s) => s.user);
  return useMutation({
    mutationFn: (cardId: string) => deleteCard(user!.uid, cardId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: cardKeys.byUser(user?.uid ?? ''),
      }),
  });
};

export const useSetDefaultCard = () => {
  const queryClient = useQueryClient();
  const user        = useAuthStore((s) => s.user);
  return useMutation({
    mutationFn: (cardId: string) => setDefaultCard(user!.uid, cardId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: cardKeys.byUser(user?.uid ?? ''),
      }),
  });
};