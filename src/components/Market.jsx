import React, { useState, useEffect } from 'react';
import { MapPin, Search, BarChart3, Calculator, List, Map, TrendingUp, Loader2 } from 'lucide-react';
import ValueEstimateCards from './ValueEstimateCards';
import RentalPrices from './RentalPrices';
import ScoreCards from './ScoreCards';
import PropertyCarousel from './PropertyCarousel';
import ComparableTable from './ComparableTable';
import NotificationPanel, { NotificationBell } from './NotificationPanel';
import RentalCalculator from './RentalCalculator';
import WatchlistManager from './WatchlistManager';
import MapAnalysis from './MapAnalysis';
import { getMarketProperties, getComparableSales } from '../lib/database';

const tabs = [
    { id: 'overview', label: 'Oversikt', icon: BarChart3 },
    { id: 'calculator', label: 'Kalkulator', icon: Calculator },
    { id: 'lists', label: 'Lister', icon: List },
    { id: 'map', label: 'Kart', icon: Map }
];

export default function Market() {
    const [showNotifications, setShowNotifications] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [liveProperties, setLiveProperties] = useState([]);
    const [comparableSales, setComparableSales] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (activeTab === 'overview') {
            loadLiveProperties();
        }
    }, [activeTab]);

    const loadLiveProperties = async () => {
        setIsLoading(true);
        try {
            const [marketData, comparableData] = await Promise.all([
                getMarketProperties({ limit: 10 }),
                getComparableSales({ limit: 20 })
            ]);
            setLiveProperties(marketData);
            setComparableSales(comparableData);
        } catch (error) {
            console.error('Error fetching market data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8 fade-in">

            {/* Header with notification bell */}
            <div className="flex items-center justify-between mb-6">
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

            {/* Tab Navigation */}
            <div className="flex justify-center gap-2 mb-8">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${activeTab === tab.id
                            ? 'bg-brass/20 text-brass border border-brass/30'
                            : 'bg-white/5 text-stone-400 border border-white/10 hover:bg-white/10 hover:text-stone-300'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Search Bar - shown on overview */}
            {activeTab === 'overview' && (
                <div className="relative mb-8 max-w-2xl mx-auto">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-brass/20 to-blue-500/20 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                        <div className="relative flex items-center bg-obsidian border border-white/10 rounded-lg p-2">
                            <MapPin className="w-5 h-5 text-stone-500 ml-2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Søk etter adresse, postnummer eller område..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-ink-primary px-4 py-2 placeholder-stone-600 focus:outline-none"
                            />
                            <button className="p-2 bg-brass/10 hover:bg-brass/20 text-brass rounded-md transition-colors">
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab Content */}
            {activeTab === 'overview' && (() => {
                const filteredProperties = liveProperties.filter(p =>
                    (p.address?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (p.city?.toLowerCase().includes(searchQuery.toLowerCase()))
                );

                return (
                    <div className="space-y-6">
                        {/* Property Carousel - Kuppeliste */}
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-8 h-8 text-brass animate-spin" />
                            </div>
                        ) : (
                            <PropertyCarousel
                                title={searchQuery ? "Søkeresultater" : "Aktive Annonser"}
                                subtitle={searchQuery ? `${filteredProperties.length} treff funnet` : "Siste boliger fra Finn.no analysert av AI"}
                                properties={filteredProperties}
                            />
                        )}

                        {/* Demo Property Info (Optional: could be replaced by first filtered property) */}
                        {filteredProperties.length > 0 && (
                            <div className="velvet-card p-4 flex items-center gap-4">
                                <div className="w-24 h-24 rounded-lg bg-stone-800 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={filteredProperties[0].image_url || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=200&fit=crop"}
                                        alt="Property"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-serif text-ink-primary">{filteredProperties[0].address}</h3>
                                    <p className="text-stone-400 text-sm">{filteredProperties[0].city}</p>
                                    <div className="flex gap-4 mt-2 text-xs text-stone-500">
                                        <span>{filteredProperties[0].property_type}</span>
                                        <span>•</span>
                                        <span>{filteredProperties[0].sqm} m²</span>
                                        <span>•</span>
                                        <span>{filteredProperties[0].bedrooms} soverom</span>
                                        <span>•</span>
                                        <span>Byggeår {filteredProperties[0].build_year}</span>
                                    </div>
                                </div>
                                <div className="hidden md:block text-right">
                                    <div className="text-xs text-stone-500 uppercase">Pris</div>
                                    <div className="text-xl font-serif text-brass">
                                        kr {new Intl.NumberFormat('nb-NO').format(filteredProperties[0].price || 0)}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Value Estimate Cards */}
                        <ValueEstimateCards />

                        {/* Two column layout for desktop */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <ScoreCards />
                            <RentalPrices />
                        </div>

                        {/* Comparable Sales Table */}
                        <ComparableTable data={comparableSales} />
                    </div>
                );
            })()}

            {activeTab === 'calculator' && (
                <RentalCalculator />
            )}

            {activeTab === 'lists' && (
                <WatchlistManager />
            )}

            {activeTab === 'map' && (
                <MapAnalysis />
            )}
        </div>
    );
}
