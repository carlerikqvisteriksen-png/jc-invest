import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

function formatPrice(num) {
    if (!num || isNaN(num)) return '—';
    return new Intl.NumberFormat('nb-NO').format(Math.round(num));
}

function TrendIndicator({ change }) {
    if (change === null || change === undefined) return null;

    if (change > 0) {
        return (
            <span className="flex items-center gap-1 text-green-400 text-xs">
                <TrendingUp className="w-3 h-3" />
                +{change}%
            </span>
        );
    } else if (change < 0) {
        return (
            <span className="flex items-center gap-1 text-red-400 text-xs">
                <TrendingDown className="w-3 h-3" />
                {change}%
            </span>
        );
    }
    return (
        <span className="flex items-center gap-1 text-stone-400 text-xs">
            <Minus className="w-3 h-3" />
            0%
        </span>
    );
}

export default function ValueEstimateCards({ properties = [], comparableSales = [] }) {

    // Calculate dynamic values from properties
    const stats = useMemo(() => {
        // Properties stats
        const validProps = properties.filter(p => p.price || p.price_total);
        const totalPrice = validProps.reduce((sum, p) => sum + (p.price || p.price_total || 0), 0);
        const avgPrice = validProps.length > 0 ? totalPrice / validProps.length : 0;

        const validSqmProps = validProps.filter(p => p.sqm > 0);
        const avgPricePerSqm = validSqmProps.length > 0
            ? validSqmProps.reduce((sum, p) => sum + ((p.price || p.price_total) / p.sqm), 0) / validSqmProps.length
            : 0;

        // Comparable sales stats
        const validSales = comparableSales.filter(s => s.sold_price || s.price);
        const totalSalesPrice = validSales.reduce((sum, s) => sum + (s.sold_price || s.price || 0), 0);
        const avgSalesPrice = validSales.length > 0 ? totalSalesPrice / validSales.length : 0;

        const validSalesSqm = validSales.filter(s => s.sqm > 0);
        const avgSalesPricePerSqm = validSalesSqm.length > 0
            ? validSalesSqm.reduce((sum, s) => sum + ((s.sold_price || s.price) / s.sqm), 0) / validSalesSqm.length
            : 0;

        return {
            indexedPrice: {
                value: avgPrice,
                perSqm: avgPricePerSqm,
                change: null, // No historical data yet
                label: 'Snittpris',
                subtitle: `${validProps.length} boliger`
            },
            estimate: {
                value: avgPrice * 0.98, // Slight discount as "estimate"
                perSqm: avgPricePerSqm * 0.98,
                change: null,
                label: 'Estimert verdi'
            },
            comparableSales: {
                value: avgSalesPrice,
                perSqm: avgSalesPricePerSqm,
                count: validSales.length,
                label: 'Sammenlignbare salg'
            }
        };
    }, [properties, comparableSales]);

    // If no data, show placeholder
    if (properties.length === 0 && comparableSales.length === 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 opacity-50">
                <div className="rounded-lg p-4 bg-white/5 border border-white/10 text-center">
                    <p className="text-stone-400 text-sm">Ingen data tilgjengelig</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 fade-in">
            {/* Snittpris - Purple */}
            <div className="relative overflow-hidden rounded-lg p-4 bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-purple-300/80 text-xs uppercase tracking-wider">
                            {stats.indexedPrice.label}
                        </span>
                        <TrendIndicator change={stats.indexedPrice.change} />
                    </div>
                    {stats.indexedPrice.subtitle && (
                        <span className="text-purple-400/60 text-[10px]">{stats.indexedPrice.subtitle}</span>
                    )}
                    <div className="text-2xl font-serif text-purple-100 mt-2">
                        {formatPrice(stats.indexedPrice.value)}
                    </div>
                    <div className="text-purple-300/60 text-xs mt-1">
                        kr/m² <span className="text-purple-200">{formatPrice(stats.indexedPrice.perSqm)}</span>
                    </div>
                </div>
            </div>

            {/* Verdiestimat - Green */}
            <div className="relative overflow-hidden rounded-lg p-4 bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-500/30">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-green-300/80 text-xs uppercase tracking-wider">
                            {stats.estimate.label}
                        </span>
                        <TrendIndicator change={stats.estimate.change} />
                    </div>
                    <div className="text-2xl font-serif text-green-100 mt-2">
                        {formatPrice(stats.estimate.value)}
                    </div>
                    <div className="text-green-300/60 text-xs mt-1">
                        kr/m² <span className="text-green-200">{formatPrice(stats.estimate.perSqm)}</span>
                    </div>
                </div>
            </div>

            {/* Sammenlignbare salg - Blue */}
            <div className="relative overflow-hidden rounded-lg p-4 bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-blue-300/80 text-xs uppercase tracking-wider">
                            {stats.comparableSales.label}
                        </span>
                        {stats.comparableSales.count > 0 && (
                            <span className="text-blue-400/60 text-xs">
                                basert på <span className="text-blue-300">{stats.comparableSales.count}</span>
                            </span>
                        )}
                    </div>
                    <div className="text-2xl font-serif text-blue-100 mt-2">
                        {formatPrice(stats.comparableSales.value)}
                    </div>
                    <div className="text-blue-300/60 text-xs mt-1">
                        kr/m² <span className="text-blue-200">{formatPrice(stats.comparableSales.perSqm)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
