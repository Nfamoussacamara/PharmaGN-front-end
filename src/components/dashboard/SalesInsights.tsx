import React from 'react';
import { Crown, Moon, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface InsightItem {
    id: string;
    name: string;
    subText: string;
    value: string;
    trend?: { value: string; positive: boolean };
    icon: React.ReactNode;
}

const VIP_CLIENTS: InsightItem[] = [
    { id: '1', name: 'Moussa Camara', subText: '12 commandes / mois', value: '4.5M GNF', trend: { value: '15%', positive: true }, icon: <Crown size={16} className="text-amber-500" /> },
    { id: '2', name: 'Fatoumata Diallo', subText: '8 commandes / mois', value: '3.2M GNF', trend: { value: '5%', positive: true }, icon: <Crown size={16} className="text-amber-400" /> },
];

const DORMANT_PRODUCTS: InsightItem[] = [
    { id: '1', name: 'Sirop Toux Enfant', subText: 'Dernière vente: 45j', value: '24 unités', icon: <Moon size={16} className="text-indigo-400" /> },
    { id: '2', name: 'Masques FFP2', subText: 'Dernière vente: 30j', value: '150 unités', icon: <Moon size={16} className="text-indigo-300" /> },
];

export const SalesInsights: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Clients VIP */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Crown size={14} className="text-amber-500" />
                        Clients VIP 👑
                    </h3>
                    <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Voir tous</button>
                </div>
                <div className="space-y-3">
                    {VIP_CLIENTS.map((client) => (
                        <Card key={client.id} className="p-4 bg-white border border-slate-50 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
                                    {client.icon}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{client.name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold tracking-tight">{client.subText}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-slate-800 text-sm tracking-tight">{client.value}</p>
                                {client.trend && (
                                    <p className="text-[9px] font-black text-emerald-600 tracking-tighter">+{client.trend.value} ↑</p>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Produits Dormants */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Moon size={14} className="text-indigo-500" />
                        Produits Dormants 😴
                    </h3>
                    <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Analyser</button>
                </div>
                <div className="space-y-3">
                    {DORMANT_PRODUCTS.map((prod) => (
                        <Card key={prod.id} className="p-4 bg-white border border-slate-50 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                                    {prod.icon}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{prod.name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold tracking-tight">{prod.subText}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-slate-800 text-sm tracking-tight">{prod.value}</p>
                                <button className="text-[8px] font-black text-primary uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                                    Promotion <ArrowRight size={8} />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};
