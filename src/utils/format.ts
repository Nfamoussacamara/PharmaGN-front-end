import { formatDistanceToNow, isAfter, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Retourne le temps restant avant une date donnée en format lisible.
 */
export const getTimeRemaining = (datePath: string): string => {
    try {
        const date = parseISO(datePath);
        if (!isAfter(date, new Date())) {
            return "Terminé";
        }
        return formatDistanceToNow(date, { locale: fr, addSuffix: false });
    } catch (e) {
        return "N/A";
    }
};

/**
 * Formate un montant en Franc Guinéen (GNF).
 */
export const formatPrice = (price: number | string): string => {
    const amount = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('fr-GN', {
        style: 'currency',
        currency: 'GNF',
        maximumFractionDigits: 0,
    }).format(amount);
};

/**
 * Formate une date au format français.
 */
export const formatDate = (datePath: string): string => {
    try {
        return new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(parseISO(datePath));
    } catch (e) {
        return "Date invalide";
    }
};
