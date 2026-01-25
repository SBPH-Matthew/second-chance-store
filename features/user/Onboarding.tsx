"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    FiCamera, FiCheck, FiChevronRight, FiChevronLeft, FiArrowRight, FiUser
} from 'react-icons/fi';

export default function Onboarding() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        phone: '',
        bio: '',
        country: 'Philippines',
        city: '',
        street_address: '',
        state_province: '',
        postal_code: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden font-inter">
            {/* Left Section: Context & Illustration */}
            <div className="w-full lg:w-1/2 bg-[#E8F1F9] p-8 lg:p-12 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-12">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                    </div>
                    <span className="text-xl font-bold font-poppins text-[#1A1A1A]">Second Chance</span>
                </div>

                <div className="flex-1 flex flex-col justify-center max-w-2xl">
                    <h1 className="text-3xl font-bold font-poppins text-[#1A1A1A] leading-tight mb-4">
                        Verify your identity to start selling.
                    </h1>
                    <p className="text-gray-500 text-base mb-6 leading-relaxed font-medium">
                        We use identity verification to keep Second Chance safe for everyone. Your information is encrypted and only used to confirm you are a real person.
                    </p>

                    <div className="space-y-4 mb-8">
                        {[
                            "Confirm your contact number and home address",
                            "Get approved and start listing items or vehicles"
                        ].map((step, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <span className="w-6 h-6 flex items-center justify-center text-primary font-bold text-sm bg-white rounded-full shrink-0 border border-primary/10">
                                    {i + 1}
                                </span>
                                <span className="text-[#1A1A1A] font-medium">{step}</span>
                            </div>
                        ))}
                    </div>

                    <div className="relative w-full rounded-2xl overflow-hidden bg-white/50 p-4 border border-white">
                        <img
                            src="/marketplace_hero_1769261680432.png"
                            alt="Identity Verification Concept"
                            className="w-full h-auto rounded-xl opacity-80"
                        />
                    </div>

                    <p className="mt-8 text-gray-400 text-xs leading-relaxed max-w-sm">
                        Most verifications are approved within a few minutes. In some cases, manual review may take up to 24 hours.
                    </p>
                </div>
            </div>

            {/* Right Section: Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12 overflow-y-auto border-l border-gray-100">
                <div className="w-full max-w-[600px] bg-white border border-gray-100 rounded-[32px] p-10">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2 font-poppins">Identity verification</h2>
                            <p className="text-gray-400 font-medium text-sm">Update your contact details so buyers and sellers can trust who they are dealing with.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Section Header */}
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-gray-300 mb-6">Contact & Address</p>
                            <div className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-[#4B4B4B] ml-1">Contact number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+63 917 000 0000"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-100 focus:border-primary focus:ring-0 transition-all outline-none text-black font-medium text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-[#4B4B4B] ml-1">Country/Region</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-transparent text-gray-400 font-medium"
                                            disabled
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-[#4B4B4B] ml-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="Manila"
                                            className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-100 focus:border-primary focus:ring-0 transition-all outline-none text-black font-medium text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-[#4B4B4B] ml-1">Street address</label>
                                    <input
                                        type="text"
                                        name="street_address"
                                        value={formData.street_address}
                                        onChange={handleChange}
                                        placeholder="123 Street Name, Brgy. Name"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-100 focus:border-primary focus:ring-0 transition-all outline-none text-black font-medium text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-[#4B4B4B] ml-1">State / Province</label>
                                        <input
                                            type="text"
                                            name="state_province"
                                            value={formData.state_province}
                                            onChange={handleChange}
                                            placeholder="Metro Manila"
                                            className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-100 focus:border-primary focus:ring-0 transition-all outline-none text-black font-medium text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-[#4B4B4B] ml-1">Postal code</label>
                                        <input
                                            type="text"
                                            name="postal_code"
                                            value={formData.postal_code}
                                            onChange={handleChange}
                                            placeholder="1000"
                                            className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-100 focus:border-primary focus:ring-0 transition-all outline-none text-black font-medium text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div className="flex gap-4 pt-4">
                            <button className="flex-1 bg-gray-50 text-[#1A1A1A] py-4 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all">
                                Save & finish later
                            </button>
                            <button className="flex-[1.5] bg-primary text-white py-4 rounded-xl font-bold text-sm hover:bg-primary-hover transition-all">
                                Submit for verification
                            </button>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                            <p className="text-[10px] text-gray-400 font-medium tracking-tight">Your data is encrypted and securely stored.</p>
                            <button className="text-[10px] text-primary font-bold hover:underline">Learn more</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
