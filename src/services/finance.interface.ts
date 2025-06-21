/* eslint-disable no-unused-vars */
import type { Account, Category, Transaction, TransactionType } from './types';

export interface FinanceProvider {
  getTotalBalance(targetCurrency?: string): Promise<number>;

  getAccounts(): Promise<Account[]>;
  addAccount(account: Omit<Account, 'id'>): Promise<Account>;
  updateAccount(accountToUpdate: Account): Account[];
  deleteAccount(accountId: string): Account[];
  getAccountBalance(
    accountId: string,
    transactions: Transaction[],
  ): Promise<number>;

  getCategories(type?: TransactionType): Promise<Category[]>;
  addCategory(category: Omit<Category, 'id'>): Promise<Category>;
  updateCategory(categoryToUpdate: Category): Category[];
  deleteCategory(categoryId: string): Category[];

  getTransactions(): Promise<Transaction[]>;
  addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction>;
  updateTransaction(transactionToUpdate: Transaction): Transaction[];
  deleteTransaction(transactionId: string): Transaction[];

  addTransfer({
    fromId,
    toId,
    amount,
    comment,
    date,
  }: {
    fromId: string;
    toId: string;
    amount: number;
    comment?: string | undefined;
    date: string;
  }): Promise<Transaction>;

  getDefaultCurrency(): Promise<string | undefined>;
  setDefaultCurrency(currency: string): void;
}
