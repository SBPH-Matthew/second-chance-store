/**
 * Authentication API endpoints
 */

import { apiClient, ApiError } from './client';

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface RegisterResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
}

export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  bio?: string;
  country?: string;
  state_province?: string;
  street_address_1?: string;
  street_address_2?: string;
  zip_postal_code?: string;
  identity_verified: boolean;
  id_document?: string;
  rating: number;
  total_reviews: number;
  profile_picture?: string;
  role_id: number;
  created_at?: string;
  CreatedAt?: string;
}

export interface ProfileResponse {
  message: string;
  user: UserProfile;
}

export interface UpdateProfileRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country?: string;
  state_province?: string;
  street_address_1?: string;
  street_address_2?: string;
  zip_postal_code?: string;
  bio?: string;
  profile_picture?: File;
  existing_profile_picture?: string;
}

export interface UpdatePhoneRequest {
  phone: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return apiClient.post<RegisterResponse>('/register', data);
  },

  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/login', data);
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<ProfileResponse> => {
    return apiClient.get<ProfileResponse>('/me');
  },

  /**
   * Logout user
   */
  logout: async (): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/logout');
  },

  /**
   * Update user profile
   */
  updateProfile: async (userId: number, data: UpdateProfileRequest, roleId: number = 1): Promise<{ message: string }> => {
    const formData = new FormData();
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('email', data.email);
    formData.append('role', roleId.toString());

    if (data.phone) formData.append('phone', data.phone);
    if (data.country) formData.append('country', data.country);
    if (data.state_province) formData.append('state_province', data.state_province);
    if (data.street_address_1) formData.append('street_address_1', data.street_address_1);
    if (data.street_address_2) formData.append('street_address_2', data.street_address_2);
    if (data.zip_postal_code) formData.append('zip_postal_code', data.zip_postal_code);
    if (data.bio) formData.append('bio', data.bio);
    if (data.profile_picture) formData.append('profile_picture', data.profile_picture);
    if (data.existing_profile_picture) formData.append('existing_profile_picture', data.existing_profile_picture);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw {
        message: error.message || 'Failed to update profile',
        errors: error.errors,
      } as ApiError;
    }

    return response.json();
  },

  /**
   * Update phone number
   */
  updatePhone: async (data: UpdatePhoneRequest): Promise<{ message: string }> => {
    return apiClient.put<{ message: string }>('/identity/phone', data);
  },

  /**
   * Change password
   */
  changePassword: async (userId: number, data: ChangePasswordRequest): Promise<{ message: string }> => {
    return apiClient.put<{ message: string }>(`/user/${userId}/password`, data);
  },
};
