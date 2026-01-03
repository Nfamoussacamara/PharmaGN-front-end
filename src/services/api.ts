/**
 * Service API pour communiquer avec le backend Django.
 * Utilise Axios avec typage complet TypeScript.
 */

import axios, { AxiosError, AxiosInstance } from 'axios';
import type { Pharmacy, ApiResponse, SearchParams } from '@/types';

/**
 * URL de base de l'API backend Django.
 * En développement: proxy Vite vers localhost:8000
 * En production: à configurer selon l'environnement
 */
export const API_BASE_URL = '/api';

/**
 * Instance Axios configurée pour l'API PharmaGN.
 */
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,

    // Timeout de 10 secondes
    timeout: 10000,

    // Headers par défaut
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },

    // Permettre l'envoi de cookies pour l'authentification future
    withCredentials: true,
});

/**
 * Intercepteur de réponse pour gérer les erreurs globalement.
 */
apiClient.interceptors.response.use(
    // En cas de succès, retourne la réponse telle quelle
    (response) => response,

    // En cas d'erreur, traite et formate le message
    (error: AxiosError) => {
        // Message d'erreur par défaut
        let messageErreur = 'Une erreur est survenue lors de la requête.';

        if (error.response) {
            // Erreur avec réponse du serveur (4xx, 5xx)
            switch (error.response.status) {
                case 400:
                    messageErreur = 'Données invalides. Veuillez vérifier les champs.';
                    break;
                case 404:
                    messageErreur = 'Ressource non trouvée.';
                    break;
                case 500:
                    messageErreur = 'Erreur serveur. Veuillez réessayer plus tard.';
                    break;
                default:
                    messageErreur = `Erreur ${error.response.status}: ${error.response.statusText}`;
            }
        } else if (error.request) {
            // Erreur réseau (pas de réponse du serveur)
            messageErreur = 'Impossible de joindre le serveur. Vérifiez votre connexion.';
        } else {
            // Erreur lors de la configuration de la requête
            messageErreur = error.message || messageErreur;
        }

        // Rejette la promesse avec le message d'erreur
        return Promise.reject(new Error(messageErreur));
    }
);

/**
 * Récupère la liste des pharmacies avec pagination et filtres.
 * 
 * @param params - Paramètres de recherche et filtres optionnels
 * @returns Promise avec la réponse paginée contenant les pharmacies
 * 
 * @example
 * ```typescript
 * // Récupérer toutes les pharmacies (page 1)
 * const pharmacies = await obtenirPharmacies();
 * 
 * // Rechercher par nom
 * const resultats = await obtenirPharmacies({ search: 'Centrale' });
 * 
 * // Filtrer par ville et statut
 * const ouvertes = await obtenirPharmacies({ 
 *   city: 'Conakry', 
 *   is_open: true 
 * });
 * ```
 */
export const obtenirPharmacies = async (
    params?: SearchParams
): Promise<ApiResponse<Pharmacy>> => {
    try {
        // Construit les paramètres de requête
        const queryParams: Record<string, string | number | boolean> = {};

        if (params?.search) {
            queryParams.search = params.search;
        }

        if (params?.city) {
            queryParams.city = params.city;
        }

        if (params?.is_open !== undefined) {
            queryParams.is_open = params.is_open;
        }

        if (params?.page) {
            queryParams.page = params.page;
        }

        if (params?.ordering) {
            queryParams.ordering = params.ordering;
        }

        // Effectue la requête GET
        const response = await apiClient.get<ApiResponse<Pharmacy>>('/pharmacies/', {
            params: queryParams,
        });

        return response.data;
    } catch (error) {
        // Propage l'erreur formatée par l'intercepteur
        throw error;
    }
};

/**
 * Récupère une pharmacie spécifique par son identifiant.
 * 
 * @param id - Identifiant de la pharmacie
 * @returns Promise avec les données de la pharmacie
 * @throws Error si la pharmacie n'existe pas (404)
 * 
 * @example
 * ```typescript
 * const pharmacie = await obtenirPharmacieParId(1);
 * console.log(pharmacie.name);
 * ```
 */
export const obtenirPharmacieParId = async (id: number): Promise<Pharmacy> => {
    try {
        const response = await apiClient.get<Pharmacy>(`/pharmacies/${id}/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Crée une nouvelle pharmacie.
 * 
 * @param data - Données de la pharmacie à créer
 * @returns Promise avec la pharmacie créée (incluant l'ID)
 * 
 * @example
 * ```typescript
 * const nouvellePharmie = await creerPharmie({
 *   name: 'Pharmacie Nouvelle',
 *   address: '123 Rue Example',
 *   city: 'Conakry',
 *   phone: '+224 123 456 789',
 *   is_open: true,
 * });
 * ```
 */
export const creerPharmacie = async (
    data: Omit<Pharmacy, 'id' | 'created_at' | 'updated_at' | 'status_display' | 'has_location'>
): Promise<Pharmacy> => {
    try {
        const response = await apiClient.post<Pharmacy>('/pharmacies/', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Met à jour une pharmacie existante.
 * 
 * @param id - Identifiant de la pharmacie à modifier
 * @param data - Nouvelles données (peut être partiel pour PATCH)
 * @returns Promise avec la pharmacie mise à jour
 * 
 * @example
 * ```typescript
 * // Mise à jour partielle
 * const pharmacieModifiee = await modifierPharmacie(1, { 
 *   is_open: false 
 * });
 * ```
 */
export const modifierPharmacie = async (
    id: number,
    data: Partial<Omit<Pharmacy, 'id' | 'created_at' | 'updated_at' | 'status_display' | 'has_location'>>
): Promise<Pharmacy> => {
    try {
        const response = await apiClient.patch<Pharmacy>(`/pharmacies/${id}/`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Supprime une pharmacie.
 * 
 * @param id - Identifiant de la pharmacie à supprimer
 * @returns Promise vide en cas de succès
 * 
 * @example
 * ```typescript
 * await supprimerPharmacie(1);
 * console.log('Pharmacie supprimée');
 * ```
 */
export const supprimerPharmacie = async (id: number): Promise<void> => {
    try {
        await apiClient.delete(`/pharmacies/${id}/`);
    } catch (error) {
        throw error;
    }
};

/**
 * Export par défaut du client API pour usage avancé.
 */
export default apiClient;
