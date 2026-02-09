import { FiHeart, FiMapPin, FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';

interface ProductCardProps {
    id: string;
    type?: string;
    title: string;
    price: string;
    location: string;
    imageUrl: string;
    isFree?: boolean;
    disableHover?: boolean;
}

export default function ProductCard({ id, type, title, price, location, imageUrl, isFree, disableHover }: ProductCardProps) {
    const detailUrl = type ? `/shop/${id}?type=${type}` : `/shop/${id}`;
    const getUrl = type ? `/shop/${id}?action=get&type=${type}` : `/shop/${id}?action=get`;

    return (
        <div className="group relative flex flex-col bg-white">
            {/* Image Wrapper */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
                <img
                    src={imageUrl}
                    alt={title}
                    className={`h-full w-full object-cover transition-transform duration-700 ease-out ${!disableHover ? 'group-hover:scale-105' : ''
                        }`}
                />

                {/* Premium Badge */}
                {isFree && (
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
                        Community Gift
                    </div>
                )}

                {/* Wishlist Button */}
                <button className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white hover:scale-110 transition-all text-gray-900 cursor-pointer">
                    <FiHeart size={18} />
                </button>
            </div>

            {/* Content Area */}
            <div className="mt-5 px-1 space-y-2">
                <div className="flex justify-between items-start">
                    <h3 className="text-[17px] font-semibold text-gray-900 line-clamp-1 flex-1 pr-4 leading-snug">
                        {title}
                    </h3>
                    <span className={`text-[17px] font-bold tracking-tight ${isFree ? 'text-green-600' : 'text-gray-900 font-poppins'}`}>
                        {isFree ? 'Free' : price}
                    </span>
                </div>

                <div className="flex items-center gap-1.5 text-gray-500 text-[13px] font-medium">
                    <FiMapPin size={14} className="opacity-60" />
                    <span className="truncate">{location}</span>
                </div>

                <div className="pt-2 flex items-center justify-center gap-3 w-full">
                    <Link
                        href={detailUrl}
                        className={`btn-primary rounded-full flex-1 py-2.5 text-[13px] font-bold text-center cursor-pointer whitespace-nowrap ${disableHover ? '' : 'transition-all'
                            }`}
                    >
                        Learn more
                    </Link>
                    <Link
                        href={getUrl}
                        className={`flex-1 text-gray-900 text-[13px] font-bold flex items-center justify-center gap-1 py-2.5 rounded-full border border-gray-200 cursor-pointer ${disableHover ? '' : 'hover:bg-gray-50 transition-colors'
                            }`}
                    >
                        Get Item
                        <FiChevronRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
