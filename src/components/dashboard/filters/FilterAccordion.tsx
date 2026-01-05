import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface FilterAccordionProps {
    title: string;
    icon: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    activeCount?: number;
    isFilterSet?: boolean;
}

/**
 * Accordion stylisé pour les sections de filtres avancés.
 */
export const FilterAccordion: React.FC<FilterAccordionProps> = ({
    title,
    icon,
    isOpen,
    onToggle,
    children,
    activeCount,
    isFilterSet
}) => (
    <div className="border border-slate-100 rounded-[24px] overflow-hidden bg-white hover:border-slate-200 transition-colors shadow-sm">
        <button
            onClick={onToggle}
            className="w-full px-4 py-3.5 flex items-center justify-between group"
        >
            <div className="flex items-center gap-3">
                <div className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                    isOpen || (activeCount && activeCount > 0) || isFilterSet
                        ? "bg-primary/10 text-primary"
                        : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                )}>
                    {icon}
                </div>
                <span className={cn(
                    "text-[11px] font-black uppercase tracking-wider transition-colors",
                    isOpen || (activeCount && activeCount > 0) || isFilterSet
                        ? "text-slate-800"
                        : "text-slate-400 group-hover:text-slate-500"
                )}>
                    {title}
                </span>
                {(activeCount || 0) > 0 && (
                    <span className="w-4 h-4 rounded-full bg-primary text-white text-[9px] font-black flex items-center justify-center">
                        {activeCount}
                    </span>
                )}
            </div>
            <ChevronDown
                size={16}
                className={cn(
                    "text-slate-300 group-hover:text-slate-400 transition-transform duration-300",
                    isOpen && "rotate-180"
                )}
            />
        </button>
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                    <div className="px-4 pb-4 pt-1">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);
