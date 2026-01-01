import React, { useState } from 'react';
import { MapPin, Search, Bell } from 'lucide-react';
import ValueEstimateCards from './ValueEstimateCards';
import RentalPrices from './RentalPrices';
import ScoreCards from './ScoreCards';
import PropertyCarousel from './PropertyCarousel';
import ComparableTable from './ComparableTable';
import NotificationPanel, { NotificationBell } from './NotificationPanel';

export default function Market() {
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8 fade-in">

            {/* Header with notification bell */}
            <div className="flex items-center justify-between mb-8">
                <div className="text-center flex-1">
                    <h2 className="text-3xl md:text-4xl font-serif text-brass mb-2">Markedsanalyse</h2>
                    <p className="text-stone-light text-sm max-w-md mx-auto">
                        Utforsk verdiestimat, leiepriser og markedsdata for eiendomsinvesteringer.
                    </p>
                </div>

                {/* Notification Bell */}
                <div className="relative">
                    <NotificationBell
                        count={2}
                        onClick={() => setShowNotifications(!showNotifications)}
                    />
                    <NotificationPanel
                        isOpen={showNotifications}
                        onClose={() => setShowNotifications(false)}
                    />
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8 max-w-2xl mx-auto">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-brass/20 to-blue-500/20 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                    <div className="relative flex items-center bg-obsidian border border-white/10 rounded-lg p-2">
                        <MapPin className="w-5 h-5 text-stone-500 ml-2" />
                        <input
                            type="text"
                            placeholder="Søk etter adresse, postnummer eller område..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-ink-primary px-4 py-2 placeholder-stone-600 focus:outline-none"
                        />
                        <button className="p-2 bg-brass/10 hover:bg-brass/20 text-brass rounded-md transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Property Carousel - Kuppeliste */}
            <PropertyCarousel />

            {/* Demo Property Info */}
            <div className="velvet-card p-4 mb-6 flex items-center gap-4">
                <div className="w-24 h-24 rounded-lg bg-stone-800 flex items-center justify-center overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=200&fit=crop"
                        alt="Property"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-serif text-ink-primary">Eksempel Eiendom</h3>
                    <p className="text-stone-400 text-sm">Storgata 123, 0182 Oslo</p>
                    <div className="flex gap-4 mt-2 text-xs text-stone-500">
                        <span>Leilighet</span>
                        <span>•</span>
                        <span>101 m²</span>
                        <span>•</span>
                        <span>3 soverom</span>
                        <span>•</span>
                        <span>Byggeår 2002</span>
                    </div>
                </div>
                <div className="hidden md:block text-right">
                    <div className="text-xs text-stone-500 uppercase">Siste salgspris</div>
                    <div className="text-xl font-serif text-brass">kr 6,450,000</div>
                </div>
            </div>

            {/* Value Estimate Cards */}
            <ValueEstimateCards />

            {/* Two column layout for desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Score Cards */}
                <ScoreCards />

                {/* Rental Prices */}
                <RentalPrices />
            </div>

            {/* Comparable Sales Table */}
            <ComparableTable />
        </div>
    );
}
