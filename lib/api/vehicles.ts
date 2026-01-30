/**
 * Vehicles API endpoints
 */

import { apiClient } from './client';

export interface CreateVehicleRequest {
  vehicleMake: string;
  vehicleModel: string;
  year: number;
  price: number;
  description: string;
  location: string;
  vehicleType: string; // Vehicle Type ID as string
  images?: File[]; // For file uploads
}

export interface CreateVehicleResponse {
  message: string;
  vehicle?: {
    id: number;
    vehicle_make: string;
    vehicle_model: string;
  };
}

export interface VehicleType {
  id: number;
  name: string;
}

export const vehiclesApi = {
  /**
   * Create a new vehicle listing
   * Uses FormData for file uploads
   */
  createVehicle: async (data: CreateVehicleRequest): Promise<CreateVehicleResponse> => {
    const formData = new FormData();
    
    formData.append('vehicleMake', data.vehicleMake);
    formData.append('vehicleModel', data.vehicleModel);
    formData.append('year', data.year.toString());
    formData.append('price', data.price.toString());
    formData.append('description', data.description || '');
    formData.append('location', data.location);
    formData.append('vehicleType', data.vehicleType);

    // Append images if provided
    if (data.images && data.images.length > 0) {
      data.images.forEach((file) => {
        formData.append('images', file);
      });
    }

    // Use fetch directly for FormData
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    const response = await fetch(`${API_BASE_URL}/vehicle/`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create vehicle');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Get all vehicle types
   */
  getVehicleTypes: async (): Promise<VehicleType[]> => {
    const response = await apiClient.get<{ vehicleTypes?: { items?: VehicleType[] } }>('/vehicle-type/');
    return response.vehicleTypes?.items || [];
  },
};
