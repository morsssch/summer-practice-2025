import React from 'react';
import './OperationGroup.scss';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Transaction, Category, Account } from '../../services/types';
import { OperationItem } from '../OperationItem/OperationItem';

interface Props {
  date: string;
  transactions: Transaction[];
  categoryMap: Map<string, Category>;
  accountMap: Map<string, Account>;
}

export const OperationGroup: React.FC<Props> = ({
  date,
  transactions,
  categoryMap,
  accountMap,
}) => {
  const formattedDate = format(new Date(date), 'd MMMM', { locale: ru });
  const total = transactions.reduce((sum, tx) => {
    const sign = tx.type === 'income' ? 1 : tx.type === 'expense' ? -1 : 0;
    return sum + sign * tx.amount;
  }, 0);

  return (
    <div className="operation-group">
      <div className="group-header">
        <div className="group-date">{formattedDate}</div>
        <div className="group-total">
          {total > 0 ? '+' : ''}
          {total.toLocaleString()} ₽
        </div>
      </div>
      <div className="group-items">
        {transactions.map((tx) => (
          <OperationItem
            key={tx.id}
            transaction={tx}
            categoryMap={categoryMap}
            accountMap={accountMap}
          />
        ))}
      </div>
    </div>
  );
};
