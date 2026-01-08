import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import { cn } from '@/utils/cn';

// Custom marker icon for pharmacy (Google Maps Red Pin Style)
const pharmacyIcon = L.divIcon({
    className: 'custom-pharmacy-marker',
    html: `
        <div class="relative flex items-center justify-center">
            <div class="absolute w-12 h-12 bg-red-500/20 rounded-full animate-ping"></div>
            <svg viewBox="0 0 24 24" class="w-12 h-12 drop-shadow-2xl" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335" stroke="#FFFFFF" stroke-width="0.5"/>
                <circle cx="12" cy="9" r="3" fill="#B31412"/>
            </svg>
        </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 48], // Anchor at bottom of pin
});

interface MapSelectorProps {
    method: 'gps' | 'manual';
    center: [number, number];
    markerPosition: [number, number] | null;
    onPositionChange: (lat: number, lng: number) => void;
}

export const MapSelector: React.FC<MapSelectorProps> = ({
    method,
    center,
    markerPosition,
    onPositionChange
}) => {
    const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');

    // Component to handle map actions (locate, zoom, etc)
    const MapController = () => {
        const map = useMap();

        const handleLocate = () => {
            if (markerPosition) {
                map.setView(markerPosition, 18);
            } else {
                map.setView(center, 18);
            }
        };

        return (
            <button
                type="button"
                onClick={handleLocate}
                className="absolute bottom-6 right-6 z-[1000] bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-2 group/locate"
            >
                <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover/locate:scale-150 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Ma Position</span>
            </button>
        );
    };

    const MapEvents = () => {
        useMapEvents({
            click(e) {
                onPositionChange(e.latlng.lat, e.latlng.lng);
            },
        });
        return null;
    };

    return (
        <div className="relative w-full h-[400px] lg:h-[500px] rounded-3xl overflow-hidden border-2 border-slate-100 shadow-inner group">
            {/* Layer Toggle */}
            <div className="absolute top-6 left-6 z-[1000] flex bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-slate-100">
                <button
                    type="button"
                    onClick={() => setMapType('streets')}
                    className={cn(
                        "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        mapType === 'streets'
                            ? "bg-slate-900 text-white shadow-lg"
                            : "text-slate-400 hover:text-slate-600"
                    )}
                >
                    Plan
                </button>
                <button
                    type="button"
                    onClick={() => setMapType('satellite')}
                    className={cn(
                        "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        mapType === 'satellite'
                            ? "bg-slate-900 text-white shadow-lg"
                            : "text-slate-400 hover:text-slate-600"
                    )}
                >
                    Satellite
                </button>
            </div>

            {method === 'manual' && !markerPosition && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce">
                    <MapPin className="text-emerald-600 w-5 h-5" />
                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight">
                        Cliquez sur la carte pour placer votre pharmacie
                    </p>
                </div>
            )}

            <MapContainer
                key={mapType} // Re-render map when type changes for smooth layer switching
                center={center}
                zoom={17}
                scrollWheelZoom={true}
                className="w-full h-full"
            >
                {mapType === 'streets' ? (
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                ) : (
                    <TileLayer
                        attribution='&copy; Google Maps'
                        url="https://mt1.google.com/vt?lyrs=y&x={x}&y={y}&z={z}"
                        maxZoom={20}
                    />
                )}
                <MapEvents />
                <MapController />
                {markerPosition && (
                    <Marker
                        position={markerPosition}
                        icon={pharmacyIcon}
                        draggable={true} // Always allow fine-tuning
                        eventHandlers={{
                            dragend: (e) => {
                                const marker = e.target;
                                const position = marker.getLatLng();
                                onPositionChange(position.lat, position.lng);
                            },
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -40]} opacity={1} permanent>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Déplacez-moi pour ajuster</span>
                        </Tooltip>
                    </Marker>
                )}
            </MapContainer>

            <div className="absolute bottom-6 left-6 z-[1000] pointer-events-none">
                <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
                    PharmaGN Geolocation Engine
                </div>
            </div>
        </div>
    );
};
