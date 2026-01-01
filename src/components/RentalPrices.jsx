import React, { useState } from 'react';
import { Home, Warehouse } from 'lucide-react';

// Mock data - replace with real data later
const defaultData = {
    perSqm: 260,
    byBedrooms: [
        { rooms: '1 soverom', price: 13518 },
        { rooms: '2 soverom', price: 17509 },
        { rooms: '3 soverom', price: 19972 },
        { rooms: '4+ soverom', price: 26453 }
    ],
    byType: {
        leilighet: {
            count: 1586,
            moblert: 17732,
            umoblert: 16762,
            delvisMoblert: 19923
        },
        enebolig: {
            count: 35,
            moblert: null,
            umoblert: null,
            delvisMoblert: null
        }
    }
};

function formatPrice(num) {
    if (num === null || num === undefined) return '—';
    return new Intl.NumberFormat('nb-NO').format(num);
}

export default function RentalPrices({ data = defaultData }) {
    const [selectedType, setSelectedType] = useState('leilighet');

    return (
        <div className="velvet-card p-5 mb-6">
            <h3 className="text-lg font-serif text-brass mb-4 flex items-center gap-2">
                <Home className="w-5 h-5" />
                Leiepriser
            </h3>

            {/* Per m² */}
            <div className="mb-6">
                <h4 className="text-xs uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brass"></span>
                    Gjennomsnittlige leiepriser
                </h4>
                <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-stone-400 text-sm">per m²</span>
                    <span className="text-2xl font-serif text-ink-primary">{formatPrice(data.perSqm)}</span>
                    <span className="text-stone-500 text-sm">kr</span>
                </div>

                {/* By bedrooms */}
                <div className="space-y-2">
                    {data.byBedrooms.map((item, idx) => (
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
                    Gjennomsnittsleie per boligtype
                </h4>

                {/* Type selector */}
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setSelectedType('leilighet')}
                        className={`px-3 py-1.5 rounded-md text-sm transition-colors ${selectedType === 'leilighet'
                                ? 'bg-brass/20 text-brass border border-brass/30'
                                : 'bg-white/5 text-stone-400 border border-white/10 hover:bg-white/10'
                            }`}
                    >
                        Leilighet
                        <span className="ml-1.5 text-xs opacity-60">({data.byType.leilighet.count})</span>
                    </button>
                    <button
                        onClick={() => setSelectedType('enebolig')}
                        className={`px-3 py-1.5 rounded-md text-sm transition-colors ${selectedType === 'enebolig'
                                ? 'bg-brass/20 text-brass border border-brass/30'
                                : 'bg-white/5 text-stone-400 border border-white/10 hover:bg-white/10'
                            }`}
                    >
                        Enebolig
                        <span className="ml-1.5 text-xs opacity-60">({data.byType.enebolig.count})</span>
                    </button>
                </div>

                {/* Selected type details */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">Møblert</div>
                        <div className="text-lg font-medium text-ink-primary">
                            {formatPrice(data.byType[selectedType].moblert)}
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">Umøblert</div>
                        <div className="text-lg font-medium text-ink-primary">
                            {formatPrice(data.byType[selectedType].umoblert)}
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">Delvis møblert</div>
                        <div className="text-lg font-medium text-ink-primary">
                            {formatPrice(data.byType[selectedType].delvisMoblert)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
