import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Eye, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';
import { Order, OrderStatus } from '@/types/client';
import { getOrderHistory, getOrderStats } from '@/services/orderService';
import { OrderStatusBadge } from '@/components/client/OrderStatusBadge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/utils/cn';

const PharmacyAvatar: React.FC<{ name: string }> = ({ name }) => {
    const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black border border-emerald-200 shrink-0">
                {initials}
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">{name}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Pharmacie</span>
            </div>
        </div>
    );
};

export const OrderHistoryPage: React.FC = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all');
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        confirmed: 0,
        ready: 0,
        delivered: 0,
        cancelled: 0
    });

    useEffect(() => {
        loadOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [activeFilter, orders]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const [ordersData, statsData] = await Promise.all([
                getOrderHistory(),
                getOrderStats()
            ]);
            setOrders(ordersData);
            setStats(statsData);
        } catch (error) {
            console.error('Erreur chargement commandes:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterOrders = () => {
        if (activeFilter === 'all') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(o => o.status === activeFilter));
        }
    };

    const inProgressCount = stats.pending + stats.confirmed + stats.ready;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-2 tracking-tight">
                                Mes commandes
                            </h1>
                            <p className="text-slate-500 font-bold">Suivez et gérez vos achats en temps réel</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden lg:flex flex-col items-end px-2 py-1 h-full justify-center border-r border-slate-200 pr-6 mr-3">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total trouvé</span>
                                <span className="text-2xl font-black text-slate-900 tabular-nums tracking-tighter">{filteredOrders.length}</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm">
                                    <Search size={18} />
                                </button>
                                <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm">
                                    <SlidersHorizontal size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Layout - Dashboard Style */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-[1.5rem] p-6 shadow-xl shadow-slate-900/5 border border-slate-50 flex flex-col items-start gap-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</span>
                            <span className="text-3xl font-black text-slate-900">{stats.total}</span>
                        </div>
                        <div className="bg-emerald-50 rounded-[1.5rem] p-6 border border-emerald-100 flex flex-col items-start gap-1">
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">En cours</span>
                            <span className="text-3xl font-black text-emerald-700">{inProgressCount}</span>
                        </div>
                        <div className="bg-white rounded-[1.5rem] p-6 shadow-xl shadow-slate-900/5 border border-slate-50 flex flex-col items-start gap-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Livrées</span>
                            <span className="text-3xl font-black text-emerald-600">{stats.delivered}</span>
                        </div>
                        <div className="bg-white rounded-[1.5rem] p-6 shadow-xl shadow-slate-900/5 border border-slate-50 flex flex-col items-start gap-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Annulées</span>
                            <span className="text-3xl font-black text-rose-500">{stats.cancelled}</span>
                        </div>
                    </div>
                </div>

                {/* Filters Track - Re-styled for expert look */}
                <div className="mb-10 w-full overflow-x-auto no-scrollbar scroll-smooth">
                    <div className="inline-flex p-1.5 bg-[#f1f3f5] rounded-[24px] border border-slate-200/50 min-w-full lg:min-w-0">
                        {[
                            { key: 'all', label: 'Tous', count: stats.total, activeColor: 'text-emerald-700', badgeColor: 'bg-emerald-50 text-emerald-700' },
                            { key: 'pending', label: 'En attente', count: stats.pending, activeColor: 'text-amber-600', badgeColor: 'bg-amber-50 text-amber-600' },
                            { key: 'confirmed', label: 'Validées', count: stats.confirmed, activeColor: 'text-blue-600', badgeColor: 'bg-blue-50 text-blue-600' },
                            { key: 'ready', label: 'En livraison', count: stats.ready, activeColor: 'text-indigo-600', badgeColor: 'bg-indigo-50 text-indigo-600' },
                            { key: 'delivered', label: 'Livrées', count: stats.delivered, activeColor: 'text-emerald-600', badgeColor: 'bg-emerald-50 text-emerald-600' },
                            { key: 'cancelled', label: 'Annulées', count: stats.cancelled, activeColor: 'text-rose-600', badgeColor: 'bg-rose-50 text-rose-600' }
                        ].map(filter => {
                            const isActive = activeFilter === filter.key;
                            return (
                                <button
                                    key={filter.key}
                                    onClick={() => setActiveFilter(filter.key as any)}
                                    className={cn(
                                        "flex items-center gap-2.5 px-6 py-2.5 rounded-[18px] font-bold text-[13px] tracking-tight transition-all duration-300 whitespace-nowrap active:scale-95 relative",
                                        isActive
                                            ? filter.activeColor
                                            : "text-slate-500 hover:text-slate-900"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeFilterTab"
                                            className="absolute inset-0 bg-white rounded-[18px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-100"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">{filter.label}</span>
                                    <span className={cn(
                                        "relative z-10 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-lg text-[10px] font-black transition-colors duration-300",
                                        isActive ? filter.badgeColor : "bg-slate-200/50 text-slate-400"
                                    )}>
                                        {filter.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Orders Main Content - Dashboard Style Table */}
                {loading ? (
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100">
                        <div className="inline-block w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-500 font-bold">Chargement de votre historique...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                        <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                            <Package size={48} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">
                            Aucune commande trouvée
                        </h2>
                        <p className="text-slate-500 font-medium mb-8 max-w-xs mx-auto">
                            Vos commandes de médicaments apparaîtront ici dès que vous en aurez passé.
                        </p>
                        <button
                            onClick={() => navigate('/catalogue')}
                            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 transform hover:scale-105 transition-all"
                        >
                            Découvrir le catalogue
                        </button>
                    </div>
                ) : (
                    <div className="w-full">
                        {/* Desktop Table Layout */}
                        <div className="hidden lg:block overflow-hidden bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-4">
                            <table className="w-full border-separate border-spacing-y-2">
                                <thead>
                                    <tr className="text-left">
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Référence</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Pharmacie</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Montant</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Articles</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Statut</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order, index) => {
                                        const isEven = index % 2 === 0;
                                        const pharmacyName = order.items[0]?.pharmacy || "Pharmacie Locale";

                                        return (
                                            <motion.tr
                                                key={order.id}
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                onClick={() => navigate(`/commande/${order.id}`)}
                                                className={cn(
                                                    "group transition-all cursor-pointer shadow-sm hover:shadow-md hover:bg-emerald-50/40",
                                                    isEven ? "bg-white" : "bg-slate-50/30"
                                                )}
                                            >
                                                <td className="px-6 py-5 rounded-l-2xl border-y border-l border-slate-50 group-hover:border-emerald-100">
                                                    <span className="font-black text-emerald-600 text-sm tracking-tight">{order.orderNumber}</span>
                                                </td>
                                                <td className="px-6 py-5 border-y border-slate-50 group-hover:border-emerald-100">
                                                    <PharmacyAvatar name={pharmacyName} />
                                                </td>
                                                <td className="px-6 py-5 border-y border-slate-50 group-hover:border-emerald-100 whitespace-nowrap">
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">
                                                        {format(new Date(order.createdAt), 'd MMM yyyy à HH:mm', { locale: fr })}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 border-y border-slate-50 group-hover:border-emerald-100">
                                                    <span className="text-base font-black text-slate-900 tracking-tight">
                                                        {Math.round(order.totalAmount).toLocaleString('fr-FR')} <span className="text-[10px] text-slate-400">GNF</span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 border-y border-slate-50 group-hover:border-emerald-100">
                                                    <div className="flex -space-x-3 overflow-hidden">
                                                        {order.items.slice(0, 3).map((item) => (
                                                            <img
                                                                key={item.id}
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover bg-white"
                                                            />
                                                        ))}
                                                        {order.items.length > 3 && (
                                                            <div className="flex items-center justify-center h-9 w-9 rounded-full ring-2 ring-white bg-slate-100 text-[10px] font-black text-slate-500">
                                                                +{order.items.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 border-y border-slate-50 group-hover:border-emerald-100">
                                                    <OrderStatusBadge status={order.status} />
                                                </td>
                                                <td className="px-6 py-5 rounded-r-2xl border-y border-r border-slate-50 group-hover:border-emerald-100 text-right">
                                                    <div className="flex items-center justify-end">
                                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:scale-110 shadow-sm">
                                                            <Eye size={18} />
                                                        </div>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile List Layout */}
                        <div className="lg:hidden space-y-4">
                            {filteredOrders.map((order, index) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => navigate(`/commande/${order.id}`)}
                                    className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{order.orderNumber}</p>
                                            <p className="font-bold text-slate-900">{order.items[0]?.pharmacy || "Pharmacie Locale"}</p>
                                        </div>
                                        <OrderStatusBadge status={order.status} />
                                    </div>

                                    <div className="flex items-center justify-between py-4 border-y border-slate-50">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Articles</p>
                                            <div className="flex -space-x-2">
                                                {order.items.slice(0, 3).map((item) => (
                                                    <img key={item.id} src={item.image} className="w-8 h-8 rounded-full ring-2 ring-white object-cover" />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                                            <p className="font-black text-emerald-600">{Math.round(order.totalAmount).toLocaleString('fr-FR')} GNF</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-slate-500">
                                        <span className="text-xs font-bold">{format(new Date(order.createdAt), 'd MMM yyyy', { locale: fr })}</span>
                                        <div className="flex items-center gap-1 text-emerald-600 font-black text-xs">
                                            Détails <ChevronRight size={14} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
