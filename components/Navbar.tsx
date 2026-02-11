"use client";

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { FiCheckCircle, FiSearch, FiBell } from 'react-icons/fi';
import { useProfile, useLogout } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
    { name: 'Electronics', icon: '📱' },
    { name: 'Vehicles', icon: '🚗' },
    { name: 'Furniture', icon: '🪑' },
    { name: 'Fashion', icon: '👕' },
    { name: 'Health & Beauty', icon: '💄' },
    { name: 'Home Appliances', icon: '🏠' },
    { name: 'Hobbies & Sports', icon: '⚽' },
    { name: 'Pets', icon: '🐾' },
];

export default function Navbar() {
    const [showMenu, setShowMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const menuRef = useRef<HTMLDivElement>(null);
    const { data: profile, isLoading } = useProfile();
    const logoutMutation = useLogout();
    const router = useRouter();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleLogout = () => {
        logoutMutation.mutate();
        setShowMenu(false);
    };

    const isLoggedIn = !!profile && !isLoading;

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
            {/* Top Bar - Optional but good for marketplace info */}
            <div className="bg-primary py-1 hidden sm:block">
                <div className="container flex justify-between text-[11px] text-white font-medium">
                    <div className="flex gap-4">
                        <Link href="/seller-center" className="hover:underline">Seller Center</Link>
                        <Link href="/help" className="hover:underline">Help & Support</Link>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="py-4 bg-white">
                <div className="container flex items-center gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center text-white">
                            <FiCheckCircle size={20} />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-primary hidden md:block uppercase">SecondChance</span>
                    </Link>

                    {/* Search Bar - Dominant */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
                        <div className="flex bg-gray-100 rounded-sm overflow-hidden border border-transparent focus-within:border-primary focus-within:bg-white transition-all">
                            <input
                                type="text"
                                placeholder="Search for items, brands, or categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2.5 bg-transparent outline-none text-sm text-gray-800"
                            />
                            <button type="submit" className="bg-primary text-white px-6 hover:bg-primary-hover transition-colors">
                                <FiSearch size={20} />
                            </button>
                        </div>
                    </form>

                    <div className='flex-1'> </div>

                    {/* Actions */}
                    <div className="flex items-center gap-5 shrink-0">
                        {isLoggedIn ? (
                            <>
                                <Link href="/user/messages" className="text-gray-500 hover:text-primary transition-colors relative">
                                    <FiBell size={22} title="Notifications" />
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full font-bold">2</span>
                                </Link>
                                <div className="relative" ref={menuRef}>
                                    <button 
                                        onClick={() => setShowMenu(!showMenu)}
                                        className="flex items-center gap-2 group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-xs overflow-hidden border border-gray-200">
                                            {profile.profile_picture ? (
                                                <img src={profile.profile_picture} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                getInitials(profile.first_name, profile.last_name)
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 hidden lg:block">{profile.first_name}</span>
                                    </button>

                                    {showMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl border border-gray-100 py-1 z-50 text-sm">
                                            <Link href="/user/profile" className="block px-4 py-2 hover:bg-gray-50">My Account</Link>
                                            <Link href="/user/listings" className="block px-4 py-2 hover:bg-gray-50">My Listings</Link>
                                            <Link href="/user/settings" className="block px-4 py-2 hover:bg-gray-50">Settings</Link>
                                            <hr className="my-1 border-gray-100" />
                                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">Log Out</button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/auth/login" className="text-sm font-bold text-gray-700 px-3 py-1.5 hover:bg-gray-50 transition-colors">Login</Link>
                                <div className="h-4 w-px bg-gray-200 mx-1" />
                                <Link href="/auth/register" className="text-sm font-bold text-gray-700 px-3 py-1.5 hover:bg-gray-50 transition-colors">Register</Link>
                            </div>
                        )}
                        <Link href="/list" className="btn-primary rounded-sm">List Item</Link>
                    </div>
                </div>
            </div>

            {/* Categories Bar */}
            <div className="border-t border-gray-50 bg-white">
                <div className="container">
                    <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2">
                        {CATEGORIES.map((cat, idx) => (
                            <Link 
                                key={idx} 
                                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                                className="flex items-center gap-1.5 text-[13px] font-medium text-gray-600 hover:text-primary whitespace-nowrap transition-colors"
                            >
                                <span>{cat.icon}</span>
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
}
