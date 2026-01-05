import React from 'react';
import { Package, Calendar, Database, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatPrice } from '@/utils/format';

interface StockWidgetsProps {
    inventoryValue: number;
    totalProducts: number;
    expirations: {
        urgent: number;
        upcoming: number;
    };
}

export const StockWidgets: React.FC<StockWidgetsProps> = ({
    inventoryValue,
    totalProducts,
    expirations
}) => {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 px-2 tracking-tighter">
                <Database size={24} className="text-primary" />
                Gestion de Stock
            </h2>

            <div className="space-y-4">
                {/* Inventaire Global */}
                <Card className="p-6 bg-slate-900 text-white rounded-[32px] border-none shadow-xl relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <Package size={140} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Inventaire Global</p>
                        <div className="space-y-1 mb-6">
                            <p className="text-3xl font-black tracking-tighter">{formatPrice(inventoryValue)}</p>
                            <p className="text-xs text-slate-400 font-bold">{totalProducts.toLocaleString()} produits en stock</p>
                        </div>
                        <button className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:gap-3 transition-all">
                            Gérer le stock <ArrowRight size={14} />
                        </button>
                    </div>
                </Card>

                {/* Expirations Proches */}
                <Card className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Calendar size={14} className="text-rose-500" />
                        Expirations proches
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-2">
                        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100/50">
                            <p className="text-2xl font-black text-rose-600 leading-none mb-1">{expirations.urgent}</p>
                            <p className="text-[9px] font-black text-rose-800/60 uppercase tracking-tighter">Moins de 7 jours</p>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100/50">
                            <p className="text-2xl font-black text-amber-600 leading-none mb-1">{expirations.upcoming}</p>
                            <p className="text-[9px] font-black text-amber-800/60 uppercase tracking-tighter">Moins de 30 jours</p>
                        </div>
                    </div>
                    <button className="w-full mt-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors border-t border-slate-50">
                        Voir les détails
                    </button>
                </Card>
            </div>
        </div>
    );
};
