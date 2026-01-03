import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthResponse } from '@/types';
import { authService } from '@/services/auth.service';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (credentials: any) => Promise<void>;
    logout: () => void;
    checkAuth: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

/**
 * Store global pour l'authentification.
 * Persiste les données utilisateur dans le localStorage.
 */
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (credentials) => {
                set({ isLoading: true, error: null });
                try {
                    const response: AuthResponse = await authService.login(credentials);
                    set({
                        user: response.user,
                        isAuthenticated: true,
                        isLoading: false
                    });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Erreur de connexion',
                        isLoading: false
                    });
                    throw error;
                }
            },

            logout: () => {
                authService.logout();
                set({ user: null, isAuthenticated: false, error: null });
            },

            checkAuth: () => {
                const user = authService.getCurrentUser();
                const isAuth = authService.isAuthenticated();
                set({ user, isAuthenticated: isAuth });
            },

            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),
        }),
        {
            name: 'pharmagn-auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);
