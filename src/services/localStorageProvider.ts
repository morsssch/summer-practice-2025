import { v4 as uuid } from 'uuid';
import type { FinanceProvider } from './finance.interface';
import type { Account, Category, Transaction, TransactionType } from './types';
import { getData, setData } from './storage';

export const localStorageProvider: FinanceProvider = {
  async getTotalBalance(targetCurrency?: string): Promise<number> {
    const data = getData();
    const transactions = data.transactions;
    const currency = targetCurrency || data.defaultCurrency || 'RUB';

    return transactions
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

  updateAccount(accountToUpdate: Account): Account[] {
    const data = getData();
    const updatedAccounts = data.accounts.map((account) =>
      account.id === accountToUpdate.id ? accountToUpdate : account,
    );
    setData({
      ...data,
      accounts: updatedAccounts,
    });
    return updatedAccounts;
  },

  deleteAccount(accountId: string): Account[] {
    const data = getData();
    const filteredAccounts = data.accounts.filter(
      (account) => account.id !== accountId,
    );
    const filteredTransactions = data.transactions.filter(
      (tx) => tx.accountId !== accountId && tx.toId !== accountId,
    );
    setData({
      ...data,
      accounts: filteredAccounts,
      transactions: filteredTransactions,
    });
    return filteredAccounts;
  },

  async getAccountBalance(
    accountId: string,
    transactions: Transaction[],
  ): Promise<number> {
    const data = getData();
    const account = data.accounts.find((acc) => acc.id === accountId);
    const accountCurrency = account?.currency || data.defaultCurrency || 'RUB';

    return transactions
      .filter((tx) => tx.currency === accountCurrency)
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
    const newCategory: Category = {
      id: uuid(),
      ...categoryData,
    };
    data.categories.push(newCategory);
    setData(data);
    return newCategory;
  },

  updateCategory(categoryToUpdate: Category): Category[] {
    const data = getData();
    const updatedCategories = data.categories.map((category) =>
      category.id === categoryToUpdate.id ? categoryToUpdate : category,
    );
    setData({
      ...data,
      categories: updatedCategories,
    });
    return updatedCategories;
  },

  deleteCategory(categoryId: string): Category[] {
    const data = getData();
    const filteredCategories = data.categories.filter(
      (category) => category.id !== categoryId,
    );
    const filteredTransactions = data.transactions.filter(
      (tx) => tx.categoryId !== categoryId,
    );
    setData({
      ...data,
      categories: filteredCategories,
      transactions: filteredTransactions,
    });
    return filteredCategories;
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

  updateTransaction(transactionToUpdate: Transaction): Transaction[] {
    const data = getData();
    const account = data.accounts.find(
      (acc) => acc.id === transactionToUpdate.accountId,
    );
    const updatedTransaction = {
      ...transactionToUpdate,
      currency: account?.currency || data.defaultCurrency || 'RUB',
      toId: transactionToUpdate.toId || '',
    };
    const updatedTransactions = data.transactions.map((tx) =>
      tx.id === transactionToUpdate.id ? updatedTransaction : tx,
    );
    setData({
      ...data,
      transactions: updatedTransactions,
    });
    return updatedTransactions;
  },

  deleteTransaction(transactionId: string): Transaction[] {
    const data = getData();
    const filteredTransactions = data.transactions.filter(
      (tx) => tx.id !== transactionId,
    );
    setData({
      ...data,
      transactions: filteredTransactions,
    });
    return filteredTransactions;
  },

  async addTransfer({
    fromId,
    toId,
    amount,
    comment,
  }: {
    fromId: string;
    toId: string;
    amount: number;
    comment?: string;
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
    const now = new Date().toISOString();

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
      date: now,
    };

    data.transactions.push(transfer);
    setData(data);

    return transfer;
  },

  async getDefaultCurrency(): Promise<string | undefined> {
    return getData().defaultCurrency;
  },

  setDefaultCurrency(currency: string): void {
    const data = getData();
    setData({
      ...data,
      defaultCurrency: currency,
    });
  },
};
