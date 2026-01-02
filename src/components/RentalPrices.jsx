import React, { useMemo, useState } from 'react';
import { Home, Warehouse, TrendingUp } from 'lucide-react';

// Estimated Gross Yields by Area
const YIELD_RATES = {
    'Oslo': 0.046,      // 4.6%
    'Ringerike': 0.054, // 5.4%
    'Hole': 0.050,      // 5.0%
    'Hønefoss': 0.054,  // 5.4% (same as Ringerike)
    'Default': 0.050    // 5.0%
};

const getYield = (city) => {
    if (!city) return YIELD_RATES['Default'];
    const key = Object.keys(YIELD_RATES).find(k => city.includes(k));
    return YIELD_RATES[key] || YIELD_RATES['Default'];
};

const calculateMonthlyRent = (price, city) => {
    if (!price) return 0;
    const yieldRate = getYield(city);
    return Math.round((price * yieldRate) / 12);
};

function formatPrice(num, fallback = '—') {
    if (!num || isNaN(num)) return fallback;
    return new Intl.NumberFormat('nb-NO').format(Math.round(num));
}

export default function RentalPrices({ properties = [] }) {
    const [selectedType, setSelectedType] = useState('leilighet');

    // Calculate Stats
    const stats = useMemo(() => {
        if (properties.length === 0) return null;

        let totalRentPerSqm = 0;
        let countSqm = 0;

        const byBedrooms = {}; // { '1': { sum, count }, ... }
        const byType = {
            leilighet: { count: 0, sum: 0 },
            enebolig: { count: 0, sum: 0 },
            rekkehus: { count: 0, sum: 0 }
        };

        properties.forEach(p => {
            const price = p.price || p.price_total || 0;
            const sqm = p.sqm || 0;
            const bedrooms = p.bedrooms || 0;
            const city = p.city || "";
            const type = (p.property_type || "").toLowerCase();

            if (price > 0) {
                const estRent = calculateMonthlyRent(price, city);

                // Per Sqm
                if (sqm > 0) {
                    totalRentPerSqm += (estRent / sqm);
                    countSqm++;
                }

                // By Bedrooms
                const bedKey = bedrooms >= 4 ? '4+' : (bedrooms || '?');
                if (!byBedrooms[bedKey]) byBedrooms[bedKey] = { sum: 0, count: 0 };
                byBedrooms[bedKey].sum += estRent;
                byBedrooms[bedKey].count++;

                // By Type
                if (type.includes('leilighet')) {
                    byType.leilighet.sum += estRent;
                    byType.leilighet.count++;
                } else if (type.includes('enebolig')) {
                    byType.enebolig.sum += estRent;
                    byType.enebolig.count++;
                } else if (type.includes('rekkehus')) {
                    byType.rekkehus.sum += estRent;
                    byType.rekkehus.count++;
                }
            }
        });

        // Averages
        const avgPerSqm = countSqm > 0 ? totalRentPerSqm / countSqm : 0;

        const bedroomStats = [1, 2, 3, '4+'].map(r => {
            const d = byBedrooms[r];
            return {
                rooms: r === '4+' ? '4+ soverom' : `${r} soverom`,
                price: d ? d.sum / d.count : 0
            };
        });

        return {
            perSqm: avgPerSqm,
            byBedrooms: bedroomStats,
            byType
        };

    }, [properties]);

    if (!stats) {
        return (
            <div className="velvet-card p-5 mb-6 opacity-50">
                <h3 className="text-lg font-serif text-brass mb-4">Leiepriser</h3>
                <p className="text-sm text-stone-400">Ingen data tilgjengelig for valgte filtre.</p>
            </div>
        );
    }

    return (
        <div className="velvet-card p-5 mb-6 fade-in">
            <h3 className="text-lg font-serif text-brass mb-4 flex items-center gap-2">
                <Home className="w-5 h-5" />
                Estimerte Leiepriser
            </h3>

            {/* Per m² */}
            <div className="mb-6">
                <h4 className="text-xs uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-brass" />
                    Snitt leieinntekt (Est. Yield ~5%)
                </h4>
                <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-stone-400 text-sm">per m²</span>
                    <span className="text-2xl font-serif text-ink-primary">{formatPrice(stats.perSqm)}</span>
                    <span className="text-stone-500 text-sm">kr</span>
                </div>

                {/* By bedrooms */}
                <div className="space-y-2">
                    {stats.byBedrooms.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                            <span className="text-stone-300">{item.rooms}</span>
                            <span className="text-ink-primary font-medium">{formatPrice(item.price)} kr</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* By property type */}
            <div>
                <h4 className="text-xs uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-2">
                    <Warehouse className="w-4 h-4" />
                    Snitt per boligtype
                </h4>

                {/* Type selector */}
                <div className="flex gap-2 mb-4">
                    {Object.keys(stats.byType).map(type => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`px-3 py-1.5 rounded-md text-sm transition-colors capitalize ${selectedType === type
                                ? 'bg-brass/20 text-brass border border-brass/30'
                                : 'bg-white/5 text-stone-400 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            {type}
                            <span className="ml-1.5 text-xs opacity-60">({stats.byType[type].count})</span>
                        </button>
                    ))}
                </div>

                {/* Selected type details */}
                <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">Gjennomsnittsleie</div>
                    <div className="text-2xl font-serif text-ink-primary">
                        {stats.byType[selectedType].count > 0
                            ? formatPrice(stats.byType[selectedType].sum / stats.byType[selectedType].count) + ' kr'
                            : '—'
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
