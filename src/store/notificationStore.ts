import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface NotificationState {
    toasts: Toast[];

    // Actions
    addToast: (message: string, type: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
}

/**
 * Store global pour les notifications UI (toasts).
 */
export const useNotificationStore = create<NotificationState>((set) => ({
    toasts: [],

    addToast: (message, type, duration = 5000) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: Toast = { id, message, type, duration };

        set((state) => ({
            toasts: [...state.toasts, newToast],
        }));

        // Suppression automatique après la durée
        if (duration !== Infinity) {
            setTimeout(() => {
                set((state) => ({
                    toasts: state.toasts.filter((t) => t.id !== id),
                }));
            }, duration);
        }
    },

    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        }));
    },
}));
