/**
 * Composant PharmacyCard - Carte d'affichage d'une pharmacie.
 * Affiche les informations principales d'une pharmacie dans un design moderne.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock } from 'lucide-react';
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
            className="block"
        >
            <div className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-[1.02] p-6 border border-gray-100">
                {/* En-tête avec nom et badge statut */}
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex-1 pr-2">
                        {pharmacy.name}
                    </h3>

                    {/* Badge ouvert/fermé */}
                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${pharmacy.is_open
                                ? 'bg-primary-100 text-primary-700'
                                : 'bg-accent-100 text-accent-700'
                            }`}
                    >
                        <Clock className="h-3 w-3 mr-1" />
                        {pharmacy.status_display}
                    </span>
                </div>

                {/* Informations de localisation */}
                <div className="space-y-3">
                    {/* Ville */}
                    <div className="flex items-start text-gray-600">
                        <MapPin className="h-5 w-5 text-secondary-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-secondary-600">
                                {pharmacy.city}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                {pharmacy.address}
                            </p>
                        </div>
                    </div>

                    {/* Téléphone */}
                    <div className="flex items-center text-gray-600">
                        <Phone className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" />
                        <a
                            href={`tel:${pharmacy.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-sm hover:text-primary-600 transition-colors font-medium"
                        >
                            {pharmacy.phone}
                        </a>
                    </div>
                </div>

                {/* Footer avec indicateur GPS si disponible */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                            {pharmacy.has_location ? (
                                <span className="flex items-center text-blue-500">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    GPS disponible
                                </span>
                            ) : (
                                <span className="text-gray-400">Pas de GPS</span>
                            )}
                        </span>

                        <span className="text-xs font-semibold text-primary-600 hover:text-primary-700">
                            Voir détails →
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PharmacyCard;
