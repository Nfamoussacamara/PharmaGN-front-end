/**
 * Composant SearchBar - Barre de recherche et filtres.
 * Permet de rechercher et filtrer les pharmacies par nom, ville et statut.
 */

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { VILLES_GUINEE } from '@/types';

/**
 * Props du composant SearchBar.
 */
interface SearchBarProps {
    /** Callback appelé lors de la recherche textuelle (avec debounce) */
    onSearch: (query: string) => void;

    /** Callback appelé lors du changement de filtre ville */
    onCityFilter: (city: string) => void;

    /** Callback appelé lors du changement de filtre statut */
    onStatusFilter: (status: string) => void;
}

/**
 * Composant barre de recherche avec debounce et filtres.
 * Optimise les requêtes API en retardant la recherche de 300ms.
 */
const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    onCityFilter,
    onStatusFilter,
}) => {
    // État local pour la valeur de recherche (avant debounce)
    const [queryLocale, setQueryLocale] = useState<string>('');

    /**
     * Effect pour implémenter le debounce sur la recherche.
     * Attend 300ms après la dernière frappe avant de déclencher la recherche.
     */
    useEffect(() => {
        // Crée un timer de 300ms
        const timer = setTimeout(() => {
            // Appelle le callback de recherche après le délai
            onSearch(queryLocale);
        }, 300);

        // Nettoie le timer si une nouvelle frappe arrive
        return () => {
            clearTimeout(timer);
        };
    }, [queryLocale, onSearch]);

    /**
     * Gère le changement dans le champ de recherche.
     */
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setQueryLocale(e.target.value);
    };

    /**
     * Gère le changement du filtre ville.
     */
    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        onCityFilter(e.target.value);
    };

    /**
     * Gère le changement du filtre statut.
     */
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        onStatusFilter(e.target.value);
    };

    return (
        <div className="bg-white rounded-xl shadow-card p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Champ de recherche textuelle */}
                <div className="md:col-span-1">
                    <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
                        Rechercher
                    </label>
                    <div className="relative">
                        {/* Icon de recherche */}
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>

                        {/* Input de recherche */}
                        <input
                            type="text"
                            id="search"
                            value={queryLocale}
                            onChange={handleSearchChange}
                            placeholder="Nom ou adresse..."
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Filtre par ville */}
                <div className="md:col-span-1">
                    <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                        Ville
                    </label>
                    <select
                        id="city"
                        onChange={handleCityChange}
                        className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                    >
                        <option value="">Toutes les villes</option>
                        {VILLES_GUINEE.map((ville) => (
                            <option key={ville} value={ville}>
                                {ville}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filtre par statut */}
                <div className="md:col-span-1">
                    <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                        Statut
                    </label>
                    <select
                        id="status"
                        onChange={handleStatusChange}
                        className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                    >
                        <option value="">Toutes</option>
                        <option value="true">Ouvertes uniquement</option>
                        <option value="false">Fermées uniquement</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
