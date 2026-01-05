import React from 'react';
import { motion } from 'framer-motion';
import { Award, Package, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

interface MedicineStats {
    id: number;
    name: string;
    category: string;
    sales: number;
    trend: number;
    percentage: number;
}

const TOP_MEDS: MedicineStats[] = [
    { id: 1, name: 'Paracétamol 500mg', category: 'Antalgique', sales: 1240, trend: 12, percentage: 85 },
    { id: 2, name: 'Amoxicilline 1g', category: 'Antibiotique', sales: 850, trend: 8, percentage: 65 },
    { id: 3, name: 'Vitamine C 1000', category: 'Complément', sales: 620, trend: -5, percentage: 45 },
    { id: 4, name: 'Dolirhume', category: 'Rhume', sales: 480, trend: 15, percentage: 35 },
];

export const TopSellingMedications: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 px-2 tracking-tighter">
                <Award size={24} className="text-amber-500" />
                Meilleures Ventes
            </h2>

            <div className="space-y-4">
                {TOP_MEDS.map((med, index) => (
                    <motion.div
                        key={med.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="p-4 border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-3xl group overflow-hidden relative">
                            <div className="flex items-center justify-between mb-3 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm leading-tight">{med.name}</h4>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{med.category}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-slate-800">{med.sales.toLocaleString()}</p>
                                    <p className={cn(
                                        "text-[10px] font-bold flex items-center justify-end gap-0.5",
                                        med.trend >= 0 ? "text-emerald-600" : "text-rose-600"
                                    )}>
                                        {med.trend >= 0 ? '+' : ''}{med.trend}%
                                        <TrendingUp size={10} className={cn(med.trend < 0 && "rotate-180")} />
                                    </p>
                                </div>
                            </div>

                            <div className="relative h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="absolute top-0 left-0 h-full bg-primary rounded-full group-hover:bg-primary-dark transition-colors"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${med.percentage}%` }}
                                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                />
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
