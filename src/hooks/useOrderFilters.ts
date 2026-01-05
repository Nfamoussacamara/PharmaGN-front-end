import { useSearchParams } from 'react-router-dom';
import { OrderFilters, OrderStatus, PrescriptionStatus } from '@/types';
import { useMemo } from 'react';

/**
 * Hook pour synchroniser les filtres de commandes avec l'URL.
 */
export const useOrderFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const filters = useMemo((): OrderFilters => {
        const params: OrderFilters = {};

        const status = searchParams.getAll('status') as OrderStatus[];
        if (status.length > 0) params.status = status;

        if (searchParams.get('pharmacy_id')) params.pharmacy_id = searchParams.get('pharmacy_id')!;
        if (searchParams.get('date_from')) params.date_from = searchParams.get('date_from')!;
        if (searchParams.get('date_to')) params.date_to = searchParams.get('date_to')!;
        if (searchParams.get('period')) params.period = searchParams.get('period') as any;

        const priceMin = searchParams.get('price_min');
        if (priceMin) params.price_min = Number(priceMin);

        const priceMax = searchParams.get('price_max');
        if (priceMax) params.price_max = Number(priceMax);

        const hasPrescription = searchParams.get('has_prescription');
        if (hasPrescription !== null) params.has_prescription = hasPrescription === 'true';

        const prescriptionStatus = searchParams.get('prescription_status') as PrescriptionStatus;
        if (prescriptionStatus) params.prescription_status = prescriptionStatus;

        if (searchParams.get('search')) params.search = searchParams.get('search')!;
        if (searchParams.get('ordering')) params.ordering = searchParams.get('ordering')!;
        if (searchParams.get('page')) params.page = Number(searchParams.get('page'));

        return params;
    }, [searchParams]);

    const setFilters = (newFilters: Partial<OrderFilters>) => {
        const nextParams = new URLSearchParams(searchParams);

        Object.entries(newFilters).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
                nextParams.delete(key);
            } else if (Array.isArray(value)) {
                nextParams.delete(key);
                value.forEach(v => nextParams.append(key, v));
            } else {
                nextParams.set(key, String(value));
            }
        });

        // Reset page when filters change
        if (!newFilters.page && searchParams.get('page')) {
            nextParams.delete('page');
        }

        setSearchParams(nextParams);
    };

    const clearFilters = () => {
        setSearchParams(new URLSearchParams());
    };

    return { filters, setFilters, clearFilters };
};
