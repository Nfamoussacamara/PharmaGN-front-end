import { useState } from 'react';
import apiClient from '@/services/apiClient';

interface UpdateLocationPayload {
    latitude: number;
    longitude: number;
    precision: number | null;
    method: 'gps' | 'manual';
}

export const usePharmacyLocation = (pharmacyId: string | number) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateLocation = async (payload: UpdateLocationPayload) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.patch(`/pharmacies/${pharmacyId}/location/`, payload);
            setLoading(false);
            return response.data;
        } catch (err: any) {
            setError(err.message || "Erreur lors de la sauvegarde.");
            setLoading(false);
            throw err;
        }
    };

    return {
        updateLocation,
        loading,
        error
    };
};
