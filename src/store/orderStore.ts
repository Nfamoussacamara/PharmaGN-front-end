import { create } from 'zustand';
import { Order } from '@/types/client';

interface OrderStore {
    currentOrder: Order | null;
    orderHistory: Order[];
    loading: boolean;
    error: string | null;

    // Actions
    setCurrentOrder: (order: Order) => void;
    addToHistory: (order: Order) => void;
    setOrderHistory: (orders: Order[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearCurrentOrder: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
    currentOrder: null,
    orderHistory: [],
    loading: false,
    error: null,

    setCurrentOrder: (order: Order) => {
        set({ currentOrder: order });
    },

    addToHistory: (order: Order) => {
        set(state => ({
            orderHistory: [order, ...state.orderHistory]
        }));
    },

    setOrderHistory: (orders: Order[]) => {
        set({ orderHistory: orders });
    },

    setLoading: (loading: boolean) => {
        set({ loading });
    },

    setError: (error: string | null) => {
        set({ error });
    },

    clearCurrentOrder: () => {
        set({ currentOrder: null });
    }
}));
