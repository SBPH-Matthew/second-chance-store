import Link from 'next/link';

interface FooterProps {
    showCTA?: boolean;
}

export default function Footer({ showCTA = true }: FooterProps) {
    return (
        <footer className="bg-white">
            <div className="container">
                {/* Ready to get started banner - Optional */}
                {showCTA && (
                    <div
                        className="mt-32 mb-32 relative rounded-2xl overflow-hidden h-[340px] flex flex-col justify-center items-center text-center text-white"
                        style={{
                            background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/hero_cafe.png")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center 30%'
                        }}
                    >
                        <h2 className="text-4xl md:text-6xl font-bold mb-4 font-poppins tracking-tight">Ready to get started</h2>
                        <p className="text-lg md:text-xl mb-10 opacity-90 max-w-xl mx-auto font-medium px-4">Join thousands who are buying and selling smarter every day.</p>
                        <div className="flex gap-4">
                            <button className="bg-white text-black px-8 md:px-10 py-3 rounded-md font-bold hover:bg-gray-100 transition-colors">List</button>
                            <button className="border border-white/40 bg-white/10 text-white px-8 md:px-10 py-3 rounded-md font-bold hover:bg-white/20 transition-colors backdrop-blur-sm">Browse</button>
                        </div>
                    </div>
                )}

                <div className="border-t border-gray-200 py-24 flex flex-col md:flex-row justify-between items-start gap-12">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Stay in the loop</h3>
                        <p className="text-gray-500 text-base">Get updates on new listings and marketplace news</p>
                    </div>
                    <div className="max-w-[440px] w-full">
                        <div className="flex gap-2 mb-3">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="flex-1 px-4 py-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                            <button className="px-6 py-3 rounded-md border border-gray-200 bg-white font-bold text-sm hover:bg-gray-50 transition-colors whitespace-nowrap">Subscribe</button>
                        </div>
                        <p className="text-xs text-gray-400">By subscribing you agree to our <Link href="/privacy" className="underline hover:text-primary transition-colors">Privacy Policy</Link></p>
                    </div>
                </div>

                <div className="py-24 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-24">
                        <div>
                            <h4 className="font-bold mb-6 text-black uppercase text-[11px] tracking-widest">Explore</h4>
                            <ul className="flex flex-col gap-4 text-sm text-gray-600 font-medium">
                                <li><Link href="/shop" className="hover:text-primary transition-colors">Browse listings</Link></li>
                                <li><Link href="/sell" className="hover:text-primary transition-colors">List your item</Link></li>
                                <li><Link href="/how-it-works" className="hover:text-primary transition-colors">How it works</Link></li>
                                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact us</Link></li>
                                <li><Link href="/safety" className="hover:text-primary transition-colors">Safety tips</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-black uppercase text-[11px] tracking-widest">Account</h4>
                            <ul className="flex flex-col gap-4 text-sm text-gray-600 font-medium">
                                <li><Link href="/signin" className="hover:text-primary transition-colors">Sign in</Link></li>
                                <li><Link href="/signup" className="hover:text-primary transition-colors">Create account</Link></li>
                                <li><Link href="/my-listings" className="hover:text-primary transition-colors">My listings</Link></li>
                                <li><Link href="/saved" className="hover:text-primary transition-colors">Saved items</Link></li>
                                <li><Link href="/messages" className="hover:text-primary transition-colors">Messages</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-black uppercase text-[11px] tracking-widest">Support</h4>
                            <ul className="flex flex-col gap-4 text-sm text-gray-600 font-medium">
                                <li><Link href="/help" className="hover:text-primary transition-colors">Help center</Link></li>
                                <li><Link href="/report-listing" className="hover:text-primary transition-colors">Report listing</Link></li>
                                <li><Link href="/report-user" className="hover:text-primary transition-colors">Report user</Link></li>
                                <li><Link href="/contact-support" className="hover:text-primary transition-colors">Contact support</Link></li>
                                <li><Link href="/feedback" className="hover:text-primary transition-colors">Feedback</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-black uppercase text-[11px] tracking-widest">Legal</h4>
                            <ul className="flex flex-col gap-4 text-sm text-gray-600 font-medium">
                                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of service</Link></li>
                                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy policy</Link></li>
                                <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie policy</Link></li>
                                <li><Link href="/accessibility" className="hover:text-primary transition-colors">Accessibility</Link></li>
                                <li><Link href="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-black uppercase text-[11px] tracking-widest">Community</h4>
                            <ul className="flex flex-col gap-4 text-sm text-gray-600 font-medium">
                                <li><Link href="/guidelines" className="hover:text-primary transition-colors">Community guidelines</Link></li>
                                <li><Link href="/resources" className="hover:text-primary transition-colors">Seller resources</Link></li>
                                <li><Link href="/protection" className="hover:text-primary transition-colors">Buyer protection</Link></li>
                                <li><Link href="/safety" className="hover:text-primary transition-colors">Trust and safety</Link></li>
                                <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-black uppercase text-[11px] tracking-widest">Social</h4>
                            <ul className="flex flex-col gap-4 text-sm text-gray-600 font-medium">
                                <li><a href="#" className="hover:text-primary transition-colors">Follow on Facebook</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Follow on Twitter</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Follow on Instagram</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Follow on LinkedIn</a></li>
                                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                        <span className="text-2xl font-bold font-poppins">Second Chance</span>
                        <p className="text-sm text-gray-400 font-medium">© 2026 Second Chance Marketplace. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
