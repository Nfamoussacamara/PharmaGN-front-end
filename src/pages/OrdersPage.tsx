import React, { useState, useEffect } from 'react';
import { ShoppingBag, Calendar, Clock, FileText, CheckCircle2, XCircle, AlertCircle, MapPin } from 'lucide-react';
import { orderService } from '@/services/order.service';
import type { Order } from '@/types';
import { useNotificationStore } from '@/store/notificationStore';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { formatDate, formatPrice } from '@/utils/format';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Page affichant les commandes/réservations du patient avec Design System appliqué
 */
const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useNotificationStore();

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await orderService.getAll();
                setOrders(response.results);
            } catch (error) {
                addToast("Erreur lors du chargement de vos commandes", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [addToast]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING': return <Clock className="text-text-status-warning" size={20} />;
            case 'VALIDATED': return <CheckCircle2 className="text-primary" size={20} />;
            case 'COMPLETED': return <CheckCircle2 className="text-text-status-info" size={20} />;
            case 'REJECTED': return <XCircle className="text-text-status-error" size={20} />;
            case 'EXPIRED': return <AlertCircle className="text-text-disabled" size={20} />;
            default: return <Clock className="text-text-muted" size={20} />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING': return <Badge variant="warning">En attente</Badge>;
            case 'VALIDATED': return <Badge variant="success">Validée</Badge>;
            case 'COMPLETED': return <Badge variant="info">Récupérée</Badge>;
            case 'REJECTED': return <Badge variant="error">Rejetée</Badge>;
            case 'EXPIRED': return <Badge variant="outline">Expirée</Badge>;
            default: return <Badge variant="default">{status}</Badge>;
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 bg-bg-app min-h-screen">
            <motion.div
                className="flex items-center justify-between mb-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>
                    <h1 className="text-3xl font-black text-text-heading-primary mb-2">Mes Commandes</h1>
                    <p className="text-text-body-secondary font-medium tracking-tight">Suivez l'état de vos réservations de médicaments.</p>
                </div>
                <div className="h-16 w-16 bg-primary-light text-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/10">
                    <ShoppingBag size={28} />
                </div>
            </motion.div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-bg-secondary/50 animate-pulse rounded-3xl" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {orders.map((order, index) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="hover:shadow-lg transition-all border-border-light group overflow-hidden bg-bg-card">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border-light">
                                        <div className="flex-1 p-6 flex gap-5">
                                            <div className="h-16 w-16 rounded-2xl bg-bg-app flex flex-col items-center justify-center border-2 border-border-light group-hover:border-primary-light transition-colors shrink-0">
                                                {getStatusIcon(order.status)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-black text-text-heading-tertiary text-lg tracking-tight">#{order.id.toString().padStart(5, '0')}</h3>
                                                    {getStatusBadge(order.status)}
                                                </div>
                                                <p className="font-black text-text-body-primary mb-2 line-clamp-1">
                                                    {order.medication_detail?.name || order.medication_name || 'Médicament'}
                                                </p>
                                                <div className="flex flex-wrap items-center text-xs text-text-body-secondary font-bold gap-4 uppercase tracking-wider">
                                                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary" /> {formatDate(order.created_at)}</span>
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin size={14} className="text-primary" /> {order.pharmacy_detail?.name || order.pharmacy_name || 'Pharmacie'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full md:w-56 p-6 bg-bg-app/30 flex flex-col justify-between gap-4">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-text-disabled uppercase tracking-widest mb-1">Total</p>
                                                <p className="text-xl font-black text-primary">{formatPrice(order.total_price)}</p>
                                                <p className="text-xs text-text-body-secondary font-bold mt-1">Quantité: {order.quantity}</p>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                {order.prescription && (
                                                    <Button variant="outline" size="sm" className="w-full rounded-xl h-10 font-bold border-2">
                                                        <FileText size={16} className="mr-2" />
                                                        Ordonnance
                                                    </Button>
                                                )}
                                                <Link to={`/pharmacy/${order.pharmacy}`}>
                                                    <Button variant="primary" size="sm" className="w-full rounded-xl h-10 font-black shadow-lg shadow-primary/20">
                                                        Contacter
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {order.rejection_reason && (
                                        <div className="p-4 bg-bg-status-error/10 border-t border-border-light flex gap-3 text-text-status-error">
                                            <XCircle className="shrink-0" size={18} />
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest mb-1">Motif de rejet par le pharmacien</p>
                                                <p className="text-sm font-bold">{order.rejection_reason}</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}

                    {orders.length === 0 && (
                        <div className="text-center py-20 bg-bg-card rounded-[40px] border-2 border-dashed border-border-light shadow-inner">
                            <div className="bg-bg-app h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag className="text-text-disabled" size={40} />
                            </div>
                            <p className="text-text-heading-tertiary font-black text-2xl mb-2">Historique vide</p>
                            <p className="text-text-body-secondary font-medium mb-8 max-w-xs mx-auto">Vous n'avez pas encore effectué de réservation de médicament.</p>
                            <Link to="/recherche">
                                <Button size="lg" className="rounded-2xl font-black px-8">Trouver un médicament</Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
