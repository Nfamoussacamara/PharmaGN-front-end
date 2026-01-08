import React from 'react';
import { Target, CheckCircle2, AlertTriangle, ExternalLink, Activity } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CoordinatesDisplayProps {
    lat: number | null;
    lng: number | null;
    precision: number | null;
    method: 'gps' | 'manual';
}

export const CoordinatesDisplay: React.FC<CoordinatesDisplayProps> = ({
    lat,
    lng,
    precision,
    method
}) => {
    if (lat === null || lng === null) return null;

    const getPrecisionConfig = (acc: number | null) => {
        if (method === 'manual') return { label: 'Placement Manuel', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: MapPin };
        if (!acc) return { label: 'Inconnu', color: 'text-slate-400', bgColor: 'bg-slate-50', icon: Activity };
        if (acc < 15) return { label: 'Excellente', color: 'text-emerald-600', bgColor: 'bg-emerald-50', icon: CheckCircle2 };
        if (acc < 50) return { label: 'Bonne', color: 'text-amber-600', bgColor: 'bg-amber-50', icon: Activity };
        return { label: 'Approximative', color: 'text-rose-600', bgColor: 'bg-rose-50', icon: AlertTriangle };
    };

    const config = getPrecisionConfig(precision);
    const StatusIcon = config.icon as any;

    return (
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-900/5 mt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
                        Coordonnées Actuelles
                    </h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                        Données prêtes pour l'enregistrement
                    </p>
                </div>

                <div className={cn(
                    "flex items-center gap-3 px-5 py-2.5 rounded-2xl border font-black text-sm transition-all shadow-sm",
                    config.bgColor,
                    config.color,
                    "border-current/10"
                )}>
                    <StatusIcon size={18} />
                    {config.label} {method === 'gps' && precision && `(±${Math.round(precision)}m)`}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Latitude</p>
                    <p className="text-2xl font-black text-slate-900 font-mono tracking-tighter">
                        {lat.toFixed(7)}°
                    </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Longitude</p>
                    <p className="text-2xl font-black text-slate-900 font-mono tracking-tighter">
                        {lng.toFixed(7)}°
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={() => window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')}
                className="w-full mt-6 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 group"
            >
                <Target className="w-5 h-5 group-hover:scale-125 transition-transform" />
                Vérifier sur Google Maps Pro
                <ExternalLink size={14} className="opacity-50" />
            </button>
        </div>
    );
};

// Add missing import for MapPin in CoordinatesDisplay logic
import { MapPin } from 'lucide-react';
