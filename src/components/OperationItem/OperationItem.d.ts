import React from 'react';
import './OperationItem.scss';
import type { Transaction, Category, Account } from '../../services/types';
interface OperationItemProps {
    transaction: Transaction;
    categoryMap: Map<string, Category>;
    accountMap: Map<string, Account>;
}
export declare const OperationItem: React.FC<OperationItemProps>;
export {};
