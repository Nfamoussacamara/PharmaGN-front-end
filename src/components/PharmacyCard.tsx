/**
 * Composant PharmacyCard - Carte d'affichage d'une pharmacie.
 * Affiche les informations principales d'une pharmacie dans un design moderne.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, ArrowRight, CheckCircle2, ShoppingCart } from 'lucide-react';
import type { Pharmacy } from '@/types';
import { useLocationStore } from '@/store/locationStore';
import { calculateDistance, formatDistance } from '@/utils/geoUtils';
import { cn } from '@/utils/cn';

/**
 * Props du composant PharmacyCard.
 */
interface PharmacyCardProps {
    /** Données de la pharmacie à afficher */
    pharmacy: Pharmacy;
}

/**
 * Composant carte pour afficher une pharmacie.
 * Design moderne avec glassmorphism et animations hover.
 */
const PharmacyCard: React.FC<PharmacyCardProps> = ({ pharmacy }) => {
    const { userCoords, selectedPharmacyId, setSelectedPharmacy } = useLocationStore();

    const distance = React.useMemo(() => {
        if (!userCoords || !pharmacy.latitude || !pharmacy.longitude) return null;
        return calculateDistance(
            userCoords.latitude, userCoords.longitude,
            Number(pharmacy.latitude), Number(pharmacy.longitude)
        );
    }, [userCoords, pharmacy.latitude, pharmacy.longitude]);

    const isSelected = selectedPharmacyId === pharmacy.id;

    const handleSelect = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedPharmacy(pharmacy.id, pharmacy.name);
    };

    return (
        <div className="relative group h-full">
            <Link
                to={`/pharmacy/${pharmacy.id}`}
                className="block h-full"
            >
                <div className={cn(
                    "bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-500 p-8 border hover:border-emerald-200 group-hover:-translate-y-2 relative overflow-hidden h-full flex flex-col",
                    isSelected ? "border-emerald-500 ring-4 ring-emerald-500/10 shadow-emerald-900/10" : "border-slate-100 shadow-slate-200/50"
                )}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none" />

                    {/* En-tête avec nom et badge statut */}
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-xl font-black text-slate-900 flex-1 pr-4 tracking-tight leading-snug">
                            {pharmacy.name}
                        </h3>

                        <div className="flex flex-col items-end gap-2">
                            {/* Badge ouvert/fermé */}
                            <span
                                className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${pharmacy.is_open_now
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    : 'bg-rose-50 text-rose-700 border border-rose-100'
                                    }`}
                            >
                                <Clock className="h-3 w-3 mr-2" />
                                {pharmacy.is_open_now ? 'OUVERT' : 'FERMÉ'}
                            </span>

                            {isSelected && (
                                <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                    <CheckCircle2 size={12} className="fill-emerald-600 text-white" />
                                    Sélectionnée
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Informations de localisation */}
                    <div className="space-y-4 mb-8 flex-1">
                        {/* Ville & Distance */}
                        <div className="flex items-start text-slate-600">
                            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center mr-4 shrink-0 transition-colors group-hover:bg-emerald-50">
                                <MapPin className="h-5 w-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                        {pharmacy.city}
                                    </p>
                                    {distance !== null && (
                                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                                            {formatDistance(distance)}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-600 font-bold leading-relaxed line-clamp-2">
                                    {pharmacy.address}
                                </p>
                            </div>
                        </div>

                        {/* Téléphone */}
                        <div className="flex items-center text-slate-600">
                            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center mr-4 shrink-0 group-hover:bg-emerald-50 transition-colors">
                                <Phone className="h-5 w-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                            </div>
                            <a
                                href={`tel:${pharmacy.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-sm hover:text-emerald-600 transition-colors font-black"
                            >
                                {pharmacy.phone}
                            </a>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t border-slate-50 flex flex-col gap-4">
                        <button
                            onClick={handleSelect}
                            className={cn(
                                "w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                                isSelected
                                    ? "bg-slate-100 text-slate-400 cursor-default"
                                    : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 active:scale-95"
                            )}
                        >
                            {isSelected ? (
                                <>Ma Boutique Active</>
                            ) : (
                                <>
                                    <ShoppingCart size={14} />
                                    Choisir cette boutique
                                </>
                            )}
                        </button>

                        <div className="flex items-center justify-between px-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                                {pharmacy.latitude ? 'GPS ACTIF' : 'SANS GPS'}
                            </span>
                            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 group-hover:gap-4 transition-all duration-300">
                                Détails <ArrowRight size={14} />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default PharmacyCard;
