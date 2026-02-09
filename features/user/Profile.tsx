"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import {
  FiMapPin,
  FiCalendar,
  FiShield,
  FiStar,
  FiMessageCircle,
  FiPlus,
  FiCheckCircle,
  FiShoppingBag,
  FiMessageSquare,
} from "react-icons/fi";
import { useState } from "react";
import { usePublicProfile } from "@/lib/hooks/useUser";

interface UserProfileProps {
  id: string;
}

export default function UserProfile({ id }: UserProfileProps) {
  const { data: profile, isLoading, error } = usePublicProfile(id);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">User not found</h2>
        <p className="text-gray-500 mb-8">The profile you are looking for may have been removed or is no longer available.</p>
        <button onClick={() => window.history.back()} className="btn-primary px-8 py-3 rounded-xl font-bold">
          Go Back
        </button>
      </div>
    );
  }

  const { user, products, vehicles, reviews } = profile;

  const displayUser = {
    name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Unknown User",
    location: user.country ? `${user.country}${user.state_province ? `, ${user.state_province}` : ""}` : "Location not set",
    joined: (user as any).CreatedAt ? new Date((user as any).CreatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently",
    rating: user.rating || 0,
    reviewsCount: user.total_reviews || 0,
    listingsCount: products.length + vehicles.length,
    verified: user.identity_verified,
    avatar: (user.first_name?.[0] || "") + (user.last_name?.[0] || ""),
    bio: user.bio || "This user hasn't added a bio yet.",
  };

  const allListings = [...products, ...vehicles];

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getImageUrl = (images: any) => {
    if (!images || (Array.isArray(images) && images.length === 0)) return "/listing_furniture_sofa_1769261712567.png";
    const image = Array.isArray(images) ? images[0] : images;
    return typeof image === 'string' ? image : "/listing_furniture_sofa_1769261712567.png";
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Profile Header */}
      <header className="bg-gray-50 border-b border-gray-100 py-20">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            <div className="w-40 h-40 rounded-[40px] bg-black text-white flex items-center justify-center text-5xl font-black shadow-2xl shadow-black/10">
              {displayUser.avatar}
            </div>
            <div className="flex-1 text-center md:text-left space-y-6">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-4xl font-bold font-poppins text-black">
                    {displayUser.name}
                  </h1>
                  {displayUser.verified && (
                    <FiCheckCircle className="text-primary" size={24} />
                  )}
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <FiMapPin size={18} className="text-primary/60" />
                    {displayUser.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiCalendar size={18} className="text-primary/60" />
                    Joined {displayUser.joined}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 max-w-2xl text-lg leading-relaxed">
                {displayUser.bio}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-8 pt-2">
                <div>
                  <div className="text-2xl font-black text-black">{displayUser.listingsCount}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Listings
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-black flex items-center gap-1">
                    {displayUser.rating.toFixed(1)}{" "}
                    <FiStar
                      className="fill-yellow-500 text-yellow-500"
                      size={20}
                    />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    {displayUser.reviewsCount} Reviews
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <button className="btn-primary px-10 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2">
                <FiMessageCircle size={20} />
                Message
              </button>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-10 py-3.5 rounded-2xl border-2 border-gray-100 bg-white text-black font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FiPlus size={20} />
                Write Review
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16">
          {/* Listings */}
          <section>
            <h2 className="text-2xl font-bold font-poppins text-black mb-10">
              Active Listings
            </h2>
            {allListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {allListings.map((item: any) => (
                  <ProductCard
                    key={`${item.item_type || 'item'}-${item.id}`}
                    id={item.id.toString()}
                    type={item.item_type}
                    title={item.name || `${item.vehicle_make} ${item.vehicle_model}`}
                    price={formatPrice(item.price)}
                    location={item.location}
                    imageUrl={getImageUrl(item.images)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-100 px-6 text-center group transition-colors hover:border-gray-200">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-gray-300 mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                  <FiShoppingBag size={32} />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">No active listings</h3>
                <p className="text-gray-500 max-w-[280px] text-sm leading-relaxed font-medium">
                  This user haven't posted any items for sale yet. Check back later!
                </p>
              </div>
            )}
          </section>

          {/* Reviews */}
          <section>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-bold font-poppins text-black">
                Member Feedback
              </h2>
            </div>
            <div className="space-y-8">
              {reviews.length > 0 ? reviews.map((review: any) => (
                <div
                  key={review.id}
                  className="border-b border-gray-100 pb-8 last:border-0"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                        {review.reviewer?.first_name?.[0]}{review.reviewer?.last_name?.[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-black">{review.reviewer?.first_name} {review.reviewer?.last_name}</h4>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          {review.CreatedAt ? new Date(review.CreatedAt).toLocaleDateString() : 'Recent'}
                        </div>
                      </div>
                    </div>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} size={14} className={i < review.rating ? "fill-current" : "text-gray-200"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {review.comment}
                  </p>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-gray-100 px-6 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 mb-6">
                    <FiMessageSquare size={24} />
                  </div>
                  <h3 className="font-bold text-black mb-1">Be the first to review</h3>
                  <p className="text-gray-400 text-xs leading-relaxed max-w-[200px] mb-8">
                    Help others know more about this member by sharing your experience.
                  </p>
                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="text-primary text-sm font-bold flex items-center gap-2 hover:underline"
                  >
                    <FiPlus size={16} />
                    Write a review
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <Footer />

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-3000 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsReviewModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <h3 className="text-2xl font-bold font-poppins text-black mb-2">
              Write a Review
            </h3>
            <p className="text-gray-500 mb-8 font-medium">
              How was your experience with {displayUser.name}?
            </p>

            <div className="space-y-6">
              <div className="flex flex-col items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Rating
                </span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="cursor-pointer transition-transform hover:scale-110"
                    >
                      <FiStar
                        size={32}
                        className={
                          star <= rating
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-gray-200"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-3 ml-1">
                  Your Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell others about your experience..."
                  className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 transition-all outline-none text-base min-h-[120px] resize-none"
                />
              </div>

              <button
                className="btn-primary w-full py-4 rounded-2xl font-bold text-lg hover:scale-[1.01] transition-all cursor-pointer shadow-lg shadow-primary/20"
                onClick={() => setIsReviewModalOpen(false)}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
