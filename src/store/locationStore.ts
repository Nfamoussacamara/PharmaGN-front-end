import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocationState {
    userCoords: { latitude: number; longitude: number } | null;
    selectedPharmacyId: string | number | null;
    selectedPharmacyName: string | null;

    // Actions
    setUserCoords: (coords: { latitude: number; longitude: number } | null) => void;
    setSelectedPharmacy: (id: string | number | null, name?: string | null) => void;
    clearSelection: () => void;
}

/**
 * Store global pour la localisation de l'utilisateur et la pharmacie sélectionnée.
 * Persisté dans le localStorage pour conserver le choix de la pharmacie.
 */
export const useLocationStore = create<LocationState>()(
    persist(
        (set) => ({
            userCoords: null,
            selectedPharmacyId: null,
            selectedPharmacyName: null,

            setUserCoords: (coords) => set({ userCoords: coords }),

            setSelectedPharmacy: (id, name = null) => set({
                selectedPharmacyId: id,
                selectedPharmacyName: name
            }),

            clearSelection: () => set({
                selectedPharmacyId: null,
                selectedPharmacyName: null
            }),
        }),
        {
            name: 'pharmagn-location-storage',
        }
    )
);
