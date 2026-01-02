import React, { useState } from 'react';
import { Map, Filter, Calendar, TrendingUp, Home, BarChart3, ChevronDown, MapPin, Layers } from 'lucide-react';

// Mock area data - replace with real API data later
const mockAreaData = {
    totalListings: 2251,
    dateRange: 'siste 60 dagene',
    avgPricePerSqm: 260,
    priceByBedrooms: [
        { bedrooms: '1 soverom', price: 13518 },
        { bedrooms: '2 soverom', price: 17509 },
        { bedrooms: '3 soverom', price: 19972 },
        { bedrooms: '4+ soverom', price: 26453 }
    ],
    priceByType: [
        { type: 'Leilighet', moblert: 17732, umoblert: 16762, delvisMoblert: 19923 },
        { type: 'Rekkehus', moblert: 20445, umoblert: 18762, delvisMoblert: null },
        { type: 'Tomannsbolig', moblert: null, umoblert: 22000, delvisMoblert: null },
        { type: 'Enebolig', moblert: 29000, umoblert: 25000, delvisMoblert: null }
    ],
    areas: [
        { id: 1, name: 'Oslo Sentrum', count: 412, avgPrice: 24500, lat: 63.4305, lng: 10.3951 }, // Keeping coords abstract for now
        { id: 2, name: 'Grünerløkka', count: 328, avgPrice: 21200, lat: 63.4402, lng: 10.4321 },
        { id: 3, name: 'Frogner', count: 156, avgPrice: 26800, lat: 63.4123, lng: 10.3456 },
        { id: 4, name: 'Hønefoss', count: 89, avgPrice: 13500, lat: 63.3654, lng: 10.3876 },
        { id: 5, name: 'Ringerike', count: 45, avgPrice: 12200, lat: 63.3521, lng: 10.3321 },
        { id: 6, name: 'Hole', count: 12, avgPrice: 14800, lat: 63.4098, lng: 10.4234 },
        { id: 7, name: 'Gamle Oslo', count: 212, avgPrice: 19500, lat: 63.4234, lng: 10.3654 },
        { id: 8, name: 'St. Hanshaugen', count: 143, avgPrice: 22800, lat: 63.3876, lng: 10.4012 }
    ]
};

const formatPrice = (num) => new Intl.NumberFormat('nb-NO').format(num);

function AreaMarker({ area, isSelected, onClick }) {
    return (
        <button
            onClick={() => onClick(area)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${isSelected ? 'z-20 scale-110' : 'z-10 hover:scale-105'
                }`}
            style={{
                left: `${((area.lng - 10.3) / 0.2) * 100}%`,
                top: `${100 - ((area.lat - 63.35) / 0.1) * 100}%`
            }}
        >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isSelected
                ? 'bg-brass text-obsidian shadow-lg shadow-brass/30'
                : 'bg-obsidian border-2 border-brass/50 text-brass hover:bg-brass/20'
                }`}>
                {area.count > 99 ? '99+' : area.count}
            </div>
            {isSelected && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap bg-obsidian border border-white/20 rounded px-2 py-1 text-xs shadow-xl">
                    <div className="font-medium text-ink-primary">{area.name}</div>
                    <div className="text-stone-500">{formatPrice(area.avgPrice)} kr/mnd</div>
                </div>
            )}
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

export default function MapAnalysis({ data = mockAreaData }) {
    const [selectedArea, setSelectedArea] = useState(null);
    const [dateFilter, setDateFilter] = useState('60');
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="velvet-card overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="text-lg font-serif text-brass flex items-center gap-2">
                    <Map className="w-5 h-5" />
                    Dybdeanalyse
                </h3>
                <div className="flex items-center gap-2">
                    {/* Date filter */}
                    <div className="relative">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-stone-400 hover:bg-white/10 transition-colors"
                        >
                            <Calendar className="w-3 h-3" />
                            Siste {dateFilter} dager
                            <ChevronDown className="w-3 h-3" />
                        </button>
                        {showFilters && (
                            <div className="absolute right-0 top-full mt-1 bg-obsidian border border-white/10 rounded shadow-xl z-20">
                                {['30', '60', '90', '180'].map(d => (
                                    <button
                                        key={d}
                                        onClick={() => { setDateFilter(d); setShowFilters(false); }}
                                        className={`block w-full px-4 py-2 text-xs text-left hover:bg-white/5 ${dateFilter === d ? 'text-brass' : 'text-stone-400'
                                            }`}
                                    >
                                        Siste {d} dager
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Left sidebar - stats */}
                <div className="p-4 border-r border-white/10 space-y-4">
                    <div className="text-xs text-stone-500">
                        Statistikk for utleieannonser de siste {dateFilter} dagene
                    </div>

                    <StatCard
                        icon={Home}
                        label="Antall utleieannonser"
                        value={formatPrice(data.totalListings)}
                    />

                    <div>
                        <h4 className="text-xs uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2">
                            <TrendingUp className="w-3 h-3" />
                            Gjennomsnittlige leiepriser
                        </h4>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-400">per m²</span>
                                <span className="text-ink-primary">{data.avgPricePerSqm} kr</span>
                            </div>
                            {data.priceByBedrooms.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <span className="text-stone-400">{item.bedrooms}</span>
                                    <span className="text-ink-primary">{formatPrice(item.price)} kr</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2">
                            <BarChart3 className="w-3 h-3" />
                            Gjennomsnittsleie per boligtype
                        </h4>
                        <div className="space-y-3">
                            {data.priceByType.map((item, idx) => (
                                <div key={idx} className="bg-white/5 rounded p-2">
                                    <div className="text-xs text-stone-300 mb-1">{item.type}</div>
                                    <div className="grid grid-cols-3 gap-2 text-[10px]">
                                        <div>
                                            <div className="text-stone-500">Møblert</div>
                                            <div className="text-ink-primary">{item.moblert ? formatPrice(item.moblert) : '—'}</div>
                                        </div>
                                        <div>
                                            <div className="text-stone-500">Umøblert</div>
                                            <div className="text-ink-primary">{item.umoblert ? formatPrice(item.umoblert) : '—'}</div>
                                        </div>
                                        <div>
                                            <div className="text-stone-500">Delvis</div>
                                            <div className="text-ink-primary">{item.delvisMoblert ? formatPrice(item.delvisMoblert) : '—'}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Map area */}
                <div className="lg:col-span-2 relative min-h-[400px] bg-gradient-to-br from-stone-900 to-stone-800">
                    {/* Placeholder map background */}
                    <div className="absolute inset-0 opacity-30">
                        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                            {/* Grid lines */}
                            {[...Array(10)].map((_, i) => (
                                <React.Fragment key={i}>
                                    <line x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="0.2" />
                                    <line x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="rgba(255,255,255,0.1)" strokeWidth="0.2" />
                                </React.Fragment>
                            ))}
                            {/* Random "roads" */}
                            <path d="M10,50 Q30,30 50,50 T90,50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                            <path d="M50,10 Q70,30 50,50 T50,90" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                            <path d="M20,20 L80,80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
                            <path d="M80,20 L20,80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
                        </svg>
                    </div>

                    {/* Area markers */}
                    <div className="absolute inset-4">
                        {data.areas.map(area => (
                            <AreaMarker
                                key={area.id}
                                area={area}
                                isSelected={selectedArea?.id === area.id}
                                onClick={setSelectedArea}
                            />
                        ))}
                    </div>

                    {/* Map legend */}
                    <div className="absolute bottom-4 left-4 bg-obsidian/90 border border-white/10 rounded-lg p-3 backdrop-blur">
                        <div className="flex items-center gap-2 text-[10px] text-stone-400 mb-2">
                            <Layers className="w-3 h-3" />
                            Antall annonser per område
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <div className="w-4 h-4 rounded-full bg-obsidian border border-brass/30"></div>
                                <span className="text-[10px] text-stone-500">&lt; 100</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-4 h-4 rounded-full bg-brass/30 border border-brass/50"></div>
                                <span className="text-[10px] text-stone-500">100-200</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-4 h-4 rounded-full bg-brass border border-brass"></div>
                                <span className="text-[10px] text-stone-500">&gt; 200</span>
                            </div>
                        </div>
                    </div>

                    {/* Info box */}
                    <div className="absolute top-4 right-4 bg-obsidian/90 border border-white/10 rounded-lg p-3 backdrop-blur max-w-[200px]">
                        <div className="flex items-center gap-2 text-brass text-xs mb-1">
                            <MapPin className="w-3 h-3" />
                            {selectedArea ? selectedArea.name : 'Trondheim'}
                        </div>
                        <div className="text-lg font-serif text-ink-primary">
                            {selectedArea ? formatPrice(selectedArea.avgPrice) : formatPrice(data.avgPricePerSqm * 65)} <span className="text-xs text-stone-500">kr/mnd</span>
                        </div>
                        <div className="text-[10px] text-stone-500 mt-1">
                            {selectedArea ? `${selectedArea.count} annonser` : `${formatPrice(data.totalListings)} annonser totalt`}
                        </div>
                    </div>

                    {/* Placeholder text for real map integration */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center text-stone-600">
                            <Map className="w-12 h-12 mx-auto mb-2 opacity-30" />
                            <p className="text-xs opacity-50">Interaktivt kart</p>
                            <p className="text-[10px] opacity-30">Klikk på områder for detaljer</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
