import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Pharmacy } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

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
const createCustomIcon = (isOnDuty: boolean) => {
    const color = isOnDuty ? '#fbbf24' : '#10b981'; // Amber-400 vs Emerald-500
    const iconMarkup = renderToStaticMarkup(
        <div style={{ color, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
            <MapPin size={32} fill={color} fillOpacity={0.2} strokeWidth={2.5} />
        </div>
    );

    return L.divIcon({
        html: iconMarkup,
        className: 'custom-map-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
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
 * Composant MapView interactif.
 */
const MapView: React.FC<MapViewProps> = ({
    pharmacies,
    center = [9.509, -13.712], // Conakry par défaut
    zoom = 13,
    userLocation,
    onPharmacyClick,
    className
}) => {
    return (
        <div className={`relative overflow-hidden rounded-3xl shadow-inner bg-slate-100 ${className}`}>
            <MapContainer
                center={center}
                zoom={zoom}
                zoomControl={false}
                className="h-full w-full"
            >
                <ChangeView center={center} zoom={zoom} />

                {/* Couche de tuiles moderne (CartoDB Voyager) */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

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
                            icon={createCustomIcon(pharmacy.is_on_duty_now)}
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
                                    <Link to={`/pharmacy/${pharmacy.id}`} className="mt-2">
                                        <Button variant="outline" size="sm" className="w-full text-[10px] py-1 h-7">
                                            Voir Détails
                                        </Button>
                                    </Link>
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
