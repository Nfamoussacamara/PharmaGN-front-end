import apiClient from './apiClient';
import type { Order, Prescription, ApiResponse } from '@/types';

/**
 * Service pour les commandes et ordonnances.
 */
export const orderService = {
    /**
     * Liste des commandes (filtrées selon le rôle par le backend).
     */
    getAll: async (params?: any): Promise<ApiResponse<Order>> => {
        const response = await apiClient.get<ApiResponse<Order>>('/orders/', { params });
        return response.data;
    },

    /**
     * Création d'une commande.
     */
    create: async (data: { pharmacy: number; medication: number; quantity: number }): Promise<Order> => {
        const response = await apiClient.post<Order>('/orders/', data);
        return response.data;
    },

    /**
     * Upload d'ordonnance pour une commande.
     */
    uploadPrescription: async (orderId: number, formData: FormData): Promise<Order> => {
        const response = await apiClient.post<Order>(`/orders/${orderId}/upload-prescription/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    /**
     * Actions pharmacien sur commande (validate, reject, complete).
     */
    updateStatus: async (orderId: number, action: 'validate' | 'reject' | 'complete', data?: any): Promise<Order> => {
        const response = await apiClient.patch<Order>(`/orders/${orderId}/${action}/`, data);
        return response.data;
    },

    /**
     * Annulation patient.
     */
    cancel: async (orderId: number): Promise<Order> => {
        const response = await apiClient.delete<Order>(`/orders/${orderId}/`);
        return response.data;
    },

    /**
     * Récupérer les ordonnances.
     */
    getPrescriptions: async (params?: any): Promise<ApiResponse<Prescription>> => {
        const response = await apiClient.get<ApiResponse<Prescription>>('/prescriptions/', { params });
        return response.data;
    }
};
