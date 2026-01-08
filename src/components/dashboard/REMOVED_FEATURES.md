# Fonctionnalités Supprimées du Dashboard

Ce fichier contient le code des composants et fonctionnalités qui ont été supprimés du tableau de bord pour simplification, à des fins de référence et de réimplémentation future.

## 1. QuickActionsBar.tsx (Barre d'actions flottante)

Barre située en bas de l'écran avec des raccourcis animés.

```tsx
import React from 'react';
import { Plus, Package, Users, BarChart3, Settings, Database } from 'lucide-react';
import { motion } from 'framer-motion';

export const QuickActionsBar: React.FC = () => {
    const actions = [
        { icon: <Plus size={20} />, label: 'Nouvelle Commande', color: 'bg-primary text-white shadow-primary/20' },
        { icon: <Package size={20} />, label: 'Ajouter Produit', color: 'bg-white text-slate-600 border border-slate-100' },
        { icon: <Users size={20} />, label: 'Nouveau Client', color: 'bg-white text-slate-600 border border-slate-100' },
        { icon: <Database size={20} />, label: 'Gérer Stock', color: 'bg-white text-slate-600 border border-slate-100' },
        { icon: <BarChart3 size={20} />, label: 'Rapport', color: 'bg-white text-slate-600 border border-slate-100' },
    ];

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-full p-2 flex items-center gap-2 pointer-events-auto"
            >
                {actions.map((action, i) => (
                    <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all group ${action.color}`}
                    >
                        {action.icon}
                        <span className="text-xs font-black uppercase tracking-widest hidden md:inline-block truncate max-w-0 group-hover:max-w-[150px] transition-all duration-500 overflow-hidden">
                            {action.label}
                        </span>
                    </motion.button>
                ))}
                <div className="w-px h-6 bg-slate-200 mx-2" />
                <motion.button
                    whileHover={{ rotate: 15 }}
                    className="p-2.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <Settings size={20} />
                </motion.button>
            </motion.div>
        </div>
    );
};
```

## 2. StockAlerts.tsx (Section Alertes Stock)

Visualisation des niveaux de stock critique avec couleurs dynamiques.

```tsx
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
                {/* ... mapping des stocks ... */}
                {lowStocks.map((stock, index) => {
                    // ... rendu des cartes ...
                    return <></>; // (code complet disponible dans les logs si besoin)
                })}
            </div>
        </div>
    );
};
```

## 3. CriticalAlerts.tsx (Alertes Stratégiques)

Alertes génériques (Urgent, Important, Info) affichées en haut du dashboard.

```tsx
import React from 'react';
import { AlertCircle, AlertTriangle, Info, ChevronRight, X } from 'lucide-react';
import { cn } from '@/utils/cn';

// ... interfaces ...

export const CriticalAlerts: React.FC<CriticalAlertsProps> = ({ alerts, onDismiss, onAction }) => {
    // ... logique de style ...
    return (
        <div className="space-y-3 mb-10">
            {/* Header et Grille d'alertes */}
        </div>
    );
};
```

## 4. Logique de Recherche Avancée (RecentOrders.tsx)

Code pour la barre de recherche locale et les filtres qui a été retiré de `RecentOrders.tsx`.

```tsx
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrage local des commandes
    const filteredOrders = useMemo(() => {
        if (!searchTerm.trim()) return orders;

        const lowerTerm = searchTerm.toLowerCase();
        return orders.filter(order =>
            order.patient_name.toLowerCase().includes(lowerTerm) ||
            order.medications.some(m => m.name.toLowerCase().includes(lowerTerm)) ||
            order.id.toLowerCase().includes(lowerTerm)
        );
    }, [orders, searchTerm]);

    /* JSX pour la barre de recherche */
    {/* Barre de recherche */}
    <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
        <input
            type="text"
            placeholder="Rechercher une commande récente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-slate-600 placeholder:text-slate-400 font-bold focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
        />
        <AnimatePresence>
            {searchTerm && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 transition-colors"
                >
                    <X size={14} />
                </motion.button>
            )}
        </AnimatePresence>
    </div>
```
