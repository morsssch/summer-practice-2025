import React from 'react';
import './ActionButton.scss';
import type { LucideIcon } from 'lucide-react';
interface ActionButtonProps {
    label: string;
    icon?: LucideIcon;
    to?: string;
    onClick?: () => void;
    className?: string;
    danger?: boolean;
}
export declare const ActionButton: React.FC<ActionButtonProps>;
export {};
