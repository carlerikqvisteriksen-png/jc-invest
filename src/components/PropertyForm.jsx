import React, { useState } from 'react';
import { X, Save, Home, MapPin, Ruler, Bed, Bath, Building, Calendar, DollarSign, TrendingUp, Star, Image, Link, FileText, Loader2 } from 'lucide-react';
import { createProperty, updateProperty } from '../lib/database';

const propertyTypes = ['Leilighet', 'Enebolig', 'Rekkehus', 'Tomannsbolig', 'Hybel'];
const statusOptions = ['active', 'sold', 'watching'];

function FormSection({ title, icon: Icon, children }) {
    return (
        <div className="mb-6">
            <h4 className="flex items-center gap-2 text-sm font-medium text-brass mb-3 pb-2 border-b border-white/10">
                {Icon && <Icon className="w-4 h-4" />}
                {title}
            </h4>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}

function FormField({ label, children, optional = false }) {
    return (
        <div>
            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">
                {label}
                {optional && <span className="text-stone-600 normal-case ml-1">(valgfritt)</span>}
            </label>
            {children}
        </div>
    );
}

function Input({ type = 'text', ...props }) {
    return (
        <input
            type={type}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-ink-primary placeholder-stone-600 focus:outline-none focus:border-brass/50 transition-colors"
            {...props}
        />
    );
}

function Select({ options, placeholder, ...props }) {
    return (
        <select
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-ink-primary focus:outline-none focus:border-brass/50 transition-colors"
            {...props}
        >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
    );
}

function ScoreInput({ value, onChange, label }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 w-20">{label}</span>
            <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={value || 0}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brass"
            />
            <span className={`text-sm font-medium w-8 text-right ${value >= 8 ? 'text-green-400' : value >= 6 ? 'text-yellow-400' : value >= 4 ? 'text-orange-400' : 'text-red-400'
                }`}>
                {value || 0}
            </span>
        </div>
    );
}

export default function PropertyForm({ property = null, onClose, onSaved }) {
    const isEditing = !!property;

    const [formData, setFormData] = useState({
        address: property?.address || '',
        city: property?.city || '',
        postal_code: property?.postal_code || '',
        property_type: property?.property_type || 'Leilighet',
        sqm: property?.sqm || '',
        bedrooms: property?.bedrooms || '',
        bathrooms: property?.bathrooms || '',
        floor: property?.floor || '',
        build_year: property?.build_year || '',
        purchase_price: property?.purchase_price || '',
        current_value: property?.current_value || '',
        monthly_rent: property?.monthly_rent || '',
        is_rented: property?.is_rented || false,
        tenant_name: property?.tenant_name || '',
        lease_end_date: property?.lease_end_date || '',
        status: property?.status || 'active',
        is_sold: property?.is_sold || false,
        sold_date: property?.sold_date || '',
        sold_price: property?.sold_price || '',
        score_location: property?.score_location || 7,
        score_standard: property?.score_standard || 7,
        score_layout: property?.score_layout || 7,
        score_view: property?.score_view || 7,
        image_url: property?.image_url || '',
        finn_url: property?.finn_url || '',
        notes: property?.notes || ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Convert string numbers to actual numbers
            const dataToSave = {
                ...formData,
                sqm: formData.sqm ? parseInt(formData.sqm) : null,
                bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
                bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
                floor: formData.floor ? parseInt(formData.floor) : null,
                build_year: formData.build_year ? parseInt(formData.build_year) : null,
                purchase_price: formData.purchase_price ? parseInt(formData.purchase_price) : null,
                current_value: formData.current_value ? parseInt(formData.current_value) : null,
                monthly_rent: formData.monthly_rent ? parseInt(formData.monthly_rent) : null,
                sold_price: formData.sold_price ? parseInt(formData.sold_price) : null,
                sold_date: formData.sold_date || null,
                lease_end_date: formData.lease_end_date || null,
            };

            let result;
            if (isEditing) {
                result = await updateProperty(property.id, dataToSave);
            } else {
                result = await createProperty(dataToSave);
            }

            onSaved(result);
            onClose();
        } catch (err) {
            console.error('Error saving property:', err);
            setError(err.message || 'Kunne ikke lagre eiendommen');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <form
                onSubmit={handleSubmit}
                className="bg-obsidian border border-white/10 rounded-lg w-full max-w-2xl shadow-2xl my-8"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 sticky top-0 bg-obsidian z-10">
                    <h3 className="text-lg font-serif text-brass">
                        {isEditing ? 'Rediger eiendom' : 'Legg til ny eiendom'}
                    </h3>
                    <button type="button" onClick={onClose} className="text-stone-500 hover:text-stone-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-4 max-h-[70vh] overflow-y-auto">
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Location */}
                    <FormSection title="Lokasjon" icon={MapPin}>
                        <FormField label="Adresse">
                            <Input
                                value={formData.address}
                                onChange={(e) => updateField('address', e.target.value)}
                                placeholder="F.eks. Storgata 123A"
                                required
                            />
                        </FormField>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="By">
                                <Input
                                    value={formData.city}
                                    onChange={(e) => updateField('city', e.target.value)}
                                    placeholder="Oslo"
                                    required
                                />
                            </FormField>
                            <FormField label="Postnummer" optional>
                                <Input
                                    value={formData.postal_code}
                                    onChange={(e) => updateField('postal_code', e.target.value)}
                                    placeholder="0182"
                                />
                            </FormField>
                        </div>
                    </FormSection>

                    {/* Property Details */}
                    <FormSection title="Eiendomsdetaljer" icon={Home}>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Boligtype">
                                <Select
                                    value={formData.property_type}
                                    onChange={(e) => updateField('property_type', e.target.value)}
                                    options={propertyTypes}
                                />
                            </FormField>
                            <FormField label="Byggeår" optional>
                                <Input
                                    type="number"
                                    value={formData.build_year}
                                    onChange={(e) => updateField('build_year', e.target.value)}
                                    placeholder="1990"
                                />
                            </FormField>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <FormField label="Areal (m²)">
                                <Input
                                    type="number"
                                    value={formData.sqm}
                                    onChange={(e) => updateField('sqm', e.target.value)}
                                    placeholder="75"
                                />
                            </FormField>
                            <FormField label="Soverom">
                                <Input
                                    type="number"
                                    value={formData.bedrooms}
                                    onChange={(e) => updateField('bedrooms', e.target.value)}
                                    placeholder="2"
                                />
                            </FormField>
                            <FormField label="Bad">
                                <Input
                                    type="number"
                                    value={formData.bathrooms}
                                    onChange={(e) => updateField('bathrooms', e.target.value)}
                                    placeholder="1"
                                />
                            </FormField>
                            <FormField label="Etasje">
                                <Input
                                    type="number"
                                    value={formData.floor}
                                    onChange={(e) => updateField('floor', e.target.value)}
                                    placeholder="3"
                                />
                            </FormField>
                        </div>
                    </FormSection>

                    {/* Pricing */}
                    <FormSection title="Økonomi" icon={DollarSign}>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Kjøpspris">
                                <Input
                                    type="number"
                                    value={formData.purchase_price}
                                    onChange={(e) => updateField('purchase_price', e.target.value)}
                                    placeholder="3500000"
                                />
                            </FormField>
                            <FormField label="Nåværende verdi" optional>
                                <Input
                                    type="number"
                                    value={formData.current_value}
                                    onChange={(e) => updateField('current_value', e.target.value)}
                                    placeholder="3800000"
                                />
                            </FormField>
                        </div>
                        <FormField label="Månedlig leie" optional>
                            <Input
                                type="number"
                                value={formData.monthly_rent}
                                onChange={(e) => updateField('monthly_rent', e.target.value)}
                                placeholder="15000"
                            />
                        </FormField>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => updateField('is_rented', !formData.is_rented)}
                                className={`w-10 h-6 rounded-full transition-colors ${formData.is_rented ? 'bg-brass' : 'bg-white/10'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-1 ${formData.is_rented ? 'translate-x-4' : 'translate-x-0'}`} />
                            </button>
                            <span className="text-sm text-stone-400">Utleid</span>
                        </div>
                        {formData.is_rented && (
                            <div className="grid grid-cols-2 gap-4 mt-2 pl-4 border-l-2 border-brass/30">
                                <FormField label="Leietakers navn" optional>
                                    <Input
                                        value={formData.tenant_name}
                                        onChange={(e) => updateField('tenant_name', e.target.value)}
                                        placeholder="Ola Nordmann"
                                    />
                                </FormField>
                                <FormField label="Leiekontrakt utløper" optional>
                                    <Input
                                        type="date"
                                        value={formData.lease_end_date}
                                        onChange={(e) => updateField('lease_end_date', e.target.value)}
                                    />
                                </FormField>
                            </div>
                        )}
                    </FormSection>

                    {/* Scores */}
                    <FormSection title="Vurderinger" icon={Star}>
                        <div className="space-y-3">
                            <ScoreInput
                                label="Beliggenhet"
                                value={formData.score_location}
                                onChange={(v) => updateField('score_location', v)}
                            />
                            <ScoreInput
                                label="Standard"
                                value={formData.score_standard}
                                onChange={(v) => updateField('score_standard', v)}
                            />
                            <ScoreInput
                                label="Planløsning"
                                value={formData.score_layout}
                                onChange={(v) => updateField('score_layout', v)}
                            />
                            <ScoreInput
                                label="Utsikt"
                                value={formData.score_view}
                                onChange={(v) => updateField('score_view', v)}
                            />
                        </div>
                    </FormSection>

                    {/* Status */}
                    <FormSection title="Status" icon={TrendingUp}>
                        <FormField label="Status">
                            <Select
                                value={formData.status}
                                onChange={(e) => updateField('status', e.target.value)}
                                options={statusOptions}
                            />
                        </FormField>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => updateField('is_sold', !formData.is_sold)}
                                className={`w-10 h-6 rounded-full transition-colors ${formData.is_sold ? 'bg-brass' : 'bg-white/10'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-1 ${formData.is_sold ? 'translate-x-4' : 'translate-x-0'}`} />
                            </button>
                            <span className="text-sm text-stone-400">Solgt</span>
                        </div>
                        {formData.is_sold && (
                            <div className="grid grid-cols-2 gap-4 mt-2 pl-4 border-l-2 border-brass/30">
                                <FormField label="Salgsdato">
                                    <Input
                                        type="date"
                                        value={formData.sold_date}
                                        onChange={(e) => updateField('sold_date', e.target.value)}
                                    />
                                </FormField>
                                <FormField label="Salgspris">
                                    <Input
                                        type="number"
                                        value={formData.sold_price}
                                        onChange={(e) => updateField('sold_price', e.target.value)}
                                        placeholder="3900000"
                                    />
                                </FormField>
                            </div>
                        )}
                    </FormSection>

                    {/* Links & Notes */}
                    <FormSection title="Lenker og notater" icon={FileText}>
                        <FormField label="Bilde-URL" optional>
                            <Input
                                type="url"
                                value={formData.image_url}
                                onChange={(e) => updateField('image_url', e.target.value)}
                                placeholder="https://..."
                            />
                        </FormField>
                        <FormField label="Finn.no-lenke" optional>
                            <Input
                                type="url"
                                value={formData.finn_url}
                                onChange={(e) => updateField('finn_url', e.target.value)}
                                placeholder="https://finn.no/..."
                            />
                        </FormField>
                        <FormField label="Notater" optional>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => updateField('notes', e.target.value)}
                                placeholder="Egne notater om eiendommen..."
                                rows={3}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-ink-primary placeholder-stone-600 focus:outline-none focus:border-brass/50 transition-colors resize-none"
                            />
                        </FormField>
                    </FormSection>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-4 border-t border-white/10 sticky bottom-0 bg-obsidian">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-2 px-4 bg-white/5 text-stone-400 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        Avbryt
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-2 px-4 bg-brass/20 text-brass rounded-lg hover:bg-brass/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {isEditing ? 'Oppdater' : 'Lagre'}
                    </button>
                </div>
            </form>
        </div>
    );
}
