/**
 * Authentication and user profile hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi, UserProfile, UpdateProfileRequest, UpdatePhoneRequest, ChangePasswordRequest } from '@/lib/api/auth';
import { onboardingApi, OnboardingStatus } from '@/lib/api/onboarding';
import { ApiError } from '@/lib/api/client';

/**
 * Hook to get current user profile
 */
export function useProfile() {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const response = await authApi.getProfile();
      return response.user;
    },
    retry: false,
  });
}

/**
 * Hook to check onboarding and verification status
 */ 
export function useOnboardingStatus() {
  const { data: profile } = useProfile();
  
  return {
    onboardingCompleted: !!(
      profile?.phone &&
      profile?.street_address_1 &&
      profile?.state_province &&
      profile?.zip_postal_code
    ),
    identityVerified: profile?.identity_verified || false,
    isLoading: !profile,
    profile,
  };
}

/**
 * Hook for user registration
 * Automatically logs in the user after successful registration
 */
export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Parameters<typeof authApi.register>[0]) => {
      // First register the user
      await authApi.register(data);
      // Then automatically log them in to get the auth cookie
      await authApi.login({
        email: data.email,
        password: data.password,
      });
    },
    onSuccess: async () => {
      // Delay to ensure cookie is set by browser and available
      await new Promise(resolve => setTimeout(resolve, 300));
      // Refetch profile queries to get user data with new cookie
      await queryClient.refetchQueries({ queryKey: ['user'] });
      // Redirect to verification
      router.push('/user/verify');
    },
    onError: (error: ApiError) => {
      // Error handling is done in the component
      console.error('Registration error:', error);
    },
  });
}

/**
 * Hook for user login
 */
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async () => {
      // Small delay to ensure cookie is set by browser
      await new Promise(resolve => setTimeout(resolve, 100));
      // Refetch profile queries to get user data with new cookie
      await queryClient.refetchQueries({ queryKey: ['user'] });
      // Redirect to home or check onboarding status
      router.push('/');
    },
  });
}

/**
 * Hook for user logout
 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
      // Redirect to login
      router.push('/auth/login');
    },
  });
}

/**
 * Hook for submitting onboarding
 */
export function useSubmitOnboarding() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: onboardingApi.submitOnboarding,
    onSuccess: () => {
      // Invalidate profile to get updated verification status
      queryClient.invalidateQueries({ queryKey: ['user'] });
      // Redirect to home
      router.push('/');
    },
    onError: (error: ApiError) => {
      // Error handling is done in the component
      console.error('Onboarding submission error:', error);
    },
  });
}

/**
 * Hook for saving onboarding draft
 */
export function useSaveOnboardingDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: onboardingApi.saveDraft,
    onSuccess: () => {
      // Invalidate profile to get updated data
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: ApiError) => {
      // Error handling is done in the component
      console.error('Save draft error:', error);
    },
  });
}

/**
 * Hook for updating user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data, roleId }: { userId: number; data: UpdateProfileRequest; roleId?: number }) =>
      authApi.updateProfile(userId, data, roleId || 1),
    onSuccess: () => {
      // Invalidate profile to get updated data
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: ApiError) => {
      console.error('Update profile error:', error);
    },
  });
}

/**
 * Hook for updating phone number
 */
export function useUpdatePhone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updatePhone,
    onSuccess: () => {
      // Invalidate profile to get updated data
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: ApiError) => {
      console.error('Update phone error:', error);
    },
  });
}

/**
 * Hook for changing password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: ChangePasswordRequest }) =>
      authApi.changePassword(userId, data),
    onError: (error: ApiError) => {
      console.error('Change password error:', error);
    },
  });
}
