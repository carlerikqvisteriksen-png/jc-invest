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

    // Process properties to ensure they have coordinates
    // If no lat/lng, we fuzzy match them around their city center so they show up
    const mapMarkers = useMemo(() => {
        return properties.map(p => {
            const city = p.city ? p.city.trim() : 'Oslo';
            let lat = p.lat;
            let lng = p.lng;

            // If missing coords, generate fuzzy coords around city center
            if (!lat || !lng) {
                const center = CENTERS[city] || CENTERS['Oslo'];
                // Add random jitter (~1-2km radius)
                lat = center[0] + (Math.random() - 0.5) * 0.04;
                lng = center[1] + (Math.random() - 0.5) * 0.04;
            }

            return { ...p, lat, lng };
        });
    }, [properties]);

    // Update center based on first property or filter
    useEffect(() => {
        if (mapMarkers.length > 0) {
            // Find centroid or just use first
            const first = mapMarkers[0];
            setMapCenter([first.lat, first.lng]);
        }
    }, [mapMarkers]);

    return (
        <div className="velvet-card overflow-hidden fade-in h-[600px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 z-10 bg-obsidian">
                <h3 className="text-lg font-serif text-brass flex items-center gap-2">
                    <MapIcon className="w-5 h-5" />
                    Eiendomskart
                </h3>
                <div className="text-sm text-stone-400">
                    Viser {mapMarkers.length} eiendommer
                </div>
            </div>

            {/* Map */}
            <div className="flex-1 relative z-0">
                <MapContainer
                    center={mapCenter}
                    zoom={10}
                    style={{ height: '100%', width: '100%' }}
                    className="z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />

                    <MapUpdater center={mapCenter} />

                    {mapMarkers.map((p, idx) => (
                        <Marker key={idx} position={[p.lat, p.lng]}>
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
