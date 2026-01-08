import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, Pencil, Search, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, AlertCircle, Loader } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Stock } from '@/types';
import apiClient from '@/services/apiClient';
import { useNotificationStore } from '@/store/notificationStore';
import { formatPrice } from '@/utils/format';
import { AddStockModal } from '../AddStockModal';
import { EditStockModal } from '../EditStockModal';
import { cn } from '@/utils/cn';

/**
 * Section de gestion du stock
 */
export const StockManagementSection: React.FC = () => {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'CRITICAL' | 'LOW' | 'GOOD'>('ALL');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingStock, setEditingStock] = useState<Stock | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const { addToast } = useNotificationStore();

    useEffect(() => {
        fetchStocks();
    }, []);

    // Simulation de chargement pour la recherche
    useEffect(() => {
        let timer: any;
        if (searchTerm) {
            setIsSearching(true);
            timer = setTimeout(() => {
                setIsSearching(false);
            }, 800);
        } else {
            setIsSearching(false);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [searchTerm]);

    const fetchStocks = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get<any>('/stock/');
            const data = response.data;
            setStocks(Array.isArray(data) ? data : (data.results || []));
        } catch (error) {
            console.error('Failed to fetch stocks:', error);
            setStocks([]);
            addToast("Erreur lors du chargement du stock", "error");
        } finally {
            setLoading(false);
        }
    };

    const getStockLevel = (quantity: number) => {
        if (quantity === 0) return { label: 'Rupture', value: 'CRITICAL', barColor: 'bg-rose-500', badgeClass: 'bg-rose-100 text-rose-700' };
        if (quantity <= 5) return { label: 'Critique', value: 'CRITICAL', barColor: 'bg-rose-500', badgeClass: 'bg-rose-100 text-rose-700' };
        if (quantity <= 10) return { label: 'Faible', value: 'LOW', barColor: 'bg-amber-400', badgeClass: 'bg-amber-100 text-amber-800' };
        return { label: 'Bon', value: 'GOOD', barColor: 'bg-emerald-500', badgeClass: 'bg-emerald-100 text-emerald-800' };
    };

    // Filtrage et Pagination
    const filteredStocks = useMemo(() => {
        return stocks.filter(stock => {
            const matchesSearch = stock.medication_detail?.name.toLowerCase().includes(searchTerm.toLowerCase());
            const level = getStockLevel(stock.quantity);
            const matchesStatus = statusFilter === 'ALL' ||
                (statusFilter === 'CRITICAL' && level.value === 'CRITICAL') ||
                (statusFilter === 'LOW' && level.value === 'LOW') ||
                (statusFilter === 'GOOD' && level.value === 'GOOD');
            return matchesSearch && matchesStatus;
        });
    }, [stocks, searchTerm, statusFilter]);

    const paginatedStocks = filteredStocks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);

    return (
        <div className="space-y-6">
            {/* Header & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-white border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Articles</p>
                    <p className="text-2xl font-black text-slate-800">{stocks.length}</p>
                </Card>
                <Card className="p-4 bg-rose-50 border-rose-100 shadow-sm">
                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Ruptures</p>
                    <p className="text-2xl font-black text-rose-600">
                        {stocks.filter(s => s.quantity === 0).length}
                    </p>
                </Card>
                <Card className="p-4 bg-amber-50 border-amber-100 shadow-sm">
                    <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Critiques</p>
                    <p className="text-2xl font-black text-amber-600">
                        {stocks.filter(s => s.quantity > 0 && s.quantity <= 10).length}
                    </p>
                </Card>
                <Card className="p-4 bg-emerald-50 border-emerald-100 shadow-sm">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Valeur Stock</p>
                    <p className="text-2xl font-black text-emerald-600">
                        {formatPrice(stocks.reduce((sum, s) => sum + (s.quantity * (s.unit_price || 0)), 0))}
                    </p>
                </Card>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">

                {/* Tabs */}
                <div className="flex p-1 bg-slate-50 border border-slate-100 rounded-xl">
                    {[
                        { id: 'ALL', label: 'Tout' },
                        { id: 'CRITICAL', label: 'Critique', icon: AlertTriangle },
                        { id: 'LOW', label: 'Faible', icon: AlertCircle },
                        { id: 'GOOD', label: 'En Stock', icon: CheckCircle },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setStatusFilter(tab.id as any); setCurrentPage(1); }}
                            className={cn(
                                "px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2",
                                statusFilter === tab.id
                                    ? "bg-white text-slate-800 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            {tab.icon && <tab.icon size={14} className={statusFilter === tab.id ? (tab.id === 'CRITICAL' ? 'text-rose-500' : tab.id === 'LOW' ? 'text-amber-500' : 'text-emerald-500') : ''} />}
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="rounded-xl font-bold shadow-lg shadow-emerald-600/30 bg-emerald-600 hover:bg-emerald-700 text-white border-none"
                        leftIcon={<Plus size={18} />}
                    >
                        Ajouter
                    </Button>
                </div>
            </div>

            <AddStockModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchStocks}
            />

            <EditStockModal
                isOpen={!!editingStock}
                stock={editingStock}
                onClose={() => setEditingStock(null)}
                onSuccess={fetchStocks}
            />

            {/* Table View */}
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="text-left py-4 px-6 text-[10px] uppercase tracking-widest font-black text-slate-400">Médicament</th>
                                <th className="text-left py-4 px-6 text-[10px] uppercase tracking-widest font-black text-slate-400">Prix Unitaire</th>
                                <th className="text-left py-4 px-6 text-[10px] uppercase tracking-widest font-black text-slate-400 w-1/4">Niveau de Stock</th>
                                <th className="text-left py-4 px-6 text-[10px] uppercase tracking-widest font-black text-slate-400">Valeur</th>
                                <th className="text-right py-4 px-6 text-[10px] uppercase tracking-widest font-black text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence mode="wait">
                                {(loading || isSearching) ? (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        key="loading"
                                    >
                                        <td colSpan={5} className="py-12 text-center">
                                            <div className="flex justify-center items-center">
                                                <Loader className="h-10 w-10 animate-spin text-emerald-600" />
                                            </div>
                                        </td>
                                    </motion.tr>
                                ) : paginatedStocks.length === 0 ? (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <td colSpan={5} className="py-12 text-center text-slate-400 font-bold">
                                            Aucun médicament trouvé
                                        </td>
                                    </motion.tr>
                                ) : (
                                    paginatedStocks.map((stock, index) => {
                                        const level = getStockLevel(stock.quantity);
                                        return (
                                            <motion.tr
                                                key={stock.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="group hover:bg-slate-50/50 transition-colors"
                                            >
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                                                            <Package size={24} strokeWidth={1.5} />
                                                        </div>
                                                        <div>
                                                            <p className="font-extrabold text-slate-800 text-base">{stock.medication_detail?.name}</p>
                                                            <p className="text-xs text-slate-400 font-bold mt-0.5">{stock.medication_detail?.manufacturer}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 font-bold text-slate-600">
                                                    {formatPrice(stock.unit_price)}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="w-full space-y-3 max-w-[200px]">
                                                        <div className="flex justify-between items-center text-xs font-bold">
                                                            <span className={level.value === 'CRITICAL' ? 'text-rose-500' : 'text-slate-600'}>
                                                                {stock.quantity} unités
                                                            </span>
                                                            <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black", level.badgeClass)}>
                                                                {level.label}
                                                            </span>
                                                        </div>
                                                        <div className="h-2 w-full bg-slate-100/80 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${Math.min((stock.quantity / 50) * 100, 100)}%` }}
                                                                className={cn("h-full rounded-full", level.barColor)}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 font-extrabold text-slate-800">
                                                    {formatPrice(stock.quantity * stock.unit_price)}
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-colors"
                                                        onClick={() => setEditingStock(stock)}
                                                    >
                                                        <Pencil size={18} />
                                                    </Button>
                                                </td>
                                            </motion.tr>
                                        );
                                    })
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-50">
                    <p className="text-xs font-bold text-slate-400">
                        Page {currentPage} sur {totalPages || 1}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="text-slate-500 disabled:opacity-30"
                        >
                            <ChevronLeft size={18} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={currentPage >= totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="text-slate-500 disabled:opacity-30"
                        >
                            <ChevronRight size={18} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
