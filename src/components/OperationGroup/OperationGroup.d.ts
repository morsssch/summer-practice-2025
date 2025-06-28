import React from 'react';
import './OperationGroup.scss';
import type { Transaction, Category, Account } from '../../services/types';
interface Props {
    date: string;
    transactions: Transaction[];
    categoryMap: Map<string, Category>;
    accountMap: Map<string, Account>;
    todayLabel?: string;
}
export declare const OperationGroup: React.FC<Props>;
export {};
