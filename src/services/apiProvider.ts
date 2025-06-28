import axios from 'axios';
import {
  API_URL,
  ACCOUNTS,
  ACCOUNT_BY_ID,
  ACCOUNT_BALANCE,
  CATEGORIES,
  CATEGORY_BY_ID,
  TRANSACTIONS,
  TRANSACTION_BY_ID,
  TRANSFERS,
  BALANCE,
  DEFAULT_CURRENCY,
} from '../constants/endpoints/endpointConst';
import type { FinanceProvider } from './finance.interface';
import type { Account, Category, Transaction, TransactionType } from './types';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiProvider: FinanceProvider = {
  async getTotalBalance(targetCurrency?: string): Promise<number> {
    const response = await api.get(BALANCE, {
      params: { currency: targetCurrency },
    });
    return response.data.total;
  },

  async getAccounts(): Promise<Account[]> {
    const response = await api.get(ACCOUNTS);
    return response.data;
  },

  async addAccount(account: Omit<Account, 'id'>): Promise<Account> {
    const response = await api.post(ACCOUNTS, account);
    return response.data;
  },

  async updateAccount(accountToUpdate: Account): Promise<Account[]> {
    await api.put(ACCOUNT_BY_ID(accountToUpdate.id), accountToUpdate);
    const response = await api.get(ACCOUNTS);
    return response.data;
  },

  async deleteAccount(accountId: string): Promise<Account[]> {
    await api.delete(ACCOUNT_BY_ID(accountId));
    const response = await api.get(ACCOUNTS);
    return response.data;
  },

  async getAccountBalance(
    accountId: string,
  ): Promise<number> {
    const response = await api.get(ACCOUNT_BALANCE(accountId));
    return response.data.balance;
  },

  async getCategories(type?: TransactionType): Promise<Category[]> {
    const response = await api.get(CATEGORIES, {
      params: type ? { type } : {},
    });
    return response.data;
  },

  async addCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const response = await api.post(CATEGORIES, category);
    return response.data;
  },

  async updateCategory(categoryToUpdate: Category): Promise<Category[]> {
    await api.put(CATEGORY_BY_ID(categoryToUpdate.id), categoryToUpdate);
    const response = await api.get(CATEGORIES);
    return response.data;
  },

  async deleteCategory(categoryId: string): Promise<Category[]> {
    await api.delete(CATEGORY_BY_ID(categoryId));
    const response = await api.get(CATEGORIES);
    return response.data;
  },

  async getTransactions(): Promise<Transaction[]> {
    const response = await api.get(TRANSACTIONS);
    return response.data;
  },

  async addTransaction(tx: Omit<Transaction, 'id'>): Promise<Transaction> {
    const response = await api.post(TRANSACTIONS, tx);
    return response.data;
  },

  async updateTransaction(
    id: string,
    updated: Partial<Transaction>,
  ): Promise<Transaction[]> {
    await api.put(TRANSACTION_BY_ID(id), updated);
    const response = await api.get(TRANSACTIONS);
    return response.data;
  },

  async deleteTransaction(id: string): Promise<Transaction[]> {
    await api.delete(TRANSACTION_BY_ID(id));
    const response = await api.get(TRANSACTIONS);
    return response.data;
  },

  async addTransfer({
    fromId,
    toId,
    amount,
    comment,
    date,
  }: {
    fromId: string;
    toId: string;
    amount: number;
    comment?: string;
    date: string;
  }): Promise<Transaction> {
    const response = await api.post(TRANSFERS, {
      fromId,
      toId,
      amount,
      comment,
      date,
    });
    return response.data;
  },

  async getDefaultCurrency(): Promise<string | undefined> {
    const response = await api.get(DEFAULT_CURRENCY);
    return response.data.currency;
  },

  async setDefaultCurrency(currency: string): Promise<void> {
    await api.put(DEFAULT_CURRENCY, { currency });
  },
};
