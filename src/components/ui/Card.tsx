import React from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverable?: boolean;
}

/**
 * Composant Card de base pour les listes et conteneurs.
 */
export const Card: React.FC<CardProps> = ({
    children,
    className,
    hoverable = true,
    ...props
}) => {
    return (
        <div
            className={cn(
                'overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm transition-all',
                hoverable && 'hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
    <div className={cn('px-6 py-4 border-b border-slate-50', className)} {...props}>{children}</div>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
    <div className={cn('px-6 py-5', className)} {...props}>{children}</div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
    <div className={cn('px-6 py-4 bg-slate-50/50 border-t border-slate-50', className)} {...props}>{children}</div>
);
