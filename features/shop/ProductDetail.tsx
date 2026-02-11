"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FiHeart,
  FiX,
} from "react-icons/fi";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useListingDetails } from "@/lib/hooks/useListings";

interface ProductDetailProps {
  id: string;
}

function ProductDetailContent({ id }: Readonly<ProductDetailProps>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [message, setMessage] = useState("");
  const itemType = searchParams.get("type") || undefined;
  const { data: item, isLoading, error } = useListingDetails(id, itemType);

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

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen || !item?.images) return;

      const images = Array.isArray(item.images) && item.images.length > 0 ? item.images : ["/listing_furniture_sofa_1769261712567.png"];

      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, item?.images]);

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
    <main className="min-h-screen bg-white text-[#111827] font-sans selection:bg-primary/10">
      <Navbar />

      <div className="max-w-[1240px] mx-auto px-4 py-6">
        {/* Breadcrumb - Minimalist */}
        <nav className="flex items-center gap-2 text-[13px] text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <span className="text-gray-300">/</span>
          <span className="truncate max-w-[200px]">{product.title}</span>
        </nav>

        {/* Primary Grid: High Information Density */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Gallery Stack (5/12) */}
          <div className="lg:col-span-5 space-y-4">
            <div 
              role="button"
              tabIndex={0}
              className="aspect-square bg-white border border-[#E5E7EB] overflow-hidden cursor-zoom-in group/main focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => setIsLightboxOpen(true)}
              onKeyDown={(e) => e.key === 'Enter' && setIsLightboxOpen(true)}
              aria-label="View large image"
            >
              <img
                src={getImageUrl(product.images, activeImageIndex)}
                alt={product.title}
                className="w-full h-full object-contain transition-transform duration-500 group-hover/main:scale-[1.02]"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((img: any, i: number) => (
                  <button
                    key={`thumb-${i}`}
                    onClick={() => setActiveImageIndex(i)}
                    className={`aspect-square border transition-all ${
                      activeImageIndex === i 
                        ? "border-primary ring-1 ring-primary" 
                        : "border-[#E5E7EB] hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`Thumb ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Stack (7/12) */}
          <div className="lg:col-span-7 flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-[#111827] mb-2 leading-tight">
              {product.title}
            </h1>
            
            {/* Status Summary */}
            <div className="flex items-center gap-4 mb-6">
              <div className="text-[13px] text-gray-500 font-medium">
                {product.seller.reviews} Reviews
              </div>
              <div className="h-4 w-[1px] bg-gray-200" />
              <div className="text-[13px] text-gray-500">
                <span className="font-semibold text-gray-700">{product.posted}</span>
              </div>
            </div>

            {/* Pricing Section - Clean, No Fluff */}
            <div className="mb-8">
              <div className="text-4xl font-bold text-[#111827] tracking-tight">
                {product.price}
              </div>
            </div>

            {/* SKU / Attribute Selectors (Standardized Chips) */}
            <div className="space-y-6 mb-10 pt-6 border-t border-[#E5E7EB]">
              <div className="space-y-3">
                <span className="text-[12px] font-bold uppercase text-gray-400 tracking-wider">Condition</span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-sm text-[13px] font-medium text-gray-700">
                    {product.condition}
                  </span>
                </div>
              </div>

              {/* Functional Attributes - Placeholder for standardized inventory */}
              <div className="space-y-3">
                <span className="text-[12px] font-bold uppercase text-gray-400 tracking-wider">Availability</span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-1.5 bg-green-50 text-green-700 border border-green-100 rounded-sm text-[13px] font-bold">
                    Available
                  </span>
                </div>
              </div>
            </div>

            {/* Action Group: C2C Direct Communication */}
            <div className="flex gap-3 mb-10 pt-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex-1 bg-[#111827] text-white h-14 rounded-sm font-bold text-[16px] flex items-center justify-center gap-2 hover:bg-gray-800 active:scale-[0.98] transition-all"
              >
                Contact Seller
              </button>
              <button 
                className="px-5 h-14 border border-[#E5E7EB] rounded-sm text-[#111827] hover:bg-gray-50 flex items-center justify-center transition-all"
                title="Save for later"
              >
                <FiHeart size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Modular Sections (Below Fold) */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-[#E5E7EB]">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Description Block */}
            <section id="description" className="space-y-4">
              <h3 className="text-[14px] font-bold uppercase text-gray-400 tracking-widest pb-2 border-b border-[#E5E7EB]">
                Product Description
              </h3>
              <div className="text-[15px] leading-relaxed text-[#111827] whitespace-pre-line max-w-none prose prose-slate">
                {product.description}
              </div>
            </section>

            {/* Product Specifications Table */}
            <section id="specifications" className="space-y-4">
              <h3 className="text-[14px] font-bold uppercase text-gray-400 tracking-widest pb-2 border-b border-[#E5E7EB]">
                Technical Specifications
              </h3>
              <div className="border border-[#E5E7EB] rounded-sm overflow-hidden">
                <table className="w-full text-left text-[14px]">
                  <tbody>
                    {(item.item_type === 'vehicle' ? [
                      { label: 'Make', value: (item as any).vehicle_make || (item as any).vehicleMake },
                      { label: 'Model', value: (item as any).vehicle_model || (item as any).vehicleModel },
                      { label: 'Year', value: (item as any).year },
                      { label: 'Type', value: (item as any).vehicle_type?.name || (item as any).vehicleType },
                      { label: 'Location', value: product.location }
                    ] : [
                      { label: 'Condition', value: product.condition },
                      { label: 'Location', value: product.location },
                      { label: 'Listing ID', value: id }
                    ]).map((spec, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <th className="px-6 py-4 font-bold text-gray-500 w-1/3 border-r border-[#E5E7EB]">{spec.label}</th>
                        <td className="px-6 py-4 text-gray-900 font-medium">{spec.value || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Seller Reviews Section */}
            <section id="reviews" className="space-y-6">
              <h3 className="text-[14px] font-bold uppercase text-gray-400 tracking-widest pb-2 border-b border-[#E5E7EB]">
                Seller Feedback
              </h3>
              <div className="space-y-8">
                {[1, 2].map((i) => (
                  <div key={i} className="pb-8 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-1 text-[12px] text-yellow-400 mb-2">
                       ★ ★ ★ ★ {i === 2 ? "☆" : "★"}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[14px] font-bold text-gray-900">User_{Math.random().toString(36).substring(7).toUpperCase()}</span>
                      <span className="text-[12px] text-gray-400">• Published {i} month{i > 1 ? 's' : ''} ago</span>
                    </div>
                    <p className="text-[14px] text-gray-600 leading-relaxed italic">
                      "Reliable seller. The transaction was smooth and communication was very clear throughout the process."
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            {/* Seller Profile Card */}
            <div className="border border-[#E5E7EB] p-6 rounded-sm space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-400">
                  {product.seller.avatar}
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-[#111827]">{product.seller.name}</h4>
                  <p className="text-[12px] text-gray-400">Member since {product.seller.joined}</p>
                </div>
              </div>
              
              <div className="pt-4 space-y-3">
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Seller Perfomance</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-bold text-gray-900">{product.seller.rating}</span>
                    <span className="text-gray-400 ml-1">({product.seller.reviews})</span>
                  </div>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Identity Status</span>
                  <span className="font-bold text-green-600">Verified</span>
                </div>
              </div>

              <div className="pt-4">
                <Link 
                  href={`/user/${product.seller.id}`}
                  className="block w-full text-center py-2.5 bg-white border border-[#E5E7EB] rounded-sm text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Visit Store
                </Link>
              </div>
            </div>

            {/* Quick Summary / ID */}
            <div className="bg-gray-50 p-6 rounded-sm">
              <span className="text-[11px] font-black uppercase text-gray-400 tracking-tighter">Listing Information</span>
              <div className="mt-2 space-y-1 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium text-gray-900 capitalize">{item.item_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Category:</span>
                  <span className="font-medium text-gray-900">{(item as any).category?.name || 'General'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Basic Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            role="presentation"
            className="absolute inset-0 bg-black/95 cursor-zoom-out" 
            onClick={() => setIsLightboxOpen(false)} 
          />
          <button 
            onClick={() => setIsLightboxOpen(false)} 
            className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-[70]"
            aria-label="Close preview"
          >
            <FiX size={32} />
          </button>
          <img
            src={getImageUrl(product.images, activeImageIndex)}
            alt={product.title}
            className="relative z-10 max-w-full max-h-[80vh] object-contain"
          />
        </div>
      )}

      {/* Interaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#111827]/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white w-full max-w-md p-8 rounded-sm shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Contact {product.seller.name}</h2>
            <p className="text-[14px] text-gray-500 mb-6">Send a direct message to inquire about this listing.</p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="message-templates" className="block text-[11px] font-bold uppercase text-gray-400 mb-2 tracking-wider">Quick Templates</label>
                <div id="message-templates" className="flex flex-wrap gap-2">
                  {[
                    "Is this still available?",
                    "What is the best price for this?",
                    "When can I pick this up?",
                    "Can you provide more details?"
                  ].map((temp, i) => (
                    <button 
                      key={`msg-temp-${i}`}
                      onClick={() => setMessage(temp)}
                      className="px-3 py-1.5 border border-[#E5E7EB] hover:bg-gray-50 rounded-sm text-[12px] font-medium transition-colors"
                    >
                      {temp}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="seller-message" className="block text-[11px] font-bold uppercase text-gray-400 mb-2 tracking-wider">Your Message</label>
                <textarea
                  id="seller-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tape your message here..."
                  className="w-full p-4 border border-[#E5E7EB] rounded-sm text-[14px] min-h-[120px] mb-2 focus:ring-1 focus:ring-primary outline-none resize-none"
                />
              </div>

              <button className="w-full bg-primary text-white py-4 rounded-sm font-bold hover:brightness-110 active:scale-[0.99] transition-all">
                Send Message
              </button>
            </div>
            
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors">
              <FiX size={20} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function ProductDetail({ id }: ProductDetailProps) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><div className="w-10 h-10 border-2 border-gray-100 border-t-primary rounded-full animate-spin" /></div>}>
      <ProductDetailContent id={id} />
    </Suspense>
  );
}
