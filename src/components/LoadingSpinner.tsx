/**
 * Composant LoadingSpinner - Indicateur de chargement.
 * Affiche une animation de chargement avec message optionnel.
 */

import React from 'react';
import { Loader } from 'lucide-react';

/**
 * Props du composant LoadingSpinner.
 */
interface LoadingSpinnerProps {
    /** Message de chargement optionnel à afficher */
    message?: string;
}

/**
 * Composant spinner de chargement animé.
 * Centré avec animation de rotation et message personnalisable.
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    message = 'Chargement en cours...'
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            {/* Icon de chargement avec animation */}
            <Loader className="h-12 w-12 text-primary-500 animate-spin mb-4" />

            {/* Message de chargement */}
            <p className="text-gray-600 text-center font-medium">
                {message}
            </p>
        </div>
    );
};

export default LoadingSpinner;
