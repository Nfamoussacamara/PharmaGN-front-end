/**
 * Types TypeScript pour l'interface client PharmaGN
 */

export interface Product {
    id: string;
    name: string;
    image: string;
    price: number;
    category: string;
    pharmacy: string;
    pharmacyId: string;
    stock: number;
    discount?: number;
    description?: string;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface DeliveryAddress {
    fullname: string;
    phone: string;
    email: string;
    street: string;
    city: string;
    quarter: string;
    instructions?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'ready' | 'delivered' | 'cancelled';

export type PaymentMethod = 'mobile_money' | 'cash';

export interface PaymentDetails {
    method: PaymentMethod;
    mobileMoneyNumber?: string;
    mobileMoneyOperator?: 'orange' | 'mtn' | 'moov';
}

export interface Order {
    id: string;
    orderNumber: string;
    items: CartItem[];
    totalAmount: number;
    status: OrderStatus;
    deliveryAddress: DeliveryAddress;
    payment: PaymentDetails;
    createdAt: Date;
    updatedAt: Date;
    statusHistory?: {
        status: OrderStatus;
        timestamp: Date;
    }[];
}

export interface OrderFormData {
    fullname: string;
    phone: string;
    email: string;
    street: string;
    city: string;
    quarter: string;
    instructions?: string;
    paymentMethod: PaymentMethod;
    mobileMoneyNumber?: string;
    mobileMoneyOperator?: 'orange' | 'mtn' | 'moov';
}
