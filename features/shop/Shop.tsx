"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";
import { useListings } from "@/lib/hooks/useListings";

export default function Shop() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const limit = 12;

  const { data, isLoading } = useListings(page, limit, search);

  const listings = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const getImageUrl = (images: any) => {
    if (!images || images.length === 0) return "/listing_furniture_sofa_1769261712567.png";
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

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Mini Hero Header */}
      <section className="bg-bg-light-blue py-16 border-b border-gray-100">
        <div className="container">
          <div className="max-w-2xl">
            <span className="uppercase text-sm tracking-widest font-bold text-primary block mb-3">
              Community Marketplace
            </span>
            <h1 className="text-5xl font-bold font-poppins text-black mb-6 tracking-tight">
              Explore All Listings
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed text-balance">
              Find exactly what you're looking for. From daily essentials to
              unique treasures, everything is curated by your neighborhood.
            </p>
          </div>
        </div>
      </section>

      <div className="container py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 sticky top-32 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold font-poppins text-black">
                  Filters
                </h2>
                <button className="text-sm font-semibold text-primary">
                  Reset
                </button>
              </div>

              <div className="mb-8">
                <h3 className="text-[11px] font-bold mb-5">Categories</h3>
                <div className="space-y-3">
                  {[
                    "All Categories",
                    "Vehicles",
                    "Electronics",
                    "Furniture",
                    "Fashion",
                    "Real Estate",
                    "Hobbies",
                  ].map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-3 text-[15px] font-medium cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-gray-300 accent-black focus:ring-black cursor-pointer"
                      />
                      <span className="text-gray-700">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-8 border-t border-gray-100 pt-8">
                <h3 className="text-[11px] font-bold mb-5">Price Range</h3>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full pl-7 pr-3 py-2.5 text-sm rounded-lg border border-gray-200 outline-none"
                    />
                  </div>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full pl-7 pr-3 py-2.5 text-sm rounded-lg border border-gray-200 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-10 border-t border-gray-100 pt-8">
                <h3 className="text-[11px] font-bold mb-5">Condition</h3>
                <div className="space-y-3">
                  {["New", "Like New", "Good", "Fair"].map((cond) => (
                    <label
                      key={cond}
                      className="flex items-center gap-3 text-[15px] font-medium cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-gray-300 accent-black focus:ring-black cursor-pointer"
                      />
                      <span className="text-gray-700">{cond}</span>
                    </label>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSearch} className="mb-10 border-t border-gray-100 pt-8">
                <h3 className="text-[11px] font-bold mb-5">Search keyword</h3>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search listings..."
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-gray-200 outline-none focus:border-primary transition-colors"
                  />
                </div>
                <button type="submit" className="btn-primary rounded-full w-full mt-6">
                  Update Search
                </button>
              </form>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 font-medium">
                  Showing <span className="text-black font-bold">{listings.length}</span>{" "}
                  of <span className="text-black font-bold">{total}</span> results
                </span>
              </div>
              <div className="flex gap-4 items-center">
                <span className="text-sm text-gray-400 font-bold uppercase tracking-tight">
                  Sort by
                </span>
                <select className="pl-4 pr-10 py-2.5 text-sm rounded-xl border border-gray-200 bg-white outline-none font-bold text-gray-700 cursor-pointer">
                  <option>Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-100 aspect-square rounded-2xl" />
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {listings.map((item: any) => (
                  <div key={`${item.item_type}-${item.id}`}>
                    <ProductCard
                      id={String(item.id)}
                      title={item.name}
                      price={formatPrice(item.price)}
                      location={item.location}
                      imageUrl={getImageUrl(item.images)}
                      isFree={item.price === 0}
                      disableHover={true}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">No listings found matching your search.</p>
                <button
                  onClick={() => { setSearch(""); setSearchInput(""); }}
                  className="mt-4 text-primary font-bold hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}

            {/* Pagination Placeholder */}
            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-3">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft size={20} />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-full font-bold flex items-center justify-center cursor-pointer transition-colors ${page === i + 1
                      ? "bg-primary text-white"
                      : "border border-gray-200 hover:bg-gray-50"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer showCTA={false} />
    </main>
  );
}
