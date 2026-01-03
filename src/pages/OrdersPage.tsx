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

/**
 * Page affichant les commandes/réservations du patient.
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
            case 'PENDING': return <Clock className="text-amber-500" size={20} />;
            case 'VALIDATED': return <CheckCircle2 className="text-emerald-500" size={20} />;
            case 'COMPLETED': return <CheckCircle2 className="text-blue-500" size={20} />;
            case 'REJECTED': return <XCircle className="text-rose-500" size={20} />;
            case 'EXPIRED': return <AlertCircle className="text-slate-400" size={20} />;
            default: return <Clock size={20} />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING': return <Badge variant="warning">EN ATTENTE</Badge>;
            case 'VALIDATED': return <Badge variant="success">VALIDÉE</Badge>;
            case 'COMPLETED': return <Badge variant="info">RÉCUPÉRÉE</Badge>;
            case 'REJECTED': return <Badge variant="error">REJETÉE</Badge>;
            case 'EXPIRED': return <Badge variant="outline">EXPIRÉE</Badge>;
            default: return <Badge variant="default">{status}</Badge>;
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Mes Commandes</h1>
                    <p className="text-slate-500 font-medium tracking-tight">Suivez l'état de vos réservations de médicaments.</p>
                </div>
                <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <ShoppingBag size={28} />
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-50 animate-pulse rounded-3xl" />)}
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <Card key={order.id} className="hover:border-slate-200 transition-all group">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex gap-5">
                                        <div className="h-16 w-16 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-white group-hover:border-emerald-100 transition-colors">
                                            {getStatusIcon(order.status)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">#{order.id.toString().padStart(5, '0')}</h3>
                                                {getStatusBadge(order.status)}
                                            </div>
                                            <p className="font-bold text-slate-600 mb-1">
                                                {order.medication_detail?.name || order.medication_name || 'Médicament'}
                                            </p>
                                            <div className="flex items-center text-xs text-slate-400 font-bold uppercase tracking-widest gap-4">
                                                <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(order.created_at)}</span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={12} /> {order.pharmacy_detail?.name || order.pharmacy_name || 'Pharmacie'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end justify-between text-right">
                                        <div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">Total</p>
                                            <p className="text-xl font-black text-slate-900">{formatPrice(order.total_price)}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Qté: {order.quantity}</p>
                                        </div>

                                        <div className="flex gap-2 mt-4">
                                            {order.prescription && (
                                                <Button variant="outline" size="sm" className="rounded-xl h-9 px-3">
                                                    <FileText size={16} className="mr-2" />
                                                    Ordonnance
                                                </Button>
                                            )}
                                            <Link to={`/pharmacy/${order.pharmacy}`}>
                                                <Button variant="primary" size="sm" className="rounded-xl h-9 px-3 bg-slate-900 border-slate-900">
                                                    Contacter
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {order.rejection_reason && (
                                    <div className="mt-4 p-4 bg-rose-50 rounded-2xl border border-rose-100 flex gap-3 text-rose-800">
                                        <XCircle className="shrink-0" size={18} />
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest mb-1">Motif de rejet</p>
                                            <p className="text-sm font-medium">{order.rejection_reason}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}

                    {orders.length === 0 && (
                        <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-100">
                            <p className="text-slate-400 font-black text-xl mb-4">Vous n'avez pas encore de commande</p>
                            <Link to="/recherche">
                                <Button size="lg">Trouver un médicament</Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
