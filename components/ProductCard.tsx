import { FiMapPin } from 'react-icons/fi';
import Link from 'next/link';

interface ProductCardProps {
    id: string;
    type?: string;
    title: string;
    price: string;
    location: string;
    imageUrl: string;
    isFree?: boolean;
    rating?: number;
    salesCount?: number;
}

export default function ProductCard({ id, type, title, price, location, imageUrl, isFree, rating = 4.8, salesCount = 120 }: ProductCardProps) {
    const detailUrl = type ? `/shop/${id}?type=${type}` : `/shop/${id}`;

    return (
        <Link href={detailUrl} className="group block h-full bg-white border border-transparent hover:border-primary hover:shadow-md transition-all duration-200">
            {/* Image Wrapper (~60% height in vertical layout) */}
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 border-b border-gray-50">
                <img
                    src={imageUrl}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Badge Overlay */}
                {isFree && (
                    <div className="absolute top-0 left-0 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-br-sm uppercase">
                        Gift
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="p-2.5 flex flex-col gap-1.5">
                {/* Title (1-2 lines) */}
                <h3 className="text-[13px] text-gray-800 line-clamp-2 leading-[1.4] h-[36px]">
                    {title}
                </h3>

                {/* Price (Dominant) */}
                <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-[18px] font-bold text-primary">
                        {isFree ? 'FREE' : price}
                    </span>
                </div>

                {/* Trust/Social Info */}
                <div className="flex items-center gap-2 mt-auto">
                    <div className="flex items-center text-[11px] text-gray-400">
                        <FiMapPin className="mr-1" />
                        <span className="truncate max-w-[120px]">{location.split(',')[0]}</span>
                    </div>
                </div>
                
                {/* Optional: Promotional text */}
                <div className="mt-1 flex gap-1">
                    <span className="text-[10px] bg-red-50 text-primary px-1 border border-primary/20 rounded-sm">Free Shipping</span>
                </div>
            </div>
        </Link>
    );
}

