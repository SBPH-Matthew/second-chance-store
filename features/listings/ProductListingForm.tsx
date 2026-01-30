"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FiX,
  FiUpload,
  FiImage,
  FiPackage,
  FiTag,
  FiMapPin,
  FiDollarSign,
  FiFileText,
  FiCamera,
} from "react-icons/fi";
import {
  useCreateProduct,
  useCategories,
  useProductConditions,
  useProductStatuses,
} from "@/lib/hooks/useListings";
import { VerificationGuard } from "@/components/VerificationGuard";
import { ApiError } from "@/lib/api/client";
import WizardNav from "@/components/listing-wizard/WizardNav";
import WizardProgress from "@/components/listing-wizard/WizardProgress";
import WizardFooter from "@/components/listing-wizard/WizardFooter";

export default function ProductListingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");

  const { data: categories } = useCategories();
  const { data: conditions } = useProductConditions();
  const { data: statuses } = useProductStatuses();
  const createMutation = useCreateProduct();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    location: "",
    category: categoryId || "",
    condition: "",
    status: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<0 | 1 | 2>(0);

  // Overall wizard steps:
  // 1) Category (done on /list)
  // 2) Product basics
  // 3) Category/details
  // 4) Photos
  const totalSteps = 4;
  const overallStep = 2 + step; // step 0 -> 2, step 1 -> 3, step 2 -> 4
  const progress = (overallStep / totalSteps) * 100;

  // Set default status to DRAFT if available
  useEffect(() => {
    if (statuses && statuses.length > 0 && !formData.status) {
      const draftStatus = statuses.find(
        (s) => s.name.toLowerCase() === "draft",
      );
      if (draftStatus) {
        setFormData((prev) => ({ ...prev, status: draftStatus.id.toString() }));
      }
    }
  }, [statuses]);

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

  const validateStep = (targetStep: 0 | 1 | 2): boolean => {
    const newErrors: Record<string, string> = {};

    if (targetStep === 0) {
      if (!formData.name.trim()) newErrors.name = "Product name is required";
      if (!formData.price || parseFloat(formData.price) <= 0) {
        newErrors.price = "Valid price is required";
      }
      if (!formData.location.trim())
        newErrors.location = "Location is required";
    }

    if (targetStep === 1) {
      if (!formData.category) newErrors.category = "Category is required";
      if (!formData.condition) newErrors.condition = "Condition is required";
      if (!formData.status) newErrors.status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitListing = async () => {
    const ok = validateStep(0) && validateStep(1);
    if (!ok) return;

    try {
      await createMutation.mutateAsync({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        location: formData.location,
        category: formData.category,
        condition: formData.condition,
        status: formData.status,
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
    setStep((s) => (s === 1 ? 0 : 1));
  };

  const goNext = () => {
    if (step === 0) {
      if (!validateStep(0)) return;
      setStep(1);
      return;
    }
    if (step === 1) {
      if (!validateStep(1)) return;
      setStep(2);
      return;
    }
    void submitListing();
  };

  const stepTitle =
    step === 0
      ? "Tell us about your item"
      : step === 1
        ? "Choose category and details"
        : "Add photos";

  return (
    <VerificationGuard requireOnboarding requireVerification>
      <div className="min-h-screen bg-white">
        <WizardNav onSaveExit={() => router.push("/list")} />
        <WizardProgress value={progress} />

        <main className="px-6 pt-10 pb-28">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A] tracking-tight">
                {stepTitle}
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
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-8 flex items-center gap-3 shadow-sm">
                  <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                    <FiX size={12} className="text-white" />
                  </div>
                  <p className="font-medium">{errors.general}</p>
                </div>
              )}

              {/* Basic Information */}
              {step === 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <FiPackage className="text-primary" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#1A1A1A]">
                        Basic Information
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Tell us about your product
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-bold text-[#4B4B4B] mb-3 flex items-center gap-2">
                        <FiTag size={16} className="text-primary" />
                        Product Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., iPhone 13 Pro Max 256GB"
                        required
                        className={`w-full px-5 py-4 rounded-xl border-2 transition-all outline-none text-black font-medium bg-gray-50 focus:bg-white ${
                          errors.name
                            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                            : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-red-600 text-xs font-medium mt-2 ml-1 flex items-center gap-1">
                          <FiX size={12} /> {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#4B4B4B] mb-3 flex items-center gap-2">
                        <FiFileText size={16} className="text-primary" />
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your product in detail. Include features, condition, reason for selling, and any other relevant information..."
                        rows={6}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none text-black font-medium resize-none bg-gray-50 focus:bg-white"
                      />
                      <p className="text-xs text-gray-400 mt-2">
                        A detailed description helps buyers make informed
                        decisions.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-bold text-[#4B4B4B] mb-3 flex items-center gap-2">
                          <FiDollarSign size={16} className="text-primary" />
                          Price (₱) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                            ₱
                          </span>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            required
                            className={`w-full pl-10 pr-5 py-4 rounded-xl border-2 transition-all outline-none text-black font-medium bg-gray-50 focus:bg-white ${
                              errors.price
                                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                            }`}
                          />
                        </div>
                        {errors.price && (
                          <p className="text-red-600 text-xs font-medium mt-2 ml-1 flex items-center gap-1">
                            <FiX size={12} /> {errors.price}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-bold text-[#4B4B4B] mb-3 flex items-center gap-2">
                          <FiMapPin size={16} className="text-primary" />
                          Location *
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="e.g., Manila, Metro Manila"
                          required
                          className={`w-full px-5 py-4 rounded-xl border-2 transition-all outline-none text-black font-medium bg-gray-50 focus:bg-white ${
                            errors.location
                              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                              : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                          }`}
                        />
                        {errors.location && (
                          <p className="text-red-600 text-xs font-medium mt-2 ml-1 flex items-center gap-1">
                            <FiX size={12} /> {errors.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Category & Details */}
              {step === 1 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500/10 to-blue-500/5 flex items-center justify-center">
                      <FiTag className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#1A1A1A]">
                        Category & Details
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Help buyers find your listing
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm font-bold text-[#4B4B4B] mb-3 block">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className={`w-full px-5 py-4 rounded-xl border-2 transition-all outline-none text-black font-medium bg-gray-50 focus:bg-white ${
                          errors.category
                            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                            : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                        }`}
                      >
                        <option value="">Select category</option>
                        {categories?.map((cat) => (
                          <option key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="text-red-600 text-xs font-medium mt-2 ml-1 flex items-center gap-1">
                          <FiX size={12} /> {errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#4B4B4B] mb-3 block">
                        Condition *
                      </label>
                      <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        required
                        className={`w-full px-5 py-4 rounded-xl border-2 transition-all outline-none text-black font-medium bg-gray-50 focus:bg-white ${
                          errors.condition
                            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                            : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                        }`}
                      >
                        <option value="">Select condition</option>
                        {conditions?.map((cond) => (
                          <option key={cond.id} value={cond.id.toString()}>
                            {cond.name}
                          </option>
                        ))}
                      </select>
                      {errors.condition && (
                        <p className="text-red-600 text-xs font-medium mt-2 ml-1 flex items-center gap-1">
                          <FiX size={12} /> {errors.condition}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#4B4B4B] mb-3 block">
                        Status *
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className={`w-full px-5 py-4 rounded-xl border-2 transition-all outline-none text-black font-medium bg-gray-50 focus:bg-white ${
                          errors.status
                            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                            : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                        }`}
                      >
                        <option value="">Select status</option>
                        {statuses?.map((status) => (
                          <option key={status.id} value={status.id.toString()}>
                            {status.name}
                          </option>
                        ))}
                      </select>
                      {errors.status && (
                        <p className="text-red-600 text-xs font-medium mt-2 ml-1 flex items-center gap-1">
                          <FiX size={12} /> {errors.status}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Images */}
              {step === 2 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500/10 to-purple-500/5 flex items-center justify-center">
                      <FiCamera className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#1A1A1A]">
                        Photos
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Show off your product with great photos
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div
                          key={index}
                          className="relative group aspect-square"
                        >
                          <div className="absolute -top-2 -right-2 z-10">
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover rounded-xl border-2 border-gray-200 group-hover:border-primary transition-colors"
                          />
                          {index === 0 && (
                            <div className="absolute bottom-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-md">
                              Main
                            </div>
                          )}
                        </div>
                      ))}

                      {images.length < 10 && (
                        <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
                          <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors">
                            <FiUpload
                              size={24}
                              className="text-gray-400 group-hover:text-primary transition-colors"
                            />
                          </div>
                          <span className="text-xs text-gray-500 group-hover:text-primary font-medium transition-colors">
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
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-sm text-blue-800 font-medium flex items-center gap-2">
                        <FiImage size={16} />
                        <span>
                          Add up to 10 photos. The first photo will be used as
                          the main image for your listing.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* hidden submit button so Enter works */}
              <button type="submit" className="hidden">
                Next
              </button>
            </form>
          </div>
        </main>

        <WizardFooter
          backLabel="Back"
          nextLabel={
            step === 2
              ? createMutation.isPending
                ? "Creating..."
                : "Create listing"
              : "Next"
          }
          onBack={goBack}
          onNext={goNext}
          nextDisabled={createMutation.isPending}
        />
      </div>
    </VerificationGuard>
  );
}
