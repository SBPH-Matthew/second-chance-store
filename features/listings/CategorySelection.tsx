"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCategories, isVehicleCategory } from "@/lib/hooks/useListings";
import { Category } from "@/lib/api/products";
import { useOnboardingStatus } from "@/lib/hooks/useAuth";
import {
  FiPackage,
  FiTruck,
  FiHome,
  FiMusic,
  FiShoppingBag,
  FiHeart,
  FiSmartphone,
  FiCamera,
  FiGrid,
} from "react-icons/fi";
import WizardNav from "@/components/listing-wizard/WizardNav";
import WizardProgress from "@/components/listing-wizard/WizardProgress";
import WizardFooter from "@/components/listing-wizard/WizardFooter";

// Icon mapping for categories
const getCategoryIcon = (categoryName: string, isVehicle: boolean) => {
  if (isVehicle) return FiTruck;

  const name = categoryName.toLowerCase();
  if (
    name.includes("home") ||
    name.includes("garden") ||
    name.includes("furniture") ||
    name.includes("household") ||
    name.includes("appliance")
  )
    return FiHome;
  if (
    name.includes("entertainment") ||
    name.includes("game") ||
    name.includes("music") ||
    name.includes("book") ||
    name.includes("movie")
  )
    return FiMusic;
  if (
    name.includes("clothing") ||
    name.includes("bag") ||
    name.includes("jewelry") ||
    name.includes("shoe")
  )
    return FiShoppingBag;
  if (
    name.includes("family") ||
    name.includes("health") ||
    name.includes("beauty") ||
    name.includes("pet") ||
    name.includes("baby") ||
    name.includes("toy")
  )
    return FiHeart;
  if (
    name.includes("electronic") ||
    name.includes("computer") ||
    name.includes("phone") ||
    name.includes("mobile")
  )
    return FiSmartphone;
  if (
    name.includes("hobbie") ||
    name.includes("bicycle") ||
    name.includes("art") ||
    name.includes("sport") ||
    name.includes("auto") ||
    name.includes("instrument") ||
    name.includes("antique")
  )
    return FiCamera;
  return FiPackage;
};

// Color mapping for category groups
const getCategoryColor = (categoryName: string, isVehicle: boolean) => {
  if (isVehicle)
    return {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconBg: "bg-blue-500",
      iconColor: "text-white",
      border: "border-blue-200",
      hoverBg: "hover:bg-gradient-to-br hover:from-blue-100 hover:to-blue-200",
    };

  const name = categoryName.toLowerCase();
  if (
    name.includes("home") ||
    name.includes("garden") ||
    name.includes("furniture") ||
    name.includes("household") ||
    name.includes("appliance")
  )
    return {
      bg: "bg-gradient-to-br from-green-50 to-emerald-50",
      iconBg: "bg-green-500",
      iconColor: "text-white",
      border: "border-green-200",
      hoverBg:
        "hover:bg-gradient-to-br hover:from-green-100 hover:to-emerald-100",
    };
  if (
    name.includes("entertainment") ||
    name.includes("game") ||
    name.includes("music") ||
    name.includes("book") ||
    name.includes("movie")
  )
    return {
      bg: "bg-gradient-to-br from-purple-50 to-pink-50",
      iconBg: "bg-purple-500",
      iconColor: "text-white",
      border: "border-purple-200",
      hoverBg:
        "hover:bg-gradient-to-br hover:from-purple-100 hover:to-pink-100",
    };
  if (
    name.includes("clothing") ||
    name.includes("bag") ||
    name.includes("jewelry") ||
    name.includes("shoe")
  )
    return {
      bg: "bg-gradient-to-br from-rose-50 to-orange-50",
      iconBg: "bg-rose-500",
      iconColor: "text-white",
      border: "border-rose-200",
      hoverBg:
        "hover:bg-gradient-to-br hover:from-rose-100 hover:to-orange-100",
    };
  if (
    name.includes("family") ||
    name.includes("health") ||
    name.includes("beauty") ||
    name.includes("pet") ||
    name.includes("baby") ||
    name.includes("toy")
  )
    return {
      bg: "bg-gradient-to-br from-pink-50 to-rose-50",
      iconBg: "bg-pink-500",
      iconColor: "text-white",
      border: "border-pink-200",
      hoverBg: "hover:bg-gradient-to-br hover:from-pink-100 hover:to-rose-100",
    };
  if (
    name.includes("electronic") ||
    name.includes("computer") ||
    name.includes("phone") ||
    name.includes("mobile")
  )
    return {
      bg: "bg-gradient-to-br from-cyan-50 to-blue-50",
      iconBg: "bg-cyan-500",
      iconColor: "text-white",
      border: "border-cyan-200",
      hoverBg: "hover:bg-gradient-to-br hover:from-cyan-100 hover:to-blue-100",
    };
  if (
    name.includes("hobbie") ||
    name.includes("bicycle") ||
    name.includes("art") ||
    name.includes("sport") ||
    name.includes("auto") ||
    name.includes("instrument") ||
    name.includes("antique")
  )
    return {
      bg: "bg-gradient-to-br from-amber-50 to-yellow-50",
      iconBg: "bg-amber-500",
      iconColor: "text-white",
      border: "border-amber-200",
      hoverBg:
        "hover:bg-gradient-to-br hover:from-amber-100 hover:to-yellow-100",
    };
  return {
    bg: "bg-gradient-to-br from-gray-50 to-slate-50",
    iconBg: "bg-primary",
    iconColor: "text-white",
    border: "border-gray-200",
    hoverBg: "hover:bg-gradient-to-br hover:from-gray-100 hover:to-slate-100",
  };
};

export default function CategorySelection() {
  const router = useRouter();
  const { data: categories, isLoading, error } = useCategories();
  const {
    onboardingCompleted,
    identityVerified,
    isLoading: isLoadingAuth,
  } = useOnboardingStatus();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  // Redirect logic: prioritize verification status
  // If verified, allow access even if onboarding incomplete
  // Only redirect unverified users
  useEffect(() => {
    if (isLoadingAuth) return;

    // If verified, allow access to listing (no redirect needed)
    if (identityVerified) {
      return;
    }

    // If not verified but onboarding completed, redirect to verification
    if (onboardingCompleted && !identityVerified) {
      router.push("/user/verify");
      return;
    }

    // If not verified and onboarding not completed, redirect to onboarding
    if (!onboardingCompleted && !identityVerified) {
      router.push("/user/onboarding");
      return;
    }
  }, [onboardingCompleted, identityVerified, isLoadingAuth, router]);

  const handleCategorySelect = (category: Category) => {
    // Only allow selection if user is verified
    if (!identityVerified) {
      return;
    }

    setSelectedCategory(category);
  };

  if (isLoading || isLoadingAuth) {
    return (
      <div className="min-h-screen bg-white">
        <WizardNav onSaveExit={() => router.push("/")} />
        <WizardProgress value={25} />
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  // Don't render if user needs to be redirected (will redirect in useEffect)
  // Only block if not verified (verified users can access even if onboarding incomplete)
  if (!identityVerified) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <WizardNav onSaveExit={() => router.push("/")} />
        <WizardProgress value={25} />
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
          <div className="text-red-500">
            Error loading categories. Please try again.
          </div>
        </div>
      </div>
    );
  }

  const goNext = () => {
    if (!selectedCategory) return;
    if (isVehicleCategory(selectedCategory)) {
      router.push(`/list/vehicle?category=${selectedCategory.id}`);
    } else {
      router.push(`/list/product?category=${selectedCategory.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <WizardNav onSaveExit={() => router.push("/")} />
      <WizardProgress value={25} />

      <main className="px-6 pt-10 pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl mb-10">
            <h1 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A] tracking-tight">
              Which of these best describes what you&rsquo;re listing?
            </h1>
            <p className="mt-3 text-gray-600">
              Choose a category. You can refine details in the next steps.
            </p>
          </div>

          {categories && categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => {
                const isVehicle = isVehicleCategory(category);
                const Icon = getCategoryIcon(category.name, isVehicle);
                const isSelected = selectedCategory?.id === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategorySelect(category)}
                    className={[
                      "group rounded-xl border p-5 text-left transition-all",
                      "hover:border-black hover:shadow-sm",
                      isSelected
                        ? "border-black shadow-sm bg-gray-50"
                        : "border-gray-200 bg-white",
                    ].join(" ")}
                  >
                    <Icon className="text-black" size={26} />
                    <div className="mt-4">
                      <div className="font-semibold text-[#1A1A1A]">
                        {category.name}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {isVehicle ? "Vehicle" : "Item"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiGrid size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">
                No categories available
              </p>
            </div>
          )}
        </div>
      </main>

      <WizardFooter
        backLabel="Back"
        nextLabel="Next"
        onBack={() => router.push("/")}
        onNext={goNext}
        nextDisabled={!selectedCategory}
      />
    </div>
  );
}
