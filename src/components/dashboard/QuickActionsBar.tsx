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
