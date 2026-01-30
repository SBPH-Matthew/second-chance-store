"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStatus } from "@/lib/hooks/useAuth";

export default function OnboardingPage() {
  const router = useRouter();
  const { onboardingCompleted, identityVerified, isLoading } =
    useOnboardingStatus();

  useEffect(() => {
    if (isLoading) return;

    // If user is verified, redirect to listing page (category selection)
    if (identityVerified) {
      router.push("/list");
      return;
    }

    // If onboarding is completed but not verified, redirect to verification
    if (onboardingCompleted && !identityVerified) {
      router.push("/user/verify");
      return;
    }

    // If onboarding is not completed, show onboarding form
    // (You can add the actual onboarding form component here)
  }, [onboardingCompleted, identityVerified, isLoading, router]);

  // Show loading state while checking
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // If verified, don't render (will redirect)
  if (identityVerified) {
    return null;
  }

  // If onboarding completed but not verified, don't render (will redirect)
  if (onboardingCompleted && !identityVerified) {
    return null;
  }

  // TODO: Add actual onboarding form component here
  // For now, show a placeholder
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Complete Your Onboarding</h1>
        <p className="text-gray-600">
          Please complete your onboarding to continue.
        </p>
      </div>
    </div>
  );
}
