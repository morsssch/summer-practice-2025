export type TransactionType = 'income' | 'expense' | 'transfer';
export type AccountType = 'cash' | 'card' | 'other' | null;
export interface FinanceData {
    accounts: Account[];
    categories: Category[];
    transactions: Transaction[];
    defaultCurrency?: string;
}
export interface Account {
    id: string;
    type: AccountType;
    name: string;
    currency: string;
    isDeleted?: boolean;
}
export interface Category {
    id: string;
    name: string;
    type: TransactionType;
    color: string;
    icon: string;
    isDeleted?: boolean;
}
export interface Transaction {
    currency: string;
    id: string;
    amount: number;
    type: TransactionType;
    categoryId: string;
    categoryName: string;
    accountId: string;
    accountName: string;
    toId?: string;
    comment?: string;
    date: string;
}
