import type { FinanceData } from "./types";

const STORAGE_KEY = 'finance_data';

export const getData = (): FinanceData => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      accounts: [],
      categories: [],
      transactions: [],
      defaultCurrency: 'RUB',
    };
  }
  return JSON.parse(raw);
};

export const setData = (data: FinanceData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};