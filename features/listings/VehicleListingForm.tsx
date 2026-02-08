"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiChevronLeft, FiX, FiUpload } from "react-icons/fi";
import { useCreateVehicle, useVehicleTypes } from "@/lib/hooks/useListings";
import { VerificationGuard } from "@/components/VerificationGuard";
import { ApiError } from "@/lib/api/client";
import WizardNav from "@/components/listing-wizard/WizardNav";
import WizardProgress from "@/components/listing-wizard/WizardProgress";
import WizardFooter from "@/components/listing-wizard/WizardFooter";

export default function VehicleListingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");

  const { data: vehicleTypes } = useVehicleTypes();
  const createMutation = useCreateVehicle();

  const [formData, setFormData] = useState({
    vehicleMake: "",
    vehicleModel: "",
    year: new Date().getFullYear().toString(),
    price: "",
    description: "",
    location: "",
    vehicleType: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<0 | 1>(0);

  // Overall steps: 1) Category (on /list), 2) Vehicle details, 3) Photos
  const totalSteps = 3;
  const overallStep = 2 + step; // step 0 -> 2, step 1 -> 3
  const progress = (overallStep / totalSteps) * 100;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...images, ...files].slice(0, 10); // Max 10 images
    setImages(newFiles);

    // Create previews
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    // Revoke object URLs to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const validateStep = (targetStep: 0 | 1): boolean => {
    const newErrors: Record<string, string> = {};

    if (targetStep === 0) {
      if (!formData.vehicleMake.trim())
        newErrors.vehicleMake = "Vehicle make is required";
      if (!formData.vehicleModel.trim())
        newErrors.vehicleModel = "Vehicle model is required";
      if (
        !formData.year ||
        parseInt(formData.year) < 1900 ||
        parseInt(formData.year) > new Date().getFullYear() + 1
      ) {
        newErrors.year = "Valid year is required";
      }
      if (!formData.price || parseInt(formData.price) <= 0) {
        newErrors.price = "Valid price is required";
      }
      if (!formData.location.trim())
        newErrors.location = "Location is required";
      if (!formData.vehicleType)
        newErrors.vehicleType = "Vehicle type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitListing = async () => {
    if (!validateStep(0)) return;
    try {
      await createMutation.mutateAsync({
        vehicleMake: formData.vehicleMake,
        vehicleModel: formData.vehicleModel,
        year: parseInt(formData.year),
        price: parseInt(formData.price),
        description: formData.description,
        location: formData.location,
        vehicleType: formData.vehicleType,
        images: images.length > 0 ? images : undefined,
      });
      // Redirect happens in mutation's onSuccess
    } catch (error) {
      if (error instanceof Error) {
        const apiError = error as ApiError;
        setErrors({ general: apiError.message });
      }
    }
  };

  const goBack = () => {
    if (step === 0) {
      router.push("/list");
      return;
    }
    setStep(0);
  };

  const goNext = () => {
    if (step === 0) {
      if (!validateStep(0)) return;
      setStep(1);
      return;
    }
    void submitListing();
  };

  // Generate year options (last 50 years to current year + 1)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 51 }, (_, i) => currentYear - i + 1);

  return (
    <VerificationGuard requireOnboarding requireVerification>
      <div className="min-h-screen bg-white">
        <WizardNav onSaveExit={() => router.push("/list")} />

        <main className="px-6 pt-10 pb-28">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A] tracking-tight">
                {step === 0 ? "Tell us about your vehicle" : "Add photos"}
              </h1>
              <p className="mt-3 text-gray-600">
                Step {overallStep} of {totalSteps}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                goNext();
              }}
            >
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium mb-6">
                  {errors.general}
                </div>
              )}

              {/* Vehicle Information */}
              {step === 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                  <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">
                    Vehicle Information
                  </h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-bold text-[#4B4B4B] ml-1 mb-2 block">
                          Make *
                        </label>
                        <input
                          type="text"
                          name="vehicleMake"
                          value={formData.vehicleMake}
                          onChange={handleChange}
                          placeholder="e.g., Toyota"
                          required
                          className={`w-full px-4 py-3 rounded-xl border transition-all outline-none text-black font-medium ${errors.vehicleMake
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-100 focus:border-primary"
                            }`}
                        />
                        {errors.vehicleMake && (
                          <p className="text-red-600 text-xs font-medium ml-1 mt-1">
                            {errors.vehicleMake}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-bold text-[#4B4B4B] ml-1 mb-2 block">
                          Model *
                        </label>
                        <input
                          type="text"
                          name="vehicleModel"
                          value={formData.vehicleModel}
                          onChange={handleChange}
                          placeholder="e.g., Vios"
                          required
                          className={`w-full px-4 py-3 rounded-xl border transition-all outline-none text-black font-medium ${errors.vehicleModel
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-100 focus:border-primary"
                            }`}
                        />
                        {errors.vehicleModel && (
                          <p className="text-red-600 text-xs font-medium ml-1 mt-1">
                            {errors.vehicleModel}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-bold text-[#4B4B4B] ml-1 mb-2 block">
                          Year *
                        </label>
                        <select
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          required
                          className={`w-full px-4 py-3 rounded-xl border transition-all outline-none text-black font-medium ${errors.year
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-100 focus:border-primary"
                            }`}
                        >
                          {years.map((year) => (
                            <option key={year} value={year.toString()}>
                              {year}
                            </option>
                          ))}
                        </select>
                        {errors.year && (
                          <p className="text-red-600 text-xs font-medium ml-1 mt-1">
                            {errors.year}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-bold text-[#4B4B4B] ml-1 mb-2 block">
                          Vehicle Type *
                        </label>
                        <select
                          name="vehicleType"
                          value={formData.vehicleType}
                          onChange={handleChange}
                          required
                          className={`w-full px-4 py-3 rounded-xl border transition-all outline-none text-black font-medium ${errors.vehicleType
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-100 focus:border-primary"
                            }`}
                        >
                          <option value="">Select type</option>
                          {vehicleTypes?.map((type) => (
                            <option key={type.id} value={type.id.toString()}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                        {errors.vehicleType && (
                          <p className="text-red-600 text-xs font-medium ml-1 mt-1">
                            {errors.vehicleType}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-bold text-[#4B4B4B] ml-1 mb-2 block">
                          Price (₱) *
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="0"
                          min="0"
                          required
                          className={`w-full px-4 py-3 rounded-xl border transition-all outline-none text-black font-medium ${errors.price
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-100 focus:border-primary"
                            }`}
                        />
                        {errors.price && (
                          <p className="text-red-600 text-xs font-medium ml-1 mt-1">
                            {errors.price}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#4B4B4B] ml-1 mb-2 block">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the vehicle's condition, features, mileage, etc..."
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-primary transition-all outline-none text-black font-medium resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#4B4B4B] ml-1 mb-2 block">
                        Location *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="City, Province"
                        required
                        className={`w-full px-4 py-3 rounded-xl border transition-all outline-none text-black font-medium ${errors.location
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-100 focus:border-primary"
                          }`}
                      />
                      {errors.location && (
                        <p className="text-red-600 text-xs font-medium ml-1 mt-1">
                          {errors.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Images */}
              {step === 1 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                  <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">
                    Photos
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-xl"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      ))}

                      {images.length < 10 && (
                        <label className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                          <FiUpload size={24} className="text-gray-400 mb-2" />
                          <span className="text-xs text-gray-400 font-medium">
                            Add Photo
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      Add up to 10 photos. First photo will be the main image.
                    </p>
                  </div>
                </div>
              )}

              <button type="submit" className="hidden">
                Next
              </button>
            </form>
          </div>
        </main>

        <WizardFooter
          backLabel="Back"
          nextLabel={
            step === 1
              ? createMutation.isPending
                ? "Creating..."
                : "Create listing"
              : "Next"
          }
          onBack={goBack}
          onNext={goNext}
          nextDisabled={createMutation.isPending}
          progress={progress}
        />
      </div>
    </VerificationGuard>
  );
}
