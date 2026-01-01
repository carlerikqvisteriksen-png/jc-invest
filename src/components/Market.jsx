import React from 'react';
import { LineChart, MapPin, Search } from 'lucide-react';
import ValueEstimateCards from './ValueEstimateCards';
import RentalPrices from './RentalPrices';
import ScoreCards from './ScoreCards';

export default function Market() {
    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8 fade-in">

            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-serif text-brass mb-2">Markedsanalyse</h2>
                <p className="text-stone-light text-sm max-w-md mx-auto">
                    Utforsk verdiestimat, leiepriser og markedsdata for eiendomsinvesteringer.
                </p>
            </div>

            {/* Search Bar (placeholder for future) */}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Score Cards */}
                <ScoreCards />

                {/* Rental Prices */}
                <RentalPrices />
            </div>

            {/* Coming Soon Section */}
            <div className="mt-8 p-6 rounded-lg border border-dashed border-white/20 text-center">
                <LineChart className="w-8 h-8 mx-auto text-stone-600 mb-3" />
                <h4 className="text-stone-400 font-medium mb-1">Flere funksjoner kommer snart</h4>
                <p className="text-stone-600 text-sm">
                    Sammenlignbare salg, kuppeliste, utleiekalkulator og mer...
                </p>
            </div>
        </div>
    );
}
