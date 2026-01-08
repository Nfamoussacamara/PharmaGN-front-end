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
        <div className="bg-transparent p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Champ de recherche textuelle */}
                <div className="md:col-span-1">
                    <label htmlFor="search" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">
                        Rechercher
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-500">
                            <Search className="h-5 w-5 text-slate-300" />
                        </div>
                        <input
                            type="text"
                            id="search"
                            value={queryLocale}
                            onChange={handleSearchChange}
                            placeholder="Nom ou adresse..."
                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none font-bold text-slate-700"
                        />
                    </div>
                </div>

                {/* Filtre par ville */}
                <div className="md:col-span-1">
                    <label htmlFor="city" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">
                        Ville
                    </label>
                    <select
                        id="city"
                        onChange={handleCityChange}
                        className="block w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none font-bold text-slate-700 cursor-pointer appearance-none"
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
                    <label htmlFor="status" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">
                        Statut
                    </label>
                    <select
                        id="status"
                        onChange={handleStatusChange}
                        className="block w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none font-bold text-slate-700 cursor-pointer appearance-none"
                    >
                        <option value="">Toutes les pharmacies</option>
                        <option value="true">Ouvertes uniquement</option>
                        <option value="false">Fermées uniquement</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
