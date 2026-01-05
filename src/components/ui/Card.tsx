import React from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverable?: boolean;
}

/**
 * Composant Card de base pour les listes et conteneurs.
 * Utilise le système de design PharmaGN avec tokens sémantiques.
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
                'overflow-hidden rounded-2xl bg-bg-card border border-border-light shadow-sm transition-all duration-[var(--transition-base)]',
                hoverable && 'hover:shadow-lg hover:-translate-y-1',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
    <div className={cn('px-6 py-4 border-b border-border-light', className)} {...props}>{children}</div>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
    <div className={cn('px-6 py-5', className)} {...props}>{children}</div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
    <div className={cn('px-6 py-4 bg-bg-secondary border-t border-border-light', className)} {...props}>{children}</div>
);
