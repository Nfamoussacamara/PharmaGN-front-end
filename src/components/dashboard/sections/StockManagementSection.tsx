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
        if (quantity === 0) return { label: 'Rupture', color: 'bg-bg-status-error', textColor: 'text-text-status-error' };
        if (quantity <= 5) return { label: 'Critique', color: 'bg-bg-status-error/80', textColor: 'text-text-status-error' };
        if (quantity <= 10) return { label: 'Faible', color: 'bg-bg-status-warning', textColor: 'text-text-status-warning' };
        if (quantity <= 20) return { label: 'Moyen', color: 'bg-bg-status-info', textColor: 'text-text-status-info' };
        return { label: 'Bon', color: 'bg-primary', textColor: 'text-primary-800' };
    };

    return (
        <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex items-center justify-between shrink-0 bg-bg-card/30 p-2 border border-border-light/50 backdrop-blur-sm">
                <div className="px-4">
                    <p className="text-text-body-secondary text-sm font-bold flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        {filteredStocks.length} médicament{filteredStocks.length > 1 ? 's' : ''} en stock
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={fetchStocks}
                        variant="ghost"
                        size="sm"
                        className="font-bold hover:bg-bg-hover"
                    >
                        Actualiser
                    </Button>
                    <Button
                        size="sm"
                        leftIcon={<Plus size={18} />}
                        onClick={() => setIsAddModalOpen(true)}
                        className="rounded-xl font-bold font-black shadow-lg shadow-primary/20"
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
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher un médicament..."
                        className="w-full pl-10 pr-4 py-2 border border-border-light rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-bg-app/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </Card>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <p className="text-xs font-bold text-text-disabled uppercase mb-1">Total Articles</p>
                    <p className="text-2xl font-bold text-text-heading-tertiary">{stocks.length}</p>
                </Card>
                <Card className="p-4">
                    <p className="text-xs font-bold text-text-disabled uppercase mb-1">Rupture</p>
                    <p className="text-2xl font-bold text-text-status-error">
                        {stocks.filter(s => s.quantity === 0).length}
                    </p>
                </Card>
                <Card className="p-4">
                    <p className="text-xs font-bold text-text-disabled uppercase mb-1">Stock Faible</p>
                    <p className="text-2xl font-bold text-text-status-warning">
                        {stocks.filter(s => s.quantity > 0 && s.quantity <= 10).length}
                    </p>
                </Card>
                <Card className="p-4">
                    <p className="text-xs font-bold text-text-disabled uppercase mb-1">Valeur Totale</p>
                    <p className="text-2xl font-bold text-primary">
                        {formatPrice(stocks.reduce((sum, s) => sum + (s.quantity * (s.unit_price || 0)), 0))}
                    </p>
                </Card>
            </div>

            {/* Stock List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-40 bg-bg-secondary animate-pulse rounded-xl" />
                    ))
                ) : filteredStocks.length === 0 ? (
                    <Card className="col-span-full p-12 text-center">
                        <Package className="mx-auto mb-4 text-text-disabled" size={48} />
                        <p className="text-text-body-secondary font-medium">Aucun médicament trouvé</p>
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
                                                <h3 className="font-bold text-text-heading-tertiary text-sm truncate">
                                                    {stock.medication_detail?.name || 'Médicament'}
                                                </h3>
                                                <p className="text-xs text-text-body-secondary mt-1">
                                                    Prix: {formatPrice(stock.unit_price)}
                                                </p>
                                            </div>
                                            <Button size="sm" variant="ghost" className="shrink-0">
                                                <Pencil size={14} />
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-text-disabled font-medium">Quantité</p>
                                                <p className="text-2xl font-bold text-text-heading-tertiary">{stock.quantity}</p>
                                            </div>
                                            <Badge variant={stockLevel.label === 'Rupture' || stockLevel.label === 'Critique' ? 'error' : stockLevel.label === 'Faible' ? 'warning' : stockLevel.label === 'Moyen' ? 'info' : 'primary'}>
                                                {stockLevel.label}
                                            </Badge>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
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
