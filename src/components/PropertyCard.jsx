import React from 'react';
import { Heart, ExternalLink, MapPin } from 'lucide-react';
import { ScoreBadge } from './ScoreCards';

export default function PropertyCard({
    image = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    address = "Storgata 123",
    location = "Oslo",
    price = 7500000,
    priceLabel = "NYLIG SOLGT",
    score = 7.8,
    maxScore = 10,
    link = "#",
    isNew = false,
    isSold = true
}) {
    const formatPrice = (num) => new Intl.NumberFormat('nb-NO').format(num);

    return (
        <div className="group relative flex-shrink-0 w-72 bg-obsidian border border-white/10 rounded-lg overflow-hidden hover:border-brass/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]">
            {/* Image Container */}
            <div className="relative h-40 overflow-hidden">
                <img
                    src={image}
                    alt={address}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent"></div>

                {/* Badge */}
                {(isSold || isNew) && (
                    <div className={`absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${isSold
                            ? 'bg-blue-500 text-white'
                            : 'bg-green-500 text-white'
                        }`}>
                        {isSold ? 'Nylig solgt' : 'Ny annonse'}
                    </div>
                )}

                {/* Score badge */}
                {score && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded px-2 py-1 flex items-center gap-1">
                        <span className="text-sm font-bold text-white">{score}</span>
                        <span className="text-[8px] text-stone-400">av {maxScore}</span>
                    </div>
                )}

                {/* Favorite button */}
                <button className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors group/heart">
                    <Heart className="w-4 h-4 text-white group-hover/heart:text-red-400 transition-colors" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Address */}
                <div className="flex items-start gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-medium text-ink-primary leading-tight">{address}</h3>
                        <p className="text-xs text-stone-500">{location}</p>
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline justify-between mt-3">
                    <div>
                        <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-0.5">
                            {priceLabel}
                        </div>
                        <div className="text-lg font-serif text-brass">
                            NOK {formatPrice(price)}
                        </div>
                    </div>
                </div>

                {/* Link */}
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-3 text-center py-2 px-3 bg-brass/10 hover:bg-brass/20 text-brass text-xs uppercase tracking-wider rounded transition-colors"
                >
                    Se annonse
                </a>
            </div>
        </div>
    );
}
