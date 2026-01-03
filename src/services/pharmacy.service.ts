import apiClient from './apiClient';
import type { Pharmacy, DutySchedule, ApiResponse, SearchParams } from '@/types';

/**
 * Service pour les pharmacies et les plannings de garde.
 */
export const pharmacyService = {
    /**
     * Liste des pharmacies avec filtres.
     */
    getAll: async (params?: SearchParams): Promise<ApiResponse<Pharmacy>> => {
        const response = await apiClient.get<ApiResponse<Pharmacy>>('/pharmacies/', { params });
        return response.data;
    },

    /**
     * Détails d'une pharmacie.
     */
    getById: async (id: number): Promise<Pharmacy> => {
        const response = await apiClient.get<Pharmacy>(`/pharmacies/${id}/`);
        return response.data;
    },

    /**
     * Pharmacies de garde actuelles.
     */
    getOnDuty: async (): Promise<ApiResponse<Pharmacy>> => {
        const response = await apiClient.get<ApiResponse<Pharmacy>>('/pharmacies/on-duty/');
        return response.data;
    },

    /**
     * Pharmacies à proximité.
     */
    getNearby: async (lat: number, lng: number, radius: number = 5): Promise<ApiResponse<Pharmacy>> => {
        const response = await apiClient.get<ApiResponse<Pharmacy>>('/pharmacies/nearby/', {
            params: { lat, lng, radius }
        });
        return response.data;
    },

    /**
     * Plannings de garde.
     */
    getSchedules: async (params?: any): Promise<ApiResponse<DutySchedule>> => {
        const response = await apiClient.get<ApiResponse<DutySchedule>>('/duty-schedules/', { params });
        return response.data;
    }
};
