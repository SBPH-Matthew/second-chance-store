import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
    FiShield,
    FiLock,
    FiAlertTriangle,
    FiCheckCircle,
    FiMessageCircle,
    FiUsers,
    FiMapPin,
    FiPhoneCall,
    FiHeart
} from 'react-icons/fi';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Trust & Safety | Second Chance Marketplace",
    description: "Learn how we keep our community safe. Read our safety tips for buyers and sellers, and find out how to report suspicious activity.",
};

export default function SafetyPage() {
    return (
        <main className="bg-white min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute top-0 right-0 -z-10 w-1/3 h-full bg-bg-light-blue rounded-l-[100px] opacity-70" />
                <div className="container">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-primary text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
                            <FiShield size={14} />
                            Trust & Safety
                        </div>
                        <h1 className="text-5xl md:text-7xl font-poppins font-extrabold text-gray-900 leading-tight mb-8">
                            Your safety is <span className="text-primary italic">everything</span> to us.
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-2xl">
                            At Second Chance, we're building a community based on trust, transparency, and local connection. Here's how we keep you safe and how you can protect yourself.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button className="btn-primary">
                                Read Safety Guide
                            </button>
                            <Link href="/about" className="btn-outline">
                                Our Mission
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Pillars */}
            <section className="py-20 bg-gray-50/50">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-primary mb-6">
                                <FiLock size={28} />
                            </div>
                            <h3 className="text-2xl font-bold font-poppins text-gray-900">Secure by Design</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Our platform is built with industry-leading security to protect your data and communications from day one.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-primary mb-6">
                                <FiCheckCircle size={28} />
                            </div>
                            <h3 className="text-2xl font-bold font-poppins text-gray-900">Verified Identity</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We encourage all members to verify their identity to build a more accountable and trustworthy marketplace.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-primary mb-6">
                                <FiUsers size={28} />
                            </div>
                            <h3 className="text-2xl font-bold font-poppins text-gray-900">Community Moderation</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Our community reports suspicious activity, and our team acts quickly to remove bad actors and fraudulent listings.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Safety Tips Grid */}
            <section className="py-24">
                <div className="container">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl font-bold font-poppins text-gray-900">Stay Safe While Trading</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">Follow these best practices for every transaction to ensure a smooth experience.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <FiMapPin />,
                                title: "Meet in Public",
                                desc: "Always meet in a well-lit, public place like a coffee shop, police station lobby, or shopping center."
                            },
                            {
                                icon: <FiUsers />,
                                title: "Bring a Friend",
                                desc: "If possible, bring someone with you when meeting a buyer or seller for the first time."
                            },
                            {
                                icon: <FiMessageCircle />,
                                title: "Stay on Platform",
                                desc: "Keep all communications within Second Chance's messaging system to maintain a record of the transaction."
                            },
                            {
                                icon: <FiAlertTriangle />,
                                title: "Inspect Thoroughly",
                                desc: "Check the item carefully before handing over payment. For vehicles, consider a professional inspection."
                            },
                            {
                                icon: <FiLock />,
                                title: "Secure Payment",
                                desc: "Avoid wire transfers or prepaid gift cards. Use cash or secure digital payments in person."
                            },
                            {
                                icon: <FiHeart />,
                                title: "Trust Your Gut",
                                desc: "If a deal feels too good to be true or a user makes you uncomfortable, walk away immediately."
                            }
                        ].map((tip, idx) => (
                            <div key={idx} className="group p-8 rounded-2xl border border-gray-100 bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-bg-light-blue flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                    {tip.icon}
                                </div>
                                <h4 className="text-xl font-bold mb-3 font-poppins text-gray-900">{tip.title}</h4>
                                <p className="text-gray-600 leading-relaxed">{tip.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reporting Section */}
            <section className="py-24 bg-primary rounded-[40px] md:rounded-[80px] mx-4 md:mx-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                    <svg width="400" height="400" viewBox="0 0 24 24" fill="white" className="absolute -top-10 -right-10 transform rotate-12">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                    </svg>
                </div>
                <div className="container relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="text-white/80 font-bold uppercase tracking-widest text-sm mb-6 block">Immediate Action</span>
                        <h2 className="text-4xl md:text-5xl font-bold font-poppins text-white mb-8 border-b border-white/20 pb-8">See something suspicious?</h2>
                        <p className="text-xl text-white/90 mb-12 leading-relaxed">
                            Reporting helps keep the whole community safe. If you encounter a fraudulent listing, a suspicious profile, or inappropriate behavior, let us know immediately.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <button className="bg-white text-primary px-10 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-black/10">
                                Report an Issue
                            </button>
                            <button className="bg-transparent border border-white/30 text-white px-10 py-4 rounded-2xl font-bold hover:bg-white/10 transition-colors">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Footer */}
            <section className="py-32">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-4xl font-bold font-poppins text-gray-900 mb-6 leading-tight">We're here for you, 24/7.</h2>
                            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                                Our dedicated safety team monitors the marketplace around the clock. If you have any concerns or need assistance with a transaction, we're just a message away.
                            </p>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-primary shrink-0">
                                        <FiPhoneCall size={20} />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-gray-900">Priority Support</h5>
                                        <p className="text-gray-500">support@secondchance.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-primary shrink-0">
                                        <FiShield size={20} />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-gray-900">Safety Center</h5>
                                        <p className="text-gray-500">safety.secondchance.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-bg-light-blue rounded-3xl overflow-hidden shadow-2xl relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-32 h-32 bg-white rounded-full shadow-xl flex items-center justify-center text-primary animate-pulse">
                                        <FiShield size={64} />
                                    </div>
                                </div>
                                {/* Decorative elements */}
                                <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-2xl" />
                                <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
