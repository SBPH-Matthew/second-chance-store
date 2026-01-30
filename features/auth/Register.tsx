"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff, FiChevronLeft } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useRegister } from "@/lib/hooks/useAuth";
import { ApiError } from "@/lib/api/client";

interface RegisterFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm<RegisterFormData>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  console.log(errors);

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync(data);
      // Redirect happens in the mutation's onSuccess
    } catch (error: unknown) {
      // Handle API errors with field-specific validation
      // The API client throws ApiError objects (not Error instances)
      console.log("Caught error:", error);
      
      const apiError = error as ApiError;
      console.log("ApiError:", apiError);
      console.log("ApiError.errors:", apiError?.errors);

      if (apiError?.errors && typeof apiError.errors === 'object') {
        // Set errors on specific form fields (e.g., { email: "This email is already taken" })
        Object.entries(apiError.errors).forEach(([field, message]) => {
          const fieldName = field as keyof RegisterFormData;
          console.log(`Setting error on ${fieldName}:`, message);
          setError(fieldName, {
            type: "server",
            message: message,
          });
        });
      } else if (apiError?.message) {
        // If no field-specific errors, set a general error message
        console.error("Registration error:", apiError.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden">
      {/* Left Section: Branding & Content */}
      <div className="w-full lg:w-1/2 bg-[#E8F1F9] p-8 lg:p-12 flex flex-col justify-between">
        {/* Back Link */}
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors mb-4 group w-fit"
        >
          <FiChevronLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to home
        </Link>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
          <span className="text-xl font-bold font-poppins text-[#1A1A1A]">
            Second Chance
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-2xl py-4">
          <h1 className="text-4xl font-bold font-poppins text-[#1A1A1A] leading-tight mb-4">
            Give pre-owned items a new story.
          </h1>
          <p className="text-gray-500 text-base mb-6 leading-relaxed font-medium">
            Join the safest community marketplace for buying and selling
            authentic, verified second-hand goods.
          </p>

          {/* Featured Image */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6 border border-blue-200/50">
            <img
              src="/marketplace_hero_1769261680432.png"
              alt="Beautiful Interior"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Testimonial Card */}
          <div className="bg-white p-6 rounded-2xl border border-white/50">
            <p className="text-[#1A1A1A] italic font-medium mb-4 leading-relaxed">
              "I love how easy it is to verify sellers on Second Chance. It
              feels so much safer than other marketplaces I've used in the
              past."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">
                SJ
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1A1A1A]">
                  Sarah Jenkins
                </h4>
                <p className="text-xs text-gray-400 font-medium">
                  Verified Seller
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16">
        <div className="w-full max-w-[440px]">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1 font-poppins tracking-tight">
              Create your account
            </h2>
            <p className="text-gray-400 text-xs font-medium">
              Start your journey to smarter, sustainable shopping.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#4B4B4B] ml-1">
                  First Name
                </label>
                <input
                  type="text"
                  {...register("first_name", {
                    required: "First name is required",
                    minLength: {
                      value: 2,
                      message: "First name must be at least 2 characters",
                    },
                  })}
                  placeholder="Jane"
                  className={`w-full px-4 py-2.5 rounded-xl bg-white border transition-all outline-none text-black font-medium text-sm ${
                    errors.first_name
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-100 focus:border-primary"
                  }`}
                />
                {errors.first_name && (
                  <p className="text-red-600 text-xs font-medium ml-1">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#4B4B4B] ml-1">
                  Last Name
                </label>
                <input
                  type="text"
                  {...register("last_name", {
                    required: "Last name is required",
                    minLength: {
                      value: 2,
                      message: "Last name must be at least 2 characters",
                    },
                  })}
                  placeholder="Doe"
                  className={`w-full px-4 py-2.5 rounded-xl bg-white border transition-all outline-none text-black font-medium text-sm ${
                    errors.last_name
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-100 focus:border-primary"
                  }`}
                />
                {errors.last_name && (
                  <p className="text-red-600 text-xs font-medium ml-1">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#4B4B4B] ml-1">
                Email Address
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                placeholder="jane@example.com"
                className={`w-full px-4 py-2.5 rounded-xl bg-white border transition-all outline-none text-black font-medium text-sm ${
                  errors.email
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-100 focus:border-primary"
                }`}
              />
              {errors.email && (
                <p className="text-red-600 text-xs font-medium ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#4B4B4B] ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 rounded-xl bg-white border transition-all outline-none text-black font-medium text-sm ${
                    errors.password
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-100 focus:border-primary"
                  }`}
                />
                {errors.password && (
                  <p className="text-red-600 text-xs font-medium ml-1 mt-1">
                    {errors.password.message}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#4B4B4B] ml-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("confirm_password", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 rounded-xl bg-white border transition-all outline-none text-black font-medium text-sm ${
                    errors.confirm_password
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-100 focus:border-primary"
                  }`}
                />
                {errors.confirm_password && (
                  <p className="text-red-600 text-xs font-medium ml-1 mt-1">
                    {errors.confirm_password.message}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || registerMutation.isPending}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold text-base hover:bg-primary-hover transition-all mt-4 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {registerMutation.isPending || isSubmitting
                ? "Creating account..."
                : "Get Started"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase font-black tracking-widest text-gray-300">
              <span className="bg-white px-4">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm text-[#1A1A1A]">
              <FcGoogle size={20} />
              Google
            </button>
            <button className="flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm text-[#1A1A1A]">
              <FaFacebook size={20} className="text-[#1877F2]" />
              Facebook
            </button>
          </div>

          <div className="mt-8 text-center text-sm font-medium text-gray-400">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary font-bold hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
