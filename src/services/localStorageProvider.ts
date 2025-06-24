import { v4 as uuid } from 'uuid';
import type { FinanceProvider } from './finance.interface';
import type { Account, Category, Transaction, TransactionType } from './types';
import { getData, setData } from './storage';

export const localStorageProvider: FinanceProvider = {
  async getTotalBalance(targetCurrency?: string): Promise<number> {
    const data = getData();
    const currency = targetCurrency || data.defaultCurrency || 'RUB';

    return data.transactions
      .filter((tx) => tx.currency === currency)
      .reduce((sum, tx) => {
        if (tx.type === 'transfer') {
          return sum;
        }
        return sum + (tx.type === 'income' ? tx.amount : -tx.amount);
      }, 0);
  },

  async getAccounts(): Promise<Account[]> {
    return getData().accounts;
  },

  async addAccount(accountData: Omit<Account, 'id'>): Promise<Account> {
    const data = getData();
    const newAccount: Account = {
      id: uuid(),
      ...accountData,
      currency: accountData.currency || data.defaultCurrency || 'RUB',
    };
    data.accounts.push(newAccount);
    setData(data);
    return newAccount;
  },

  async updateAccount(accountToUpdate: Account): Promise<Account[]> {
    const data = getData();
    const updatedAccounts = data.accounts.map((acc) =>
      acc.id === accountToUpdate.id ? accountToUpdate : acc,
    );
    setData({ ...data, accounts: updatedAccounts });
    return updatedAccounts;
  },

  async deleteAccount(accountId: string): Promise<Account[]> {
    const data = getData();
    const accounts = data.accounts.filter((acc) => acc.id !== accountId);
    const transactions = data.transactions.filter(
      (tx) => tx.accountId !== accountId && tx.toId !== accountId,
    );
    setData({ ...data, accounts, transactions });
    return accounts;
  },

  async getAccountBalance(
    accountId: string,
    transactions: Transaction[],
  ): Promise<number> {
    const data = getData();
    const account = data.accounts.find((a) => a.id === accountId);
    const currency = account?.currency || data.defaultCurrency || 'RUB';

    return transactions
      .filter((tx) => tx.currency === currency)
      .reduce((sum, tx) => {
        if (tx.type === 'transfer') {
          if (tx.accountId === accountId) {
            return sum - tx.amount;
          }
          if (tx.toId === accountId) {
            return sum + tx.amount;
          }
          return sum;
        }
        if (tx.accountId === accountId) {
          return sum + (tx.type === 'income' ? tx.amount : -tx.amount);
        }
        return sum;
      }, 0);
  },

  async getCategories(type?: TransactionType): Promise<Category[]> {
    const all = getData().categories;
    return type ? all.filter((cat) => cat.type === type) : all;
  },

  async addCategory(categoryData: Omit<Category, 'id'>): Promise<Category> {
    const data = getData();
    const newCategory: Category = { id: uuid(), ...categoryData };
    data.categories.push(newCategory);
    setData(data);
    return newCategory;
  },

  async updateCategory(categoryToUpdate: Category): Promise<Category[]> {
    const data = getData();
    const updatedCategories = data.categories.map((cat) =>
      cat.id === categoryToUpdate.id ? categoryToUpdate : cat,
    );
    setData({ ...data, categories: updatedCategories });
    return updatedCategories;
  },

  async deleteCategory(categoryId: string): Promise<Category[]> {
    const data = getData();
    const categories = data.categories.filter((cat) => cat.id !== categoryId);

    setData({ ...data, categories });
    return categories;
  },

  async getTransactions(): Promise<Transaction[]> {
    return getData().transactions;
  },

  async addTransaction(txData: Omit<Transaction, 'id'>): Promise<Transaction> {
    const data = getData();
    const account = data.accounts.find((acc) => acc.id === txData.accountId);
    const newTx: Transaction = {
      id: uuid(),
      ...txData,
      currency: account?.currency || data.defaultCurrency || 'RUB',
      toId: txData.toId || '',
    };
    data.transactions.push(newTx);
    setData(data);
    return newTx;
  },

  async updateTransaction(
    id: string,
    updatedData: Partial<Transaction>,
  ): Promise<Transaction[]> {
    const data = getData();
    const index = data.transactions.findIndex((tx) => tx.id === id);
    if (index === -1) {
      throw new Error('Транзакция не найдена');
    }

    const oldTx = data.transactions[index];
    const account =
      data.accounts.find((a) => a.id === updatedData.accountId) ||
      data.accounts.find((a) => a.id === oldTx.accountId);

    const updatedTx: Transaction = {
      ...oldTx,
      ...updatedData,
      currency: account?.currency || data.defaultCurrency || 'RUB',
      toId: updatedData.toId || '',
    };

    data.transactions[index] = updatedTx;
    setData(data);
    return data.transactions;
  },

  async deleteTransaction(id: string): Promise<Transaction[]> {
    const data = getData();
    const transactions = data.transactions.filter((tx) => tx.id !== id);
    setData({ ...data, transactions });
    return transactions;
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
    const data = getData();
    const from = data.accounts.find((acc) => acc.id === fromId);
    const to = data.accounts.find((acc) => acc.id === toId);
    if (!from || !to) {
      throw new Error('Один из счетов не найден');
    }
    if (from.currency !== to.currency) {
      throw new Error('Разная валюта');
    }
    if (amount <= 0) {
      throw new Error('Сумма должна быть больше нуля');
    }

    const currency = from.currency || data.defaultCurrency || 'RUB';

    const transfer: Transaction = {
      id: uuid(),
      type: 'transfer',
      amount,
      currency,
      accountId: from.id,
      accountName: from.name,
      toId: to.id,
      categoryId: '',
      categoryName: '',
      comment: comment || `Перевод между счетами`,
      date,
    };

    data.transactions.push(transfer);
    setData(data);
    return transfer;
  },

  async getDefaultCurrency(): Promise<string | undefined> {
    return getData().defaultCurrency;
  },

  async setDefaultCurrency(currency: string): Promise<void> {
    const data = getData();
    setData({ ...data, defaultCurrency: currency });
  },
};
