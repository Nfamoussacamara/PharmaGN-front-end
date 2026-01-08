import React from 'react';
import { ClipboardList, User, Loader } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import type { Order } from '@/types';

interface RecentOrdersProps {
    orders: Order[];
    loading: boolean;
    onOrderClick: (order: Order) => void;
}

/**
 * Composant liste des commandes récentes avec recherche locale
 */
export const RecentOrders: React.FC<RecentOrdersProps> = ({
    orders,
    loading,
    onOrderClick
}) => {
    // Show only first 5 recent orders
    const recentOrders = orders.slice(0, 5);

    return (
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between gap-4 px-2">
                <h2 className="text-xl font-bold text-text-heading-tertiary flex items-center gap-2">
                    <ClipboardList size={24} className="text-primary" />
                    Commandes Récentes
                </h2>
                {/* Removed Action button as requested */}
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : recentOrders.length === 0 ? (
                    <div className="bg-bg-secondary py-8 rounded-3xl text-center border-2 border-dashed border-border-default">
                        <p className="text-text-muted font-bold text-sm">
                            Aucune commande récente.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div key={order.id}>
                                <Card
                                    hoverable={false}
                                    className={cn(
                                        "p-4 cursor-pointer transition-colors bg-bg-card group shadow-none",
                                        order.status === 'PENDING'
                                            ? "border-l-4 border-l-amber-500 bg-gradient-to-r from-bg-status-warning to-transparent hover:border-amber-500"
                                            : "border border-border-light/50 hover:border-primary"
                                    )}
                                    onClick={() => onOrderClick(order)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-3 items-center flex-1 min-w-0">
                                            <div className="h-10 w-10 bg-bg-secondary rounded-xl flex items-center justify-center text-text-body-secondary font-bold text-[10px] shrink-0 border border-border-light/50 group-hover:border-primary/20 transition-colors uppercase leading-tight text-center">
                                                ID
                                                <br />
                                                <span className="text-xs">{order.id.toString().slice(-4)}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-text-heading-tertiary tracking-tight truncate text-sm mb-0.5">
                                                    {order.medication_detail?.name || order.medication_name || 'Médicament'}
                                                </h4>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1">
                                                        <User size={10} className="text-blue-500" />
                                                        <span className="text-[11px] font-semibold text-text-body-secondary truncate max-w-[100px]">
                                                            {order.patient_detail?.full_name || order.patient_name || 'Anonyme'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 shrink-0">
                                            <div className="text-right hidden sm:block">
                                                <div className="flex items-baseline justify-end gap-0.5">
                                                    <span className="font-bold text-emerald-600 text-sm">
                                                        {order.total_price?.toLocaleString() || '0'}
                                                    </span>
                                                    <span className="text-[9px] font-black text-emerald-600/70 uppercase">
                                                        GNF
                                                    </span>
                                                </div>
                                            </div>
                                            {order.status === 'PENDING' ? (
                                                <Badge variant="warning" className="animate-pulse text-[10px] py-0.5 px-2">
                                                    Action
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="opacity-50 tracking-tighter text-[10px] py-0.5 px-2">
                                                    {order.status}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
