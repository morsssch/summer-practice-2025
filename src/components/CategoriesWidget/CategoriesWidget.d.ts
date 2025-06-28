import React from 'react';
import './CategoriesWidget.scss';
import type { TransactionType } from '../../services/types';
interface Category {
    id: string;
    name: string;
    type: TransactionType;
    color: string;
    icon: string;
}
interface CategoriesWidgetProps {
    mode: 'edit' | 'select';
    type: TransactionType;
    categories: Category[];
    selectedCategoryId?: string;
    onSelect?: (categoryId: string) => void;
    disabled?: boolean;
}
export declare const CategoriesWidget: React.FC<CategoriesWidgetProps>;
export {};
