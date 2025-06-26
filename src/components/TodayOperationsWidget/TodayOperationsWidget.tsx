import React, { useEffect, useState } from 'react';
import './TodayOperationsWidget.scss';
import { MinorButton } from '../MinorButton';
import { OperationGroup } from '../OperationGroup';
import provider from '../../services/provider';
import type { Transaction, Category, Account } from '../../services/types';

export const TodayOperationsWidget: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categoryMap, setCategoryMap] = useState<Map<string, Category>>(
    new Map(),
  );
  const [accountMap, setAccountMap] = useState<Map<string, Account>>(new Map());

  useEffect(() => {
    const fetchData = async () => {
      const [allTransactions, categories, accounts] = await Promise.all([
        provider.getTransactions(),
        provider.getCategories(),
        provider.getAccounts(),
      ]);

      const today = new Date().toDateString();
      const todayTransactions = allTransactions.filter(
        (tx) => new Date(tx.date).toDateString() === today,
      );

      const catMap = new Map<string, Category>();
      categories.forEach((cat) => catMap.set(cat.id, cat));

      const accMap = new Map<string, Account>();
      accounts.forEach((acc) => accMap.set(acc.id, acc));

      setTransactions(todayTransactions);
      setCategoryMap(catMap);
      setAccountMap(accMap);
    };

    fetchData();
  }, []);

  return (
    <div className="option-wrapper">
      <div className="option-header">
        <h2 className="subtitle">История операций</h2>
        <MinorButton
          to="/operations"
          label="Подробнее"
        />
      </div>
      <div className="today-operations-widget-wrapper">
        {transactions.length > 0 ? (
          <OperationGroup
            date={new Date().toISOString()}
            transactions={transactions}
            categoryMap={categoryMap}
            accountMap={accountMap}
            todayLabel="Сегодня"
          />
        ) : (
          <p>Нет операций за сегодня</p>
        )}
      </div>
    </div>
  );
};
