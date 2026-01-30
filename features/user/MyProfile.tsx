"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import {
  FiBriefcase,
  FiMessageCircle,
  FiEdit2,
  FiCheckCircle,
  FiGrid,
  FiList,
  FiPlus,
} from "react-icons/fi";
import { useState } from "react";
import { useProfile } from "@/lib/hooks/useAuth";
import { useMyProducts } from "@/lib/hooks/useListings";
import { useRouter } from "next/navigation";
import { ListingItem } from "@/lib/api/products";

type ProfileTab = "about" | "listings" | "reviews";

export default function MyProfile() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("about");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("list");
  const { data: profile, isLoading } = useProfile();
  const router = useRouter();
  const { data: myProducts, isLoading: isLoadingProducts } = useMyProducts(
    1,
    50,
    !!profile,
  );

  // Redirect if not logged in
  if (!isLoading && !profile) {
    router.push("/auth/login");
    return null;
  }

  // Get user initials for avatar placeholder
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Get avatar URL
  const getAvatarUrl = (profilePicture?: string) => {
    if (!profilePicture) return null;
    if (profilePicture.startsWith("http")) return profilePicture;
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    return `${API_BASE_URL}${profilePicture}`;
  };

  if (isLoading) {
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

  if (!profile) return null;

  const displayUser = {
    id: profile.id,
    name: `${profile.first_name} ${profile.last_name}`,
    first_name: profile.first_name,
    last_name: profile.last_name,
    location: profile.state_province
      ? `${profile.state_province}, ${profile.country || "Philippines"}`
      : profile.country || "Philippines",
    joined: new Date(profile.created_at || Date.now()).toLocaleDateString(
      "en-US",
      { month: "long", year: "numeric" },
    ),
    rating: profile.rating || 0,
    reviewsCount: profile.total_reviews || 0,
    productsCount: myProducts?.total || 0,
    verified: profile.identity_verified,
    bio: profile.bio || "",
    email: profile.email,
    phone: profile.phone || "",
    profile_picture: profile.profile_picture,
  };

  const avatarUrl = getAvatarUrl(displayUser.profile_picture);
  const initials = getInitials(displayUser.first_name, displayUser.last_name);

  // Mock data for now - TODO: Fetch from API
  const reviews: any[] = [];
  const recentProducts = myProducts?.items || [];

  const getListingImageUrl = (images?: string[]) => {
    if (!images || images.length === 0)
      return "/listing_electronics_laptop_gaming_1769261730700.png";
    const img = images[0];
    if (!img) return "/listing_electronics_laptop_gaming_1769261730700.png";
    if (img.startsWith("http")) return img;
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    return `${API_BASE_URL}${img}`;
  };

  const formatPrice = (price?: number) => {
    if (!price || price <= 0) return "Free";
    return `₱${price.toLocaleString("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Sidebar - Profile Navigation */}
          <aside className="w-full lg:w-64 shrink-0">
            <h2 className="text-2xl font-bold font-poppins text-black mb-6">
              Profile
            </h2>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("about")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                  activeTab === "about"
                    ? "bg-gray-100 text-black font-bold"
                    : "text-gray-600 hover:bg-gray-50 font-medium"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayUser.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <span>About me</span>
              </button>

              <button
                onClick={() => setActiveTab("listings")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                  activeTab === "listings"
                    ? "bg-gray-100 text-black font-bold"
                    : "text-gray-600 hover:bg-gray-50 font-medium"
                }`}
              >
                <FiBriefcase size={20} className="text-gray-400 shrink-0" />
                <span>My listings</span>
              </button>

              <button
                onClick={() => setActiveTab("reviews")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                  activeTab === "reviews"
                    ? "bg-gray-100 text-black font-bold"
                    : "text-gray-600 hover:bg-gray-50 font-medium"
                }`}
              >
                <FiMessageCircle size={20} className="text-gray-400 shrink-0" />
                <span>Reviews</span>
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {activeTab === "about" && (
              <div className="space-y-8">
                {/* Header with Edit Button */}
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold font-poppins text-black">
                    About me
                  </h1>
                  <Link
                    href="/user/profile/edit"
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-bold text-gray-700 flex items-center gap-2"
                  >
                    <FiEdit2 size={16} />
                    Edit
                  </Link>
                </div>

                {/* User Information Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-8">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex flex-col items-center md:items-start">
                      <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center text-white text-4xl font-bold mb-4 overflow-hidden">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={displayUser.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          initials
                        )}
                      </div>
                      <h2 className="text-2xl font-bold text-black mb-1 text-center md:text-left">
                        {displayUser.name}
                      </h2>
                      <p className="text-sm text-gray-500 font-medium text-center md:text-left">
                        Member
                      </p>
                    </div>

                    {/* Complete Profile Section */}
                    {!displayUser.verified && (
                      <div className="flex-1 bg-gray-50 rounded-xl p-6 border border-gray-100">
                        <h3 className="text-lg font-bold text-black mb-2">
                          Complete your profile
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                          Add more information to your profile to help buyers
                          and sellers get to know you better. Complete profiles
                          help build trust in the community.
                        </p>
                        <div className="mb-4 space-y-2">
                          <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                            Verification Requirements:
                          </p>
                          <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                            <li>Verify your email address</li>
                            <li>Verify your mobile number</li>
                            <li>
                              Submit a valid government-issued ID for identity
                              verification
                            </li>
                          </ul>
                        </div>
                        <Link
                          href="/user/verify"
                          className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-hover transition-colors"
                        >
                          Get started
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Bio Section */}
                  {displayUser.bio && (
                    <div className="mt-8 pt-8 border-t border-gray-100">
                      <h3 className="text-lg font-bold text-black mb-3">Bio</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {displayUser.bio}
                      </p>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Location
                      </p>
                      <p className="text-gray-900 font-medium">
                        {displayUser.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Member since
                      </p>
                      <p className="text-gray-900 font-medium">
                        {displayUser.joined}
                      </p>
                    </div>
                    {displayUser.phone && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                          Phone
                        </p>
                        <p className="text-gray-900 font-medium">
                          {displayUser.phone}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Verification
                      </p>
                      <div className="flex items-center gap-2">
                        {displayUser.verified ? (
                          <>
                            <FiCheckCircle className="text-primary" size={18} />
                            <span className="text-gray-900 font-medium">
                              Verified
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-500 font-medium">
                            Not verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews I've Written Section */}
                <div className="border-t border-gray-100 pt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <FiMessageCircle size={24} className="text-gray-400" />
                    <h2 className="text-2xl font-bold font-poppins text-black">
                      Reviews I've written
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {reviews.length > 0 ? (
                      reviews.map((review: any) => (
                        <div
                          key={review.id}
                          className="border-b border-gray-100 pb-6 last:border-0"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-bold text-black mb-1">
                                {review.author}
                              </h4>
                              <div className="flex items-center gap-2">
                                <div className="flex text-yellow-500">
                                  {[...Array(review.rating)].map((_, i) => (
                                    <FiMessageCircle
                                      key={i}
                                      size={14}
                                      className="fill-current"
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-400 font-medium">
                                  {review.date}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed text-sm">
                            {review.content}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No reviews yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "listings" && (
              <div className="space-y-6">
                {/* Header with title and action buttons */}
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold font-poppins text-black">
                    My listings
                  </h1>
                  <div className="flex items-center gap-3">
                    {/* View Toggle Button */}
                    <button
                      onClick={() =>
                        setViewMode(viewMode === "list" ? "kanban" : "list")
                      }
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      title={
                        viewMode === "list"
                          ? "Switch to Kanban view"
                          : "Switch to List view"
                      }
                    >
                      {viewMode === "list" ? (
                        <FiGrid size={18} className="text-gray-700" />
                      ) : (
                        <FiList size={18} className="text-gray-700" />
                      )}
                    </button>
                    {/* Add New Listing Button */}
                    <button
                      onClick={() => router.push("/list")}
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      title="Create new listing"
                    >
                      <FiPlus size={20} className="text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Listings Display */}
                {isLoadingProducts ? (
                  <div className="bg-white border border-gray-100 rounded-xl p-8 text-gray-500">
                    Loading your listings...
                  </div>
                ) : recentProducts.length > 0 ? (
                  viewMode === "list" ? (
                    /* List View */
                    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                      <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 font-bold text-xs text-gray-500 uppercase tracking-wider">
                        <div className="col-span-4">Listing</div>
                        <div className="col-span-2">Category</div>
                        <div className="col-span-3">Location</div>
                        <div className="col-span-3">Status</div>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {recentProducts.map((product: any) => (
                          <div
                            key={product.id}
                            className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="col-span-4 flex items-center gap-3">
                              <div className="w-16 h-16 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                                <img
                                  src={getListingImageUrl(product.images)}
                                  alt={product.name || "Listing image"}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-bold text-black text-sm">
                                  {product.name || "Untitled Listing"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {product.CreatedAt
                                    ? `Started ${new Date(product.CreatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
                                    : "No date available"}
                                </p>
                              </div>
                            </div>
                            <div className="col-span-2 flex items-center">
                              <span className="text-sm text-gray-700 font-medium">
                                {product.item_type === "vehicle"
                                  ? product.vehicle_type?.name || "Vehicle"
                                  : product.category?.name || "Product"}
                              </span>
                            </div>
                            <div className="col-span-3 flex items-center">
                              <span className="text-sm text-gray-700">
                                {product.location || "Not specified"}
                              </span>
                            </div>
                            <div className="col-span-3 flex items-center">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                <span className="text-sm text-gray-700 font-medium">
                                  {product.status?.name || "Draft"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Kanban View */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recentProducts.map((product: any) => (
                        <div
                          key={product.id}
                          className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="p-4">
                            <ProductCard
                              id={String(product.id)}
                              title={product.name || "Untitled Listing"}
                              price={formatPrice(product.price)}
                              location={product.location || "Not specified"}
                              imageUrl={getListingImageUrl(product.images)}
                              isFree={!product.price || product.price <= 0}
                              disableHover
                            />
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-xs text-gray-500 font-medium">
                                {product.item_type === "vehicle"
                                  ? product.vehicle_type?.name || "Vehicle"
                                  : product.category?.name || "Product"}
                              </span>
                              <span className="text-xs font-bold text-gray-700">
                                {product.status?.name ||
                                product.item_type === "vehicle"
                                  ? "Active"
                                  : "Draft"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <FiBriefcase
                      size={48}
                      className="mx-auto text-gray-300 mb-4"
                    />
                    <p className="text-gray-500 mb-4">No listings yet.</p>
                    <button
                      onClick={() => router.push("/list")}
                      className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-hover transition-colors"
                    >
                      Create your first listing
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold font-poppins text-black">
                  Reviews
                </h1>
                <div className="space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map((review: any) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-100 pb-6 last:border-0"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-black mb-1">
                              {review.author}
                            </h4>
                            <div className="flex items-center gap-2">
                              <div className="flex text-yellow-500">
                                {[...Array(review.rating)].map((_, i) => (
                                  <FiMessageCircle
                                    key={i}
                                    size={14}
                                    className="fill-current"
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-400 font-medium">
                                {review.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          {review.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No reviews yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
