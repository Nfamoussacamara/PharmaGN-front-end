import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/utils/cn';
import { Loader } from 'lucide-react';

interface StatCardData {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    bg: string;
    gradient?: string;
    trend?: {
        value: string;
        positive: boolean;
    };
}

interface DashboardStatsProps {
    stats: StatCardData[];
    loading?: boolean;
}

/**
 * Composant d'affichage des statistiques du tableau de bord avec animations
 */
export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, loading = false }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }


    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
                <motion.div key={i} variants={item} initial="hidden" animate="show">
                    <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group relative bg-white rounded-[32px] border border-slate-50">
                        {/* Gradient overlay on hover */}
                        <div className={cn(
                            "absolute inset-0 transition-opacity duration-500",
                            stat.gradient || "bg-gradient-to-br from-primary/5 to-transparent"
                        )} />

                        <CardContent className="p-5 sm:p-6 relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <motion.div
                                    className={cn("p-3 rounded-2xl shadow-sm", stat.bg)}
                                    whileHover={{ scale: 1.1, rotate: -5 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    {stat.icon}
                                </motion.div>

                                {stat.trend && (
                                    <div className={cn(
                                        "flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black tracking-tighter",
                                        stat.trend.positive ? "bg-emerald-50 text-emerald-600 border border-emerald-100/50" : "bg-rose-50 text-rose-600 border border-rose-100/50"
                                    )}>
                                        {stat.trend.positive ? '↑' : '↓'} {stat.trend.value}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate">
                                    {stat.label}
                                </p>
                                <motion.p
                                    className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tighter truncate"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 + 0.3 }}
                                >
                                    {stat.value}
                                </motion.p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
};
