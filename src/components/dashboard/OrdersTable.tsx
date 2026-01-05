import React from 'react';
import { motion } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, Eye, Trash2,
    CheckCircle, Clock, Truck, Check, XCircle
} from 'lucide-react';
import type { Order } from '@/types';
import { formatDate, formatPrice } from '@/utils/format';
import { cn } from '@/utils/cn';
import { Dropdown } from '@/components/ui/Dropdown';

interface OrdersTableProps {
    orders: Order[];
    onOrderClick: (order: Order) => void;
    onStatusChange: (orderId: number, newStatus: string) => void;
}

const StatusBadge: React.FC<{
    status: string,
    onStatusChange?: (newStatus: string) => void
}> = ({ status, onStatusChange }) => {
    const statusConfig: Record<string, { label: string, color: string, dot: string, icon: any }> = {
        'PENDING': { label: 'En attente', color: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500', icon: Clock },
        'VALIDATED': { label: 'Validée', color: 'bg-blue-50 text-blue-700 border-blue-100', dot: 'bg-blue-500', icon: CheckCircle },
        'READY': { label: 'En livraison', color: 'bg-indigo-50 text-indigo-700 border-indigo-100', dot: 'bg-indigo-500', icon: Truck },
        'COMPLETED': { label: 'Livrée', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500', icon: Check },
        'REJECTED': { label: 'Annulée', color: 'bg-rose-50 text-rose-700 border-rose-100', dot: 'bg-rose-500', icon: XCircle },
    };

    const config = statusConfig[status] || { label: status, color: 'bg-slate-50 text-slate-700 border-slate-100', dot: 'bg-slate-400', icon: Clock };
    const Icon = config.icon;

    if (!onStatusChange) {
        return (
            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all", config.color)}>
                <Icon size={12} />
                {config.label}
            </span>
        );
    }

    const options = Object.entries(statusConfig).map(([key, value]) => ({
        id: key,
        label: value.label,
        icon: <value.icon size={14} />,
        onClick: () => onStatusChange(key),
        className: key === status ? "bg-slate-50 text-primary" : ""
    }));

    return (
        <Dropdown
            trigger={
                <button
                    className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black border transition-all hover:scale-105 active:scale-95 shadow-sm",
                        config.color
                    )}
                >
                    <Icon size={12} />
                    {config.label}
                </button>
            }
            options={options}
            align="left"
        />
    );
};

const CustomerAvatar: React.FC<{ name: string }> = ({ name }) => {
    const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black border border-emerald-200 shrink-0">
                {initials}
            </div>
            <span className="font-bold text-text-body-primary text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">{name}</span>
        </div>
    );
};

export const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onOrderClick, onStatusChange }) => {
    return (
        <div className="w-full">
            <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-2">
                    <thead>
                        <tr className="text-left">
                            <th className="px-2.5 py-3">
                                <input type="checkbox" className="rounded border-border-default text-primary focus:ring-primary h-4 w-4" />
                            </th>
                            <th className="px-2.5 py-3 text-[10px] font-black uppercase tracking-widest text-text-disabled">Commande</th>
                            <th className="px-2.5 py-3 text-[10px] font-black uppercase tracking-widest text-text-disabled">Client</th>
                            <th className="px-2.5 py-3 text-[10px] font-black uppercase tracking-widest text-text-disabled">Date</th>
                            <th className="px-2.5 py-3 text-[10px] font-black uppercase tracking-widest text-text-disabled">Montant</th>
                            <th className="px-2.5 py-3 text-[10px] font-black uppercase tracking-widest text-text-disabled">Articles</th>
                            <th className="px-2.5 py-3 text-[10px] font-black uppercase tracking-widest text-text-disabled">Statut</th>
                            <th className="px-2.5 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <motion.tr
                                    key={order.id}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    onClick={() => onOrderClick(order)}
                                    className={cn(
                                        "group transition-colors cursor-pointer shadow-sm hover:shadow-md hover:bg-emerald-50/50",
                                        isEven ? "bg-white" : "bg-emerald-50/20"
                                    )}
                                >
                                    <td className="px-2.5 py-4 rounded-l-xl border-y border-l border-border-light/50 group-hover:border-primary/20">
                                        <input
                                            type="checkbox"
                                            className="rounded border-border-default text-primary focus:ring-primary h-4 w-4 transition-all"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td className="px-2.5 py-4 border-y border-border-light/50 group-hover:border-primary/20">
                                        <span className="font-black text-primary text-sm tracking-tight">#{String(order.id).padStart(5, '0')}</span>
                                    </td>
                                    <td className="px-2.5 py-4 border-y border-border-light/50 group-hover:border-primary/20">
                                        <CustomerAvatar name={order.patient_detail?.full_name || order.patient_name || 'Client Anonyme'} />
                                    </td>
                                    <td className="px-2.5 py-4 border-y border-border-light/50 group-hover:border-primary/20 whitespace-nowrap">
                                        <span className="text-xs font-bold text-text-body-secondary uppercase tracking-tight">{formatDate(order.created_at)}</span>
                                    </td>
                                    <td className="px-2.5 py-4 border-y border-border-light/50 group-hover:border-primary/20">
                                        <span className="text-sm font-black text-emerald-700">{formatPrice(order.total_price)}</span>
                                    </td>
                                    <td className="px-2.5 py-4 border-y border-border-light/50 group-hover:border-primary/20">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-text-body-primary truncate max-w-[110px]">
                                                {order.medication_detail?.name || order.medication_name || 'Médicament'}
                                            </span>
                                            <span className="text-[10px] font-bold text-text-muted">{order.quantity} unité{order.quantity > 1 ? 's' : ''}</span>
                                        </div>
                                    </td>
                                    <td className="px-2.5 py-4 border-y border-border-light/50 group-hover:border-primary/20">
                                        <StatusBadge
                                            status={order.status}
                                            onStatusChange={(newStatus) => onStatusChange(order.id, newStatus)}
                                        />
                                    </td>
                                    <td className="px-2.5 py-4 rounded-r-xl border-y border-r border-border-light/50 group-hover:border-primary/20 text-right">
                                        <div className="flex items-center justify-end gap-0.5">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onOrderClick(order);
                                                }}
                                                className="p-1.5 hover:bg-blue-50 rounded-lg transition-all text-slate-400 hover:text-blue-600 active:scale-95 group/btn"
                                                title="Voir les détails"
                                            >
                                                <Eye size={16} className="transition-transform group-hover/btn:scale-110" />
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
                                                        onStatusChange(order.id, 'REJECTED');
                                                    }
                                                }}
                                                className="p-1.5 hover:bg-rose-50 rounded-lg transition-all text-slate-400 hover:text-rose-600 active:scale-95 group/btn"
                                                title="Annuler la commande"
                                            >
                                                <Trash2 size={16} className="transition-transform group-hover/btn:scale-110" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="mt-8 flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-border-light">
                <p className="text-xs font-bold text-text-body-secondary uppercase tracking-wider">
                    Affichage de <span className="text-text-heading-tertiary">1-{orders.length}</span> sur <span className="text-text-heading-tertiary">{orders.length}</span> commandes
                </p>
                <div className="flex items-center gap-2">
                    <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-border-light text-text-muted hover:border-primary hover:text-primary transition-all">
                        <ChevronLeft size={16} />
                    </button>
                    {[1, 2, 3].map(i => (
                        <button key={i} className={cn(
                            "h-8 w-8 flex items-center justify-center rounded-lg text-xs font-black transition-all",
                            i === 1 ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-text-body-secondary hover:bg-slate-50 border border-transparent hover:border-border-light"
                        )}>
                            {i}
                        </button>
                    ))}
                    <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-border-light text-text-muted hover:border-primary hover:text-primary transition-all">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
