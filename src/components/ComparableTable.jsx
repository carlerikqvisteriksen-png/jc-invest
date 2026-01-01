import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Filter, Check, X } from 'lucide-react';

// Mock data - replace with real data later
const mockData = [
    { id: 1, address: "Rosenborggate 9 A", sold: "04.2025", price: 8558780, pricePerSqm: 104583, sqm: 78, floor: 4, year: 1937, status: "Umøblert" },
    { id: 2, address: "Dyre Halses Gate 1 C", sold: "03.2025", price: 8108000, pricePerSqm: 104149, sqm: 289, floor: 4, year: 1917, status: "Umøblert" },
    { id: 3, address: "Dyre Halses Gate 9", sold: "04.2025", price: 8000000, pricePerSqm: 98765, sqm: 405, floor: 3, year: 1935, status: "Delvis møblert" },
    { id: 4, address: "Dyre Halses Gate 3", sold: "02.2025", price: 9176000, pricePerSqm: 114700, sqm: 80, floor: 5, year: 1956, status: "Umøblert" },
    { id: 5, address: "Langenbakla i 926", sold: "04.2025", price: 7100000, pricePerSqm: 88750, sqm: 392, floor: 1, year: 1940, status: "Umøblert" },
    { id: 6, address: "Thereses Gate 1", sold: "04.2025", price: 7650000, pricePerSqm: 95625, sqm: 389, floor: 3, year: 1898, status: "Umøblert" },
    { id: 7, address: "Norsegata 30a", sold: "04.2025", price: 7450000, pricePerSqm: 93125, sqm: 379, floor: 1, year: 1902, status: "Delvis møblert" },
    { id: 8, address: "Kirkegata 57 A", sold: "04.2025", price: 6890000, pricePerSqm: 86125, sqm: 347, floor: 4, year: 1925, status: "Umøblert" },
];

const formatPrice = (num) => new Intl.NumberFormat('nb-NO').format(num);

export default function ComparableTable({ data = mockData, title = "Sammenlignbare salg" }) {
    const [sortConfig, setSortConfig] = useState({ key: 'sold', direction: 'desc' });
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [filterStatus, setFilterStatus] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const sortedData = useMemo(() => {
        let filteredData = [...data];

        // Apply status filter
        if (filterStatus) {
            filteredData = filteredData.filter(item => item.status === filterStatus);
        }

        // Apply sorting
        filteredData.sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];

            // Handle date sorting
            if (sortConfig.key === 'sold') {
                const [aMonth, aYear] = aVal.split('.');
                const [bMonth, bYear] = bVal.split('.');
                aVal = parseInt(aYear) * 100 + parseInt(aMonth);
                bVal = parseInt(bYear) * 100 + parseInt(bMonth);
            }

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return filteredData;
    }, [data, sortConfig, filterStatus]);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const toggleRow = (id) => {
        setSelectedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const toggleAll = () => {
        if (selectedRows.size === sortedData.length) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(sortedData.map(d => d.id)));
        }
    };

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) {
            return <ArrowUpDown className="w-3 h-3 opacity-30" />;
        }
        return sortConfig.direction === 'asc'
            ? <ArrowUp className="w-3 h-3 text-brass" />
            : <ArrowDown className="w-3 h-3 text-brass" />;
    };

    const uniqueStatuses = [...new Set(data.map(d => d.status))];

    return (
        <div className="velvet-card overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="text-lg font-serif text-brass">{title}</h3>

                <div className="flex gap-2">
                    {/* Filter button */}
                    <div className="relative">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${filterStatus
                                    ? 'bg-brass/20 text-brass border border-brass/30'
                                    : 'bg-white/5 text-stone-400 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            <Filter className="w-3 h-3" />
                            {filterStatus || 'Filter'}
                            {filterStatus && (
                                <X
                                    className="w-3 h-3 hover:text-red-400"
                                    onClick={(e) => { e.stopPropagation(); setFilterStatus(null); }}
                                />
                            )}
                        </button>

                        {showFilters && (
                            <div className="absolute right-0 top-full mt-1 bg-obsidian border border-white/10 rounded-lg shadow-xl z-10 min-w-[150px]">
                                {uniqueStatuses.map(status => (
                                    <button
                                        key={status}
                                        onClick={() => { setFilterStatus(status); setShowFilters(false); }}
                                        className={`flex items-center justify-between w-full px-3 py-2 text-xs hover:bg-white/5 ${filterStatus === status ? 'text-brass' : 'text-stone-400'
                                            }`}
                                    >
                                        {status}
                                        {filterStatus === status && <Check className="w-3 h-3" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Export button */}
                    <button className="px-3 py-1.5 bg-white/5 text-stone-400 border border-white/10 rounded text-xs hover:bg-white/10 transition-colors">
                        Eksporter
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="p-3 text-left">
                                <input
                                    type="checkbox"
                                    checked={selectedRows.size === sortedData.length && sortedData.length > 0}
                                    onChange={toggleAll}
                                    className="rounded border-white/30 bg-transparent text-brass focus:ring-brass/30"
                                />
                            </th>
                            <th
                                onClick={() => handleSort('address')}
                                className="p-3 text-left text-xs uppercase tracking-wider text-stone-500 cursor-pointer hover:text-stone-300"
                            >
                                <span className="flex items-center gap-1">
                                    Adresse <SortIcon column="address" />
                                </span>
                            </th>
                            <th
                                onClick={() => handleSort('sold')}
                                className="p-3 text-left text-xs uppercase tracking-wider text-stone-500 cursor-pointer hover:text-stone-300"
                            >
                                <span className="flex items-center gap-1">
                                    Solgt <SortIcon column="sold" />
                                </span>
                            </th>
                            <th
                                onClick={() => handleSort('price')}
                                className="p-3 text-right text-xs uppercase tracking-wider text-stone-500 cursor-pointer hover:text-stone-300"
                            >
                                <span className="flex items-center justify-end gap-1">
                                    Salgspris <SortIcon column="price" />
                                </span>
                            </th>
                            <th
                                onClick={() => handleSort('pricePerSqm')}
                                className="p-3 text-right text-xs uppercase tracking-wider text-stone-500 cursor-pointer hover:text-stone-300"
                            >
                                <span className="flex items-center justify-end gap-1">
                                    kr/m² <SortIcon column="pricePerSqm" />
                                </span>
                            </th>
                            <th
                                onClick={() => handleSort('sqm')}
                                className="p-3 text-right text-xs uppercase tracking-wider text-stone-500 cursor-pointer hover:text-stone-300"
                            >
                                <span className="flex items-center justify-end gap-1">
                                    BRA-i <SortIcon column="sqm" />
                                </span>
                            </th>
                            <th
                                onClick={() => handleSort('floor')}
                                className="p-3 text-center text-xs uppercase tracking-wider text-stone-500 cursor-pointer hover:text-stone-300"
                            >
                                <span className="flex items-center justify-center gap-1">
                                    Etg <SortIcon column="floor" />
                                </span>
                            </th>
                            <th
                                onClick={() => handleSort('year')}
                                className="p-3 text-center text-xs uppercase tracking-wider text-stone-500 cursor-pointer hover:text-stone-300"
                            >
                                <span className="flex items-center justify-center gap-1">
                                    Byggeår <SortIcon column="year" />
                                </span>
                            </th>
                            <th className="p-3 text-center text-xs uppercase tracking-wider text-stone-500">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((row, idx) => (
                            <tr
                                key={row.id}
                                className={`border-b border-white/5 hover:bg-white/5 transition-colors ${selectedRows.has(row.id) ? 'bg-brass/5' : ''
                                    }`}
                            >
                                <td className="p-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.has(row.id)}
                                        onChange={() => toggleRow(row.id)}
                                        className="rounded border-white/30 bg-transparent text-brass focus:ring-brass/30"
                                    />
                                </td>
                                <td className="p-3 text-ink-primary font-medium">{row.address}</td>
                                <td className="p-3 text-stone-400">{row.sold}</td>
                                <td className="p-3 text-right text-ink-primary">{formatPrice(row.price)}</td>
                                <td className="p-3 text-right text-stone-400">{formatPrice(row.pricePerSqm)}</td>
                                <td className="p-3 text-right text-stone-400">{row.sqm}</td>
                                <td className="p-3 text-center text-stone-400">{row.floor}</td>
                                <td className="p-3 text-center text-stone-400">{row.year}</td>
                                <td className="p-3 text-center">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${row.status === 'Umøblert'
                                            ? 'bg-stone-700/50 text-stone-300'
                                            : 'bg-blue-900/30 text-blue-300'
                                        }`}>
                                        {row.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/10 flex items-center justify-between text-xs text-stone-500">
                <span>{sortedData.length} eiendommer</span>
                {selectedRows.size > 0 && (
                    <span className="text-brass">{selectedRows.size} valgt</span>
                )}
            </div>
        </div>
    );
}
