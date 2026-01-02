import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Map as MapIcon, Calendar, Filter } from 'lucide-react';

// Fix for default marker icon in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Center coordinates
const CENTERS = {
    'Oslo': [59.9139, 10.7522],
    'Hønefoss': [60.1664, 10.2563],
    'Ringerike': [60.1664, 10.2563], // Same as Hønefoss approx
    'Hole': [60.0934, 10.2185]
};

// Component to update map center when properties change
function MapUpdater({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 11);
        }
    }, [center, map]);
    return null;
}

export default function MapAnalysis({ properties = [] }) {
    const [mapCenter, setMapCenter] = useState(CENTERS['Oslo']);
    const [geocodedProperties, setGeocodedProperties] = useState([]);

    // Geocoding logic
    useEffect(() => {
        const fetchCoords = async () => {
            const updatedProps = [...properties];
            let hasChanges = false;

            for (let i = 0; i < updatedProps.length; i++) {
                const p = updatedProps[i];
                // Only geocode if we haven't already and don't have valid coords
                if (!p.lat && !p.lng && !p._geocoded) {
                    try {
                        // Respect Nominatim rate limit (1 req/sec)
                        await new Promise(resolve => setTimeout(resolve, 1100));

                        const query = `${p.address}, ${p.city}, Norway`;
                        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
                        const data = await response.json();

                        if (data && data.length > 0) {
                            updatedProps[i] = {
                                ...p,
                                lat: parseFloat(data[0].lat),
                                lng: parseFloat(data[0].lon),
                                _geocoded: true
                            };
                            hasChanges = true;
                            // Update state incrementally to show progress
                            setGeocodedProperties([...updatedProps]);
                        }
                    } catch (err) {
                        console.error("Geocoding error for", p.address, err);
                    }
                } else if ((p.lat || p.lng) && !p._geocoded) {
                    // Prop already has coords from DB
                    updatedProps[i] = { ...p, _geocoded: true };
                    hasChanges = true;
                }
            }

            if (hasChanges) {
                setGeocodedProperties(updatedProps);
            }
        };

        if (properties.length > 0) {
            // Initialize with existing properties first
            setGeocodedProperties(properties);
            fetchCoords();
        }
    }, [properties.length]); // Only restart if property count changes (e.g. filter)

    // Use geocoded properties for markers
    const mapMarkers = useMemo(() => {
        return geocodedProperties.filter(p => p.lat && p.lng);
    }, [geocodedProperties]);

    // Update center based on first property or filter
    useEffect(() => {
        if (mapMarkers.length > 0) {
            // Use the first filtered/geocoded property to center
            const first = mapMarkers[0];
            setMapCenter([first.lat, first.lng]);
        }
    }, [mapMarkers.length]); // Minimize re-centering jitters

    return (
        <div className="velvet-card overflow-hidden fade-in h-[600px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 z-10 bg-obsidian">
                <h3 className="text-lg font-serif text-brass flex items-center gap-2">
                    <MapIcon className="w-5 h-5" />
                    Eiendomskart <span className="text-xs text-stone-500 font-sans ml-2">(Henter nøyaktig posisjon...)</span>
                </h3>
                <div className="text-sm text-stone-400">
                    Viser {mapMarkers.length} av {properties.length} eiendommer
                </div>
            </div>

            {/* Map */}
            <div className="flex-1 relative z-0">
                <MapContainer
                    center={mapCenter}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                    className="z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />

                    <MapUpdater center={mapCenter} />

                    {mapMarkers.map((p, idx) => (
                        <Marker key={p.id || idx} position={[p.lat, p.lng]}>
                            <Popup>
                                <div className="p-2 min-w-[200px]">
                                    <h4 className="font-bold text-sm mb-1">{p.address}</h4>
                                    <p className="text-xs text-gray-600 mb-1">{p.city}</p>
                                    <div className="font-mono text-sm text-blue-600">
                                        {new Intl.NumberFormat('nb-NO').format(p.price || p.price_total)} kr
                                    </div>
                                    <div className="text-xs text-gray-500 mt-2">
                                        {p.sqm} m² • {p.property_type}
                                    </div>
                                    <a
                                        href={p.finn_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block mt-2 text-xs text-blue-500 hover:underline"
                                    >
                                        Se på Finn.no
                                    </a>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}
