import { useState, useEffect } from 'react';

interface GeolocationState {
    location: [number, number] | null;
    error: string | null;
    loading: boolean;
}

/**
 * Hook personnalisé pour récupérer la position de l'utilisateur.
 */
export const useGeolocation = () => {
    const [state, setState] = useState<GeolocationState>({
        location: null,
        error: null,
        loading: true,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setState({
                location: null,
                error: "La géolocalisation n'est pas supportée par votre navigateur",
                loading: false,
            });
            return;
        }

        const onSuccess = (position: GeolocationPosition) => {
            setState({
                location: [position.coords.latitude, position.coords.longitude],
                error: null,
                loading: false,
            });
        };

        const onError = (error: GeolocationPositionError) => {
            let message = "Erreur de géolocalisation";
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    message = "Permission de géolocalisation refusée";
                    break;
                case error.POSITION_UNAVAILABLE:
                    message = "Position non disponible";
                    break;
                case error.TIMEOUT:
                    message = "Délai d'attente dépassé";
                    break;
            }
            setState({
                location: null,
                error: message,
                loading: false,
            });
        };

        navigator.geolocation.getCurrentPosition(onSuccess, onError, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        });
    }, []);

    return state;
};
