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
} from "react-icons/fi";
import { useState } from "react";

interface UserProfileProps {
  id: string;
}

export default function UserProfile({ id }: UserProfileProps) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Mock data for the seller
  const user = {
    name: "Marcus Chen",
    location: "Tokyo, Japan",
    joined: "January 2023",
    rating: 4.9,
    reviewsCount: 124,
    productsCount: 12,
    verified: true,
    avatar: "MC",
    bio: "Automotive enthusiast and frequent traveler. I enjoy finding new homes for quality pre-owned items. Always open to fair offers!",
    reviews: [
      {
        id: 1,
        author: "Aiko Tanaka",
        rating: 5,
        date: "2 days ago",
        content:
          "Great seller! The car was exactly as described and very clean.",
      },
      {
        id: 2,
        author: "Kenji Sato",
        rating: 4,
        date: "1 week ago",
        content: "Fast communication. Smooth transaction.",
      },
    ],
    recentProducts: [
      {
        id: "1",
        title: "Tesla Model 3 Performance",
        price: "$35,000",
        location: "Tokyo, Japan",
        imageUrl: "/listing_vehicle_tesla_1769261698522.png",
      },
      {
        id: "3",
        title: "RTX 4090 Gaming Laptop",
        price: "$1,200",
        location: "Kyoto, Japan",
        imageUrl: "/listing_electronics_laptop_gaming_1769261730700.png",
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Profile Header */}
      <header className="bg-gray-50 border-b border-gray-100 py-20">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            <div className="w-40 h-40 rounded-[40px] bg-black text-white flex items-center justify-center text-5xl font-black shadow-2xl shadow-black/10">
              {user.avatar}
            </div>
            <div className="flex-1 text-center md:text-left space-y-6">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-4xl font-bold font-poppins text-black">
                    {user.name}
                  </h1>
                  {user.verified && (
                    <FiCheckCircle className="text-primary" size={24} />
                  )}
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <FiMapPin size={18} className="text-primary/60" />
                    {user.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiCalendar size={18} className="text-primary/60" />
                    Joined {user.joined}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 max-w-2xl text-lg leading-relaxed">
                {user.bio}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-8 pt-2">
                <div>
                  <div className="text-2xl font-black text-black">12</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Listings
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-black flex items-center gap-1">
                    {user.rating}{" "}
                    <FiStar
                      className="fill-yellow-500 text-yellow-500"
                      size={20}
                    />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    {user.reviewsCount} Reviews
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
                className="px-10 py-3.5 rounded-2xl border-2 border-gray-200 bg-white text-black font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {user.recentProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </section>

          {/* Reviews */}
          <section>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-bold font-poppins text-black">
                Member Feedback
              </h2>
            </div>
            <div className="space-y-8">
              {user.reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-100 pb-8 last:border-0"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-black">{review.author}</h4>
                      <div className="text-xs text-gray-400 font-medium">
                        {review.date}
                      </div>
                    </div>
                    <div className="flex text-yellow-500">
                      {[...Array(review.rating)].map((_, i) => (
                        <FiStar key={i} size={14} className="fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {review.content}
                  </p>
                </div>
              ))}
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
              How was your experience with Marcus?
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
