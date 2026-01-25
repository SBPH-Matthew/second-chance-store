import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Shop() {
    const allProducts = [
        {
            id: '1',
            title: 'Tesla Model 3 Performance',
            price: '$35,000',
            location: 'Tokyo, Japan',
            imageUrl: '/listing_vehicle_tesla_1769261698522.png'
        },
        {
            id: '2',
            title: 'Modern L-Shaped Sofa',
            price: '$450',
            location: 'Osaka, Japan',
            imageUrl: '/listing_furniture_sofa_1769261712567.png'
        },
        {
            id: '3',
            title: 'RTX 4090 Gaming Laptop',
            price: '$1,200',
            location: 'Kyoto, Japan',
            imageUrl: '/listing_electronics_laptop_gaming_1769261730700.png'
        },
        {
            id: '4',
            title: 'Limited Edition Neon Sneakers',
            price: 'Free',
            location: 'Yokohama, Japan',
            imageUrl: '/listing_fashion_sneakers_1769261743924.png',
            isFree: true
        },
        {
            id: '5',
            title: 'Vintage Film Camera',
            price: '$150',
            location: 'Sapporo, Japan',
            imageUrl: '/listing_electronics_laptop_gaming_1769261730700.png'
        },
        {
            id: '6',
            title: 'Minimalist Dining Table',
            price: '$200',
            location: 'Fukuoka, Japan',
            imageUrl: '/listing_furniture_sofa_1769261712567.png'
        },
    ];

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Mini Hero Header */}
            <section className="bg-bg-light-blue py-16 border-b border-gray-100">
                <div className="container">
                    <div className="max-w-2xl">
                        <span className="uppercase text-sm tracking-widest font-bold text-primary block mb-3">Community Marketplace</span>
                        <h1 className="text-5xl font-bold font-poppins text-black mb-6 tracking-tight">Explore All Listings</h1>
                        <p className="text-gray-600 text-lg leading-relaxed text-balance">
                            Find exactly what you're looking for. From daily essentials to unique treasures, everything is curated by your neighborhood.
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
                                <h2 className="text-xl font-bold font-poppins text-black">Filters</h2>
                                <button className="text-sm font-semibold text-primary">Reset</button>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-[11px] font-bold mb-5">Categories</h3>
                                <div className="space-y-3">
                                    {['All Categories', 'Vehicles', 'Electronics', 'Furniture', 'Fashion', 'Real Estate', 'Hobbies'].map(cat => (
                                        <label key={cat} className="flex items-center gap-3 text-[15px] font-medium cursor-pointer group">
                                            <input type="checkbox" className="w-5 h-5 rounded border-gray-300 accent-black focus:ring-black cursor-pointer" />
                                            <span className="text-gray-700">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8 border-t border-gray-100 pt-8">
                                <h3 className="text-[11px] font-bold mb-5">Price Range</h3>
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                        <input type="number" placeholder="Min" className="w-full pl-7 pr-3 py-2.5 text-sm rounded-lg border border-gray-200 outline-none" />
                                    </div>
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                        <input type="number" placeholder="Max" className="w-full pl-7 pr-3 py-2.5 text-sm rounded-lg border border-gray-200 outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-10 border-t border-gray-100 pt-8">
                                <h3 className="text-[11px] font-bold mb-5">Condition</h3>
                                <div className="space-y-3">
                                    {['New', 'Like New', 'Good', 'Fair'].map(cond => (
                                        <label key={cond} className="flex items-center gap-3 text-[15px] font-medium cursor-pointer group">
                                            <input type="checkbox" className="w-5 h-5 rounded border-gray-300 accent-black focus:ring-black cursor-pointer" />
                                            <span className="text-gray-700">{cond}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button className="btn-primary rounded-full w-full ">
                                Update Search
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 pb-6 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-500 font-medium">Showing <span className="text-black font-bold">12</span> results</span>
                            </div>
                            <div className="flex gap-4 items-center">
                                <span className="text-sm text-gray-400 font-bold uppercase tracking-tight">Sort by</span>
                                <select className="pl-4 pr-10 py-2.5 text-sm rounded-xl border border-gray-200 bg-white outline-none font-bold text-gray-700 cursor-pointer">
                                    <option>Newest First</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...allProducts, ...allProducts].map((product, i) => (
                                <div key={i}>
                                    <ProductCard {...product} disableHover={true} />
                                </div>
                            ))}
                        </div>

                        {/* Pagination Placeholder */}
                        <div className="mt-20 flex justify-center items-center gap-3">
                            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer text-gray-500">
                                <FiChevronLeft size={20} />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center cursor-pointer">1</button>
                            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center font-bold hover:bg-gray-50 transition-colors cursor-pointer">2</button>
                            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center font-bold hover:bg-gray-50 transition-colors cursor-pointer">3</button>
                            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer text-gray-500">
                                <FiChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <Footer showCTA={false} />
        </main>
    );
}
