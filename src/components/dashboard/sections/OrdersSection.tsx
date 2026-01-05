import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, RefreshCw, Download,
    SlidersHorizontal, ArrowUpDown, MoreHorizontal
} from 'lucide-react';
import type { Order, OrderFilters as IOrderFilters, OrderStatus } from '@/types';
import apiClient from '@/services/apiClient';
import { useNotificationStore } from '@/store/notificationStore';
import { cn } from '@/utils/cn';
import { OrdersTable } from '../OrdersTable';
import { useOrderFilters } from '@/hooks/useOrderFilters';
import { OrderFiltersPanel } from '../OrderFilters';
import { FilterBadge } from '../FilterBadge';
import { AdvancedFilterSidebar } from '../AdvancedFilterSidebar';

interface OrdersSectionProps {
    onOrderClick: (order: Order) => void;
}

export const OrdersSection: React.FC<OrdersSectionProps> = ({ onOrderClick }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [showSidebarFilters, setShowSidebarFilters] = useState(false);
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [loading, setLoading] = useState(false);
    const [totalResults, setTotalResults] = useState(0);

    const { filters, setFilters, clearFilters } = useOrderFilters();
    const { addToast } = useNotificationStore();

    const statuses = [
        { id: 'all', label: 'Tous', count: totalResults, activeClass: 'text-primary' },
        { id: 'PENDING', label: 'En attente', activeClass: 'text-amber-600' },
        { id: 'VALIDATED', label: 'Validées', activeClass: 'text-blue-600' },
        { id: 'READY', label: 'En livraison', activeClass: 'text-indigo-600' },
        { id: 'COMPLETED', label: 'Livrées', activeClass: 'text-emerald-600' },
        { id: 'REJECTED', label: 'Annulées', activeClass: 'text-rose-600' },
    ];

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            // Transformer les filtres en query params pour l'API
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.status) filters.status.forEach(s => params.append('status', s));
            if (filters.date_from) params.append('date_from', filters.date_from);
            if (filters.date_to) params.append('date_to', filters.date_to);
            if (filters.period) params.append('period', filters.period);
            if (filters.price_min) params.append('price_min', filters.price_min.toString());
            if (filters.price_max) params.append('price_max', filters.price_max.toString());
            if (filters.has_prescription !== undefined) params.append('has_prescription', filters.has_prescription.toString());
            if (filters.ordering) params.append('ordering', filters.ordering);
            if (filters.page) params.append('page', filters.page.toString());

            const response = await apiClient.get<any>(`/orders/?${params.toString()}`);
            const data = response.data;

            setOrders(Array.isArray(data) ? data : (data.results || []));
            setTotalResults(data.count || (Array.isArray(data) ? data.length : 0));
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setOrders([]);
            addToast("Erreur lors du chargement des commandes", "error");
        } finally {
            setLoading(false);
        }
    }, [filters, addToast]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchOrders();
        }, 300); // Debounce
        return () => clearTimeout(timer);
    }, [fetchOrders]);

    const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
        if (value === undefined || value === null || value === '') return false;
        if (key === 'status' && Array.isArray(value)) return value.length > 0;
        if (key === 'page' || key === 'ordering') return false;
        return true;
    }).length;

    const handleStatusUpdate = async (orderId: number, newStatus: string) => {
        try {
            await apiClient.patch(`/orders/${orderId}/`, { status: newStatus });

            // Mise à jour locale de l'état pour un feedback immédiat
            setOrders(prev => prev.map(order =>
                order.id === orderId ? { ...order, status: newStatus as OrderStatus } : order
            ));

            addToast(`Statut de la commande #${orderId} mis à jour avec succès`, "success");
        } catch (error) {
            console.error('Failed to update order status:', error);
            addToast("Erreur lors de la mise à jour du statut", "error");
        }
    };

    const removeFilter = (key: keyof IOrderFilters, value?: any) => {
        if (key === 'status' && value) {
            const newStatuses = filters.status?.filter(s => s !== value) || [];
            setFilters({ status: newStatuses });
        } else {
            setFilters({ [key]: undefined });
        }
    };

    return (
        <div className="flex gap-6 min-h-[600px] h-full items-start">
            {/* Advanced Filters Sidebar - Persistent on Desktop */}
            <AdvancedFilterSidebar
                isOpen={showSidebarFilters}
                onToggle={() => setShowSidebarFilters(!showSidebarFilters)}
                activeFiltersCount={activeFilterCount}
                onApply={fetchOrders}
                onReset={clearFilters}
                title="Filtres Commandes"
            >
                <OrderFiltersPanel
                    filters={filters}
                    onFilterChange={setFilters}
                    totalResults={totalResults}
                />
            </AdvancedFilterSidebar>

            <div className="flex-1 flex flex-col space-y-6 relative min-w-0">
                {/* Top Search Bar & Actions */}
                <div className="flex flex-col md:flex-row gap-2.5">
                    <div className="relative group flex-1">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="text-text-muted group-focus-within:text-primary transition-colors" size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher un patient, un médicament..."
                            className="w-full pl-12 pr-4 py-2.5 bg-white border-2 border-border-light rounded-[16px] shadow-sm focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium text-text-body-primary placeholder:text-text-muted text-xs md:text-sm"
                            value={filters.search || ''}
                            onChange={(e) => setFilters({ search: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-1.5 bg-slate-50/50 p-1 rounded-[18px] border border-slate-100 relative">
                        {/* Filtres Toggle */}
                        <button
                            onClick={() => setShowSidebarFilters(!showSidebarFilters)}
                            className={cn(
                                "w-9 h-9 rounded-[14px] flex items-center justify-center transition-all active:scale-90",
                                activeFilterCount > 0 || showSidebarFilters
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary shadow-sm"
                            )}
                            title="Filtres avancés"
                        >
                            <SlidersHorizontal size={16} />
                        </button>

                        {/* Tri */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowSortMenu(!showSortMenu);
                                    setShowMoreMenu(false);
                                }}
                                className={cn(
                                    "w-9 h-9 rounded-[14px] bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary transition-all shadow-sm flex items-center justify-center active:scale-90",
                                    showSortMenu && "border-primary text-primary bg-primary/5"
                                )}
                                title="Trier"
                            >
                                <ArrowUpDown size={16} />
                            </button>

                            <AnimatePresence>
                                {showSortMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50"
                                    >
                                        {[
                                            { id: '-created_at', label: 'Plus récent' },
                                            { id: 'created_at', label: 'Plus ancien' },
                                            { id: '-total_price', label: 'Prix élevé' },
                                            { id: 'total_price', label: 'Prix faible' },
                                        ].map(opt => (
                                            <button
                                                key={opt.id}
                                                onClick={() => {
                                                    setFilters({ ordering: opt.id });
                                                    setShowSortMenu(false);
                                                }}
                                                className={cn(
                                                    "w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-colors",
                                                    filters.ordering === opt.id ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50"
                                                )}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Plus Actions */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowMoreMenu(!showMoreMenu);
                                    setShowSortMenu(false);
                                }}
                                className={cn(
                                    "w-9 h-9 rounded-[14px] bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary transition-all shadow-sm flex items-center justify-center active:scale-90",
                                    showMoreMenu && "border-primary text-primary bg-primary/5"
                                )}
                                title="Plus d'actions"
                            >
                                <MoreHorizontal size={16} />
                            </button>

                            <AnimatePresence>
                                {showMoreMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50"
                                    >
                                        <button
                                            onClick={() => {
                                                fetchOrders();
                                                setShowMoreMenu(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                        >
                                            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                                            Actualiser
                                        </button>
                                        <button
                                            onClick={() => setShowMoreMenu(false)}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors border-t border-slate-50 mt-1"
                                        >
                                            <Download size={14} />
                                            Exporter CSV
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Quick Status Filters & Total Count Container */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center py-1.5 px-1.5 bg-[#f1f3f5] rounded-[22px] border border-slate-200/50 overflow-x-auto no-scrollbar relative">
                        <div className="flex items-center gap-1 relative z-10">
                            {statuses.map((s) => {
                                const isActive = s.id === 'all'
                                    ? (!filters.status || filters.status.length === 0)
                                    : filters.status?.includes(s.id as any);

                                return (
                                    <button
                                        key={s.id}
                                        onClick={() => {
                                            if (s.id === 'all') setFilters({ status: [] });
                                            else setFilters({ status: [s.id as any] });
                                        }}
                                        className={cn(
                                            "px-6 py-2.5 rounded-[16px] text-[13px] font-bold tracking-tight whitespace-nowrap transition-colors duration-300 flex items-center gap-2.5 shrink-0 active:scale-95 relative",
                                            isActive
                                                ? s.activeClass
                                                : "text-slate-500 hover:text-slate-700"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] -z-10"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        {s.label}
                                        {s.id === 'all' && (
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full text-[10px] font-black min-w-[20px] text-center transition-colors duration-300",
                                                isActive ? "bg-primary/10 text-primary" : "bg-slate-200/50 text-slate-400"
                                            )}>
                                                {totalResults}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Total Found - Transparent and minimalist */}
                    <div className="hidden lg:flex flex-col items-end px-2 py-1 h-full justify-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total trouvé</span>
                        <span className="text-xl font-bold text-slate-800 tabular-nums tracking-tighter">{totalResults}</span>
                    </div>
                </div>

                {/* Main Table Area */}
                <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Active Filter Chips */}
                    <AnimatePresence>
                        {activeFilterCount > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-wrap gap-2 items-center"
                            >
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Filtres actifs:</span>
                                {filters.search && <FilterBadge label="Recherche" value={filters.search} onRemove={() => removeFilter('search')} />}
                                {filters.status && filters.status.length > 0 && filters.status.map(s => {
                                    const statusLabel = statuses.find(st => st.id === s)?.label || s;
                                    return (
                                        <FilterBadge key={s} label="Statut" value={statusLabel} onRemove={() => removeFilter('status', s)} />
                                    );
                                })}
                                {filters.period && <FilterBadge label="Période" value={filters.period} onRemove={() => removeFilter('period')} />}
                                {filters.price_min && <FilterBadge label="Prix Min" value={`${filters.price_min} GNF`} onRemove={() => removeFilter('price_min')} />}
                                {filters.price_max && <FilterBadge label="Prix Max" value={`${filters.price_max} GNF`} onRemove={() => removeFilter('price_max')} />}
                                {filters.has_prescription !== undefined && (
                                    <FilterBadge
                                        label="Ordonnance"
                                        value={filters.has_prescription ? "Oui" : "Non"}
                                        onRemove={() => removeFilter('has_prescription')}
                                    />
                                )}
                                <button
                                    onClick={clearFilters}
                                    className="text-[10px] font-black text-rose-500 hover:text-rose-600 underline underline-offset-4 px-2"
                                >
                                    Tout effacer
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Table Area */}
                    <div className="relative min-h-[500px]">
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="h-20 bg-white animate-pulse rounded-[24px] border border-slate-100" />
                                ))}
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="bg-white border-2 border-dashed border-slate-100 rounded-[40px] py-40 flex flex-col items-center justify-center text-center">
                                <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
                                    <Search size={48} />
                                </div>
                                <h3 className="text-2xl font-black text-text-heading-primary mb-2">Aucune commande</h3>
                                <p className="text-text-body-secondary max-w-xs font-medium mx-auto px-6">
                                    Essayez de modifier vos filtres ou effectuez une nouvelle recherche.
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-8 px-8 py-3 bg-primary text-white font-black text-sm rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                                >
                                    Effacer les filtres
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
                                <OrdersTable
                                    orders={orders}
                                    onOrderClick={onOrderClick}
                                    onStatusChange={handleStatusUpdate}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
