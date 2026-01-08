import React from 'react';
import { Navigation, MapPin, Check, Info } from 'lucide-react';
import { cn } from '@/utils/cn';

interface GeolocationMethodsProps {
    activeMethod: 'gps' | 'manual';
    onMethodChange: (method: 'gps' | 'manual') => void;
    onGPSActivate: () => void;
    isGPSLoading: boolean;
}

export const GeolocationMethods: React.FC<GeolocationMethodsProps> = ({
    activeMethod,
    onMethodChange,
    onGPSActivate,
    isGPSLoading
}) => {
    return (
        <div className="mb-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                Méthode de localisation
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
                {/* GPS Automatique */}
                <button
                    type="button"
                    onClick={() => {
                        onMethodChange('gps');
                        onGPSActivate();
                    }}
                    disabled={isGPSLoading}
                    className={cn(
                        "relative p-6 rounded-[2rem] border-2 transition-all duration-500 text-left overflow-hidden group",
                        activeMethod === 'gps'
                            ? "bg-emerald-50 border-emerald-500 shadow-xl shadow-emerald-500/10"
                            : "bg-white border-slate-100 hover:border-slate-200"
                    )}
                >
                    {activeMethod !== 'gps' && (
                        <div className="absolute top-4 right-4 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-tighter">
                            Recommandé
                        </div>
                    )}

                    <div className="flex items-start gap-5">
                        <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
                            activeMethod === 'gps' ? "bg-emerald-600 shadow-lg shadow-emerald-600/20 rotate-6" : "bg-slate-50 group-hover:scale-110"
                        )}>
                            {isGPSLoading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Navigation className={cn(
                                    "w-7 h-7",
                                    activeMethod === 'gps' ? "text-white" : "text-slate-400"
                                )} />
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className={cn(
                                    "font-black text-lg tracking-tight",
                                    activeMethod === 'gps' ? "text-slate-900" : "text-slate-700"
                                )}>
                                    GPS Automatique
                                </h4>
                                {activeMethod === 'gps' && <Check className="w-5 h-5 text-emerald-500" />}
                            </div>
                            <p className="text-sm font-bold text-slate-400 leading-snug">
                                Détection précise via les capteurs de votre appareil.
                            </p>
                        </div>
                    </div>
                </button>

                {/* Positionnement Manuel */}
                <button
                    type="button"
                    onClick={() => onMethodChange('manual')}
                    className={cn(
                        "relative p-6 rounded-[2rem] border-2 transition-all duration-500 text-left overflow-hidden group",
                        activeMethod === 'manual'
                            ? "bg-slate-900 border-slate-900 shadow-xl shadow-slate-900/10"
                            : "bg-white border-slate-100 hover:border-slate-200"
                    )}
                >
                    <div className="flex items-start gap-5">
                        <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
                            activeMethod === 'manual' ? "bg-white shadow-lg rotate-6" : "bg-slate-50 group-hover:scale-110"
                        )}>
                            <MapPin className={cn(
                                "w-7 h-7",
                                activeMethod === 'manual' ? "text-slate-900" : "text-slate-400"
                            )} />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className={cn(
                                    "font-black text-lg tracking-tight",
                                    activeMethod === 'manual' ? "text-white" : "text-slate-700"
                                )}>
                                    Placement Manuel
                                </h4>
                                {activeMethod === 'manual' && <Check className="w-5 h-5 text-emerald-400" />}
                            </div>
                            <p className={cn(
                                "text-sm font-bold leading-snug",
                                activeMethod === 'manual' ? "text-slate-400" : "text-slate-400"
                            )}>
                                Placez précisément votre point de vente sur la carte.
                            </p>
                        </div>
                    </div>
                </button>
            </div>

            <div className="mt-6 p-5 bg-blue-50/50 border border-blue-100 rounded-[1.5rem] flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-sm">
                    <p className="text-blue-900 font-black mb-1">Optimisation du Signal</p>
                    <p className="text-blue-700 font-bold leading-relaxed">
                        Pour une précision maximale avec le GPS automatique, assurez-vous d'être à proximité d'une fenêtre ou en extérieur.
                    </p>
                </div>
            </div>
        </div>
    );
};
