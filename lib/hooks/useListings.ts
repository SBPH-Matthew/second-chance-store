/**
 * Hooks for creating product and vehicle listings
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { productsApi, CreateProductRequest, Category, ProductCondition, ProductStatus, ListingFilters } from '@/lib/api/products';
import { vehiclesApi, CreateVehicleRequest, VehicleType } from '@/lib/api/vehicles';
import { ApiError } from '@/lib/api/client';

/**
 * Hook to get all categories
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: productsApi.getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get product conditions
 */
export function useProductConditions() {
  return useQuery({
    queryKey: ['product-conditions'],
    queryFn: productsApi.getConditions,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to get product statuses
 */
export function useProductStatuses() {
  return useQuery({
    queryKey: ['product-statuses'],
    queryFn: productsApi.getStatuses,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to get current user's product listings
 */
export function useMyProducts(page: number = 1, limit: number = 20, enabled: boolean = true) {
  return useQuery({
    queryKey: ['user', 'products', page, limit],
    queryFn: () => productsApi.getMyProducts(page, limit),
    staleTime: 30 * 1000,
    enabled,
  });
}

/**
 * Hook to get all listings for the shop
 */
export function useListings(page: number = 1, limit: number = 20, search?: string, filters?: ListingFilters) {
  return useQuery({
    queryKey: ['listings', page, limit, search, filters],
    queryFn: () => productsApi.getListings(page, limit, search, filters),
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to get details for a single listing
 */
export function useListingDetails(id: string, type?: string) {
  return useQuery({
    queryKey: ['listing', id, type],
    queryFn: () => productsApi.getListingDetails(id, type),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to get vehicle types
 */
export function useVehicleTypes() {
  return useQuery({
    queryKey: ['vehicle-types'],
    queryFn: vehiclesApi.getVehicleTypes,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for creating a product listing
 */
export function useCreateProduct() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productsApi.createProduct(data),
    onSuccess: () => {
      // Invalidate product queries to refetch
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'products'] });
      // Redirect to user's listings or home
      router.push('/shop');
    },
    onError: (error: ApiError) => {
      console.error('Create product error:', error);
    },
  });
}

/**
 * Hook for creating a vehicle listing
 */
export function useCreateVehicle() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVehicleRequest) => vehiclesApi.createVehicle(data),
    onSuccess: () => {
      // Invalidate vehicle queries to refetch
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'vehicles'] });
      // Redirect to shop or home
      router.push('/shop');
    },
    onError: (error: ApiError) => {
      console.error('Create vehicle error:', error);
    },
  });
}

/**
 * Helper function to check if a category is "Vehicles"
 */
export function isVehicleCategory(category: Category | null | undefined): boolean {
  if (!category) return false;
  // Check if category name contains "vehicle" (case insensitive)
  return category.name.toLowerCase().includes('vehicle');
}
