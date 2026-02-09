/**
 * Products API endpoints
 */

import { apiClient } from './client';
import { UserProfile } from './auth';

export interface CreateProductRequest {
  name: string;
  price: number;
  description: string;
  location: string;
  status: string; // Status ID as string
  condition: string; // Condition ID as string
  category: string; // Category ID as string
  images?: File[]; // For file uploads
}

export interface CreateProductResponse {
  message: string;
  product?: {
    id: number;
    name: string;
  };
}

export interface Category {
  id: number;
  name: string;
  category_group_id?: number;
}

export interface ProductCondition {
  id: number;
  name: string;
}

export interface ProductStatus {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  category_id: number;
  status_id: number;
  seller_id: number;
  product_condition_id: number;
  category?: Category;
  status?: ProductStatus;
  product_condition?: ProductCondition;
  // gorm.Model fields are usually serialized as "CreatedAt"/"UpdatedAt"
  CreatedAt?: string;
  UpdatedAt?: string;
  item_type?: string;
  is_boosted?: boolean;
  seller?: UserProfile;
}

export interface VehicleListing {
  id: number;
  name: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  CreatedAt?: string;
  UpdatedAt?: string;
  item_type: "vehicle";
  is_boosted?: boolean;
  vehicle_type?: { id: number; name: string };
  vehicle_make?: string;
  vehicle_model?: string;
  year?: number;
  category?: Category;
  status?: ProductStatus;
  product_condition?: ProductCondition;
  seller?: UserProfile;
}

export type ListingItem = Product | VehicleListing;

export interface MyProductsResult {
  total: number;
  items: ListingItem[];
}

export interface ListingFilters {
  category_ids?: number[];
  min_price?: number;
  max_price?: number;
  condition_ids?: number[];
  sort?: string;
}

export const productsApi = {
  /**
   * Create a new product listing
   * Uses FormData for file uploads
   */
  createProduct: async (data: CreateProductRequest): Promise<CreateProductResponse> => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('price', data.price.toString());
    formData.append('description', data.description || '');
    formData.append('location', data.location);
    formData.append('status', data.status);
    formData.append('condition', data.condition);
    formData.append('category', data.category);

    // Append images if provided
    if (data.images && data.images.length > 0) {
      data.images.forEach((file) => {
        formData.append('images', file);
      });
    }

    // Use fetch directly for FormData
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    const response = await fetch(`${API_BASE_URL}/product/`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create product');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Get all categories
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<{ categories?: Category[]; items?: Category[] }>('/category/all');
    // Handle different response structures
    return response.categories || response.items || [];
  },

  /**
   * Get all product conditions
   */
  getConditions: async (): Promise<ProductCondition[]> => {
    const response = await apiClient.get<{ product_conditions?: ProductCondition[] }>('/product-condition/');
    return response.product_conditions || [];
  },

  /**
   * Get all product statuses
   */
  getStatuses: async (): Promise<ProductStatus[]> => {
    const response = await apiClient.get<{ product_status?: ProductStatus[] }>('/product-status/');
    return response.product_status || [];
  },

  /**
   * Get current user's product listings (paginated) - includes both products and vehicles
   */
  getMyProducts: async (page: number = 1, limit: number = 20): Promise<MyProductsResult> => {
    const response = await apiClient.get<{
      products?: { total?: number; items?: ListingItem[] };
    }>(`/listings/self?page=${page}&limit=${limit}`);

    return {
      total: response.products?.total ?? 0,
      items: response.products?.items ?? [],
    };
  },

  /**
   * Get all product and vehicle listings (paginated)
   */
  getListings: async (page: number = 1, limit: number = 20, search?: string, filters?: ListingFilters): Promise<MyProductsResult> => {
    let query = `/listings?page=${page}&limit=${limit}`;
    if (search) query += `&search=${encodeURIComponent(search)}`;
    if (filters?.category_ids && filters.category_ids.length > 0) query += `&category_ids=${filters.category_ids.join(',')}`;
    if (filters?.min_price) query += `&min_price=${filters.min_price}`;
    if (filters?.max_price) query += `&max_price=${filters.max_price}`;
    if (filters?.condition_ids && filters.condition_ids.length > 0) query += `&condition_ids=${filters.condition_ids.join(',')}`;
    if (filters?.sort) query += `&sort=${filters.sort}`;

    const response = await apiClient.get<{
      listings?: { total?: number; items?: ListingItem[] };
    }>(query);

    return {
      total: response.listings?.total ?? 0,
      items: response.listings?.items ?? [],
    };
  },

  /**
   * Get detail for a single product or vehicle listing
   */
  getListingDetails: async (id: string, type?: string): Promise<ListingItem> => {
    const typeQuery = type ? `?type=${type}` : '';
    const response = await apiClient.get<{ item: ListingItem }>(`/listings/${id}${typeQuery}`);
    return response.item;
  },
};
