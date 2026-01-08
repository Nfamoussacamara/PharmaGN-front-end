import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Package,
    MapPin,
    CreditCard,
    ShoppingCart,
    AlertCircle,
    User,
    Phone,
    Clock,
    Pill
} from 'lucide-react';
import { Order } from '@/types/client';
import { getOrderById, cancelOrder } from '@/services/orderService';
import { OrderStatusBadge } from '@/components/client/OrderStatusBadge';
import { useCartStore } from '@/store/cartStore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/utils/cn';

export const OrderDetailPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCartStore();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        if (orderId) {
            loadOrder();
        }
    }, [orderId]);

    const loadOrder = async () => {
        if (!orderId) return;
        setLoading(true);
        try {
            const data = await getOrderById(orderId);
            setOrder(data);
        } catch (error) {
            console.error('Erreur chargement commande:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!order) return;

        if (!confirm('Voulez-vous vraiment annuler cette commande ?')) {
            return;
        }

        setCancelling(true);
        try {
            await cancelOrder(order.id);
            await loadOrder(); // Reload to get updated status
            alert('Commande annulée avec succès');
        } catch (error: any) {
            alert(error.message || 'Erreur lors de l\'annulation');
        } finally {
            setCancelling(false);
        }
    };

    const handleReorder = () => {
        if (!order) return;

        order.items.forEach(item => {
            addToCart(item);
        });

        alert(`${order.items.length} produit(s) ajouté(s) au panier`);
        navigate('/panier');
    };

    const canCancel = order?.status === 'pending' || order?.status === 'confirmed';

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-600 font-bold">Chargement des détails...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-black text-slate-900 mb-2">
                        Commande introuvable
                    </h2>
                    <button
                        onClick={() => navigate('/historique')}
                        className="mt-4 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                    >
                        Retour à l'historique
                    </button>
                </div>
            </div>
        );
    }

    const pharmacyName = order.items[0]?.pharmacy || "Pharmacie Locale";

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Back button */}
                <button
                    onClick={() => navigate('/historique')}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 font-bold transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Retour à mon historique
                </button>

                {/* Header Section - Inspired by Dashboard Modal */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-900/5 border border-slate-50 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 rounded-[1.5rem] bg-emerald-50 flex items-center justify-center shadow-inner">
                                <Package size={32} className="text-emerald-600" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Commande</span>
                                    <span className="text-xl font-black text-slate-900">#{order.orderNumber}</span>
                                </div>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                                    {pharmacyName}
                                </h1>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <OrderStatusBadge status={order.status} size="lg" />
                            <p className="text-xs font-bold text-slate-400 capitalize">
                                Passée le {format(new Date(order.createdAt), 'd MMMM yyyy à HH:mm', { locale: fr })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Details */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Timeline - Styled like Dashboard tracking */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-900/5 border border-slate-50">
                            <h2 className="text-sm font-black text-slate-800 mb-8 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Clock size={16} className="text-emerald-600" />
                                Suivi de commande
                            </h2>

                            <div className="relative pl-3">
                                <div className="absolute left-[23px] top-2 bottom-5 w-1 bg-slate-50 shadow-inner"></div>

                                <div className="space-y-10 relative">
                                    {order.statusHistory?.map((history, index) => {
                                        const isLast = index === (order.statusHistory?.length || 0) - 1;
                                        return (
                                            <div key={index} className="flex items-start gap-8 group">
                                                <div className={cn(
                                                    "w-6 h-6 rounded-full flex items-center justify-center z-10 transition-all",
                                                    isLast ? "bg-emerald-600 shadow-[0_0_0_6px_rgba(16,185,129,0.1)] scale-110" : "bg-slate-200"
                                                )}>
                                                    <div className={cn("w-2 h-2 rounded-full", isLast ? "bg-white" : "bg-slate-400")}></div>
                                                </div>
                                                <div className="-mt-1">
                                                    <p className={cn(
                                                        "font-black tracking-tight text-lg transition-colors",
                                                        isLast ? "text-slate-900" : "text-slate-400"
                                                    )}>
                                                        {history.status === 'pending' && 'En attente'}
                                                        {history.status === 'confirmed' && 'Validée'}
                                                        {history.status === 'ready' && 'En livraison'}
                                                        {history.status === 'delivered' && 'Livrée'}
                                                        {history.status === 'cancelled' && 'Annulée'}
                                                    </p>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                        {format(new Date(history.timestamp), 'EEEE d MMMM HH:mm', { locale: fr })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Products List - Dashboard Style Sub-section */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-900/5 border border-slate-50">
                            <h2 className="text-sm font-black text-slate-800 mb-8 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Pill size={16} className="text-emerald-600" />
                                Articles commandés
                            </h2>

                            <div className="space-y-5">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-5 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors group">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 rounded-xl object-cover shadow-sm bg-white"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900 text-base">{item.name}</h3>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-tight mt-1">
                                                Quantité: {item.quantity} × {item.price.toLocaleString('fr-FR')} GNF
                                            </p>
                                        </div>
                                        <div className="font-black text-slate-900 text-lg">
                                            {(item.price * item.quantity).toLocaleString('fr-FR')} <span className="text-[10px] text-slate-400 uppercase">GNF</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-100 flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Articles Totaux</p>
                                    <p className="text-xl font-bold text-slate-900">{order.items.length} médicament(s)</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Montant Total</p>
                                    <p className="text-3xl font-black text-emerald-600">
                                        {Math.round(order.totalAmount).toLocaleString('fr-FR')} <span className="text-sm font-bold text-emerald-400">GNF</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Client & Payment Info */}
                    <div className="space-y-8">
                        {/* Delivery Info - Inspired by "Informations Patient" dashboard style */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-900/20">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 text-slate-400">
                                <MapPin size={14} className="text-emerald-400" />
                                Adresse de Livraison
                            </h2>

                            <div className="space-y-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                        <User size={18} className="text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Destinataire</p>
                                        <p className="font-bold text-sm mt-0.5">{order.deliveryAddress.fullname}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                        <Phone size={18} className="text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Téléphone</p>
                                        <p className="font-bold text-sm mt-0.5">{order.deliveryAddress.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                        <MapPin size={18} className="text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Adresse</p>
                                        <p className="font-bold text-sm mt-0.5">{order.deliveryAddress.street}</p>
                                        <p className="text-slate-400 text-xs mt-0.5">{order.deliveryAddress.city}, {order.deliveryAddress.quarter}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-900/5 border border-slate-50">
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <CreditCard size={14} className="text-emerald-600" />
                                Paiement
                            </h2>

                            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-tight">Méthode</span>
                                    <span className="font-black text-slate-900 text-sm">
                                        {order.payment.method === 'mobile_money' ? 'Mobile Money' : 'Cash'}
                                    </span>
                                </div>
                                {order.payment.method === 'mobile_money' && (
                                    <>
                                        <div className="flex items-center justify-between border-t border-emerald-100 pt-3">
                                            <span className="text-xs font-bold text-emerald-800 uppercase tracking-tight">Opérateur</span>
                                            <span className="font-black text-slate-900 text-sm uppercase">
                                                {order.payment.mobileMoneyOperator}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-emerald-100 pt-3">
                                            <span className="text-xs font-bold text-emerald-800 uppercase tracking-tight">Numéro</span>
                                            <span className="font-black text-slate-900 text-sm">
                                                {order.payment.mobileMoneyNumber}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4">
                            {canCancel && (
                                <button
                                    onClick={handleCancelOrder}
                                    disabled={cancelling}
                                    className="w-full py-5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-black rounded-[1.5rem] transition-all flex items-center justify-center gap-3 disabled:opacity-50 border border-rose-100"
                                >
                                    {cancelling ? 'Annulation...' : 'Annuler la commande'}
                                </button>
                            )}
                            <button
                                onClick={handleReorder}
                                className="w-full flex items-center justify-center gap-4 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-[1.5rem] shadow-xl shadow-emerald-500/20 transform hover:scale-[1.02] active:scale-95 transition-all text-lg"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                Commander à nouveau
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
