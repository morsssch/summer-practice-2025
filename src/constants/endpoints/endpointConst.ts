export const API_URL: string = 'http://localhost:8800/api';
export const AUTH_REFRESH: string = '/auth/refresh';
export const AUTH_LOGIN: string = '/auth/authorization';
export const AUTH_REG: string = '/auth/registration';
export const AUTH_LOGOUT: string = '/auth/logout';

export const ACCOUNTS = '/accounts';
export const ACCOUNT_BY_ID = (id: string): string => `/accounts/${id}`;
export const ACCOUNT_BALANCE = (id: string): string => `/accounts/${id}/balance`;

export const CATEGORIES = '/categories';
export const CATEGORY_BY_ID = (id: string): string => `/categories/${id}`;

export const TRANSACTIONS = '/transactions';
export const TRANSACTION_BY_ID = (id: string): string =>`/transactions/${id}`;

export const TRANSFERS = '/transfers';

export const BALANCE = '/balance';

export const DEFAULT_CURRENCY = '/settings/defaultCurrency';

