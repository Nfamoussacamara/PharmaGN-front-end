import React, { useState } from 'react';
import {
    Calendar, DollarSign, Clock, Tag, FileText,
    Check
} from 'lucide-react';
import { OrderFilters, OrderStatus } from '@/types';
import { cn } from '@/utils/cn';
import { FilterAccordion } from './filters/FilterAccordion';
import { RangeSlider } from '../ui/RangeSlider';

interface OrderFiltersProps {
    filters: OrderFilters;
    onFilterChange: (newFilters: Partial<OrderFilters>) => void;
    totalResults: number;
}

const ORDER_STATUSES: { value: OrderStatus; label: string; color: string }[] = [
    { value: 'PENDING', label: 'En attente', color: 'bg-amber-500' },
    { value: 'VALIDATED', label: 'Validée', color: 'bg-blue-500' },
    { value: 'READY', label: 'En livraison', color: 'bg-indigo-500' },
    { value: 'COMPLETED', label: 'Livrée', color: 'bg-emerald-500' },
    { value: 'REJECTED', label: 'Annulée', color: 'bg-rose-500' },
];

const PERIOD_OPTIONS = [
    { value: 'today', label: "Aujourd'hui" },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'last_3_months', label: '3 derniers mois' },
    { value: 'custom', label: 'Personnalisé' },
];

export const OrderFiltersPanel: React.FC<OrderFiltersProps> = ({
    filters,
    onFilterChange,
}) => {
    const [openSections, setOpenSections] = useState<string[]>(['status', 'period']);

    const toggleSection = (section: string) => {
        setOpenSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };

    const toggleStatus = (status: OrderStatus) => {
        const currentStatuses = filters.status || [];
        const newStatuses = currentStatuses.includes(status)
            ? currentStatuses.filter((s: OrderStatus) => s !== status)
            : [...currentStatuses, status];
        onFilterChange({ status: newStatuses });
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Status Section */}
            <FilterAccordion
                title="Statut de commande"
                icon={<Tag size={16} />}
                isOpen={openSections.includes('status')}
                onToggle={() => toggleSection('status')}
                activeCount={filters.status?.length || 0}
            >
                <div className="space-y-1.5 py-1">
                    {ORDER_STATUSES.map(status => (
                        <button
                            key={status.value}
                            onClick={() => toggleStatus(status.value)}
                            className={cn(
                                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group/item",
                                filters.status?.includes(status.value)
                                    ? "bg-primary/5 text-primary"
                                    : "hover:bg-slate-50 text-slate-600"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all",
                                    filters.status?.includes(status.value)
                                        ? "border-primary bg-primary"
                                        : "border-slate-200 group-hover/item:border-slate-300"
                                )}>
                                    {filters.status?.includes(status.value) && <Check size={8} className="text-white" />}
                                </div>
                                <span className="text-[11px] font-bold">{status.label}</span>
                            </div>
                            <div className={cn("w-1.5 h-1.5 rounded-full", status.color)} />
                        </button>
                    ))}
                </div>
            </FilterAccordion>

            {/* Period Section */}
            <FilterAccordion
                title="Période"
                icon={<Calendar size={16} />}
                isOpen={openSections.includes('period')}
                onToggle={() => toggleSection('period')}
                isFilterSet={!!filters.period}
            >
                <div className="space-y-1.5 py-1">
                    {PERIOD_OPTIONS.map(option => (
                        <button
                            key={option.value}
                            onClick={() => onFilterChange({ period: option.value as any })}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                                filters.period === option.value
                                    ? "bg-primary/5 text-primary"
                                    : "hover:bg-slate-50 text-slate-500"
                            )}
                        >
                            <Clock size={14} />
                            <span className="text-[11px] font-bold">{option.label}</span>
                            {filters.period === option.value && <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />}
                        </button>
                    ))}

                    {filters.period === 'custom' && (
                        <div className="grid grid-cols-1 gap-3 pt-3 mt-3 border-t border-slate-50">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date début</label>
                                <input
                                    type="date"
                                    value={filters.date_from || ''}
                                    onChange={(e) => onFilterChange({ date_from: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-[11px] font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary/30 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date fin</label>
                                <input
                                    type="date"
                                    value={filters.date_to || ''}
                                    onChange={(e) => onFilterChange({ date_to: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-[11px] font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary/30 outline-none transition-all"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </FilterAccordion>

            {/* Price Range Section */}
            <FilterAccordion
                title="Fourchette de prix"
                icon={<DollarSign size={16} />}
                isOpen={openSections.includes('price')}
                onToggle={() => toggleSection('price')}
                isFilterSet={!!(filters.price_min || filters.price_max)}
            >
                <RangeSlider
                    min={0}
                    max={1000000}
                    step={5000}
                    value={[filters.price_min || 0, filters.price_max || 1000000]}
                    onChange={([min, max]) => onFilterChange({ price_min: min, price_max: max })}
                    unit="GNF"
                />
            </FilterAccordion>

            {/* Prescription Section */}
            <FilterAccordion
                title="Ordonnance"
                icon={<FileText size={16} />}
                isOpen={openSections.includes('prescription')}
                onToggle={() => toggleSection('prescription')}
                isFilterSet={filters.has_prescription !== undefined}
            >
                <div className="grid grid-cols-2 gap-2 py-1">
                    <button
                        onClick={() => onFilterChange({ has_prescription: filters.has_prescription === true ? undefined : true })}
                        className={cn(
                            "px-3 py-2.5 rounded-xl border-2 text-[10px] font-black uppercase transition-all",
                            filters.has_prescription === true
                                ? "bg-blue-50 border-blue-500 text-blue-600 shadow-sm"
                                : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                        )}
                    >
                        Avec
                    </button>
                    <button
                        onClick={() => onFilterChange({ has_prescription: filters.has_prescription === false ? undefined : false })}
                        className={cn(
                            "px-3 py-2.5 rounded-xl border-2 text-[10px] font-black uppercase transition-all",
                            filters.has_prescription === false
                                ? "bg-slate-100 border-slate-500 text-slate-700 shadow-sm"
                                : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                        )}
                    >
                        Sans
                    </button>
                </div>
            </FilterAccordion>
        </div>
    );
};
