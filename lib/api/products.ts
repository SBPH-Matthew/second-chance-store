/**
 * Products API endpoints
 */

import { apiClient } from './client';

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
}

export type ListingItem = Product | VehicleListing;

export interface MyProductsResult {
  total: number;
  items: ListingItem[];
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
    }>(`/product/self?page=${page}&limit=${limit}`);

    return {
      total: response.products?.total ?? 0,
      items: response.products?.items ?? [],
    };
  },
};
