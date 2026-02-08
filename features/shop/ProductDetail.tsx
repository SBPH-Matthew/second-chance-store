"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FiMapPin,
  FiClock,
  FiShield,
  FiMessageCircle,
  FiHeart,
  FiShare2,
  FiX,
  FiCheck,
} from "react-icons/fi";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useListingDetails } from "@/lib/hooks/useListings";

interface ProductDetailProps {
  id: string;
}

function ProductDetailContent({ id }: ProductDetailProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const { data: item, isLoading, error } = useListingDetails(id);

  const templates = [
    "Hi, is this still available?",
    "I'm interested in this item. When is the best time to meet?",
    "Is the price negotiable?",
  ];

  const handleShare = () => {
    const url = `${window.location.origin}${pathname}`;
    navigator.clipboard.writeText(url);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    if (searchParams.get("action") === "get") {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const closeModal = () => {
    setIsModalOpen(false);
    // Clean up URL without refresh
    router.replace(`/shop/${id}`, { scroll: false });
  };

  const getImageUrl = (images: any, index?: number) => {
    if (!images || (Array.isArray(images) && images.length === 0)) return "/listing_furniture_sofa_1769261712567.png";
    if (typeof index === 'number') {
      const img = images[index];
      return img || "/listing_furniture_sofa_1769261712567.png";
    }
    const image = Array.isArray(images) ? images[0] : images;
    if (typeof image !== 'string') return "/listing_furniture_sofa_1769261712567.png";
    return image;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing not found</h2>
        <p className="text-gray-500 mb-8">The item you are looking for may have been removed or is no longer available.</p>
        <Link href="/shop" className="btn-primary px-8 py-3 rounded-xl font-bold">
          Back to Shop
        </Link>
      </div>
    );
  }

  // Map item to UI structure
  const product = {
    title: item.name,
    price: formatPrice(item.price),
    location: item.location,
    condition: item.item_type === 'vehicle' ? 'Good' : ((item as any).product_condition?.name || 'Good'),
    posted: item.CreatedAt ? new Date(item.CreatedAt).toLocaleDateString() : 'Recently',
    description: item.description,
    images: Array.isArray(item.images) && item.images.length > 0 ? item.images : ["/listing_furniture_sofa_1769261712567.png"],
    seller: item.seller ? {
      id: item.seller.id,
      name: `${item.seller.first_name} ${item.seller.last_name}`,
      rating: item.seller.rating || 0,
      reviews: item.seller.total_reviews || 0,
      joined: item.seller.CreatedAt ? new Date(item.seller.CreatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2024',
      avatar: (item.seller.first_name?.[0] || "") + (item.seller.last_name?.[0] || ""),
      phone: item.seller.phone || "Not provided",
      identityVerified: item.seller.identity_verified,
    } : {
      id: 1,
      name: "Marcus Chen",
      rating: 4.9,
      reviews: 124,
      joined: "Jan 2023",
      avatar: "MC",
      phone: "+81 90-XXXX-XXXX",
      identityVerified: true,
    },
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="container py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-primary transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="text-gray-900 truncate max-w-[200px]">
            {product.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
          <div className="space-y-10">
            <div className="space-y-4">
              <div
                className="aspect-16/10 bg-gray-100 rounded-3xl overflow-hidden relative group cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
              >
                <img
                  src={getImageUrl(product.images, activeImageIndex)}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:scale-110 transition-all text-gray-900 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); /* Favorite logic */ }}
                >
                  <FiHeart size={20} />
                </button>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="bg-white/90 backdrop-blur-md px-6 py-2.5 rounded-full text-sm font-bold shadow-xl border border-white/20">
                    Click to preview
                  </span>
                </div>
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-6 gap-4">
                  {product.images.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${activeImageIndex === i ? "border-primary scale-95 shadow-inner" : "border-transparent hover:border-gray-200"}`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`Thumb ${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <span className="bg-blue-50 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.condition}
                </span>
                <div className="flex items-center gap-1.5 text-gray-400 text-sm font-medium">
                  <FiClock size={14} />
                  <span>Posted {product.posted}</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-poppins text-black tracking-tight leading-tight">
                {product.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <FiMapPin className="text-primary" />
                <span>{product.location}</span>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xl font-bold mb-4 font-poppins text-black">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                  {product.description}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 p-8 rounded-2xl flex gap-6 items-start">
              <div className="p-3 bg-white rounded-xl text-primary shadow-sm">
                <FiShield size={24} />
              </div>
              <div>
                <h4 className="font-bold text-black mb-1">Safety First</h4>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  Always meet in a public, well-lit place. Never send money
                  before seeing the item.
                </p>
                <Link
                  href="/safety"
                  className="text-primary text-sm font-bold hover:underline"
                >
                  Read safety guide
                </Link>
              </div>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm sticky top-32">
              <div className="mb-6">
                <span className="text-sm text-gray-400 font-bold uppercase tracking-widest block mb-1">
                  Asking Price
                </span>
                <div className="text-5xl font-black font-poppins text-black tracking-tighter">
                  {product.price}
                </div>
              </div>
              <div className="space-y-4 mb-8">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-primary w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:scale-[1.01] transition-all cursor-pointer"
                >
                  Get Item
                </button>
                <button
                  onClick={handleShare}
                  className="w-full py-4 rounded-2xl border-2 border-gray-100 bg-white text-gray-900 font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <FiShare2 size={18} />
                  Share listing
                </button>
              </div>

              <div className="pt-8 border-t border-gray-100 mt-2">
                <Link
                  href={`/user/${product.seller.id}`}
                  className="flex items-center gap-4 mb-6 group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                    {product.seller.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-black text-lg group-hover:text-primary transition-colors">
                      {product.seller.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex text-yellow-500">
                        {"★".repeat(Math.round(product.seller.rating))}
                        {"☆".repeat(5 - Math.round(product.seller.rating))}
                      </div>
                      <span className="text-sm text-gray-400 font-medium">
                        ({product.seller.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-sm py-1">
                    <span className="text-gray-400 font-medium">
                      Member Since
                    </span>
                    <span className="text-gray-900 font-bold">
                      {product.seller.joined}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm py-1">
                    <span className="text-gray-400 font-medium">
                      Verifications
                    </span>
                    <span className={`${product.seller.identityVerified ? "text-green-600" : "text-yellow-600"} font-bold`}>
                      {product.seller.identityVerified ? "Email, Phone, Identity" : "Email, Phone"}
                    </span>
                  </div>
                </div>
                <div id="contact" className="space-y-4 pt-4">
                  <h3 className="text-lg font-bold font-poppins text-black flex items-center gap-2">
                    <FiMessageCircle className="text-primary" />
                    Message Seller
                  </h3>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Is this still available?"
                    className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm min-h-[120px]"
                  />
                  <button className="btn-primary w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer">
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />

      {/* Image Preview Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-3000 flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            onClick={() => setIsLightboxOpen(false)}
          />
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer z-10"
          >
            <FiX size={32} />
          </button>

          <div className="relative w-full h-full flex flex-col items-center justify-center gap-8">
            <div className="relative max-w-5xl w-full aspect-16/10 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src={getImageUrl(product.images, activeImageIndex)}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex gap-3 p-4 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${activeImageIndex === i ? "border-primary scale-110" : "border-transparent opacity-50 hover:opacity-100"}`}
                >
                  <img
                    src={getImageUrl(img)}
                    alt={`Preview ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Get Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-2000 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative bg-white w-full max-w-xl rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer z-10"
            >
              <FiX size={24} />
            </button>

            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-50 text-primary rounded-2xl">
                  <FiShield size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-poppins text-black">
                    Safety First
                  </h2>
                  <p className="text-gray-500 font-medium">
                    Keep your purchase secure
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex gap-4 items-start">
                  <div className="mt-1 shrink-0 w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                    <FiCheck size={14} strokeWidth={3} />
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    <span className="font-bold text-black">
                      Meet in person:
                    </span>{" "}
                    Always inspect the item before paying.
                  </p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="mt-1 shrink-0 w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                    <FiCheck size={14} strokeWidth={3} />
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    <span className="font-bold text-black">Public places:</span>{" "}
                    Choose a busy location for the exchange.
                  </p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="mt-1 shrink-0 w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                    <FiCheck size={14} strokeWidth={3} />
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    <span className="font-bold text-black">No deposits:</span>{" "}
                    Never send money to hold an item.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-3 ml-1">
                    Send a message to {product.seller.name}
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full p-5 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 transition-all outline-none text-base min-h-[140px] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    Quick Templates
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {templates.map((t, i) => (
                      <button
                        key={i}
                        onClick={() => setMessage(t)}
                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-xs font-bold text-gray-700 transition-all cursor-pointer border border-gray-100"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="btn-primary w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.01] transition-all cursor-pointer shadow-lg shadow-primary/20 mt-4">
                  <FiMessageCircle size={20} />
                  Send Interest
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-3000 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-black text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <FiCheck size={12} strokeWidth={4} />
            </div>
            <span className="text-sm font-bold tracking-tight">
              Link copied to clipboard
            </span>
          </div>
        </div>
      )}
    </main>
  );
}

export default function ProductDetail({ id }: ProductDetailProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      }
    >
      <ProductDetailContent id={id} />
    </Suspense>
  );
}
