import React, { useState, useEffect } from 'react';
import { Plus, Home, MapPin, Bed, Ruler, TrendingUp, Trash2, Edit2, ExternalLink, Loader2, Search, Filter, ChevronDown } from 'lucide-react';
import { getProperties, deleteProperty } from '../lib/database';
import PropertyForm from './PropertyForm';

const formatPrice = (num) => num ? new Intl.NumberFormat('nb-NO').format(num) + ' kr' : '-';

function PropertyCard({ property, onEdit, onDelete }) {
    const avgScore = property.score_location && property.score_standard && property.score_layout && property.score_view
        ? ((property.score_location + property.score_standard + property.score_layout + property.score_view) / 4).toFixed(1)
        : null;

    return (
        <div className="velvet-card p-4 hover:border-brass/30 transition-colors group">
            <div className="flex gap-4">
                {/* Image */}
                <div className="w-24 h-24 rounded-lg bg-stone-800 overflow-hidden shrink-0">
                    {property.image_url ? (
                        <img src={property.image_url} alt={property.address} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Home className="w-8 h-8 text-stone-600" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-medium text-ink-primary truncate">{property.address}</h3>
                            <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3" />
                                {property.city}{property.postal_code ? `, ${property.postal_code}` : ''}
                            </p>
                        </div>

                        {/* Score badge */}
                        {avgScore && (
                            <div className={`px-2 py-1 rounded text-xs font-bold ${avgScore >= 8 ? 'bg-green-500/20 text-green-400' :
                                    avgScore >= 6 ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-orange-500/20 text-orange-400'
                                }`}>
                                {avgScore}/10
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-stone-500">
                        <span>{property.property_type}</span>
                        {property.sqm && (
                            <span className="flex items-center gap-1">
                                <Ruler className="w-3 h-3" />
                                {property.sqm} m²
                            </span>
                        )}
                        {property.bedrooms && (
                            <span className="flex items-center gap-1">
                                <Bed className="w-3 h-3" />
                                {property.bedrooms} sov
                            </span>
                        )}
                        {property.build_year && <span>Byggeår {property.build_year}</span>}
                    </div>

                    {/* Prices */}
                    <div className="flex flex-wrap gap-4 mt-3">
                        {property.purchase_price && (
                            <div>
                                <div className="text-[10px] uppercase tracking-wider text-stone-600">Kjøpspris</div>
                                <div className="text-sm text-ink-primary">{formatPrice(property.purchase_price)}</div>
                            </div>
                        )}
                        {property.monthly_rent && (
                            <div>
                                <div className="text-[10px] uppercase tracking-wider text-stone-600">Leie/mnd</div>
                                <div className="text-sm text-green-400">{formatPrice(property.monthly_rent)}</div>
                            </div>
                        )}
                        {property.is_sold && property.sold_price && (
                            <div>
                                <div className="text-[10px] uppercase tracking-wider text-stone-600">Salgspris</div>
                                <div className="text-sm text-brass">{formatPrice(property.sold_price)}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(property)}
                        className="p-1.5 text-stone-500 hover:text-brass transition-colors"
                        title="Rediger"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    {property.finn_url && (
                        <a
                            href={property.finn_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-stone-500 hover:text-blue-400 transition-colors"
                            title="Åpne på Finn.no"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                    <button
                        onClick={() => onDelete(property.id)}
                        className="p-1.5 text-stone-500 hover:text-red-400 transition-colors"
                        title="Slett"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Status badges */}
            <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${property.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        property.status === 'sold' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-stone-500/20 text-stone-400'
                    }`}>
                    {property.status === 'active' ? 'Aktiv' : property.status === 'sold' ? 'Solgt' : 'Følger'}
                </span>
                {property.is_rented && (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-brass/20 text-brass">
                        Utleid
                    </span>
                )}
            </div>
        </div>
    );
}

export default function PropertyList() {
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getProperties();
            setProperties(data);
        } catch (err) {
            console.error('Error loading properties:', err);
            setError('Kunne ikke laste eiendommer');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Er du sikker på at du vil slette denne eiendommen?')) return;

        try {
            await deleteProperty(id);
            setProperties(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('Error deleting property:', err);
            alert('Kunne ikke slette eiendommen');
        }
    };

    const handleEdit = (property) => {
        setEditingProperty(property);
        setShowForm(true);
    };

    const handleSaved = (savedProperty) => {
        if (editingProperty) {
            setProperties(prev => prev.map(p => p.id === savedProperty.id ? savedProperty : p));
        } else {
            setProperties(prev => [savedProperty, ...prev]);
        }
        setEditingProperty(null);
    };

    // Filter properties
    const filteredProperties = properties.filter(p => {
        const matchesSearch = p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.city.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Stats
    const totalValue = properties.reduce((sum, p) => sum + (p.current_value || p.purchase_price || 0), 0);
    const totalRent = properties.filter(p => p.is_rented).reduce((sum, p) => sum + (p.monthly_rent || 0), 0);
    const rentedCount = properties.filter(p => p.is_rented).length;

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8 fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-serif text-brass">Min Portefølje</h2>
                    <p className="text-stone-500 text-sm mt-1">
                        {properties.length} eiendommer • {rentedCount} utleid
                    </p>
                </div>
                <button
                    onClick={() => { setEditingProperty(null); setShowForm(true); }}
                    className="px-4 py-2 bg-brass/20 text-brass rounded-lg hover:bg-brass/30 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Legg til eiendom
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="velvet-card p-4">
                    <div className="text-xs uppercase tracking-wider text-stone-500 mb-1">Total verdi</div>
                    <div className="text-2xl font-serif text-brass">{formatPrice(totalValue)}</div>
                </div>
                <div className="velvet-card p-4">
                    <div className="text-xs uppercase tracking-wider text-stone-500 mb-1">Månedlig leieinntekt</div>
                    <div className="text-2xl font-serif text-green-400">{formatPrice(totalRent)}</div>
                </div>
                <div className="velvet-card p-4">
                    <div className="text-xs uppercase tracking-wider text-stone-500 mb-1">Årlig yield (gj.snitt)</div>
                    <div className="text-2xl font-serif text-ink-primary">
                        {totalValue > 0 ? ((totalRent * 12 / totalValue) * 100).toFixed(1) : 0}%
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Søk etter adresse eller by..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-ink-primary placeholder-stone-600 focus:outline-none focus:border-brass/50"
                    />
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${statusFilter !== 'all'
                                ? 'bg-brass/20 text-brass border border-brass/30'
                                : 'bg-white/5 text-stone-400 border border-white/10 hover:bg-white/10'
                            }`}
                    >
                        <Filter className="w-4 h-4" />
                        {statusFilter === 'all' ? 'Filter' : statusFilter === 'active' ? 'Aktive' : statusFilter === 'sold' ? 'Solgte' : 'Følger'}
                        <ChevronDown className="w-3 h-3" />
                    </button>
                    {showFilters && (
                        <div className="absolute right-0 top-full mt-1 bg-obsidian border border-white/10 rounded-lg shadow-xl z-10">
                            {['all', 'active', 'sold', 'watching'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => { setStatusFilter(status); setShowFilters(false); }}
                                    className={`block w-full px-4 py-2 text-xs text-left hover:bg-white/5 ${statusFilter === status ? 'text-brass' : 'text-stone-400'
                                        }`}
                                >
                                    {status === 'all' ? 'Alle' : status === 'active' ? 'Aktive' : status === 'sold' ? 'Solgte' : 'Følger'}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Property List */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-brass animate-spin" />
                </div>
            ) : error ? (
                <div className="text-center py-12 text-red-400">
                    <p>{error}</p>
                    <button onClick={loadProperties} className="mt-2 text-brass hover:underline">
                        Prøv igjen
                    </button>
                </div>
            ) : filteredProperties.length === 0 ? (
                <div className="text-center py-12 text-stone-500">
                    <Home className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg">Ingen eiendommer funnet</p>
                    <button
                        onClick={() => { setEditingProperty(null); setShowForm(true); }}
                        className="mt-3 text-brass hover:underline"
                    >
                        Legg til din første eiendom
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredProperties.map(property => (
                        <PropertyCard
                            key={property.id}
                            property={property}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Property Form Modal */}
            {showForm && (
                <PropertyForm
                    property={editingProperty}
                    onClose={() => { setShowForm(false); setEditingProperty(null); }}
                    onSaved={handleSaved}
                />
            )}
        </div>
    );
}
