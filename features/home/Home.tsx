import Navbar from '@/components/Navbar';
import Hero from './components/Hero';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Home() {
    return (
        <main className="bg-white">
            <Navbar />
            <Hero />

            {/* What makes us different Section */}
            <section className="py-24">
                <div className="container">
                    <div className="text-center mb-12 space-y-4">
                        <span className=" text-sm font-bold text-black block mb-2">Simple</span>
                        <h2 className="text-4xl font-poppins text-black">What makes us different</h2>
                        <p className="text-gray-600 mt-4 text-lg">Post your items in minutes without complicated forms.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Listing Card - Wider (2 cols) */}
                        <div className="col-span-1 md:col-span-2 card flex flex-row min-h-[400px]">
                            <div className="p-10 flex-1 flex flex-col justify-center">
                                <span className="text-sm font-bold mb-4 block">Listing</span>
                                <h3 className="text-3xl font-bold mb-4 leading-tight">List your item in seconds</h3>
                                <p className="text-gray-600 mb-8 max-w-xs">Upload photos, set your price, and reach buyers today.</p>
                                <Link href="/sell" className="font-semibold flex items-center gap-1 hover:text-primary transition-colors">
                                    Learn <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                </Link>
                            </div>
                            <div
                                className="w-[40%] bg-cover bg-center"
                                style={{ backgroundImage: 'url("/listing_fashion_sneakers_1769261743924.png")' }}
                            ></div>
                        </div>

                        {/* Promotion Card - Standard (1 col) */}
                        <div className="col-span-1 card flex flex-col">
                            <div className="p-8 flex-1">
                                <span className="text-sm font-bold mb-4 block">Promotion</span>
                                <h3 className="text-2xl font-bold mb-4 leading-tight">Boost your listings</h3>
                                <p className="text-gray-600 mb-6">Reach more local buyers and sell faster by promoting your items to the top.</p>
                                <Link href="/promote" className="font-semibold flex items-center gap-1 hover:text-primary transition-colors">
                                    Learn <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                </Link>
                            </div>
                            <div
                                className="h-44 bg-cover bg-center"
                                style={{ backgroundImage: 'url("/listing_electronics_laptop_gaming_1769261730700.png")' }}
                            ></div>
                        </div>

                        {/* Variety Card - Standard (1 col) */}
                        <div className="col-span-1 card flex flex-col">
                            <div className="p-8 flex-1">
                                <span className="text-sm font-bold mb-4 block">Variety</span>
                                <h3 className="text-2xl font-bold mb-4 leading-tight">Everything you want</h3>
                                <p className="text-gray-600 mb-6">From furniture to vehicles, find it all in one place.</p>
                                <Link href="/shop" className="font-semibold flex items-center gap-1 hover:text-primary transition-colors">
                                    Learn <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                </Link>
                            </div>
                            <div
                                className="h-44 bg-cover bg-center"
                                style={{ backgroundImage: 'url("/listing_vehicle_tesla_1769261698522.png")' }}
                            ></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works Section */}
            <section className="py-24 bg-white border-t border-gray-100">
                <div className="container">
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-sm font-bold text-black block mb-2">Process</span>
                        <h2 className="text-4xl font-bold font-poppins text-black">How it works</h2>
                        <p className="text-gray-600 mt-4 text-lg">Three simple steps to start buying or selling today.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <div
                                className="h-[320px] bg-cover bg-center"
                                style={{ backgroundImage: 'url("/marketplace_hero_1769261680432.png")' }}
                            ></div>
                            <div className="p-8">
                                <span className="text-sm font-bold text-black block mb-3">First</span>
                                <h3 className="text-2xl font-bold mb-4 leading-tight font-poppins">Create your account and get started</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">Sign up takes less than a minute to complete.</p>
                                <Link href="/signup" className="font-bold flex items-center gap-1 hover:text-primary transition-colors">
                                    Start <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                </Link>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <div
                                className="h-[320px] bg-cover bg-center"
                                style={{ backgroundImage: 'url("/listing_electronics_laptop_gaming_1769261730700.png")' }}
                            ></div>
                            <div className="p-8">
                                <span className="text-sm font-bold text-black block mb-3">Second</span>
                                <h3 className="text-2xl font-bold mb-4 leading-tight font-poppins">List what you want to sell or browse</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">Add photos, details, and your price to attract buyers.</p>
                                <Link href="/sell" className="font-bold flex items-center gap-1 hover:text-primary transition-colors">
                                    List <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                </Link>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <div
                                className="h-[320px] bg-cover bg-center"
                                style={{ backgroundImage: 'url("/hero_cafe.png")' }}
                            ></div>
                            <div className="p-8">
                                <span className="text-sm font-bold text-black block mb-3">Third</span>
                                <h3 className="text-2xl font-bold mb-4 leading-tight font-poppins">Connect and complete your transaction</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">Message with buyers or sellers and make the deal.</p>
                                <Link href="/messages" className="font-bold flex items-center gap-1 hover:text-primary transition-colors">
                                    Connect <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Real stories Section */}
            <section className="py-32 bg-bg-light-blue">
                <div className="container">
                    <div className="text-center mb-16">
                        <h2 className="text-6xl font-bold font-poppins text-black tracking-tight">Real stories</h2>
                        <p className="text-gray-600 mt-4 text-xl">Hear from people who found what they needed on Second Chance.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Marcus Chen', role: 'Seller, Portland', quote: 'I sold my old desk in two days and the buyer was honest and quick.', stars: 5 },
                            { name: 'Sarah Mitchell', role: 'Buyer, Denver', quote: 'Found a truck that runs like new for half the dealership price.', stars: 5 },
                            { name: 'James Rodriguez', role: 'Buyer, Austin', quote: 'The messaging system kept everything transparent between us.', stars: 5 },
                        ].map((story, i) => (
                            <div key={i} className="bg-white p-10 rounded-lg shadow-sm border border-gray-100 flex flex-col">
                                <div className="flex gap-1 mb-6">
                                    {[...Array(story.stars)].map((_, j) => (
                                        <svg key={j} width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-black"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                    ))}
                                </div>
                                <p className="text-lg font-medium mb-8 leading-relaxed flex-1">"{story.quote}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                    <div>
                                        <h4 className="text-base font-bold text-black">{story.name}</h4>
                                        <p className="text-sm text-gray-500">{story.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Questions Section */}
            <section className="py-32">
                <div className="container">
                    <div className="text-center mb-20">
                        <h2 className="text-6xl font-bold font-poppins text-black tracking-tight mb-6">Questions</h2>
                        <p className="text-gray-600 text-xl max-w-2xl mx-auto">Find answers to what you need to know about buying and selling here.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16 text-center max-w-[1000px] mx-auto mb-24">
                        {[
                            { q: 'How do I list an item?', a: 'Sign up, click list your item, add photos and details, then publish.', icon: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5-5 5 5m-5-5v12" /> },
                            { q: 'Is it free to sell?', a: 'Yes, listing your items costs nothing on Second Chance.', icon: <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01" /> },
                            { q: 'How do I contact buyers?', a: 'Use our secure messaging system to communicate directly with interested parties.', icon: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /> },
                            { q: 'Can I sell vehicles?', a: 'Absolutely, we support listings for cars, trucks, motorcycles, and more.', icon: <><circle cx="18.5" cy="17.5" r="3.5" /><circle cx="5.5" cy="17.5" r="3.5" /><path d="M15 17.5c0-4.42-3.58-8-8-8H2l3 5h14c1.1 0 2 .9 2 2v1H5" /></> },
                            { q: "What if there's a problem?", a: 'Our support team is ready to help resolve any issues that come up.', icon: <><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18m-11 6h2m-6 0h.01m10 0h.01" /></> },
                            { q: 'How are prices set?', a: 'You decide the price for your items based on condition and market value.', icon: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></> },
                        ].map((faq, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="mb-6 h-12 flex items-center justify-center">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black">{faq.icon}</svg>
                                </div>
                                <h4 className="text-xl font-bold mb-4 font-poppins"> {faq.q}</h4>
                                <p className="text-gray-600 text-[0.925rem] leading-relaxed px-4">{faq.a}</p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 pt-24 text-center">
                        <h2 className="text-5xl font-bold font-poppins mb-6">Need more help?</h2>
                        <p className="text-gray-500 text-lg mb-10">Reach out to our team for anything else you want to know.</p>
                        <button className="px-10 py-3 rounded-md border border-blue-100 bg-white hover:bg-blue-50 transition-colors font-semibold text-gray-700">
                            Contact
                        </button>
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
