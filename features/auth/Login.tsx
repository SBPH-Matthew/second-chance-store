"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiEye, FiEyeOff, FiChevronLeft } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Login logic
    };

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden">
            {/* Left Section: Branding & Content */}
            <div className="w-full lg:w-1/2 bg-[#E8F1F9] p-8 lg:p-12 flex flex-col justify-between">
                {/* Back Link */}
                <Link href="/" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors mb-4 group w-fit">
                    <FiChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to home
                </Link>

                {/* Logo */}
                <div className="flex items-center gap-2 mb-12">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                    </div>
                    <span className="text-xl font-bold font-poppins text-[#1A1A1A]">Second Chance</span>
                </div>

                <div className="flex-1 flex flex-col justify-center max-w-2xl py-4">
                    <h1 className="text-4xl font-bold font-poppins text-[#1A1A1A] leading-tight mb-4">
                        Welcome back to the community.
                    </h1>
                    <p className="text-gray-500 text-base mb-6 leading-relaxed font-medium">
                        Continue your sustainable journey by finding more community treasures and connecting with verified members.
                    </p>

                    {/* Featured Image */}
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6 border border-blue-200/50">
                        <img
                            src="/listing_vehicle_tesla_1769261698522.png"
                            alt="Tesla Interior/Exterior"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Testimonial Card */}
                    <div className="bg-white p-6 rounded-2xl border border-white/50">
                        <p className="text-[#1A1A1A] italic font-medium mb-4 leading-relaxed">
                            "Finding high-quality pre-owned items has never been easier. The security and verification steps make every deal feel solid."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-primary">MC</div>
                            <div>
                                <h4 className="text-sm font-bold text-[#1A1A1A]">Marcus Chen</h4>
                                <p className="text-xs text-gray-400 font-medium">Frequent Buyer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section: Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16">
                <div className="w-full max-w-[440px]">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1 font-poppins tracking-tight">Login to account</h2>
                        <p className="text-gray-400 text-xs font-medium">Glad to see you again!</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-[#4B4B4B] ml-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="jane@example.com"
                                className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-100 focus:border-primary transition-all outline-none text-black font-medium text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-bold text-[#4B4B4B]">Password</label>
                                <button type="button" className="text-xs font-bold text-primary hover:underline transition-all">Forgot?</button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-100 focus:border-primary transition-all outline-none text-black font-medium text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                                >
                                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-base hover:bg-primary-hover transition-all mt-4 active:scale-[0.98]"
                        >
                            Log In
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase font-black tracking-widest text-gray-300">
                            <span className="bg-white px-4">Or sign in with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm text-[#1A1A1A]">
                            <FcGoogle size={20} />
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm text-[#1A1A1A]">
                            <FaFacebook size={20} className="text-[#1877F2]" />
                            Facebook
                        </button>
                    </div>

                    <div className="mt-8 text-center text-sm font-medium text-gray-400">
                        New to Second Chance? <Link href="/auth/register" className="text-primary font-bold hover:underline">Create an account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
