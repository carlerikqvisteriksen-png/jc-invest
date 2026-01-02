import React, { useState, useMemo } from 'react';
import { Map, Calendar, TrendingUp, Home, BarChart3, ChevronDown, MapPin, Layers } from 'lucide-react';

// Abstract map nodes for the requested areas
const AREA_NODES = [
    { id: 'oslo', name: 'Oslo', lat: 70, lng: 70 },       // Bottom Right
    { id: 'ringerike', name: 'Ringerike', lat: 30, lng: 30 }, // Top Left (includes Hønefoss)
    { id: 'hole', name: 'Hole', lat: 60, lng: 40 }        // Middle Left
];

const formatPrice = (num) => new Intl.NumberFormat('nb-NO').format(Math.round(num));

function AreaMarker({ area, stats, isSelected, onClick }) {
    const count = stats?.count || 0;
    const avgPrice = stats?.avgPrice || 0;

    // Position on 0-100 grid
    const style = {
        left: `${area.lng}%`,
        top: `${area.lat}%`
    };

    return (
        <button
            onClick={() => onClick(area)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all group ${isSelected ? 'z-20 scale-110' : 'z-10 hover:scale-105'}`}
            style={style}
        >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${isSelected
                    ? 'bg-brass text-obsidian shadow-lg shadow-brass/30'
                    : 'bg-obsidian border-2 border-brass/50 text-brass group-hover:bg-brass/20'
                }`}>
                {count > 99 ? '99+' : count}
            </div>

            {/* Label always visible for main nodes if desired, or just on hover/select */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap bg-obsidian/90 border border-white/20 rounded px-3 py-1.5 text-xs shadow-xl backdrop-blur-sm">
                <div className="font-medium text-ink-primary text-center">{area.name}</div>
                {count > 0 && (
                    <div className="text-stone-400 text-[10px] text-center">{formatPrice(avgPrice)} kr</div>
                )}
            </div>
        </button>
    );
}

function StatCard({ icon: Icon, label, value, subValue }) {
    return (
        <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center gap-2 text-stone-500 mb-1">
                <Icon className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-wider">{label}</span>
            </div>
            <div className="text-lg font-serif text-ink-primary">{value}</div>
            {subValue && <div className="text-xs text-stone-500">{subValue}</div>}
        </div>
    );
}

export default function MapAnalysis({ properties = [] }) {
    const [selectedAreaId, setSelectedAreaId] = useState(null);
    const [dateFilter, setDateFilter] = useState('60');
    const [showFilters, setShowFilters] = useState(false);

    // Process Data
    const analysis = useMemo(() => {
        const stats = {
            totalListings: properties.length,
            avgPrice: 0,
            avgSqmPrice: 0,
            areas: {} // { oslo: { count, sumPrice, ... } }
        };

        let totalPrice = 0;
        let totalSqm = 0;
        let priceCount = 0;

        // Initialize areas
        AREA_NODES.forEach(node => {
            stats.areas[node.id] = { count: 0, sumPrice: 0, priceCount: 0 };
        });

        properties.forEach(p => {
            const price = p.price || p.price_total || 0;
            const sqm = p.sqm || 0;
            const city = (p.city || "").toLowerCase();
            const address = (p.address || "").toLowerCase();

            // Dynamic Stats
            if (price > 0) {
                totalPrice += price;
                priceCount++;
            }
            if (price > 0 && sqm > 0) {
                totalSqm += sqm;
            }

            // Categorize
            let areaId = null;
            if (city.includes('oslo') || address.includes('oslo')) areaId = 'oslo';
            else if (city.includes('ringerike') || city.includes('hønefoss') || address.includes('hønefoss')) areaId = 'ringerike';
            else if (city.includes('hole')) areaId = 'hole';

            if (areaId && stats.areas[areaId]) {
                stats.areas[areaId].count++;
                if (price > 0) {
                    stats.areas[areaId].sumPrice += price;
                    stats.areas[areaId].priceCount++;
                }
            }
        });

        stats.avgPrice = priceCount > 0 ? totalPrice / priceCount : 0;
        // Approximation for visualization if we don't have perfect sqm data for all
        stats.avgSqmPrice = totalSqm > 0 ? totalPrice / totalSqm : 0; // This is rough, usually sum(price/sqm) / N is better but this is ok for overview

        // Finalize Area Stats
        Object.keys(stats.areas).forEach(key => {
            const area = stats.areas[key];
            area.avgPrice = area.priceCount > 0 ? area.sumPrice / area.priceCount : 0;
        });

        return stats;
    }, [properties]);

    const selectedAreaNode = AREA_NODES.find(n => n.id === selectedAreaId);
    const selectedStats = selectedAreaId ? analysis.areas[selectedAreaId] : null;

    return (
        <div className="velvet-card overflow-hidden fade-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="text-lg font-serif text-brass flex items-center gap-2">
                    <Map className="w-5 h-5" />
                    Dybdeanalyse
                </h3>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-stone-400 hover:bg-white/10 transition-colors"
                        >
                            <Calendar className="w-3 h-3" />
                            Siste {dateFilter} dager
                            <ChevronDown className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Left sidebar - stats */}
                <div className="p-4 border-r border-white/10 space-y-4">
                    <div className="text-xs text-stone-500">
                        Viser data for {analysis.totalListings} eiendommer
                    </div>

                    <StatCard
                        icon={Home}
                        label="Antall eiendommer"
                        value={analysis.totalListings}
                        subValue={selectedAreaId ? `I ${selectedAreaNode.name}` : "Totalt i utvalget"}
                    />

                    <StatCard
                        icon={TrendingUp}
                        label="Snittpris"
                        value={`${formatPrice(selectedAreaId ? selectedStats?.avgPrice : analysis.avgPrice)} kr`}
                        subValue="Gjennomsnittlig totalpris"
                    />

                    {/* Simplified breakdown since we might not have enough data for bedrooms/types in small samples */}
                    <div className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-stone-500 mb-2">
                            <BarChart3 className="w-4 h-4" />
                            <span className="text-[10px] uppercase tracking-wider">Fordeling per område</span>
                        </div>
                        <div className="space-y-2">
                            {AREA_NODES.map(node => {
                                const count = analysis.areas[node.id]?.count || 0;
                                const percentage = analysis.totalListings > 0 ? (count / analysis.totalListings) * 100 : 0;
                                return (
                                    <div key={node.id} className="text-xs">
                                        <div className="flex justify-between mb-1 text-stone-400">
                                            <span>{node.name}</span>
                                            <span>{count}</span>
                                        </div>
                                        <div className="h-1.5 bg-obsidian rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-brass/60"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>

                {/* Map area */}
                <div className="lg:col-span-2 relative min-h-[400px] bg-gradient-to-br from-stone-900 to-stone-800 overflow-hidden">
                    {/* Abstract Grid Background */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <svg width="100%" height="100%">
                            <defs>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-stone-500" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                    </div>

                    {/* Simple geometric map representation */}
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                        {/* Connecting lines */}
                        <path d="M 70 70 L 30 30" stroke="currentColor" strokeWidth="0.2" className="text-brass" strokeDasharray="2 2" />
                        <path d="M 70 70 L 40 60" stroke="currentColor" strokeWidth="0.2" className="text-brass" strokeDasharray="2 2" />
                        <path d="M 30 30 L 40 60" stroke="currentColor" strokeWidth="0.2" className="text-brass" strokeDasharray="2 2" />
                    </svg>

                    {/* Area markers */}
                    <div className="absolute inset-0">
                        {AREA_NODES.map(node => (
                            <AreaMarker
                                key={node.id}
                                area={node}
                                stats={analysis.areas[node.id]}
                                isSelected={selectedAreaId === node.id}
                                onClick={(area) => setSelectedAreaId(area.id === selectedAreaId ? null : area.id)}
                            />
                        ))}
                    </div>

                    {/* Legend / Info */}
                    <div className="absolute bottom-4 right-4 text-right pointer-events-none">
                        <div className="text-[10px] text-stone-500 uppercase tracking-wider mb-1">
                            Valgt Visning
                        </div>
                        <div className="text-2xl font-serif text-brass/20">
                            {selectedAreaId ? selectedAreaNode.name : 'Oversikt'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
