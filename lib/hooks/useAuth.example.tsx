/**
 * Example usage of TanStack Query hooks in components
 * 
 * This file demonstrates how the hooks use TanStack Query's
 * useQuery and useMutation features
 */

"use client";

import { useRegister, useProfile, useSubmitOnboarding } from '@/lib/hooks/useAuth';

// Example 1: Using useQuery for fetching data
export function ProfileExample() {
  // useQuery automatically handles:
  // - Loading states (isLoading, isFetching)
  // - Error states (error, isError)
  // - Caching and refetching
  // - Background refetching
  const { data: profile, isLoading, error, isError } = useProfile();

  if (isLoading) return <div>Loading profile...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return <div>Welcome, {profile?.first_name}!</div>;
}

// Example 2: Using useMutation for registration
export function RegisterExample() {
  // useMutation provides:
  // - mutate() - fire and forget
  // - mutateAsync() - returns a promise
  // - isPending - loading state
  // - isError, error - error state
  // - isSuccess - success state
  // - reset() - reset mutation state
  const registerMutation = useRegister();

  const handleSubmit = async (data: { email: string; password: string }) => {
    try {
      // Option 1: Using mutateAsync (returns promise)
      await registerMutation.mutateAsync(data);
      // Success handling is in the mutation's onSuccess callback
    } catch (error) {
      // Handle error
      console.error('Registration failed:', error);
    }

    // Option 2: Using mutate (fire and forget)
    // registerMutation.mutate(data, {
    //   onSuccess: () => {
    //     console.log('Success!');
    //   },
    //   onError: (error) => {
    //     console.error('Error:', error);
    //   },
    // });
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({ email: 'test@example.com', password: 'password' });
    }}>
      <button 
        type="submit"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? 'Registering...' : 'Register'}
      </button>
      
      {registerMutation.isError && (
        <div>Error: {registerMutation.error?.message}</div>
      )}
      
      {registerMutation.isSuccess && (
        <div>Registration successful!</div>
      )}
    </form>
  );
}

// Example 3: Using mutation with optimistic updates
export function OnboardingExample() {
  const submitMutation = useSubmitOnboarding();
  const { data: profile } = useProfile();

  const handleSubmit = async (data: any) => {
    // TanStack Query automatically:
    // 1. Calls the mutationFn (onboardingApi.submitOnboarding)
    // 2. On success: calls onSuccess callback (invalidates queries, redirects)
    // 3. On error: calls onError callback
    // 4. Updates isPending, isError, isSuccess states
    
    await submitMutation.mutateAsync(data);
  };

  return (
    <div>
      <button 
        onClick={() => handleSubmit({ phone: '+63...', address: '...' })}
        disabled={submitMutation.isPending}
      >
        {submitMutation.isPending ? 'Submitting...' : 'Submit'}
      </button>
      
      {/* TanStack Query provides these states automatically */}
      {submitMutation.isPending && <div>Submitting...</div>}
      {submitMutation.isError && <div>Error occurred</div>}
      {submitMutation.isSuccess && <div>Success!</div>}
    </div>
  );
}

/**
 * Key TanStack Query Features Being Used:
 * 
 * 1. useQuery:
 *    - Automatic caching
 *    - Background refetching
 *    - Stale-while-revalidate pattern
 *    - Loading and error states
 * 
 * 2. useMutation:
 *    - Optimistic updates (can be added)
 *    - Automatic error handling
 *    - Loading states (isPending)
 *    - Success/error callbacks
 *    - Query invalidation on success
 * 
 * 3. Query Invalidation:
 *    - queryClient.invalidateQueries() refreshes cached data
 *    - Ensures UI shows latest data after mutations
 * 
 * 4. Query Client:
 *    - Centralized state management
 *    - Automatic request deduplication
 *    - Request cancellation
 */
