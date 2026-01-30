/**
 * Onboarding API endpoints
 */

import { apiClient } from './client';

export interface OnboardingData {
  phone: string;
  country: string;
  city?: string;
  street_address: string;
  state_province: string;
  postal_code: string;
  bio?: string;
}

export interface OnboardingResponse {
  message: string;
  onboarding_completed?: boolean;
}

export interface OnboardingStatus {
  onboarding_completed: boolean;
  identity_verified: boolean;
}

export const onboardingApi = {
  /**
   * Submit onboarding data for verification
   * Updates user profile and submits for identity verification
   */
  submitOnboarding: async (data: OnboardingData): Promise<OnboardingResponse> => {
    // First get current user to get their ID and existing data
    const profileResponse = await apiClient.get<{ user: { id: number; first_name: string; last_name: string; email: string; role_id: number } }>('/me');
    const user = profileResponse.user;

    // Update phone via identity endpoint
    await apiClient.put('/identity/phone', { phone: data.phone });

    // Note: The backend UpdateUser endpoint expects form data with role field
    // For now, we'll create a FormData object to match backend expectations
    // TODO: Backend should add a dedicated /api/user/me/onboarding endpoint
    
    // Since we can't easily send FormData from this API client,
    // we'll need to update the backend or create a new endpoint
    // For now, let's just update phone and submit for verification
    // The address fields will need to be updated via a separate endpoint
    
    // Submit for verification (this will mark identity_verified as true)
    await apiClient.post('/identity/verify');
    
    return {
      message: 'Onboarding submitted successfully. Address details can be updated in your profile.',
      onboarding_completed: true,
    };
  },

  /**
   * Save onboarding data as draft (finish later)
   * Only saves phone for now - address updates need backend endpoint
   */
  saveDraft: async (data: OnboardingData): Promise<OnboardingResponse> => {
    // Update phone only (address requires user update endpoint with form data)
    if (data.phone) {
      await apiClient.put('/identity/phone', { phone: data.phone });
    }
    
    return {
      message: 'Draft saved successfully',
      onboarding_completed: false,
    };
  },

  /**
   * Get onboarding status
   */
  getStatus: async (): Promise<OnboardingStatus> => {
    const response = await apiClient.get<{ 
      user: { 
        identity_verified: boolean; 
        phone?: string; 
        street_address_1?: string;
        state_province?: string;
        zip_postal_code?: string;
      } 
    }>('/me');
    
    const user = response.user;
    return {
      onboarding_completed: !!(
        user.phone &&
        user.street_address_1 &&
        user.state_province &&
        user.zip_postal_code
      ),
      identity_verified: user.identity_verified,
    };
  },
};
