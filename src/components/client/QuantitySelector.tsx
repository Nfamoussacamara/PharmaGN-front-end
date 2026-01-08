import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    max?: number;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
    quantity,
    onIncrease,
    onDecrease,
    max,
    disabled = false,
    size = 'md'
}) => {
    const sizeClasses = {
        sm: 'w-7 h-7',
        md: 'w-10 h-10',
        lg: 'w-12 h-12'
    };

    const textSizeClasses = {
        sm: 'w-10 text-sm',
        md: 'w-12 text-base',
        lg: 'w-16 text-lg'
    };

    const iconSizeClasses = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    const isMaxReached = max !== undefined && quantity >= max;

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={onDecrease}
                disabled={disabled || quantity <= 1}
                className={`${sizeClasses[size]} flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                aria-label="Diminuer la quantité"
            >
                <Minus className={iconSizeClasses[size]} />
            </button>

            <span className={`${textSizeClasses[size]} text-center font-semibold text-gray-900`}>
                {quantity}
            </span>

            <button
                onClick={onIncrease}
                disabled={disabled || isMaxReached}
                className={`${sizeClasses[size]} flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                aria-label="Augmenter la quantité"
            >
                <Plus className={iconSizeClasses[size]} />
            </button>
        </div>
    );
};
