import { useState } from 'react';

interface GeolocationPosition {
    latitude: number;
    longitude: number;
    accuracy: number;
}

export const useGeolocation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getCurrentLocation = (highAccuracy = true): Promise<GeolocationPosition> => {
        setLoading(true);
        setError(null);

        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                const msg = "La géolocalisation n'est pas supportée par votre navigateur.";
                setError(msg);
                setLoading(false);
                reject(msg);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                    };
                    setLoading(false);
                    resolve(coords);
                },
                async (err) => {
                    // If high accuracy failed and we haven't tried low accuracy yet
                    if (highAccuracy && (err.code === 3 || err.code === 2)) {
                        console.log("High accuracy failed, retrying with low accuracy...");
                        try {
                            const lowAccuracyCoords = await getCurrentLocation(false);
                            resolve(lowAccuracyCoords);
                        } catch (fallbackErr) {
                            reject(fallbackErr);
                        }
                        return;
                    }

                    let msg = "Une erreur est survenue lors de la détection de votre position.";
                    if (err.code === 1) msg = "Veuillez autoriser l'accès à votre position dans les paramètres de votre navigateur.";
                    if (err.code === 2) msg = "Position non disponible.";
                    if (err.code === 3) msg = "Délai d'attente dépassé.";

                    setError(msg);
                    setLoading(false);
                    reject(msg);
                },
                {
                    enableHighAccuracy: highAccuracy,
                    timeout: highAccuracy ? 15000 : 15000, // Try 15s for each
                    maximumAge: 0,
                }
            );
        });
    };

    return {
        getCurrentLocation,
        loading,
        error
    };
};
