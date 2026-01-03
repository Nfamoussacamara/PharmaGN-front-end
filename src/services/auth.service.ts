import apiClient from './apiClient';
import type { User, AuthTokens, AuthResponse } from '@/types';

/**
 * Service pour l'authentification.
 */
export const authService = {
    /**
     * Connexion utilisateur.
     */
    login: async (credentials: any): Promise<AuthResponse> => {
        // Dans une vraie app, on ferait d'abord POST /auth/login/ 
        // puis potentiellement un GET /auth/me/ pour avoir les infos user
        const response = await apiClient.post<AuthTokens>('/auth/login/', credentials);
        const tokens = response.data;

        // Stockage temporaire des tokens
        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);

        // Récupération du profil utilisateur (on assume qu'un endpoint /api/users/me/ existe ou on le crée)
        // Pour l'instant, disons qu'on récupère les infos
        const userResponse = await apiClient.get<User>('/users/me/'); // Corrigé : le préfixe est déjà géré par l'inclusion dans urls.py
        const user = userResponse.data;

        localStorage.setItem('user', JSON.stringify(user));

        return { ...tokens, user };
    },

    /**
     * Déconnexion.
     */
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },

    /**
     * Vérifie si l'utilisateur est connecté.
     */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('access_token');
    },

    /**
     * Récupère l'utilisateur stocké.
     */
    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
};
