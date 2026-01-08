import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, ShoppingBag } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Pharmacy } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { useLocationStore } from '@/store/locationStore';

// Correction pour les icônes par défaut de Leaflet dans Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/**
 * Icône personnalisée pour les pharmacies utilisant Lucide.
 */
const createCustomIcon = (name: string, isOnDuty: boolean) => {
    const color = isOnDuty ? '#fbbf24' : '#10b981'; // Amber-400 vs Emerald-500
    const iconMarkup = renderToStaticMarkup(
        <div className="relative flex flex-col items-center">
            {/* Pharmacy Name Label */}
            <div
                className="mb-1 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-lg border border-slate-200 shadow-xl"
                style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}
            >
                <p className="text-[10px] font-black uppercase text-slate-800 whitespace-nowrap tracking-tighter">
                    {name}
                </p>
            </div>

            {/* Marker Pin */}
            <div style={{ color, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
                <MapPin size={32} fill={color} fillOpacity={0.2} strokeWidth={2.5} />
            </div>
        </div>
    );

    return L.divIcon({
        html: iconMarkup,
        className: 'custom-map-icon',
        iconSize: [120, 60], // Larger size to accommodate label
        iconAnchor: [60, 60], // Anchor at bottom center of the pin
        popupAnchor: [0, -60],
    });
};

/**
 * Icône pour la position de l'utilisateur.
 */
const userIcon = L.divIcon({
    html: renderToStaticMarkup(
        <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-40"></div>
            <div className="relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-blue-500 shadow-md">
                <Navigation size={10} className="text-white fill-white" />
            </div>
        </div>
    ),
    className: 'user-pos-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});

interface MapViewProps {
    pharmacies: Pharmacy[];
    center?: [number, number];
    zoom?: number;
    userLocation?: [number, number] | null;
    onPharmacyClick?: (pharmacy: Pharmacy) => void;
    className?: string;
}

/**
 * Composant de synchronisation de la vue de la carte.
 */
const ChangeView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

/**
 * Composant MapView interactif avec support satellite.
 */
const MapView: React.FC<MapViewProps> = ({
    pharmacies,
    center = [9.509, -13.712], // Conakry par défaut
    zoom = 13,
    userLocation,
    onPharmacyClick,
    className
}) => {
    const navigate = useNavigate();
    const { setSelectedPharmacy } = useLocationStore();
    const [mapType, setMapType] = React.useState<'streets' | 'satellite'>('satellite');

    const handleViewCatalogue = (pharmacy: Pharmacy) => {
        setSelectedPharmacy(pharmacy.id, pharmacy.name);
        navigate('/catalogue');
    };

    return (
        <div className={cn("relative overflow-hidden rounded-3xl shadow-inner bg-slate-100", className)}>
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

            <MapContainer
                key={mapType} // Re-render map when type changes for smooth layer switching
                center={center}
                zoom={zoom}
                zoomControl={false}
                className="h-full w-full"
            >
                <ChangeView center={center} zoom={zoom} />

                {mapType === 'streets' ? (
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                ) : (
                    <TileLayer
                        attribution='&copy; Google Maps'
                        url="https://mt1.google.com/vt?lyrs=y&x={x}&y={y}&z={z}"
                        maxZoom={20}
                    />
                )}

                <ZoomControl position="bottomright" />

                {/* Marqueur Utilisateur */}
                {userLocation && (
                    <Marker position={userLocation} icon={userIcon}>
                        <Popup>Vous êtes ici</Popup>
                    </Marker>
                )}

                {/* Marqueurs Pharmacies */}
                {pharmacies.map((pharmacy) => {
                    if (!pharmacy.latitude || !pharmacy.longitude) return null;

                    return (
                        <Marker
                            key={pharmacy.id}
                            position={[pharmacy.latitude, pharmacy.longitude]}
                            icon={createCustomIcon(pharmacy.name, pharmacy.is_on_duty_now)}
                            eventHandlers={{
                                click: () => onPharmacyClick?.(pharmacy),
                            }}
                        >
                            <Popup className="pharmacy-popup" minWidth={200}>
                                <div className="flex flex-col gap-2 p-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-black text-slate-800 pr-2">{pharmacy.name}</h4>
                                        {pharmacy.is_on_duty_now && (
                                            <Badge variant="warning">DE GARDE</Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-2">{pharmacy.address}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant={pharmacy.is_open_now ? 'success' : 'error'} className="text-[10px]">
                                            {pharmacy.is_open_now ? 'Ouvert' : 'Fermé'}
                                        </Badge>
                                        {pharmacy.distance != null && (
                                            <span className="text-[10px] font-bold text-slate-400">
                                                à {Number(pharmacy.distance).toFixed(1)} km
                                            </span>
                                        )}
                                    </div>
                                    <Button
                                        onClick={() => handleViewCatalogue(pharmacy)}
                                        variant="primary"
                                        size="sm"
                                        className="mt-3 w-full text-[10px] py-2 h-9 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        <ShoppingBag size={14} />
                                        Voir le catalogue
                                    </Button>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default MapView;
