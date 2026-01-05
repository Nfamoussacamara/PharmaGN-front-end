import React from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

/**
 * Composant Button réutilisable avec états de chargement et icônes.
 * Utilise le système de design PharmaGN avec tokens sémantiques.
 */
export const Button: React.FC<ButtonProps> = ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    ...props
}) => {
    const variants = {
        primary: 'bg-primary text-text-on-primary hover:bg-primary-hover disabled:opacity-50 focus-visible:ring-[var(--focus-ring-success)]',
        secondary: 'bg-bg-secondary text-text-body-primary hover:bg-bg-active disabled:bg-bg-disabled disabled:text-text-disabled',
        outline: 'border-2 border-primary text-primary hover:bg-primary-light disabled:border-border-light disabled:text-text-disabled disabled:opacity-50',
        ghost: 'text-text-body-secondary hover:bg-bg-hover disabled:text-text-disabled disabled:opacity-50',
        danger: 'bg-accent-600 text-text-on-primary hover:bg-accent-700 disabled:opacity-50 focus-visible:ring-[var(--focus-ring-error)]',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-2.5',
        lg: 'px-8 py-3.5 text-lg',
    };

    return (
        <button
            className={cn(
                'flex items-center justify-center rounded-lg font-bold transition-all duration-[var(--transition-base)]',
                'active:scale-95 disabled:cursor-not-allowed disabled:active:scale-100',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <svg className="mr-2 h-4 w-4 animate-spin text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        </button>
    );
};
