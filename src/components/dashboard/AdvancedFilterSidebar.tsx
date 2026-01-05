import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, ChevronLeft, ChevronRight,
    RotateCcw, Check, ListFilter
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface AdvancedFilterSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    title?: string;
    children: React.ReactNode;
    onApply?: () => void;
    onReset?: () => void;
    activeFiltersCount?: number;
    className?: string;
}

/**
 * Sidebar de filtres avancés collapsible pour PharmaGN.
 * Supporte le mode Desktop (sidebar gauche) et Mobile/Tablette (overlay/drawer).
 */
export const AdvancedFilterSidebar: React.FC<AdvancedFilterSidebarProps> = ({
    isOpen,
    onToggle,
    title = "Filtres avancés",
    children,
    onApply,
    onReset,
    activeFiltersCount = 0,
    className
}) => {
    // État pour savoir si on est sur mobile pour adapter le rendu
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const sidebarVariants = {
        open: {
            width: isMobile ? '100%' : '320px',
            opacity: 1,
            x: 0,
            transition: { type: 'spring' as const, stiffness: 300, damping: 30 }
        },
        closed: {
            width: isMobile ? '100%' : '0px',
            opacity: isMobile ? 0 : 1,
            x: isMobile ? '-100%' : 0,
            transition: { type: 'spring' as const, stiffness: 300, damping: 30 }
        }
    };

    return (
        <>
            {/* Mobile Overlay Background */}
            <AnimatePresence>
                {isMobile && isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onToggle}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[40]"
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial={false}
                animate={isOpen ? "open" : "closed"}
                variants={sidebarVariants}
                className={cn(
                    "relative flex flex-col bg-white border-r border-slate-200/60 z-[45] overflow-hidden group/sidebar",
                    isMobile && "fixed inset-y-0 left-0 shadow-2xl",
                    !isMobile && "h-[calc(100vh-100px)] sticky top-24 rounded-r-[32px] border-y border-slate-200/60 shadow-sm",
                    className
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <ListFilter size={18} />
                        </div>
                        <div>
                            <h3 className="font-black text-sm text-slate-800 tracking-tight">{title}</h3>
                            {activeFiltersCount > 0 && (
                                <p className="text-[10px] text-primary font-bold uppercase tracking-wider">
                                    {activeFiltersCount} filtres actifs
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={onToggle}
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all active:scale-95"
                    >
                        {isMobile ? <X size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                {/* Filters Content Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {children}
                </div>

                {/* Action Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-3 shrink-0">
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={onReset}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all active:scale-95 hover:border-slate-300"
                        >
                            <RotateCcw size={14} />
                            Reset
                        </button>
                        <button
                            onClick={onApply}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                            <Check size={14} />
                            Appliquer
                        </button>
                    </div>
                </div>

                {/* Collapse Button (Hidden when open) */}
                {!isOpen && !isMobile && (
                    <button
                        onClick={onToggle}
                        className="absolute top-5 right-0 translate-x-1/2 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary shadow-sm z-50 transition-all active:scale-90"
                    >
                        <ChevronRight size={20} />
                    </button>
                )}
            </motion.aside>
        </>
    );
};
