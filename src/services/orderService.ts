import { Order, OrderFormData, CartItem, OrderStatus } from '@/types/client';

/**
 * Service de gestion des commandes
 * Utilise des données mock pour le développement
 */

// Mock storage pour les commandes
let MOCK_ORDERS: Order[] = [];
let orderCounter = 1;

/**
 * Génère un numéro de commande unique
 */
const generateOrderNumber = (): string => {
    const prefix = 'CMD';
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const num = String(orderCounter++).padStart(4, '0');
    return `${prefix}${dateStr}${num}`;
};

/**
 * Crée une nouvelle commande
 */
export const createOrder = async (
    formData: OrderFormData,
    items: CartItem[]
): Promise<Order> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const totalAmount = items.reduce((total, item) => {
        const price = item.discount
            ? item.price * (1 - item.discount / 100)
            : item.price;
        return total + price * item.quantity;
    }, 0);

    const now = new Date();

    const order: Order = {
        id: `order-${Date.now()}`,
        orderNumber: generateOrderNumber(),
        items,
        totalAmount,
        status: 'pending',
        deliveryAddress: {
            fullname: formData.fullname,
            phone: formData.phone,
            email: formData.email,
            street: formData.street,
            city: formData.city,
            quarter: formData.quarter,
            instructions: formData.instructions
        },
        payment: {
            method: formData.paymentMethod,
            mobileMoneyNumber: formData.mobileMoneyNumber,
            mobileMoneyOperator: formData.mobileMoneyOperator
        },
        createdAt: now,
        updatedAt: now,
        statusHistory: [
            {
                status: 'pending',
                timestamp: now
            }
        ]
    };

    MOCK_ORDERS.unshift(order);
    return order;
};

/**
 * Récupère une commande par ID
 */
export const getOrderById = async (id: string): Promise<Order | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_ORDERS.find(o => o.id === id) || null;
};

/**
 * Récupère l'historique des commandes
 */
export const getOrderHistory = async (): Promise<Order[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return MOCK_ORDERS;
};

/**
 * Met à jour le statut d'une commande
 */
export const updateOrderStatus = async (
    id: string,
    status: OrderStatus
): Promise<Order | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const orderIndex = MOCK_ORDERS.findIndex(o => o.id === id);
    if (orderIndex === -1) return null;

    const now = new Date();
    MOCK_ORDERS[orderIndex] = {
        ...MOCK_ORDERS[orderIndex],
        status,
        updatedAt: now,
        statusHistory: [
            ...(MOCK_ORDERS[orderIndex].statusHistory || []),
            { status, timestamp: now }
        ]
    };

    return MOCK_ORDERS[orderIndex];
};

/**
 * Annule une commande (si statut pending ou confirmed)
 */
export const cancelOrder = async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const order = MOCK_ORDERS.find(o => o.id === id);
    if (!order) return false;

    if (order.status !== 'pending' && order.status !== 'confirmed') {
        throw new Error('Cette commande ne peut plus être annulée');
    }

    await updateOrderStatus(id, 'cancelled');
    return true;
};

/**
 * Filtre les commandes par statut
 */
export const filterOrdersByStatus = async (
    status: OrderStatus | 'all'
): Promise<Order[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    if (status === 'all') return MOCK_ORDERS;
    return MOCK_ORDERS.filter(o => o.status === status);
};

/**
 * Obtient les statistiques des commandes
 */
export const getOrderStats = async (): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    ready: number;
    delivered: number;
    cancelled: number;
}> => {
    await new Promise(resolve => setTimeout(resolve, 200));

    return {
        total: MOCK_ORDERS.length,
        pending: MOCK_ORDERS.filter(o => o.status === 'pending').length,
        confirmed: MOCK_ORDERS.filter(o => o.status === 'confirmed').length,
        ready: MOCK_ORDERS.filter(o => o.status === 'ready').length,
        delivered: MOCK_ORDERS.filter(o => o.status === 'delivered').length,
        cancelled: MOCK_ORDERS.filter(o => o.status === 'cancelled').length
    };
};
