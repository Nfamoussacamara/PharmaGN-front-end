import apiClient from './apiClient';
import type { Medication, Stock, ApiResponse, SearchParams } from '@/types';

/**
 * Service pour les médicaments et stocks.
 */
export const medicationService = {
    /**
     * Liste des médicaments avec recherche.
     */
    getAll: async (params?: SearchParams): Promise<ApiResponse<Medication>> => {
        const response = await apiClient.get<ApiResponse<Medication>>('/medications/', { params });
        return response.data;
    },

    /**
     * Détails d'un médicament et sa disponibilité.
     */
    getAvailability: async (id: number, city?: string): Promise<Stock[]> => {
        const response = await apiClient.get<Stock[]>(`/medications/${id}/availability/`, {
            params: { city }
        });
        return response.data;
    },

    /**
     * Stock d'une pharmacie spécifique.
     */
    getPharmacyStock: async (pharmacyId: number): Promise<Stock[]> => {
        const response = await apiClient.get<Stock[]>(`/pharmacies/${pharmacyId}/stock/`);
        return response.data;
    },

    /**
     * Met à jour le stock (pour les pharmaciens).
     */
    updateStock: async (stockId: number, data: Partial<Stock>): Promise<Stock> => {
        const response = await apiClient.patch<Stock>(`/stock/${stockId}/`, data);
        return response.data;
    }
};
