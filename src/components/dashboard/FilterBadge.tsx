import React from 'react';
import { X } from 'lucide-react';

interface FilterBadgeProps {
    label: string;
    value: string;
    onRemove: () => void;
}

export const FilterBadge: React.FC<FilterBadgeProps> = ({ label, value, onRemove }) => {
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-[10px] font-black uppercase tracking-tight shadow-sm hover:bg-blue-100 transition-colors group">
            <span className="opacity-60">{label}:</span>
            <span>{value}</span>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
                className="hover:text-blue-900 transition-colors p-0.5"
            >
                <X size={10} className="group-hover:scale-125 transition-transform" />
            </button>
        </span>
    );
};
