import React, { useState } from 'react';
import { Save, AlertCircle, MapPin } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { usePharmacyLocation } from '@/hooks/usePharmacyLocation';
import { MapSelector } from './MapSelector';
import { GeolocationMethods } from './GeolocationMethods';
import { CoordinatesDisplay } from './CoordinatesDisplay';
import { cn } from '@/utils/cn';
import { useNotificationStore } from '@/store/notificationStore';

interface GeolocationSectionProps {
    pharmacy: any;
}

export const GeolocationSection: React.FC<GeolocationSectionProps> = ({ pharmacy }) => {
    const { getCurrentLocation, loading: gpsLoading, error: gpsError } = useGeolocation();
    const { updateLocation, loading: saveLoading } = usePharmacyLocation(pharmacy.id);

    const [method, setMethod] = useState<'gps' | 'manual'>('manual');
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
        pharmacy.latitude && pharmacy.longitude ? [Number(pharmacy.latitude), Number(pharmacy.longitude)] : null
    );
    const [precision, setPrecision] = useState<number | null>(pharmacy.location_precision || null);
    const [mapCenter, setMapCenter] = useState<[number, number]>(
        pharmacy.latitude && pharmacy.longitude ? [Number(pharmacy.latitude), Number(pharmacy.longitude)] : [9.509167, -13.712222] // Conakry default
    );

    const handleGPSLocate = async () => {
        try {
            const position = await getCurrentLocation();
            const newPos: [number, number] = [position.latitude, position.longitude];
            setMarkerPosition(newPos);
            setMapCenter(newPos);
            setPrecision(position.accuracy);
            setMethod('gps');
        } catch (err) {
            console.error('GPS Detection failed:', err);
        }
    };

    const handlePositionChange = (lat: number, lng: number) => {
        setMarkerPosition([lat, lng]);
        setPrecision(null); // Precision is not applicable for manual fine-tuning
        setMethod('manual'); // Switch to manual mode so the user knows they are fine-tuning
    };

    const { addToast } = useNotificationStore();

    const handleSave = async () => {
        if (!markerPosition) return;

        try {
            await updateLocation({
                latitude: markerPosition[0],
                longitude: markerPosition[1],
                precision: precision,
                method: method
            });
            addToast('Position enregistrée avec succès !', 'success');
        } catch (err: any) {
            console.error('Save failed:', err);
            addToast(err.message || 'Erreur lors de la sauvegarde.', 'error');
        }
    };

    return (
        <div className="mt-12 pt-12 border-t border-slate-100">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-900/20">
                    <MapPin className="text-white w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                        Géolocalisation de la Pharmacie
                    </h2>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                        Optimisez votre visibilité sur la carte client
                    </p>
                </div>
            </div>

            <div className="space-y-12">
                {/* 1. Selection Methods */}
                <div className="max-w-4xl">
                    <GeolocationMethods
                        activeMethod={method}
                        onMethodChange={setMethod}
                        onGPSActivate={handleGPSLocate}
                        isGPSLoading={gpsLoading}
                    />

                    {gpsError && (
                        <div className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex gap-3 items-center text-rose-600">
                            <AlertCircle size={20} className="shrink-0" />
                            <p className="text-sm font-bold">{gpsError}</p>
                        </div>
                    )}
                </div>

                {/* 2. Interactive Map (Full Width) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Aperçu interactif plein écran</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Mise à jour en direct</span>
                        </div>
                    </div>

                    <MapSelector
                        method={method}
                        center={mapCenter}
                        markerPosition={markerPosition}
                        onPositionChange={handlePositionChange}
                    />
                </div>

                {/* 3. Results & Action */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
                    <div className="lg:col-span-2">
                        <CoordinatesDisplay
                            lat={markerPosition ? markerPosition[0] : null}
                            lng={markerPosition ? markerPosition[1] : null}
                            precision={precision}
                            method={method}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!markerPosition || saveLoading}
                        className={cn(
                            "w-full py-6 rounded-[2rem] font-black text-xl transition-all flex items-center justify-center gap-3 shadow-2xl h-[fit-content] mb-1.5",
                            markerPosition
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/30"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        )}
                    >
                        {saveLoading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save size={24} />
                                Enregistrer la Position
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
