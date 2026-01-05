import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Search, X, User, Package } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/format';
import type { Order } from '@/types';

interface RecentOrdersProps {
    orders: Order[];
    loading: boolean;
    onRefresh: () => void;
    onOrderClick: (order: Order) => void;
}

/**
 * Composant liste des commandes récentes avec recherche locale
 */
export const RecentOrders: React.FC<RecentOrdersProps> = ({
    orders,
    loading,
    onRefresh,
    onOrderClick
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrage local des commandes
    const filteredOrders = useMemo(() => {
        if (!searchTerm.trim()) return orders;

        const term = searchTerm.toLowerCase();
        return orders.filter(order => {
            const medName = order.medication_detail?.name || order.medication_name || '';
            const patName = order.patient_detail?.full_name || order.patient_name || '';
            const orderId = order.id.toString();

            return medName.toLowerCase().includes(term) ||
                patName.toLowerCase().includes(term) ||
                orderId.includes(term);
        });
    }, [orders, searchTerm]);

    const clearSearch = () => setSearchTerm('');

    return (
        <div className="lg:col-span-2 space-y-6">
            {/* Header avec recherche */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
                <h2 className="text-xl font-bold text-text-heading-tertiary flex items-center gap-2">
                    <ClipboardList size={24} className="text-primary" />
                    Réservations Récentes
                    {filteredOrders.length !== orders.length && (
                        <span className="text-sm text-text-disabled font-medium">
                            ({filteredOrders.length}/{orders.length})
                        </span>
                    )}
                </h2>
                <Button variant="outline" size="sm" onClick={onRefresh}>
                    Actualiser
                </Button>
            </div>

            {/* Barre de recherche */}
            <motion.div
                className="relative"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input
                        type="text"
                        placeholder="Rechercher par patient, médicament ou n°..."
                        className="w-full pl-12 pr-12 py-3 bg-bg-card border-2 border-border-light rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-text-body-primary placeholder:text-text-muted"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <AnimatePresence>
                        {searchTerm && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={clearSearch}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-bg-hover rounded-lg transition-colors"
                            >
                                <X size={18} className="text-text-muted" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Liste des commandes */}
            <div className="space-y-4">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-gradient-to-r from-bg-secondary via-bg-hover to-bg-secondary animate-pulse rounded-2xl" />
                    ))
                ) : filteredOrders.length === 0 ? (
                    <motion.div
                        className="bg-bg-secondary py-16 rounded-3xl text-center border-2 border-dashed border-border-default"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <ClipboardList className="mx-auto mb-4 text-text-disabled" size={48} />
                        <p className="text-text-muted font-bold text-sm">
                            {searchTerm
                                ? `Aucune commande trouvée pour "${searchTerm}"`
                                : "Aucune commande reçue aujourd'hui."}
                        </p>
                        {searchTerm && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={clearSearch}
                            >
                                Réinitialiser la recherche
                            </Button>
                        )}
                    </motion.div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredOrders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.05 }}
                                layout
                            >
                                <Card
                                    hoverable={false}
                                    className={cn(
                                        "p-5 cursor-pointer transition-colors bg-bg-card group shadow-none",
                                        order.status === 'PENDING'
                                            ? "border-l-4 border-l-amber-500 bg-gradient-to-r from-bg-status-warning to-transparent hover:border-amber-500"
                                            : "border border-border-light/50 hover:border-primary"
                                    )}
                                    onClick={() => onOrderClick(order)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-4 items-center flex-1 min-w-0">
                                            <div className="h-12 w-12 bg-bg-secondary rounded-xl flex items-center justify-center text-text-body-secondary font-bold text-[10px] shrink-0 border border-border-light/50 group-hover:border-primary/20 transition-colors uppercase leading-tight text-center">
                                                ID
                                                <br />
                                                <span className="text-xs">{order.id.toString().slice(-4)}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-text-heading-tertiary tracking-tight truncate text-sm mb-1">
                                                    {order.medication_detail?.name || order.medication_name || 'Médicament'}
                                                </h4>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1">
                                                        <User size={10} className="text-blue-500" />
                                                        <span className="text-[11px] font-semibold text-text-body-secondary truncate max-w-[120px]">
                                                            {order.patient_detail?.full_name || order.patient_name || 'Anonyme'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Package size={10} className="text-amber-500" />
                                                        <span className="text-[11px] font-semibold text-text-body-secondary">
                                                            x{order.quantity || 0}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 shrink-0">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-[10px] font-bold text-text-disabled uppercase mb-0.5">
                                                    {formatDate(order.created_at)}
                                                </p>
                                                <div className="flex items-baseline justify-end gap-0.5">
                                                    <span className="font-bold text-emerald-600 text-base">
                                                        {order.total_price?.toLocaleString() || '0'}
                                                    </span>
                                                    <span className="text-[9px] font-black text-emerald-600/70 uppercase">
                                                        GNF
                                                    </span>
                                                </div>
                                            </div>
                                            {order.status === 'PENDING' ? (
                                                <Badge variant="warning" className="animate-pulse">
                                                    Action requise
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="opacity-50 tracking-tighter">
                                                    {order.status}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div >
    );
};
