import type { Account, Category, Transaction, TransactionType } from './types';
export interface FinanceProvider {
    getTotalBalance(targetCurrency?: string): Promise<number>;
    getAccounts(): Promise<Account[]>;
    addAccount(account: Omit<Account, 'id'>): Promise<Account>;
    updateAccount(accountToUpdate: Account): Promise<Account[]>;
    deleteAccount(accountId: string): Promise<Account[]>;
    getAccountBalance(accountId: string): Promise<number>;
    getCategories(type?: TransactionType): Promise<Category[]>;
    addCategory(category: Omit<Category, 'id'>): Promise<Category>;
    updateCategory(categoryToUpdate: Category): Promise<Category[]>;
    deleteCategory(categoryId: string): Promise<Category[]>;
    getTransactions(): Promise<Transaction[]>;
    addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction>;
    updateTransaction(id: string, updatedData: Partial<Transaction>): Promise<Transaction[]>;
    deleteTransaction(id: string): Promise<Transaction[]>;
    addTransfer({ fromId, toId, amount, comment, date, }: {
        fromId: string;
        toId: string;
        amount: number;
        comment?: string | undefined;
        date: string;
    }): Promise<Transaction>;
    getDefaultCurrency(): Promise<string | undefined>;
    setDefaultCurrency(currency: string): void;
}
