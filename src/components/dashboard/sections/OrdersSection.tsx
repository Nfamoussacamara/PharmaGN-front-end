import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Order } from '@/types';
import { formatDate, formatPrice } from '@/utils/format';
import apiClient from '@/services/apiClient';
import { useNotificationStore } from '@/store/notificationStore';

interface OrdersSectionProps {
    onOrderClick: (order: Order) => void;
}

/**
 * Section complète de gestion des commandes
 */
export const OrdersSection: React.FC<OrdersSectionProps> = ({ onOrderClick }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const { addToast } = useNotificationStore();

    const statuses = [
        { value: 'ALL', label: 'Toutes' },
        { value: 'PENDING', label: 'En attente' },
        { value: 'VALIDATED', label: 'Validées' },
        { value: 'READY', label: 'Prêtes' },
        { value: 'COMPLETED', label: 'Complétées' },
        { value: 'REJECTED', label: 'Rejetées' },
    ];

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get<any>('/orders/');
            const data = response.data;
            // Gérer le cas où l'API renvoie un objet paginé { results: [], ... } 
            // ou un tableau simple []
            setOrders(Array.isArray(data) ? data : (data.results || []));
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setOrders([]);
            addToast("Erreur lors du chargement des commandes", "error");
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        const medName = order.medication_detail?.name || order.medication_name || '';
        const patName = order.patient_detail?.full_name || order.patient_name || '';
        const orderId = order.id.toString();

        const matchesSearch =
            medName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            orderId.includes(searchTerm);

        const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { variant: "success" | "error" | "warning" | "default" | "info" | "outline"; label: string }> = {
            PENDING: { variant: 'warning', label: 'En attente' },
            VALIDATED: { variant: 'info', label: 'Validée' },
            READY: { variant: 'default', label: 'Prête' },
            COMPLETED: { variant: 'success', label: 'Complétée' },
            REJECTED: { variant: 'error', label: 'Rejetée' },
        };

        const statusInfo = statusMap[status] || { variant: 'outline' as const, label: status };
        return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <ClipboardList size={28} className="text-emerald-600" />
                        Gestion des Commandes
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''}
                    </p>
                </div>
                <Button onClick={fetchOrders} size="sm">
                    Actualiser
                </Button>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher par patient, médicament ou n°..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2 flex-wrap">
                        {statuses.map(status => (
                            <button
                                key={status.value}
                                onClick={() => setStatusFilter(status.value)}
                                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${statusFilter === status.value
                                    ? 'bg-emerald-600 text-white shadow-lg'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {status.label}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Orders List */}
            <div className="space-y-3">
                {loading ? (
                    [1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-24 bg-slate-50 animate-pulse rounded-xl" />
                    ))
                ) : filteredOrders.length === 0 ? (
                    <Card className="p-12 text-center">
                        <ClipboardList className="mx-auto mb-4 text-slate-300" size={48} />
                        <p className="text-slate-500 font-medium">Aucune commande trouvée</p>
                    </Card>
                ) : (
                    filteredOrders.map((order) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.01 }}
                        >
                            <Card
                                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => onOrderClick(order)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                                            <span className="text-xs font-black text-slate-600">
                                                #{String(order.id).padStart(4, '0')}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-black text-slate-900 truncate">
                                                {order.medication_detail?.name || order.medication_name || 'Médicament'}
                                            </h3>
                                            <p className="text-sm text-slate-500">
                                                Patient: {order.patient_detail?.full_name || order.patient_name || 'Anonyme'} • Qté: {order.quantity || 0}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-xs text-slate-400 font-medium">
                                                {order.created_at ? formatDate(order.created_at) : ''}
                                            </p>
                                            <p className="font-black text-slate-900">
                                                {order.total_price ? formatPrice(order.total_price) : '0 GNF'}
                                            </p>
                                        </div>
                                        {getStatusBadge(order.status)}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};
