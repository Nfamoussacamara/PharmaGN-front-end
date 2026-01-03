import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/Card';

/**
 * Section de statistiques (placeholder)
 * Nécessiterait une bibliothèque comme Recharts pour les graphiques
 */
export const AnalyticsSection: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <BarChart3 size={28} className="text-emerald-600" />
                    Statistiques
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                    Analysez les performances de votre pharmacie
                </p>
            </div>

            {/* Placeholder */}
            <Card className="p-12 text-center">
                <BarChart3 className="mx-auto mb-4 text-slate-300" size={64} />
                <h3 className="text-lg font-black text-slate-900 mb-2">
                    Graphiques de statistiques
                </h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                    Cette section afficherait des graphiques interactifs (ventes, top médicaments, évolution du stock, etc.).
                    Nécessite l'installation de Recharts ou d'une bibliothèque similaire.
                </p>
                <div className="mt-8 p-6 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-600 font-mono">
                        npm install recharts
                    </p>
                </div>
            </Card>
        </div>
    );
};
