import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/types/client';

interface CartStore {
    items: CartItem[];
    isCartOpen: boolean;

    // Actions
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;

    // Computed
    getTotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isCartOpen: false,

            addToCart: (product: Product) => {
                const { items } = get();
                const existingItem = items.find(item => item.id === product.id);

                if (existingItem) {
                    // Increment quantity if product already in cart
                    set({
                        items: items.map(item =>
                            item.id === product.id && item.quantity < item.stock
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        )
                    });
                } else {
                    // Add new product to cart
                    set({
                        items: [...items, { ...product, quantity: 1 }]
                    });
                }
            },

            removeFromCart: (productId: string) => {
                set(state => ({
                    items: state.items.filter(item => item.id !== productId)
                }));
            },

            updateQuantity: (productId: string, quantity: number) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId);
                    return;
                }

                set(state => ({
                    items: state.items.map(item =>
                        item.id === productId
                            ? { ...item, quantity: Math.min(quantity, item.stock) }
                            : item
                    )
                }));
            },

            clearCart: () => {
                set({ items: [] });
            },

            toggleCart: () => {
                set(state => ({ isCartOpen: !state.isCartOpen }));
            },

            getTotal: () => {
                const { items } = get();
                return items.reduce((total, item) => {
                    const price = item.discount
                        ? item.price * (1 - item.discount / 100)
                        : item.price;
                    return total + price * item.quantity;
                }, 0);
            },

            getItemCount: () => {
                const { items } = get();
                return items.reduce((count, item) => count + item.quantity, 0);
            }
        }),
        {
            name: 'pharmagn-cart-storage'
        }
    )
);
