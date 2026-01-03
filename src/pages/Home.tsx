/**
 * Page Home - Page d'accueil avec liste des pharmacies.
 * Affiche la liste de toutes les pharmacies avec recherche et filtres.
 */

import React, { useState, useEffect, useCallback } from 'react';
import type { Pharmacy, SearchParams } from '@/types';
import { obtenirPharmacies } from '@/services/api';
import SearchBar from '@/components/SearchBar';
import PharmacyCard from '@/components/PharmacyCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AlertCircle } from 'lucide-react'; 

/**
 * Composant page d'accueil.
 * Gère le chargement, la recherche et l'affichage des pharmacies.
 */
const Home: React.FC = () => {
    // État pour la liste des pharmacies
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);

    // État de chargement
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // État d'erreur
    const [error, setError] = useState<string | null>(null);

    // État des paramètres de recherche
    const [searchParams, setSearchParams] = useState<SearchParams>({});

    /**
     * Charge les pharmacies depuis l'API avec les filtres actuels.
     * Utilise useCallback pour éviter les re-renders inutiles.
     */
    const chargerPharmacies = useCallback(async () => {
        try {
            // Active le chargement
            setIsLoading(true);
            setError(null);

            // Appelle l'API avec les paramètres de recherche
            const response = await obtenirPharmacies(searchParams);

            // Met à jour la liste des pharmacies
            setPharmacies(response.results);
        } catch (err) {
            // Gère les erreurs
            const messageErreur = err instanceof Error
                ? err.message
                : 'Une erreur inconnue est survenue.';

            setError(messageErreur);
            setPharmacies([]);
        } finally {
            // Désactive le chargement
            setIsLoading(false);
        }
    }, [searchParams]);

    /**
     * Effect pour charger les pharmacies au montage et lors des changements de filtres.
     */
    useEffect(() => {
        chargerPharmacies();
    }, [chargerPharmacies]);

    /**
     * Callback pour la recherche textuelle.
     */
    const handleSearch = useCallback((query: string): void => {
        setSearchParams((prev) => ({
            ...prev,
            search: query || undefined,
            page: 1, // Reset à la page 1
        }));
    }, []);

    /**
     * Callback pour le filtre ville.
     */
    const handleCityFilter = useCallback((city: string): void => {
        setSearchParams((prev) => ({
            ...prev,
            city: city || undefined,
            page: 1,
        }));
    }, []);

    /**
     * Callback pour le filtre statut.
     */
    const handleStatusFilter = useCallback((status: string): void => {
        setSearchParams((prev) => ({
            ...prev,
            is_open: status ? status === 'true' : undefined,
            page: 1,
        }));
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
            {/* Hero Section */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Trouvez votre pharmacie en Guinée
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Recherchez parmi les pharmacies disponibles dans toutes les régions de la Guinée.
                            Informations à jour et fiables.
                        </p>
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Barre de recherche */}
                <SearchBar
                    onSearch={handleSearch}
                    onCityFilter={handleCityFilter}
                    onStatusFilter={handleStatusFilter}
                />

                {/* Affichage conditionnel basé sur l'état */}
                {isLoading ? (
                    // État de chargement
                    <LoadingSpinner message="Chargement des pharmacies..." />
                ) : error ? (
                    // État d'erreur
                    <div className="bg-accent-50 border border-accent-200 rounded-xl p-6 flex items-start">
                        <AlertCircle className="h-6 w-6 text-accent-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-lg font-semibold text-accent-900 mb-1">
                                Erreur de chargement
                            </h3>
                            <p className="text-accent-700">
                                {error}
                            </p>
                            <button
                                onClick={chargerPharmacies}
                                className="mt-4 px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors font-medium"
                            >
                                Réessayer
                            </button>
                        </div>
                    </div>
                ) : pharmacies.length === 0 ? (
                    // État vide (pas de résultats)
                    <div className="bg-white rounded-xl shadow-card p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Aucune pharmacie trouvée
                            </h3>
                            <p className="text-gray-600">
                                Essayez de modifier vos critères de recherche ou de filtrage.
                            </p>
                        </div>
                    </div>
                ) : (
                    // État de succès avec résultats
                    <>
                        {/* Compteur de résultats */}
                        <div className="mb-6">
                            <p className="text-gray-600 font-medium">
                                {pharmacies.length} pharmacie{pharmacies.length > 1 ? 's' : ''} trouvée{pharmacies.length > 1 ? 's' : ''}
                            </p>
                        </div>

                        {/* Grille de cartes de pharmacies */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                            {pharmacies.map((pharmacy) => (
                                <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
                            ))} 
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
