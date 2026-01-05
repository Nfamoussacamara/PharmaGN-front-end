import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

/**
 * Section Analytics - Statistiques détaillées de la pharmacie
 */
const AnalyticsSection: React.FC = () => {
    const stats = [
        { label: 'Ventes du mois', value: '4.5M GNF', icon: <DollarSign size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Nouveaux Patients', value: '+124', icon: <Users size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Croissance', value: '+12%', icon: <TrendingUp size={20} />, color: 'text-violet-600', bg: 'bg-violet-50' },
    ];

    return (
        <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Action Bar */}
            <div className="flex items-center justify-between shrink-0 bg-bg-card/30 p-2 border border-border-light/50 backdrop-blur-sm">
                <div className="px-4">
                    <p className="text-text-body-secondary text-sm font-bold flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                        Analyses et performances de votre établissement
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-none shadow-md overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-bold text-text-body-secondary mb-1">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-text-heading-tertiary">{stat.value}</h3>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="p-12 text-center border-dashed border-2 border-border-light">
                <div className="bg-bg-secondary h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="text-text-disabled" size={32} />
                </div>
                <h3 className="text-lg font-bold text-text-heading-tertiary">Graphiques détaillés</h3>
                <p className="text-text-body-secondary text-sm max-w-sm mx-auto mt-2">
                    Cette section est en cours de développement. Bientôt, vous pourrez visualiser vos performances sous forme de graphiques interactifs.
                </p>
            </Card>
        </motion.div>
    );
};

export { AnalyticsSection };
