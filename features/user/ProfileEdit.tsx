"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  useProfile,
  useUpdateProfile,
  useChangePassword,
} from "@/lib/hooks/useAuth";
import { ApiError } from "@/lib/api/client";
import { FiMapPin, FiMail, FiPhone, FiLock, FiCamera, FiX, FiCheck } from "react-icons/fi";
import { useForm } from "react-hook-form";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/utils/cropImage";

interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  country: string;
  state_province: string;
  street_address_1: string;
  street_address_2: string;
  zip_postal_code: string;
  phone: string;
}

interface PasswordFormData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export default function ProfileEdit() {
  const router = useRouter();
  const { data: profile, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const doneButtonRef = useRef<HTMLDivElement>(null);
  const [doneButtonPosition, setDoneButtonPosition] = useState<'visible' | 'above' | 'below'>('visible');

  // Cropping states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isProcessingCrop, setIsProcessingCrop] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    setError: setProfileError,
    watch: watchProfile,
    reset: resetProfile,
    setValue: setProfileValue,
  } = useForm<ProfileFormData>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      bio: "",
      country: "",
      state_province: "",
      street_address_1: "",
      street_address_2: "",
      zip_postal_code: "",
      phone: "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    setError: setPasswordError,
    watch: watchPassword,
    reset: resetPassword,
  } = useForm<PasswordFormData>();

  const newPassword = watchPassword("new_password");

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      resetProfile({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        bio: profile.bio || "",
        country: profile.country || "",
        state_province: profile.state_province || "",
        street_address_1: profile.street_address_1 || "",
        street_address_2: profile.street_address_2 || "",
        zip_postal_code: profile.zip_postal_code || "",
        phone: profile.phone || "",
      });
    }
  }, [profile, resetProfile]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !profile) {
      router.push("/auth/login");
    }
  }, [profile, isLoading, router]);

  // Track position of Done button section relative to viewport
  useEffect(() => {
    const currentRef = doneButtonRef.current;
    if (!currentRef) {
      setDoneButtonPosition('below');
      return;
    }

    // Check position relative to viewport
    const checkPosition = () => {
      const rect = currentRef.getBoundingClientRect();
      const viewportTop = 0;
      const viewportBottom = window.innerHeight;

      // If the Done section is fully visible in viewport
      if (rect.top >= viewportTop && rect.bottom <= viewportBottom) {
        setDoneButtonPosition('visible');
      }
      // If the Done section is above the viewport (scrolled past it upward)
      else if (rect.bottom < viewportTop) {
        setDoneButtonPosition('above');
      }
      // If the Done section is below the viewport (scrolled past it downward)
      else if (rect.top > viewportBottom) {
        setDoneButtonPosition('below');
      }
      // If partially visible, determine based on center point
      else {
        const centerY = rect.top + rect.height / 2;
        if (centerY < viewportTop) {
          setDoneButtonPosition('above');
        } else if (centerY > viewportBottom) {
          setDoneButtonPosition('below');
        } else {
          setDoneButtonPosition('visible');
        }
      }
    };

    // Check on mount
    checkPosition();

    // Check on scroll
    const handleScroll = () => {
      checkPosition();
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [profile]); // Re-run when profile loads

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarUrl = (profilePicture?: string) => {
    if (!profilePicture) return null;
    if (profilePicture.startsWith("http")) return profilePicture;
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    return `${API_BASE_URL}${profilePicture}`;
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleApplyCrop = async () => {
    if (!tempImage || !croppedAreaPixels) return;

    setIsProcessingCrop(true);
    try {
      const croppedBlob = await getCroppedImg(tempImage, croppedAreaPixels);
      if (croppedBlob) {
        const croppedFile = new File([croppedBlob], "profile-picture.jpg", { type: "image/jpeg" });
        setProfilePicture(croppedFile);

        const previewUrl = URL.createObjectURL(croppedBlob);
        setProfilePicturePreview(previewUrl);
        setIsCropping(false);
        setTempImage(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessingCrop(false);
    }
  };

  const handleCancelCrop = () => {
    setIsCropping(false);
    setTempImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onProfileSubmit = async (data: ProfileFormData) => {
    if (!profile) return;

    try {
      await updateProfileMutation.mutateAsync({
        userId: profile.id,
        roleId: profile.role_id,
        data: {
          ...data,
          profile_picture: profilePicture || undefined,
          existing_profile_picture: profile?.profile_picture || undefined,
        },
      });
      // Small delay to ensure profile is updated
      await new Promise((resolve) => setTimeout(resolve, 300));
      router.push("/user/profile");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError?.errors) {
        Object.entries(apiError.errors).forEach(([field, message]) => {
          setProfileError(field as keyof ProfileFormData, {
            type: "server",
            message: message,
          });
        });
      }
    }
  };

  const onPhoneSubmit = (phone: string) => {
    // Update form state only - actual save happens when "Done" is clicked
    setProfileValue("phone", phone);
    setEditingField(null);
  };

  const onEmailSubmit = async (email: string) => {
    if (!profile) return;

    // Validate email format
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailPattern.test(email)) {
      setProfileError("email", {
        type: "validation",
        message: "Invalid email address",
      });
      return;
    }

    try {
      // Update email via profile update mutation
      const currentFormData = watchProfile();
      await updateProfileMutation.mutateAsync({
        userId: profile.id,
        roleId: profile.role_id,
        data: {
          ...currentFormData,
          email,
          profile_picture: profilePicture || undefined,
          existing_profile_picture: profile?.profile_picture || undefined,
        },
      });
      setProfileValue("email", email);
      setEditingField(null);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError?.errors?.email) {
        setProfileError("email", {
          type: "server",
          message: Array.isArray(apiError.errors.email)
            ? apiError.errors.email[0]
            : apiError.errors.email,
        });
      }
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    if (!profile) return;

    try {
      await changePasswordMutation.mutateAsync({
        userId: profile.id,
        data,
      });
      setShowPasswordModal(false);
      resetPassword();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError?.errors) {
        Object.entries(apiError.errors).forEach(([field, message]) => {
          setPasswordError(field as keyof PasswordFormData, {
            type: "server",
            message: message,
          });
        });
      }
    }
  };

  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue("");
  };

  const saveField = (field: string) => {
    if (field === "phone") {
      onPhoneSubmit(editValue);
    } else if (field === "email") {
      onEmailSubmit(editValue);
    } else {
      // For other fields, they're handled by the form submit
      setEditingField(null);
    }
  };

  if (isLoading || !profile) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="container py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  const avatarUrl = getAvatarUrl(profile.profile_picture);
  const initials = getInitials(profile.first_name, profile.last_name);
  const displayAvatar = profilePicturePreview || avatarUrl;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Side - Profile Picture */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt={`${profile.first_name} ${profile.last_name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-gray-200 hover:border-primary transition-colors cursor-pointer"
              >
                <FiCamera size={18} className="text-gray-700" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute text-sm -bottom-8 left-1/2 -translate-x-1/2 font-bold text-gray-700 hover:text-primary transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Right Side - Main Content */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold font-poppins text-black mb-2">
              My profile
            </h1>
            <p className="text-gray-600 mb-8 text-sm leading-relaxed">
              Buyers and sellers can see your profile and it may appear across
              the platform to help us build trust in our community.{" "}
              <a href="#" className="text-primary hover:underline">
                Learn more
              </a>
            </p>

            <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
              {/* Profile Fields Grid */}
              <div className="space-y-0 border-t border-gray-100">
                {/* Email */}
                <div className="flex items-center gap-4 py-4 border-b border-gray-100">
                  <FiMail size={20} className="text-gray-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    {/* Hidden input to keep email in form data */}
                    <input
                      {...registerProfile("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      type="hidden"
                    />
                    {editingField === "email" ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="email"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="email@example.com"
                          />
                          <button
                            type="button"
                            onClick={() => saveField("email")}
                            className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors"
                            disabled={updateProfileMutation.isPending}
                          >
                            {updateProfileMutation.isPending ? "Saving..." : "Save"}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                        {profileErrors.email && (
                          <p className="text-xs text-red-500">
                            {profileErrors.email.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 font-medium">
                          {watchProfile("email") || "Not set"}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            startEditing("email", watchProfile("email") || "")
                          }
                          className="text-primary hover:text-primary-hover text-sm font-bold"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-4 py-4 border-b border-gray-100">
                  <FiPhone size={20} className="text-gray-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile number
                    </label>
                    {/* Hidden input to keep phone in form data */}
                    <input
                      {...registerProfile("phone")}
                      type="hidden"
                    />
                    {editingField === "phone" ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="tel"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="+63 917 000 0000"
                        />
                        <button
                          type="button"
                          onClick={() => saveField("phone")}
                          className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 font-medium">
                          {watchProfile("phone") || "Not set"}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            startEditing("phone", watchProfile("phone") || "")
                          }
                          className="text-primary hover:text-primary-hover text-sm font-bold"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="py-4 border-b border-gray-100">
                  <div className="flex-1 min-w-0 space-y-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-5">
                        <FiMapPin
                          size={20}
                          className="text-gray-400 shrink-0"
                        />
                        Street Address
                      </label>
                      <input
                        {...registerProfile("street_address_1")}
                        type="text"
                        placeholder="Enter street address"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 font-medium"
                      />
                    </div>
                    <div>
                      <input
                        {...registerProfile("street_address_2")}
                        type="text"
                        placeholder="Apt, suite, etc. (optional)"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          {...registerProfile("state_province")}
                          type="text"
                          placeholder="State/Province"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 font-medium"
                        />
                      </div>
                      <div>
                        <input
                          {...registerProfile("zip_postal_code")}
                          type="text"
                          placeholder="ZIP/Postal Code"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <input
                        {...registerProfile("country")}
                        type="text"
                        placeholder="Country"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Change Password */}
                <div className="flex items-center gap-4 py-4 border-b border-gray-100">
                  <FiLock size={20} className="text-gray-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">••••••••</span>
                      <button
                        type="button"
                        onClick={() => setShowPasswordModal(true)}
                        className="text-primary hover:text-primary-hover text-sm font-bold"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* About me Section */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h2 className="text-xl font-bold text-black mb-4">About me</h2>
                <textarea
                  {...registerProfile("bio")}
                  placeholder="Write something fun and punchy."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-gray-900"
                />
                {!watchProfile("bio") && (
                  <button
                    type="button"
                    onClick={() => {
                      const textarea = document.querySelector(
                        'textarea[name="bio"]',
                      ) as HTMLTextAreaElement;
                      textarea?.focus();
                    }}
                    className="mt-2 text-sm text-primary hover:text-primary-hover font-bold"
                  >
                    Add intro
                  </button>
                )}
              </div>

              {/* Done Button Section */}
              <div
                ref={doneButtonRef}
                className="mt-8 pt-8 pb-4 border-t border-gray-100"
              >
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="px-6 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {updateProfileMutation.isPending ? "Saving..." : "Done"}
                  </button>
                </div>
              </div>

              {/* Fixed Done Button (positioned based on scroll direction) */}
              {doneButtonPosition !== 'visible' && (
                <div
                  className={`fixed left-0 right-0 bg-white border-gray-100 p-4 z-50 transition-all ${doneButtonPosition === 'above'
                      ? 'top-0 border-b'
                      : 'bottom-0 border-t'
                    }`}
                >
                  <div className="container">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="px-6 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                      >
                        {updateProfileMutation.isPending ? "Saving..." : "Done"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Change password</h2>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  resetPassword();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={24} />
              </button>
            </div>

            <form
              onSubmit={handlePasswordSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Current password
                </label>
                <input
                  {...registerPassword("old_password", {
                    required: "Current password is required",
                  })}
                  type="password"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {passwordErrors.old_password && (
                  <p className="text-xs text-red-500 mt-1">
                    {passwordErrors.old_password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  New password
                </label>
                <input
                  {...registerPassword("new_password", {
                    required: "New password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  type="password"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {passwordErrors.new_password && (
                  <p className="text-xs text-red-500 mt-1">
                    {passwordErrors.new_password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Confirm new password
                </label>
                <input
                  {...registerPassword("confirm_password", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === newPassword || "Passwords do not match",
                  })}
                  type="password"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {passwordErrors.confirm_password && (
                  <p className="text-xs text-red-500 mt-1">
                    {passwordErrors.confirm_password.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    resetPassword();
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition-colors disabled:opacity-50"
                >
                  {changePasswordMutation.isPending
                    ? "Changing..."
                    : "Change password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Cropping Modal */}
      {isCropping && tempImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-black font-poppins">Edit photo</h2>
              <button
                onClick={handleCancelCrop}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isProcessingCrop}
              >
                <FiX size={24} className="text-gray-400" />
              </button>
            </div>

            <div className="relative flex-1 bg-gray-950 min-h-[300px] md:min-h-[450px]">
              <Cropper
                image={tempImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="round"
                showGrid={false}
              />
            </div>

            <div className="p-8 space-y-8 bg-white">
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                  <span>Zoom</span>
                  <span>{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleCancelCrop}
                  className="flex-1 py-4 px-6 rounded-2xl border-2 border-gray-100 text-gray-700 font-bold hover:bg-gray-50 transition-all cursor-pointer"
                  disabled={isProcessingCrop}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyCrop}
                  disabled={isProcessingCrop}
                  className="flex-[2] py-4 px-6 rounded-2xl bg-black text-white font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessingCrop ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <FiCheck size={20} />
                      Save photo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
