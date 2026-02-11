"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { FiChevronRight, FiFilter, FiChevronDown, FiAward } from "react-icons/fi";
import { useListings, useCategories, useProductConditions } from "@/lib/hooks/useListings";

export default function Shop() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [selectedConditionIds, setSelectedConditionIds] = useState<number[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sort, setSort] = useState<string>("newest");

  const limit = 20; // Increased limit for density

  const filters = useMemo(() => ({
    category_ids: selectedCategoryIds,
    condition_ids: selectedConditionIds,
    min_price: minPrice ? Number.parseFloat(minPrice) : undefined,
    max_price: maxPrice ? Number.parseFloat(maxPrice) : undefined,
    sort: sort,
  }), [selectedCategoryIds, selectedConditionIds, minPrice, maxPrice, sort]);

  const { data, isLoading } = useListings(page, limit, search, filters);
  const { data: categories = [] } = useCategories();
  const { data: conditions = [] } = useProductConditions();

  const listings = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const toggleCategory = (id: number) => {
    setSelectedCategoryIds(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
    setPage(1);
  };

  const toggleCondition = (id: number) => {
    setSelectedConditionIds(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
    setPage(1);
  };

  const handleReset = () => {
    setSelectedCategoryIds([]);
    setSelectedConditionIds([]);
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
    setSort("newest");
    setPage(1);
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `$${price.toLocaleString()}`;
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <Navbar />

      <div className="container py-6">
        {/* Breadcrumb / Top Bar */}
        <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <FiChevronRight size={12} />
          <span className="text-gray-900 font-medium">Marketplace</span>
          {selectedCategoryIds.length > 0 && (
            <>
              <FiChevronRight size={12} />
              <span className="text-primary font-medium">Multiple Categories</span>
            </>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters - More compact */}
          <aside className="w-full lg:w-[240px] shrink-0">
            <div className="space-y-6">
              {/* Filter Header */}
              <div className="flex items-center gap-2 text-[14px] font-bold text-gray-800 uppercase mb-4">
                <FiFilter className="text-primary" />
                <span>Filters</span>
                { (selectedCategoryIds.length > 0 || selectedConditionIds.length > 0 || minPrice || maxPrice) && (
                   <button onClick={handleReset} className="ml-auto text-[11px] text-primary capitalize font-normal hover:underline">Clear all</button>
                )}
              </div>

              {/* Category Filter */}
              <div className="bg-white p-4 shadow-sm rounded-sm">
                <h3 className="text-[13px] font-bold mb-4 flex items-center justify-between cursor-pointer group">
                  Categories
                  <FiChevronDown size={14} className="text-gray-400 group-hover:text-gray-600" />
                </h3>
                <div className="space-y-2 max-h-[200px] overflow-y-auto no-scrollbar">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2.5 text-[13px] text-gray-600 cursor-pointer hover:text-primary group">
                      <input
                        type="checkbox"
                        checked={selectedCategoryIds.includes(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                        className="w-4 h-4 rounded border-gray-300 accent-primary cursor-pointer"
                      />
                      <span className={selectedCategoryIds.includes(cat.id) ? 'text-primary font-bold' : ''}>
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="bg-white p-4 shadow-sm rounded-sm">
                <h3 className="text-[13px] font-bold mb-4 flex items-center justify-between">
                  Price Range
                  <FiChevronDown size={14} className="text-gray-400" />
                </h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                      className="w-full px-3 py-1.5 text-[12px] bg-gray-50 border border-gray-200 focus:border-primary outline-none rounded-sm transition-colors"
                    />
                    <span className="text-gray-300">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                      className="w-full px-3 py-1.5 text-[12px] bg-gray-50 border border-gray-200 focus:border-primary outline-none rounded-sm transition-colors"
                    />
                  </div>
                  <button onClick={() => setPage(1)} className="btn-primary w-full py-1.5 text-[11px] mt-2 uppercase">Apply</button>
                </div>
              </div>

              {/* Condition Filter */}
              <div className="bg-white p-4 shadow-sm rounded-sm">
                <h3 className="text-[13px] font-bold mb-4 flex items-center justify-between">
                  Condition
                  <FiChevronDown size={14} className="text-gray-400" />
                </h3>
                <div className="space-y-2">
                  {conditions.map((cond) => (
                    <label key={cond.id} className="flex items-center gap-2.5 text-[13px] text-gray-600 cursor-pointer hover:text-primary group">
                      <input
                        type="checkbox"
                        checked={selectedConditionIds.includes(cond.id)}
                        onChange={() => toggleCondition(cond.id)}
                        className="w-4 h-4 rounded border-gray-300 accent-primary cursor-pointer"
                      />
                      <span className={selectedConditionIds.includes(cond.id) ? 'text-primary font-bold' : ''}>
                        {cond.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Safety Tip Banner */}
              <div className="bg-blue-600 p-4 shadow-sm rounded-sm text-white relative overflow-hidden">
                 <div className="absolute -right-2 -bottom-2 opacity-10">
                    <FiAward size={80} />
                 </div>
                 <h4 className="text-[14px] text-white font-bold mb-1">Trading Safely</h4>
                 <p className="text-[11px] opacity-90 mb-3 leading-relaxed">Always meet in public places and inspect items carefully before payment.</p>
                 <Link href="/resources" className="text-[11px] font-bold underline">LEARN MORE</Link>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Sorting & Stats Top Bar */}
            <div className="bg-white p-4 shadow-sm rounded-sm flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
              <div className="text-[14px] text-gray-600">
                Found <span className="font-bold text-gray-900">{total}</span> items
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[13px] text-gray-500">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="bg-gray-50 border-none text-[13px] font-bold text-gray-800 focus:ring-0 cursor-pointer"
                >
                  <option value="newest">Latest listings</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {Array.from({ length: limit }, (_, i) => i).map((i) => (
                  <div key={`skeleton-${i}`} className="animate-pulse bg-white aspect-[4/5] rounded-sm shadow-sm" />
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {listings.map((item: any) => (
                    <ProductCard
                      key={`${item.item_type}-${item.id}`}
                      id={String(item.id)}
                      type={item.item_type}
                      title={item.name}
                      price={formatPrice(item.price)}
                      location={item.location}
                      imageUrl={Array.isArray(item.images) ? item.images[0] : item.images}
                      isFree={item.price === 0}
                    />
                ))}
              </div>
            ) : (
              <div className="bg-white text-center py-20 rounded-sm shadow-sm border border-transparent">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-gray-500 font-medium">No results found for your filters.</p>
                <button
                  onClick={handleReset}
                  className="mt-6 text-primary font-bold border border-primary px-6 py-2 rounded-sm hover:bg-primary hover:text-white transition-all text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Modern Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white text-[13px] font-medium border border-gray-200 rounded-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Prev
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                    const isActive = page === pageNumber;
                    const buttonStyles = isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                      : "bg-white border border-gray-200 hover:border-primary text-gray-600";
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`w-9 h-9 rounded-sm flex items-center justify-center text-[13px] font-bold transition-all ${buttonStyles}`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white text-[13px] font-medium border border-gray-200 rounded-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Next
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

import Link from "next/link";

