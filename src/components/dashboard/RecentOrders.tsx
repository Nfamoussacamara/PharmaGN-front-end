import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Search, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { formatDate, formatPrice } from '@/utils/format';
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
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <ClipboardList size={24} className="text-emerald-600" />
                    Réservations Récentes
                    {filteredOrders.length !== orders.length && (
                        <span className="text-sm text-slate-400 font-medium">
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
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Rechercher par patient, médicament ou n°..."
                        className="w-full pl-12 pr-12 py-3 bg-white border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
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
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X size={18} className="text-slate-400" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Liste des commandes */}
            <div className="space-y-4">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 animate-pulse rounded-2xl" />
                    ))
                ) : filteredOrders.length === 0 ? (
                    <motion.div
                        className="bg-slate-50 py-16 rounded-3xl text-center border-2 border-dashed border-slate-200"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <ClipboardList className="mx-auto mb-4 text-slate-300" size={48} />
                        <p className="text-slate-400 font-bold text-sm">
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
                                    className={cn(
                                        "border-l-4 transition-all hover:shadow-lg hover:scale-[1.01] cursor-pointer",
                                        order.status === 'PENDING'
                                            ? "border-l-amber-500 shadow-amber-900/5 shadow-md bg-gradient-to-r from-amber-50/30 to-transparent"
                                            : "border-l-slate-200 hover:border-l-slate-300"
                                    )}
                                    onClick={() => onOrderClick(order)}
                                >
                                    <div className="p-5 flex items-center justify-between">
                                        <div className="flex gap-4 items-center flex-1 min-w-0">
                                            <div className="h-12 w-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-slate-600 font-bold text-xs uppercase shrink-0 shadow-sm">
                                                #{order.id.toString().slice(-3)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-black text-slate-800 uppercase tracking-tight truncate">
                                                    {order.medication_detail?.name || order.medication_name || 'Médicament'}
                                                </h4>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest truncate">
                                                    Client: {order.patient_detail?.full_name || order.patient_name || 'Anonyme'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 shrink-0">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-xs font-bold text-slate-400">
                                                    {formatDate(order.created_at)}
                                                </p>
                                                <p className="font-black text-slate-900">
                                                    {formatPrice(order.total_price)}
                                                </p>
                                            </div>
                                            {order.status === 'PENDING' ? (
                                                <Badge variant="warning" className="animate-pulse">
                                                    ACTION REQUISE
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="opacity-50 tracking-tighter uppercase">
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
        </div>
    );
};
