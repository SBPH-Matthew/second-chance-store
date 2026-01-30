"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStatus } from "@/lib/hooks/useAuth";

interface VerificationGuardProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
  requireVerification?: boolean;
  redirectTo?: string;
}

/**
 * Component to protect routes that require onboarding or verification
 * Redirects users who haven't completed required steps
 */
export function VerificationGuard({
  children,
  requireOnboarding = false,
  requireVerification = false,
  redirectTo = "/user/verify",
}: VerificationGuardProps) {
  const router = useRouter();
  const { onboardingCompleted, identityVerified, isLoading } =
    useOnboardingStatus();

  useEffect(() => {
    if (isLoading) return;

    // Prioritize verification: if verified, allow access even if onboarding incomplete
    if (requireVerification && !identityVerified) {
      router.push(redirectTo);
      return;
    }

    // Only check onboarding if verification is not required OR if user is not verified
    // If user is verified, they can proceed even with incomplete onboarding
    if (requireOnboarding && !onboardingCompleted && !identityVerified) {
      router.push(redirectTo);
      return;
    }
  }, [
    onboardingCompleted,
    identityVerified,
    isLoading,
    requireOnboarding,
    requireVerification,
    redirectTo,
    router,
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Prioritize verification: if verified, allow access even if onboarding incomplete
  if (requireVerification && !identityVerified) {
    return null; // Will redirect
  }

  // Only check onboarding if verification is not required OR if user is not verified
  // If user is verified, they can proceed even with incomplete onboarding
  if (requireOnboarding && !onboardingCompleted && !identityVerified) {
    return null; // Will redirect
  }

  return <>{children}</>;
}

/**
 * Hook to check if user can perform actions (like listing items)
 */
export function useCanListItems() {
  const { onboardingCompleted, identityVerified, isLoading } =
    useOnboardingStatus();

  return {
    canList: onboardingCompleted && identityVerified,
    needsOnboarding: !onboardingCompleted,
    needsVerification: onboardingCompleted && !identityVerified,
    isLoading,
  };
}
