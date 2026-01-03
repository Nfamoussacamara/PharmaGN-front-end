import React from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
}

/**
 * Composant Badge pour afficher des statuts ou des tags.
 */
export const Badge: React.FC<BadgeProps> = ({
    children,
    className,
    variant = 'default',
    ...props
}) => {
    const variants = {
        default: 'bg-slate-100 text-slate-800',
        success: 'bg-emerald-100 text-emerald-800',
        warning: 'bg-amber-100 text-amber-800',
        error: 'bg-rose-100 text-rose-800',
        info: 'bg-sky-100 text-sky-800',
        outline: 'border border-slate-200 text-slate-600',
    };

    return (
        <div
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
