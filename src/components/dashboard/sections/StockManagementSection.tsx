import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Pencil, Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { Stock } from '@/types';
import apiClient from '@/services/apiClient';
import { useNotificationStore } from '@/store/notificationStore';
import { formatPrice } from '@/utils/format';
import { AddStockModal } from '../AddStockModal';

/**
 * Section de gestion du stock
 */
export const StockManagementSection: React.FC = () => {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { addToast } = useNotificationStore();

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get<any>('/stock/');
            const data = response.data;
            // Gérer le cas où l'API renvoie un objet paginé { results: [], ... } 
            // ou un tableau simple []
            setStocks(Array.isArray(data) ? data : (data.results || []));
        } catch (error) {
            console.error('Failed to fetch stocks:', error);
            setStocks([]);
            addToast("Erreur lors du chargement du stock", "error");
        } finally {
            setLoading(false);
        }
    };

    const filteredStocks = stocks.filter(stock => {
        const name = stock.medication_detail?.name || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const getStockLevel = (quantity: number) => {
        if (quantity === 0) return { label: 'Rupture', color: 'bg-rose-500', textColor: 'text-rose-600' };
        if (quantity <= 5) return { label: 'Critique', color: 'bg-rose-400', textColor: 'text-rose-600' };
        if (quantity <= 10) return { label: 'Faible', color: 'bg-amber-400', textColor: 'text-amber-600' };
        if (quantity <= 20) return { label: 'Moyen', color: 'bg-blue-400', textColor: 'text-blue-600' };
        return { label: 'Bon', color: 'bg-emerald-400', textColor: 'text-emerald-600' };
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <Package size={28} className="text-emerald-600" />
                        Gestion du Stock
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        {filteredStocks.length} médicament{filteredStocks.length > 1 ? 's' : ''} en stock
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={fetchStocks} variant="outline" size="sm">
                        Actualiser
                    </Button>
                    <Button
                        size="sm"
                        leftIcon={<Plus size={18} />}
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Ajouter Stock
                    </Button>
                </div>
            </div>

            <AddStockModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchStocks}
            />

            {/* Search */}
            <Card className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher un médicament..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </Card>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Articles</p>
                    <p className="text-2xl font-black text-slate-900">{stocks.length}</p>
                </Card>
                <Card className="p-4">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Rupture</p>
                    <p className="text-2xl font-black text-rose-600">
                        {stocks.filter(s => s.quantity === 0).length}
                    </p>
                </Card>
                <Card className="p-4">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Stock Faible</p>
                    <p className="text-2xl font-black text-amber-600">
                        {stocks.filter(s => s.quantity > 0 && s.quantity <= 10).length}
                    </p>
                </Card>
                <Card className="p-4">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Valeur Totale</p>
                    <p className="text-2xl font-black text-emerald-600">
                        {formatPrice(stocks.reduce((sum, s) => sum + (s.quantity * (s.unit_price || 0)), 0))}
                    </p>
                </Card>
            </div>

            {/* Stock List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-40 bg-slate-50 animate-pulse rounded-xl" />
                    ))
                ) : filteredStocks.length === 0 ? (
                    <Card className="col-span-full p-12 text-center">
                        <Package className="mx-auto mb-4 text-slate-300" size={48} />
                        <p className="text-slate-500 font-medium">Aucun médicament trouvé</p>
                    </Card>
                ) : (
                    filteredStocks.map((stock) => {
                        const stockLevel = getStockLevel(stock.quantity);

                        return (
                            <motion.div
                                key={stock.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <Card className="p-4 hover:shadow-md transition-shadow">
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-black text-slate-900 text-sm truncate">
                                                    {stock.medication_detail?.name || 'Médicament'}
                                                </h3>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Prix: {formatPrice(stock.unit_price)}
                                                </p>
                                            </div>
                                            <Button size="sm" variant="ghost" className="shrink-0">
                                                <Pencil size={14} />
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-slate-400 font-medium">Quantité</p>
                                                <p className="text-2xl font-black text-slate-900">{stock.quantity}</p>
                                            </div>
                                            <Badge className={`${stockLevel.textColor}`}>
                                                {stockLevel.label}
                                            </Badge>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${stockLevel.color} transition-all`}
                                                style={{ width: `${Math.min((stock.quantity / 50) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
