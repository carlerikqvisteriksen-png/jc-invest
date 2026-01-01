import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// Mock data - replace with real data later
const defaultData = {
    indexedPrice: {
        value: 12492448,
        perSqm: 123688,
        change: 17,
        label: 'Indeksert pris',
        date: 'fra 26.01.2024'
    },
    estimate: {
        value: 12216000,
        perSqm: 120950,
        change: null,
        label: 'Verdiestimat'
    },
    comparableSales: {
        value: 11857542,
        perSqm: 117401,
        count: 396,
        label: 'Sammenlignbare salg'
    }
};

function formatPrice(num) {
    return new Intl.NumberFormat('nb-NO').format(num);
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

export default function ValueEstimateCards({ data = defaultData }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Indeksert pris - Purple */}
            <div className="relative overflow-hidden rounded-lg p-4 bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-purple-300/80 text-xs uppercase tracking-wider">
                            {data.indexedPrice.label}
                        </span>
                        <TrendIndicator change={data.indexedPrice.change} />
                    </div>
                    {data.indexedPrice.date && (
                        <span className="text-purple-400/60 text-[10px]">{data.indexedPrice.date}</span>
                    )}
                    <div className="text-2xl font-serif text-purple-100 mt-2">
                        {formatPrice(data.indexedPrice.value)}
                    </div>
                    <div className="text-purple-300/60 text-xs mt-1">
                        kr/m² <span className="text-purple-200">{formatPrice(data.indexedPrice.perSqm)}</span>
                    </div>
                </div>
            </div>

            {/* Verdiestimat - Green */}
            <div className="relative overflow-hidden rounded-lg p-4 bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-500/30">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-green-300/80 text-xs uppercase tracking-wider">
                            {data.estimate.label}
                        </span>
                        <TrendIndicator change={data.estimate.change} />
                    </div>
                    <div className="text-2xl font-serif text-green-100 mt-2">
                        {formatPrice(data.estimate.value)}
                    </div>
                    <div className="text-green-300/60 text-xs mt-1">
                        kr/m² <span className="text-green-200">{formatPrice(data.estimate.perSqm)}</span>
                    </div>
                </div>
            </div>

            {/* Sammenlignbare salg - Blue */}
            <div className="relative overflow-hidden rounded-lg p-4 bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-blue-300/80 text-xs uppercase tracking-wider">
                            {data.comparableSales.label}
                        </span>
                        {data.comparableSales.count && (
                            <span className="text-blue-400/60 text-xs">
                                basert på <span className="text-blue-300">{data.comparableSales.count}</span>
                            </span>
                        )}
                    </div>
                    <div className="text-2xl font-serif text-blue-100 mt-2">
                        {formatPrice(data.comparableSales.value)}
                    </div>
                    <div className="text-blue-300/60 text-xs mt-1">
                        kr/m² <span className="text-blue-200">{formatPrice(data.comparableSales.perSqm)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
