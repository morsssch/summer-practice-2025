import React, { useEffect, useState } from 'react';
import './TodayExpensesWidget.scss';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { NavLink } from 'react-router';
import { MinorButton } from '../MinorButton';
import currencyOptions from '../../constants/currencyOptions.json';
import type { Transaction, TransactionType } from '../../services/types';
import provider from '../../services/provider';

const findOperationSum = (type: TransactionType, operations: Transaction[]) => {
  const filteredOperations = operations.filter(
    (v) =>
      v.type === type &&
      new Date(v.date).toDateString() === new Date().toDateString(),
  );

  const sum = filteredOperations.reduce(
    (acc: number, v: Transaction) => acc + v.amount,
    0,
  );

  return sum;
};

export const TodayExpensesWidget: React.FC = () => {
  const [operations, setOperations] = useState<Transaction[]>();
  const [defaultCurrency, setDefaultCurrency] = useState<string>('RUB');
  const [incomes, setIncomes] = useState<number | null>(null);
  const [expenses, setExpenses] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [allOperations, currency] = await Promise.all([
        provider.getTransactions(),
        provider.getDefaultCurrency(),
      ]);

      setOperations(allOperations);
      setDefaultCurrency(currency);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!operations) {
      return;
    }

    setIncomes(findOperationSum('income', operations));
    setExpenses(findOperationSum('expense', operations));
  }, [operations]);

  const currencyOption = currencyOptions.find(
    (opt) => opt.value === defaultCurrency,
  );
  const currencySymbol = currencyOption
    ? currencyOption.label.split(' ')[0]
    : defaultCurrency;
  const locale = defaultCurrency === 'RUB' ? 'ru-RU' : 'en-US';

  return (
    <div className="option-wrapper">
      <div className="option-header">
        <h2 className="subtitle">Сегодня</h2>
        <MinorButton
          to="/analytics"
          label={'Аналитика'}
        />
      </div>
      <div className="today-expenses-widget-wrapper">
        <NavLink
          className="today-expenses-widget"
          to={'/operations?type=income'}
        >
          <div className="today-expenses-widget-header">
            <p>Доходы</p>
            <TrendingUp size={24} />
          </div>
          <h2 className="today-expenses-widget-amount">
            {incomes === null
              ? 'Загрузка...'
              : `${incomes.toLocaleString(locale)} ${currencySymbol}`}
          </h2>
        </NavLink>
        <NavLink
          className="today-expenses-widget"
          to={'/operations?type=expense'}
        >
          <div className="today-expenses-widget-header">
            <p>Расходы</p>
            <TrendingDown size={24} />
          </div>
          <h2 className="today-expenses-widget-amount">
            {expenses === null
              ? 'Загрузка...'
              : `${expenses.toLocaleString(locale)} ${currencySymbol}`}
          </h2>
        </NavLink>
      </div>
    </div>
  );
};
