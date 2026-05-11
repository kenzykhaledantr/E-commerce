// src/api/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import {
  getProducts,
  getProduct,
  getNewArrivals,
  getProductsByCategory,
} from '../services/productService';
import type { ProductCategory } from '../types';

// Query key factory — keeps keys consistent everywhere
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  byCategory: (cat: ProductCategory) => [...productKeys.lists(), cat] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
  newArrivals: () => [...productKeys.all, 'newArrivals'] as const,
};

export const useProducts = () =>
  useQuery({
    queryKey: productKeys.lists(),
    queryFn: getProducts,
  });

export const useProduct = (id: string) =>
  useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProduct(id),
    enabled: !!id,
  });

export const useNewArrivals = () =>
  useQuery({
    queryKey: productKeys.newArrivals(),
    queryFn: getNewArrivals,
  });

export const useProductsByCategory = (category: ProductCategory) =>
  useQuery({
    queryKey: productKeys.byCategory(category),
    queryFn: () => getProductsByCategory(category),
    enabled: !!category,
    retry: 1,
  });