import React from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline' | 'primary';
}

/**
 * Composant Badge pour afficher des statuts ou des tags.
 * Utilise le système de design PharmaGN avec tokens sémantiques de statut.
 */
export const Badge: React.FC<BadgeProps> = ({
    children,
    className,
    variant = 'default',
    ...props
}) => {
    const variants = {
        default: 'bg-bg-secondary text-text-body-primary',
        success: 'bg-bg-status-success text-text-status-success',
        warning: 'bg-bg-status-warning text-text-status-warning',
        error: 'bg-bg-status-error text-text-status-error',
        info: 'bg-bg-status-info text-text-status-info',
        outline: 'border border-border-default text-text-body-secondary bg-transparent',
        primary: 'bg-primary-light text-primary-800',
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
