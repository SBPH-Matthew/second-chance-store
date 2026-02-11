"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { useListings } from '@/lib/hooks/useListings';
import { FiChevronRight, FiZap, FiGift, FiAward } from 'react-icons/fi';

const CATEGORY_SHORTCUTS = [
    { name: 'Phones', icon: '📱', color: 'bg-blue-50' },
    { name: 'Laptops', icon: '💻', color: 'bg-purple-50' },
    { name: 'Cars', icon: '🚗', color: 'bg-green-50' },
    { name: 'Sofas', icon: '🛋️', color: 'bg-orange-50' },
    { name: 'Sneakers', icon: '👟', color: 'bg-red-50' },
    { name: 'Watches', icon: '⌚', color: 'bg-cyan-50' },
    { name: 'Beauty', icon: '💄', color: 'bg-pink-50' },
    { name: 'Sports', icon: '⚽', color: 'bg-emerald-50' },
    { name: 'Games', icon: '🎮', color: 'bg-indigo-50' },
    { name: 'Camera', icon: '📷', color: 'bg-yellow-50' },
];

export default function Home() {
    const { data: recentData } = useListings(1, 6, '', { sort: 'newest' });
    const { data: boostedData } = useListings(1, 6, '', { sort: 'price_desc' }); // Using price_desc as a proxy for premium/boosted

    return (
        <main className="min-h-screen bg-bg-base">
            <Navbar />

            <div className="container py-6 space-y-8">
                {/* Community Mission Hero */}
                <section className="relative h-[300px] md:h-[450px] bg-gray-900 overflow-hidden rounded-sm">
                    <img 
                        src="/marketplace_hero_1769261680432.png" 
                        className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700" 
                        alt="Join our community"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white">
                        <div className="mb-4 inline-block bg-primary px-3 py-1 rounded-sm text-[11px] font-bold tracking-widest uppercase">
                            Your Local Neighborhood Marketplace
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                            GIVE YOUR ITEMS A <br />
                            <span className="text-primary italic underline decoration-white/20">SECOND CHANCE</span>
                        </h1>
                        <p className="text-base md:text-lg opacity-80 mb-10 max-w-2xl font-medium text-balance">
                            Join thousands of neighbors buying, selling, and gifting items every day. 
                            It's simple, sustainable, and 100% community-driven.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                            <Link href="/shop" className="flex-1 bg-white text-gray-900 py-4 rounded-sm font-bold text-[15px] hover:bg-gray-100 shadow-2xl transition-all">
                                BROWSE MARKETPLACE
                            </Link>
                            <Link href="/list" className="flex-1 bg-primary text-white py-4 rounded-sm font-bold text-[15px] hover:scale-105 shadow-2xl transition-all">
                                LIST AN ITEM FREE
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Core Benefits Rail */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-100 pb-8">
                    <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <FiAward size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-[15px] mb-1">Verified Community</h3>
                            <p className="text-[13px] text-gray-500 leading-relaxed">Trade with confidence with our verified buyer and seller system.</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                            <FiGift size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-[15px] mb-1">Gift for Free</h3>
                            <p className="text-[13px] text-gray-500 leading-relaxed">Help your neighbors by listing items for free in our gifting section.</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                            <FiZap size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-[15px] mb-1">Instant Messaging</h3>
                            <p className="text-[13px] text-gray-500 leading-relaxed">Connect instantly with local neighbors to coordinate pick-ups.</p>
                        </div>
                    </div>
                </section>

                {/* Category Shortcuts */}
                <section className="bg-white p-6 shadow-sm rounded-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="section-title mb-0">Browse Categories</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-4">
                        {CATEGORY_SHORTCUTS.map((cat, idx) => (
                            <Link 
                                key={cat.name} 
                                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                                className="flex flex-col items-center gap-3 p-3 hover:bg-gray-50 transition-colors group"
                            >
                                <div className={`w-14 h-14 ${cat.color} rounded-md flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                                    {cat.icon}
                                </div>
                                <span className="text-[12px] font-medium text-gray-700 text-center">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Horizontal Rail: Trending (Boosted) */}
                <section className="bg-white rounded-sm shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-primary/5">
                        <div className="flex items-center gap-2 text-gray-800">
                            <FiAward className="text-primary" />
                            <h2 className="text-[16px] font-bold uppercase">Featured Items</h2>
                        </div>
                        <Link href="/shop" className="text-[13px] text-primary font-medium flex items-center gap-1 hover:underline">
                            See More <FiChevronRight />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-l border-gray-100">
                        {boostedData?.items?.map((item: any, index: number) => (
                             <div key={`${item.id}-${index}`} className="border-r border-b border-gray-100">
                                <ProductCard 
                                    id={String(item.id)}
                                    title={item.name}
                                    price={`$${item.price}`}
                                    location={item.location}
                                    imageUrl={Array.isArray(item.images) ? item.images[0] : item.images}
                                    type={item.item_type}
                                />
                             </div>
                        ))}
                    </div>
                </section>

                {/* Main Content Grid: Just For You */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <FiAward className="text-primary" />
                            <h2 className="section-title mb-0 text-gray-800">Just For You</h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {recentData?.items?.map((item: any, index: number) => (
                            <ProductCard 
                                key={`${item.id}-${index}`}
                                id={String(item.id)}
                                title={item.name}
                                price={`$${item.price}`}
                                location={item.location}
                                imageUrl={Array.isArray(item.images) ? item.images[0] : item.images}
                                type={item.item_type}
                            />
                        ))}
                    </div>
                    <div className="mt-8 flex justify-center">
                        <Link href="/shop" className="bg-white border border-gray-200 text-gray-600 px-12 py-3 rounded-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                            See More
                        </Link>
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    );
}

