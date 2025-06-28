import React from 'react';
import './CategoryIcon.scss';
interface CategoryIconProps {
    name: string;
    color: string;
    iconName: string;
    showLabel?: boolean;
    isActive?: boolean;
    onClick?: () => void;
}
export declare const CategoryIcon: React.FC<CategoryIconProps>;
export {};
