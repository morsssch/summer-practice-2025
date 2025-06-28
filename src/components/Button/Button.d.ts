import React from 'react';
import './Button.scss';
import type { LucideIcon } from 'lucide-react';
interface ButtonProps {
    label: string;
    icon?: LucideIcon;
    to?: string;
    onClick?: () => void;
    className?: string;
}
export declare const Button: React.FC<ButtonProps>;
export {};
