import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import PropertyCard from './PropertyCard';

// Mock data - replace with real data later
const mockProperties = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
        address: "Seilduksgata 23A",
        location: "Oslo",
        price: 7560000,
        score: 7.9,
        isSold: true
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
        address: "Markveien 9",
        location: "Oslo",
        price: 8200000,
        score: 7.6,
        isSold: true
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop",
        address: "Thereses gate 14",
        location: "Oslo",
        price: 11200000,
        score: 8.4,
        isSold: true
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
        address: "Frognerveien 42",
        location: "Oslo",
        price: 9450000,
        score: 8.1,
        isSold: true
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=300&fit=crop",
        address: "Bygdøy allé 55",
        location: "Oslo",
        price: 14800000,
        score: 9.2,
        isSold: true
    },
    {
        id: 6,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
        address: "Holmenkollveien 88",
        location: "Oslo",
        price: 22500000,
        score: 9.5,
        isNew: true,
        isSold: false
    }
];

export default function PropertyCarousel({
    title = "Kuppeliste (Januar)",
    subtitle = "Et utvalg av boliger som ble solgt før visning!",
    properties = mockProperties
}) {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        const ref = scrollRef.current;
        if (ref) {
            ref.addEventListener('scroll', checkScroll);
            return () => ref.removeEventListener('scroll', checkScroll);
        }
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="mb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-serif text-brass flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-400" />
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-sm text-stone-500 mt-1">{subtitle}</p>
                    )}
                </div>

                {/* Navigation buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${canScrollLeft
                                ? 'border-white/20 hover:border-brass/50 hover:bg-brass/10 text-stone-400 hover:text-brass'
                                : 'border-white/5 text-stone-700 cursor-not-allowed'
                            }`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${canScrollRight
                                ? 'border-white/20 hover:border-brass/50 hover:bg-brass/10 text-stone-400 hover:text-brass'
                                : 'border-white/5 text-stone-700 cursor-not-allowed'
                            }`}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Scrollable container */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
                style={{ scrollSnapType: 'x mandatory' }}
            >
                {properties.map((property) => (
                    <div key={property.id} style={{ scrollSnapAlign: 'start' }}>
                        <PropertyCard {...property} />
                    </div>
                ))}
            </div>
        </div>
    );
}
