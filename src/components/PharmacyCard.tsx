/**
 * Composant PharmacyCard - Carte d'affichage d'une pharmacie.
 * Affiche les informations principales d'une pharmacie dans un design moderne.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import type { Pharmacy } from '@/types';

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
    return (
        <Link
            to={`/pharmacy/${pharmacy.id}`}
            className="block group"
        >
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 p-8 border border-slate-100 group-hover:-translate-y-2 relative overflow-hidden h-full flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none" />

                {/* En-tête avec nom et badge statut */}
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-black text-slate-900 flex-1 pr-4 tracking-tight leading-snug">
                        {pharmacy.name}
                    </h3>

                    {/* Badge ouvert/fermé */}
                    <span
                        className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${pharmacy.is_open
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                            }`}
                    >
                        <Clock className="h-3 w-3 mr-2" />
                        {pharmacy.status_display}
                    </span>
                </div>

                {/* Informations de localisation */}
                <div className="space-y-4 mb-8 flex-1">
                    {/* Ville */}
                    <div className="flex items-start text-slate-600">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center mr-4 shrink-0">
                            <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                                {pharmacy.city}
                            </p>
                            <p className="text-sm text-slate-600 font-bold leading-relaxed">
                                {pharmacy.address}
                            </p>
                        </div>
                    </div>

                    {/* Téléphone */}
                    <div className="flex items-center text-slate-600">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center mr-4 shrink-0">
                            <Phone className="h-5 w-5 text-emerald-600" />
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

                {/* Footer avec indicateur GPS si disponible */}
                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest">
                        {pharmacy.has_location ? (
                            <span className="flex items-center text-blue-500">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse mr-2" />
                                GPS Actif
                            </span>
                        ) : (
                            <span className="text-slate-300">Sans GPS</span>
                        )}
                    </span>

                    <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 group-hover:gap-4 transition-all duration-300">
                        Voir détails <ArrowRight size={14} />
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default PharmacyCard;
