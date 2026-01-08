import React from 'react';
import { OrderStatus } from '@/types/client';
import {
    Clock,
    CheckCircle,
    Package,
    XCircle
} from 'lucide-react';

interface OrderStatusBadgeProps {
    status: OrderStatus;
    size?: 'sm' | 'md' | 'lg';
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
    status,
    size = 'md'
}) => {
    const config = {
        pending: {
            label: 'En attente',
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-700',
            borderColor: 'border-amber-100',
            icon: Clock
        },
        confirmed: {
            label: 'Validée',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700',
            borderColor: 'border-blue-100',
            icon: CheckCircle
        },
        ready: {
            label: 'En livraison',
            bgColor: 'bg-indigo-50',
            textColor: 'text-indigo-700',
            borderColor: 'border-indigo-100',
            icon: Package
        },
        delivered: {
            label: 'Livrée',
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-700',
            borderColor: 'border-emerald-100',
            icon: CheckCircle
        },
        cancelled: {
            label: 'Annulée',
            bgColor: 'bg-rose-50',
            textColor: 'text-rose-700',
            borderColor: 'border-rose-100',
            icon: XCircle
        }
    };

    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-2 text-base'
    };

    const { label, bgColor, textColor, borderColor, icon: Icon } = config[status];

    return (
        <span
            className={`inline-flex items-center gap-1.5 ${sizeClasses[size]} ${bgColor} ${textColor} ${borderColor} border rounded-lg font-bold transition-all shadow-sm`}
        >
            <Icon size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} />
            {label}
        </span>
    );
};
