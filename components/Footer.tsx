import Link from 'next/link';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone } from 'react-icons/fi';

interface FooterProps {
    showCTA?: boolean;
}

export default function Footer({ showCTA = true }: FooterProps) {
    return (
        <footer className="bg-white border-t border-gray-200 mt-12 pb-12">
            {/* Promotion/Trust Banner */}
            <div className="bg-gray-50 border-b border-gray-100 py-6">
                <div className="container grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">🛡️</div>
                        <div>
                            <h5 className="text-[13px] font-bold">Safe Trading</h5>
                            <p className="text-[11px] text-gray-500">Verified buyers & sellers</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">🚚</div>
                        <div>
                            <h5 className="text-[13px] font-bold">Fast Delivery</h5>
                            <p className="text-[11px] text-gray-500">Coordination made easy</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">💬</div>
                        <div>
                            <h5 className="text-[13px] font-bold">24/7 Support</h5>
                            <p className="text-[11px] text-gray-500">Always here to help</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">🎁</div>
                        <div>
                            <h5 className="text-[13px] font-bold">Free Gems</h5>
                            <p className="text-[11px] text-gray-500">Community gifts daily</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-12">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
                    <div className="col-span-2 lg:col-span-1">
                        <Link href="/" className="inline-block mb-6">
                             <span className="text-xl font-bold tracking-tight text-primary uppercase">SecondChance</span>
                        </Link>
                        <p className="text-[13px] text-gray-500 leading-relaxed mb-6">
                            Join the largest community-driven marketplace. Buy, sell, and gift with confidence in a safe local environment.
                        </p>
                        <div className="flex gap-4 text-gray-400">
                            <FiFacebook size={18} className="hover:text-primary cursor-pointer" />
                            <FiTwitter size={18} className="hover:text-primary cursor-pointer" />
                            <FiInstagram size={18} className="hover:text-primary cursor-pointer" />
                            <FiLinkedin size={18} className="hover:text-primary cursor-pointer" />
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-5 text-[14px]">Customer Care</h4>
                        <ul className="flex flex-col gap-3 text-[13px] text-gray-600">
                            <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link href="/how-to-buy" className="hover:text-primary transition-colors">How to Buy</Link></li>
                            <li><Link href="/how-to-sell" className="hover:text-primary transition-colors">How to Sell</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                            <li><Link href="/resources" className="hover:text-primary transition-colors">Resources</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-5 text-[14px]">SecondChance</h4>
                        <ul className="flex flex-col gap-3 text-[13px] text-gray-600">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link href="/blog" className="hover:text-primary transition-colors">Media Center</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-5 text-[14px]">Sell on SecondChance</h4>
                        <ul className="flex flex-col gap-3 text-[13px] text-gray-600">
                            <li><Link href="/list" className="hover:text-primary transition-colors">List Your Item</Link></li>
                            <li><Link href="/seller-guidelines" className="hover:text-primary transition-colors">Seller Guidelines</Link></li>
                            <li><Link href="/boost" className="hover:text-primary transition-colors">Boost Listings</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-5 text-[14px]">Contact</h4>
                        <ul className="flex flex-col gap-4 text-[13px] text-gray-600">
                            <li className="flex items-center gap-2 italic">
                                <FiMail size={14} /> support@secondchance.com
                            </li>
                            <li className="flex items-center gap-2 italic">
                                <FiPhone size={14} /> +123 456 7890
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[12px] text-gray-400">
                        © 2026 SecondChance Marketplace. All Rights Reserved.
                    </p>
                    <div className="flex gap-6 grayscale opacity-60">
                         {/* Payment Icons Placeholder */}
                         <div className="flex gap-3">
                             <div className="w-10 h-6 bg-gray-200 rounded-sm"></div>
                             <div className="w-10 h-6 bg-gray-200 rounded-sm"></div>
                             <div className="w-10 h-6 bg-gray-200 rounded-sm"></div>
                         </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

