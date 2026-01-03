import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * URL de base de l'API.
 * En développement : proxy Vite vers http://localhost:8000
 */
export const API_BASE_URL = '/api';

/**
 * Instance Axios de base.
 */
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

/**
 * Intercepteur de requête : Ajoute le token JWT si disponible.
 */
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Intercepteur de réponse : Gère les erreurs globales et le rafraîchissement de token.
 */
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Si erreur 401 (Non autorisé) et qu'on n'a pas déjà réessayé
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    // Tente de rafraîchir le token
                    const resp = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
                        refresh: refreshToken,
                    });

                    const { access } = resp.data;
                    localStorage.setItem('access_token', access);

                    // Rejoue la requête originale avec le nouveau token
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${access}`;
                    }
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    // Si le refresh échoue, on déconnecte
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user');
                    window.location.href = '/login?expired=true';
                }
            }
        }

        // Formatage des messages d'erreur
        let message = 'Une erreur est survenue.';
        if (error.response?.data && typeof error.response.data === 'object') {
            const data = error.response.data as any;
            // Extrait le premier message d'erreur si disponible (format Django/DRF)
            message = data.detail || data.error || Object.values(data)[0] || message;
        }

        return Promise.reject(new Error(message));
    }
);

export default apiClient;
