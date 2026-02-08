"use client";

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { FiMenu, FiX, FiLogOut, FiUser, FiSettings, FiCheckCircle } from 'react-icons/fi';
import { useProfile, useLogout } from '@/lib/hooks/useAuth';

export default function Navbar() {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { data: profile, isLoading } = useProfile();
    const logoutMutation = useLogout();

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get user initials for avatar placeholder
    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    // Get avatar URL (use API base URL if profile_picture is a relative path)
    const getAvatarUrl = (profilePicture?: string) => {
        return profilePicture || null;
    };

    const handleLogout = () => {
        logoutMutation.mutate();
        setShowMenu(false);
    };

    const isLoggedIn = !!profile && !isLoading;

    return (
        <nav className="h-16 flex items-center sticky top-0 z-50 border-b border-gray-100 bg-white">
            <div className="container flex justify-between items-center w-full">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2.5 group transition-transform hover:scale-[1.02]"
                >
                    <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shrink-0 transition-all">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                    </div>
                    <span className="font-poppins text-[#1A1A1A] text-lg font-bold tracking-tight">
                        Second Chance
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden lg:flex gap-8 items-center">
                    <Link
                        href="/shop"
                        className="text-sm font-medium text-gray-600 hover:text-primary transition-colors relative group"
                    >
                        Browse listings
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                    </Link>
                    <Link
                        href="/list"
                        className="text-sm font-medium text-gray-600 hover:text-primary transition-colors relative group"
                    >
                        List item
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                    </Link>
                    <Link
                        href="/about"
                        className="text-sm font-medium text-gray-600 hover:text-primary transition-colors relative group"
                    >
                        About us
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                    </Link>
                </div>

                {/* Right Side - Auth or User Menu */}
                <div className="flex items-center gap-3">
                    {isLoading ? (
                        <>
                            <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
                            <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
                        </>
                    ) : isLoggedIn && profile ? (
                        <>
                            {/* Avatar Button - Links to Profile */}
                            <Link
                                href="/user/profile"
                                className="relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden transition-transform hover:scale-105 active:scale-95"
                            >
                                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-sm">
                                    {getAvatarUrl(profile.profile_picture) ? (
                                        <img
                                            src={getAvatarUrl(profile.profile_picture)!}
                                            alt={`${profile.first_name} ${profile.last_name}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        getInitials(profile.first_name, profile.last_name)
                                    )}
                                </div>
                                {profile.identity_verified && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center border-2 border-white">
                                        <FiCheckCircle className="text-primary" size={10} />
                                    </div>
                                )}
                            </Link>

                            {/* Burger Menu Button */}
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                    aria-label="Menu"
                                >
                                    {showMenu ? (
                                        <FiX size={18} className="text-gray-800" />
                                    ) : (
                                        <FiMenu size={18} className="text-gray-800" />
                                    )}
                                </button>

                                {/* Menu Dropdown */}
                                {showMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-gray-100 py-2 z-50 transition-all duration-200">
                                        {/* User Info Header */}
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                                                    {getAvatarUrl(profile.profile_picture) ? (
                                                        <img
                                                            src={getAvatarUrl(profile.profile_picture)!}
                                                            alt={`${profile.first_name} ${profile.last_name}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        getInitials(profile.first_name, profile.last_name)
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 truncate">
                                                        {profile.first_name} {profile.last_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {profile.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-1">
                                            <Link
                                                href="/user/profile"
                                                onClick={() => setShowMenu(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 group"
                                            >
                                                <FiUser size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
                                                <span>View Profile</span>
                                            </Link>
                                            <Link
                                                href="/user/verify"
                                                onClick={() => setShowMenu(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 group"
                                            >
                                                <FiSettings size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
                                                <span>Settings</span>
                                            </Link>
                                        </div>

                                        {/* Logout */}
                                        <div className="border-t border-gray-100 mt-1 pt-1">
                                            <button
                                                onClick={handleLogout}
                                                disabled={logoutMutation.isPending}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-sm font-medium text-red-600 disabled:opacity-50 group"
                                            >
                                                <FiLogOut size={18} className="group-hover:scale-110 transition-transform" />
                                                <span>{logoutMutation.isPending ? 'Logging out...' : 'Log out'}</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/auth/login"
                                className="hidden sm:block text-sm font-bold text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/auth/register"
                                className="btn-primary py-2.5 px-5 text-sm font-bold"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
