import React from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';
import type { Stock } from '@/types';

interface StockAlertsProps {
    lowStocks: Stock[];
    loading?: boolean;
}

/**
 * Composant alertes de stock bas avec niveaux d'urgence visuels
 */
export const StockAlerts: React.FC<StockAlertsProps> = ({ lowStocks, loading = false }) => {
    const getUrgencyStyles = (quantity: number) => {
        if (quantity === 0) return {
            bg: "bg-rose-50/50",
            border: "border-rose-100/50",
            text: "text-rose-600",
            badge: "bg-rose-600 text-white",
            icon: <AlertTriangle size={18} className="text-rose-600" />,
            label: "RUPTURE TOTALE"
        };
        if (quantity <= 5) return {
            bg: "bg-amber-50/50",
            border: "border-amber-100/50",
            text: "text-amber-600",
            badge: "bg-amber-600 text-white",
            icon: <Package size={18} className="text-amber-600" />,
            label: "CRITIQUE"
        };
        return {
            bg: "bg-blue-50/50",
            border: "border-blue-100/50",
            text: "text-blue-600",
            badge: "bg-blue-600 text-white",
            icon: <Package size={18} className="text-blue-600" />,
            label: "STOCK FAIBLE"
        };
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 tracking-tighter">
                    <AlertTriangle size={24} className="text-rose-500" />
                    Alertes Produits
                </h2>
                {lowStocks.length > 0 && (
                    <span className="text-[10px] font-black bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">
                        {lowStocks.length} PRIORITÉS
                    </span>
                )}
            </div>

            <div className="space-y-4">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-slate-50 animate-pulse rounded-[32px] border border-slate-100" />
                    ))
                ) : lowStocks.length === 0 ? (
                    <motion.div
                        className="bg-white p-10 rounded-[40px] text-center border border-slate-100 shadow-sm group hover:shadow-md transition-all duration-500"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <CheckCircle className="text-emerald-500" size={40} />
                        </div>
                        <p className="text-slate-800 font-black text-lg tracking-tight">Stock impeccable</p>
                        <p className="text-slate-400 text-xs font-bold mt-1">Aucune action requise pour le moment.</p>
                    </motion.div>
                ) : (
                    lowStocks.map((stock, index) => {
                        const styles = getUrgencyStyles(stock.quantity);

                        return (
                            <motion.div
                                key={stock.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className={cn(
                                    "border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[32px] overflow-hidden group bg-white border border-slate-50",
                                )}>
                                    <div className="p-5 flex items-center gap-4 relative">
                                        {/* Texture d'accentuation sur le côté */}
                                        <div className={cn("absolute left-0 top-0 bottom-0 w-1", styles.badge.split(' ')[0])} />

                                        <div className={cn(
                                            "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:rotate-6",
                                            styles.bg
                                        )}>
                                            {styles.icon}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={cn(
                                                    "text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
                                                    styles.badge
                                                )}>
                                                    {styles.label}
                                                </span>
                                                <span className="text-[10px] font-black text-slate-300">#{stock.id}</span>
                                            </div>
                                            <h4 className="font-black text-slate-800 text-sm truncate leading-tight">
                                                {stock.medication_detail?.name || 'Médicament Inconnu'}
                                            </h4>
                                            <p className="text-[11px] font-bold text-slate-400 italic">
                                                Reste {stock.quantity} unité{stock.quantity > 1 ? 's' : ''}
                                            </p>
                                        </div>

                                        <button className={cn(
                                            "px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                            "bg-slate-900 text-white hover:bg-primary hover:shadow-lg hover:shadow-primary/20"
                                        )}>
                                            Commander
                                        </button>
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
