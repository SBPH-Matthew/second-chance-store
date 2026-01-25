import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="h-20 flex items-center bg-white sticky top-0 z-1000">
            <div className="container flex justify-between items-center w-full">
                <Link href="/" className="text-xl font-bold flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                    </div>
                    <span className="font-poppins text-[#1A1A1A]">Second Chance</span>
                </Link>

                <div className="hidden md:flex gap-6 items-center font-medium">
                    <Link href="/shop" className="text-gray-700 text-sm hover:text-primary">Browse listings</Link>
                    <Link href="/sell" className="text-gray-700 text-sm hover:text-primary">List item</Link>
                    <Link href="/about" className="text-gray-700 text-sm hover:text-primary">About us</Link>
                    <div className="flex items-center gap-1 text-gray-700 text-sm cursor-pointer hover:text-primary">
                        More
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                </div>

                <div className="flex gap-4 items-center">
                    <Link href="/auth/login" className="text-gray-700 font-medium px-4 py-2 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                        Sign in
                    </Link>
                    <Link href="/auth/register" className="btn-primary py-2.5 px-6 text-sm">
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
}
