import React from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Stock } from '@/types';

interface StockAlertsProps {
    lowStocks: Stock[];
    loading?: boolean;
}

/**
 * Composant alertes de stock bas avec niveaux d'urgence visuels
 */
export const StockAlerts: React.FC<StockAlertsProps> = ({ lowStocks, loading = false }) => {
    // Détermine le niveau d'urgence en fonction de la quantité
    const getUrgencyLevel = (quantity: number): 'critical' | 'warning' | 'low' => {
        if (quantity === 0) return 'critical';
        if (quantity <= 5) return 'critical';
        if (quantity <= 10) return 'warning';
        return 'low';
    };

    const urgencyStyles = {
        critical: {
            border: 'border-rose-200',
            bg: 'bg-rose-50',
            buttonBorder: 'border-rose-300',
            buttonText: 'text-rose-700',
            buttonHover: 'hover:bg-rose-100',
            textColor: 'text-rose-600',
            icon: 'text-rose-500'
        },
        warning: {
            border: 'border-amber-200',
            bg: 'bg-amber-50/30',
            buttonBorder: 'border-amber-200',
            buttonText: 'text-amber-700',
            buttonHover: 'hover:bg-amber-50',
            textColor: 'text-amber-600',
            icon: 'text-amber-500'
        },
        low: {
            border: 'border-orange-200',
            bg: 'bg-orange-50/20',
            buttonBorder: 'border-orange-200',
            buttonText: 'text-orange-600',
            buttonHover: 'hover:bg-orange-50',
            textColor: 'text-orange-500',
            icon: 'text-orange-500'
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 px-2">
                <Package size={24} className="text-rose-500" />
                Alertes Stock
            </h2>

            <div className="space-y-3">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-gradient-to-r from-rose-50 to-rose-100/50 animate-pulse rounded-2xl" />
                    ))
                ) : lowStocks.length === 0 ? (
                    <motion.div
                        className="bg-gradient-to-br from-emerald-50 to-emerald-100/30 py-10 rounded-3xl text-center border border-emerald-200 shadow-sm"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                        >
                            <CheckCircle className="text-emerald-500 mx-auto mb-3" size={32} />
                        </motion.div>
                        <p className="text-emerald-700 font-bold text-sm uppercase tracking-widest">
                            Tout est en règle
                        </p>
                        <p className="text-emerald-600 text-xs mt-1">
                            Aucune alerte de stock
                        </p>
                    </motion.div>
                ) : (
                    lowStocks.map((stock, index) => {
                        const urgency = getUrgencyLevel(stock.quantity);
                        const styles = urgencyStyles[urgency];

                        return (
                            <motion.div
                                key={stock.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className={`${styles.border} ${styles.bg} border-2 transition-all hover:shadow-md`}>
                                    <div className="p-4 flex items-center justify-between gap-3">
                                        {/* Icon d'urgence */}
                                        <div className="shrink-0">
                                            {urgency === 'critical' ? (
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                >
                                                    <AlertTriangle className={styles.icon} size={24} />
                                                </motion.div>
                                            ) : (
                                                <Package className={styles.icon} size={20} />
                                            )}
                                        </div>

                                        {/* Info médicament */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-slate-800 text-sm truncate">
                                                {stock.medication_detail?.name || 'Médicament'}
                                            </p>
                                            <p className={`text-[10px] font-bold uppercase tracking-widest ${styles.textColor}`}>
                                                {urgency === 'critical' && stock.quantity === 0
                                                    ? 'RUPTURE DE STOCK'
                                                    : `Qté: ${stock.quantity} unité${stock.quantity > 1 ? 's' : ''}`
                                                }
                                            </p>
                                        </div>

                                        {/* Bouton action */}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className={`h-8 text-[10px] rounded-xl ${styles.buttonBorder} ${styles.buttonText} ${styles.buttonHover} shrink-0 font-bold`}
                                        >
                                            Réappro.
                                        </Button>
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
