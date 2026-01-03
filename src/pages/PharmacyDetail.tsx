/**
 * Page PharmacyDetail - Page de détail d'une pharmacie.
 * Affiche toutes les informations détaillées d'une pharmacie spécifique.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Pharmacy } from '@/types';
import { obtenirPharmacieParId } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
    ArrowLeft,
    MapPin,
    Phone,
    Clock,
    Calendar,
    AlertCircle,
    Navigation
} from 'lucide-react';

/**
 * Composant page de détail d'une pharmacie.
 * Charge et affiche les informations complètes d'une pharmacie.
 */
const PharmacyDetail: React.FC = () => {
    // Récupère l'ID depuis les paramètres d'URL (typé)
    const { id } = useParams<{ id: string }>();

    // Hook de navigation pour redirection
    const navigate = useNavigate();

    // État pour les données de la pharmacie
    const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);

    // État de chargement
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // État d'erreur
    const [error, setError] = useState<string | null>(null);

    /**
     * Effect pour charger les données de la pharmacie au montage.
     */
    useEffect(() => {
        const chargerPharmacie = async (): Promise<void> => {
            // Vérifie que l'ID est présent
            if (!id) {
                setError('Identifiant de pharmacie manquant.');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                // Convertit l'ID en nombre et charge la pharmacie
                const pharmacieId = parseInt(id, 10);

                if (isNaN(pharmacieId)) {
                    throw new Error('Identifiant invalide.');
                }

                const data = await obtenirPharmacieParId(pharmacieId);
                setPharmacy(data);
            } catch (err) {
                const messageErreur = err instanceof Error
                    ? err.message
                    : 'Impossible de charger la pharmacie.';

                setError(messageErreur);
            } finally {
                setIsLoading(false);
            }
        };

        chargerPharmacie();
    }, [id]);

    /**
     * Formate une date ISO en format lisible français.
     */
    const formaterDate = (dateISO: string): string => {
        const date = new Date(dateISO);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Affichage pendant le chargement
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <LoadingSpinner message="Chargement des informations..." />
                </div>
            </div>
        );
    }

    // Affichage en cas d'erreur
    if (error || !pharmacy) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-accent-50 border border-accent-200 rounded-xl p-6 flex items-start">
                        <AlertCircle className="h-6 w-6 text-accent-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-accent-900 mb-1">
                                Pharmacie non trouvée
                            </h3>
                            <p className="text-accent-700 mb-4">
                                {error || 'Cette pharmacie n\'existe pas ou a été supprimée.'}
                            </p>
                            <Link
                                to="/"
                                className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour à l'accueil
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Affichage de la pharmacie
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Bouton retour */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 inline-flex items-center text-gray-600 hover:text-primary-600 font-medium transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Retour
                </button>

                {/* Carte principale */}
                <div className="bg-white rounded-xl shadow-card overflow-hidden animate-fadeIn">
                    {/* En-tête avec nom et statut */}
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 px-8 py-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-0">
                                {pharmacy.name}
                            </h1>

                            <span
                                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${pharmacy.is_open
                                        ? 'bg-white text-primary-700'
                                        : 'bg-accent-100 text-accent-700'
                                    }`}
                            >
                                <Clock className="h-4 w-4 mr-2" />
                                {pharmacy.status_display}
                            </span>
                        </div>
                    </div>

                    {/* Contenu */}
                    <div className="px-8 py-6 space-y-6">
                        {/* Section Informations générales */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <MapPin className="h-5 w-5 text-primary-500 mr-2" />
                                Informations
                            </h2>

                            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                                {/* Ville */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Ville
                                    </label>
                                    <p className="text-lg text-gray-900">{pharmacy.city}</p>
                                </div>

                                {/* Adresse */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Adresse
                                    </label>
                                    <p className="text-lg text-gray-900">{pharmacy.address}</p>
                                </div>

                                {/* Téléphone */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Téléphone
                                    </label>
                                    <a
                                        href={`tel:${pharmacy.phone}`}
                                        className="text-lg text-primary-600 hover:text-primary-700 font-medium flex items-center"
                                    >
                                        <Phone className="h-5 w-5 mr-2" />
                                        {pharmacy.phone}
                                    </a>
                                </div>
                            </div>
                        </section>

                        {/* Section Localisation GPS */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <Navigation className="h-5 w-5 text-secondary-500 mr-2" />
                                Localisation GPS
                            </h2>

                            {pharmacy.has_location ? (
                                <div className="bg-blue-50 rounded-lg p-6 space-y-3">
                                    <div className="flex items-center text-blue-700 mb-2">
                                        <MapPin className="h-5 w-5 mr-2" />
                                        <span className="font-semibold">Coordonnées GPS disponibles</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Latitude
                                            </label>
                                            <p className="text-lg text-gray-900 font-mono">
                                                {pharmacy.latitude}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Longitude
                                            </label>
                                            <p className="text-lg text-gray-900 font-mono">
                                                {pharmacy.longitude}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 mt-4">
                                        💡 La carte interactive sera disponible dans une prochaine version.
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-lg p-6 text-center">
                                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-600">
                                        Les coordonnées GPS ne sont pas encore disponibles pour cette pharmacie.
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* Section Métadonnées */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                                Informations complémentaires
                            </h2>

                            <div className="bg-gray-50 rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Ajoutée le
                                    </label>
                                    <p className="text-gray-900">
                                        {formaterDate(pharmacy.created_at)}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Dernière modification
                                    </label>
                                    <p className="text-gray-900">
                                        {formaterDate(pharmacy.updated_at)}
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PharmacyDetail;
