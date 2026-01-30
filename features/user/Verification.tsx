"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiMail,
  FiPhone,
  FiUpload,
  FiCheck,
  FiX,
  FiFileText,
  FiClock,
} from "react-icons/fi";
import { useProfile } from "@/lib/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiClient, ApiError } from "@/lib/api/client";

interface VerificationStatus {
  email_verified: boolean;
  phone_verified: boolean;
  id_verified: boolean;
  id_pending: boolean;
}

export default function Verification() {
  const router = useRouter();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>({
      email_verified: false,
      phone_verified: false,
      id_verified: false,
      id_pending: false,
    });

  useEffect(() => {
    if (profile) {
      // Check verification status from profile
      // Note: This assumes the backend provides these fields
      const hasIdDocument = !!profile.id_document && profile.id_document !== "";
      const isIdVerified = profile.identity_verified || false;
      const isIdPending = hasIdDocument && !isIdVerified;

      setVerificationStatus({
        email_verified: !!profile.email, // Assume verified if email exists
        phone_verified: !!profile.phone && profile.phone !== "",
        id_verified: isIdVerified,
        id_pending: isIdPending,
      });

      // Load existing ID document preview if it exists
      if (hasIdDocument && !idPreview && !idFile) {
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
        const idUrl = profile.id_document?.startsWith("http")
          ? profile.id_document
          : `${API_BASE_URL}${profile.id_document}`;
        setIdPreview(idUrl);
      }
    }
  }, [profile]);

  const handleIdFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];
      if (!validTypes.includes(file.type)) {
        setErrors({
          id_file: "Please upload a valid image (JPEG, PNG) or PDF file",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ id_file: "File size must be less than 5MB" });
        return;
      }

      setIdFile(file);
      setErrors({ ...errors, id_file: "" });

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setIdPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setIdPreview(null);
      }
    }
  };

  const handleSubmitId = async () => {
    if (!idFile) {
      setErrors({ id_file: "Please select a file to upload" });
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});
      setSuccessMessage("");

      const formData = new FormData();
      formData.append("id_file", idFile);

      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
      const response = await fetch(`${API_BASE_URL}/identity/verify`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload ID");
      }

      setSuccessMessage(
        "ID submitted successfully! Your verification is under review.",
      );
      setIdFile(null);
      setIdPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh profile to get updated verification status
      if (profile) {
        // Trigger profile refetch
        window.location.reload();
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setErrors({
        id_file: apiError.message || "Failed to upload ID. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmailVerification = async () => {
    try {
      setIsSubmitting(true);
      setErrors({});

      // TODO: Implement email verification resend endpoint
      await apiClient.post("/auth/resend-verification");
      setSuccessMessage("Verification email sent! Please check your inbox.");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setErrors({
        email: apiError.message || "Failed to send verification email",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendPhoneVerification = async () => {
    try {
      setIsSubmitting(true);
      setErrors({});

      // TODO: Implement phone verification resend endpoint
      await apiClient.post("/identity/resend-phone-verification");
      setSuccessMessage("Verification code sent! Please check your phone.");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setErrors({
        phone: apiError.message || "Failed to send verification code",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (profileLoading) {
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

  if (!profile) {
    router.push("/auth/login");
    return null;
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold font-poppins text-black mb-2">
            Complete Verification
          </h1>
          <p className="text-gray-600 mb-8 text-sm leading-relaxed">
            Verify your identity to build trust in our community. Complete all
            verification steps to unlock full platform features.
          </p>

          {/* Verification Requirements Info */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-8">
            <h3 className="text-lg font-bold text-black mb-3">
              Verification Requirements
            </h3>
            <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
              <li>Verify your email address</li>
              <li>Verify your mobile number</li>
              <li>
                Submit a valid government-issued ID for identity verification
              </li>
            </ul>
          </div>

          {/* Email Verification */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    verificationStatus.email_verified
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {verificationStatus.email_verified ? (
                    <FiCheck size={24} />
                  ) : (
                    <FiMail size={24} />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black">
                    Email Verification
                  </h3>
                  <p className="text-sm text-gray-500">
                    {verificationStatus.email_verified
                      ? "Your email has been verified"
                      : "Verify your email address to continue"}
                  </p>
                </div>
              </div>
              {verificationStatus.email_verified ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                  Verified
                </span>
              ) : (
                <button
                  onClick={handleResendEmailVerification}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors disabled:opacity-50"
                >
                  Resend Email
                </button>
              )}
            </div>
            {errors.email && (
              <p className="text-red-600 text-xs mt-2">{errors.email}</p>
            )}
          </div>

          {/* Phone Verification */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    verificationStatus.phone_verified
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {verificationStatus.phone_verified ? (
                    <FiCheck size={24} />
                  ) : (
                    <FiPhone size={24} />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black">
                    Mobile Number Verification
                  </h3>
                  <p className="text-sm text-gray-500">
                    {verificationStatus.phone_verified
                      ? `Your phone number ${profile.phone} has been verified`
                      : profile.phone
                        ? `Verify your phone number ${profile.phone}`
                        : "Add and verify your phone number in your profile"}
                  </p>
                </div>
              </div>
              {verificationStatus.phone_verified ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                  Verified
                </span>
              ) : (
                <div className="flex gap-2">
                  {profile.phone ? (
                    <button
                      onClick={handleResendPhoneVerification}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors disabled:opacity-50"
                    >
                      Verify Phone
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push("/user/profile/edit")}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors"
                    >
                      Add Phone
                    </button>
                  )}
                </div>
              )}
            </div>
            {errors.phone && (
              <p className="text-red-600 text-xs mt-2">{errors.phone}</p>
            )}
          </div>

          {/* ID Verification */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    verificationStatus.id_verified
                      ? "bg-green-100 text-green-600"
                      : verificationStatus.id_pending
                        ? "bg-amber-100 text-amber-600"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {verificationStatus.id_verified ? (
                    <FiCheck size={24} />
                  ) : verificationStatus.id_pending ? (
                    <FiClock size={24} />
                  ) : (
                    <FiFileText size={24} />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black">
                    Identity Verification
                  </h3>
                  <p className="text-sm text-gray-500">
                    {verificationStatus.id_verified
                      ? "Your ID has been verified"
                      : verificationStatus.id_pending
                        ? "Your ID document has been submitted and is under review. We'll notify you once verification is complete."
                        : "Upload a valid government-issued ID (e.g., Driver's License, Passport, National ID)"}
                  </p>
                </div>
              </div>
              {verificationStatus.id_verified ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                  Verified
                </span>
              ) : verificationStatus.id_pending ? (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold whitespace-nowrap">
                  Under Review
                </span>
              ) : null}
            </div>

            {!verificationStatus.id_verified &&
              !verificationStatus.id_pending && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Upload ID Document
                    </label>
                    <div
                      className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {idPreview ? (
                        <div className="space-y-2">
                          <img
                            src={idPreview}
                            alt="ID Preview"
                            className="max-h-48 mx-auto rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIdFile(null);
                              setIdPreview(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                            }}
                            className="text-red-600 hover:text-red-700 text-sm font-bold"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <FiUpload
                            size={32}
                            className="mx-auto text-gray-400"
                          />
                          <p className="text-sm text-gray-600 font-medium">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-400">
                            JPEG, PNG, or PDF (max 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      onChange={handleIdFileChange}
                      className="hidden"
                    />
                    {errors.id_file && (
                      <p className="text-red-600 text-xs mt-2">
                        {errors.id_file}
                      </p>
                    )}
                  </div>

                  {idFile && (
                    <button
                      onClick={handleSubmitId}
                      disabled={isSubmitting}
                      className="w-full px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-colors disabled:opacity-50"
                    >
                      {isSubmitting
                        ? "Submitting..."
                        : "Submit ID for Verification"}
                    </button>
                  )}
                </div>
              )}

            {verificationStatus.id_pending && (
              <div className="space-y-4">
                {idPreview && (
                  <div className="border-2 border-amber-200 rounded-xl p-4 bg-amber-50">
                    <p className="text-xs font-bold text-amber-900 mb-2">
                      Uploaded Document
                    </p>
                    <img
                      src={idPreview}
                      alt="Uploaded ID"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                  </div>
                )}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <FiClock className="text-amber-600 mt-0.5" size={20} />
                    <div>
                      <p className="text-sm font-bold text-amber-900 mb-1">
                        Verification in Progress
                      </p>
                      <p className="text-xs text-amber-700">
                        Your ID document has been successfully uploaded and is
                        currently being reviewed by our team. This process
                        typically takes 1-2 business days. You'll receive a
                        notification once your verification is complete.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium mb-6">
              {successMessage}
            </div>
          )}

          {/* Back Button */}
          <div className="flex justify-end">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
            >
              Back to Profile
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
