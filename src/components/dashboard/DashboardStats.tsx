import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

interface StatCardData {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    bg: string;
    gradient?: string;
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-gradient-to-br from-slate-50 to-slate-100 animate-pulse rounded-3xl" />
                ))}
            </div>
        );
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {stats.map((stat, i) => (
                <motion.div key={i} variants={item}>
                    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group relative">
                        {/* Gradient overlay on hover */}
                        <div className={cn(
                            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                            stat.gradient || "bg-gradient-to-br from-slate-900/5 to-transparent"
                        )} />

                        <CardContent className="p-6 relative z-10">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                        {stat.label}
                                    </p>
                                    <motion.p
                                        className="text-3xl font-black text-slate-900"
                                        initial={{ scale: 0.5 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: i * 0.1 + 0.2, type: "spring", stiffness: 200 }}
                                    >
                                        {stat.value}
                                    </motion.p>
                                </div>
                                <motion.div
                                    className={cn("p-4 rounded-2xl shadow-inner", stat.bg)}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    {stat.icon}
                                </motion.div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
};
