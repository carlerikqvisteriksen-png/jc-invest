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

    // Filters
    const [filters, setFilters] = useState({
        locations: ['Oslo', 'Ringerike', 'Hole'], // Default active locations
        type: 'Leilighet',
        minPrice: 2500000,
        maxPrice: 3500000
    });

    useEffect(() => {
        if (activeTab === 'overview') {
            loadLiveProperties();
        }
    }, [activeTab]);

    const loadLiveProperties = async () => {
        setIsLoading(true);
        try {
            // Fetch more properties to allow for client-side filtering
            const [marketData, comparableData] = await Promise.all([
                getMarketProperties({ limit: 300 }),
                getComparableSales({ limit: 50 })
            ]);
            setLiveProperties(marketData);
            setComparableSales(comparableData);
        } catch (error) {
            console.error('Error fetching market data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter Logic
    const filteredProperties = liveProperties.filter(p => {
        // Search
        const searchMatch = !searchQuery ||
            (p.address?.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (p.city?.toLowerCase().includes(searchQuery.toLowerCase()));

        // Location (City/Municipality checks)
        // Note: Finn data often puts municipality in 'location' or 'city'. 
        // We check if the property's city/location matches ANY of the selected filter locations.
        const locationMatch = filters.locations.length === 0 || filters.locations.some(loc => {
            if (p.city?.includes(loc) || p.address?.includes(loc)) return true;
            // Ringerike filter should also match Hønefoss
            if (loc === 'Ringerike' && (p.city?.includes('Hønefoss') || p.address?.includes('Hønefoss'))) return true;
            return false;
        });

        // Type
        const typeMatch = !filters.type || p.property_type?.toLowerCase().includes(filters.type.toLowerCase()) || filters.type === 'Alle';

        // Price
        const price = p.price || p.price_total || 0;
        const priceMatch = (price >= filters.minPrice) && (filters.maxPrice === 0 || price <= filters.maxPrice);

        return searchMatch && locationMatch && typeMatch && priceMatch;
    });

    const toggleLocation = (loc) => {
        setFilters(prev => ({
            ...prev,
            locations: prev.locations.includes(loc)
                ? prev.locations.filter(l => l !== loc)
                : [...prev.locations, loc]
        }));
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
            <div className="flex justify-center gap-2 mb-6">
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

            {/* FILTERS SECTION */}
            {activeTab === 'overview' && (
                <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* 1. Locations */}
                        <div>
                            <label className="text-[10px] uppercase tracking-wider text-stone-500 mb-2 block">Områder</label>
                            <div className="flex flex-wrap gap-2">
                                {['Oslo', 'Ringerike', 'Hole'].map(loc => (
                                    <button
                                        key={loc}
                                        onClick={() => toggleLocation(loc)}
                                        className={`px-3 py-1.5 rounded-full text-xs border transition-all ${filters.locations.includes(loc)
                                            ? 'bg-brass text-obsidian border-brass font-bold'
                                            : 'bg-transparent text-stone-400 border-stone-700 hover:border-stone-500'
                                            }`}
                                    >
                                        {loc}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Type & Price */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] uppercase tracking-wider text-stone-500 mb-2 block">Boligtype</label>
                                <select
                                    value={filters.type}
                                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                                    className="w-full bg-obsidian border border-white/20 rounded px-3 py-1.5 text-sm text-ink-primary"
                                >
                                    <option value="Alle">Alle typer</option>
                                    <option value="Leilighet">Leilighet</option>
                                    <option value="Enebolig">Enebolig</option>
                                    <option value="Rekkehus">Rekkehus</option>
                                </select>
                            </div>
                        </div>

                        {/* 3. Price Range Input */}
                        <div>
                            <label className="text-[10px] uppercase tracking-wider text-stone-500 mb-2 block">Prisnivå (NOK)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={filters.minPrice}
                                    onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                                    placeholder="Fra"
                                    className="w-full bg-obsidian border border-white/20 rounded px-3 py-1.5 text-sm text-ink-primary"
                                />
                                <span className="text-stone-500">-</span>
                                <input
                                    type="number"
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                                    placeholder="Til"
                                    className="w-full bg-obsidian border border-white/20 rounded px-3 py-1.5 text-sm text-ink-primary"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab Content */}
            {activeTab === 'overview' && (() => {
                return (
                    <div className="space-y-6">
                        {/* Property Carousel - Kuppeliste */}
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-8 h-8 text-brass animate-spin" />
                            </div>
                        ) : (
                            <PropertyCarousel
                                title={filters.locations.length > 0 ? `Resultater i ${filters.locations.join(', ')}` : "Alle Annonser"}
                                subtitle={`${filteredProperties.length} boliger funnet (Filter: ${filters.type}, ${filters.minPrice / 1000000}-${filters.maxPrice / 1000000}M)`}
                                properties={filteredProperties}
                            />
                        )}

                        {/* Demo Property Info (Optional: could be replaced by first filtered property) */}
                        {filteredProperties.length > 0 && (
                            <div className="velvet-card p-4 flex items-center gap-4">
                                <div className="w-24 h-24 rounded-lg bg-stone-800 flex items-center justify-center overflow-hidden">
                                    {/* ... keeping existing demo card logic for now, using first filtered prop ... */}
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
                <MapAnalysis properties={filteredProperties} />
            )}
        </div>
    );
}
