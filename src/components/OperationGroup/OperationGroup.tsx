import React from 'react';
import './OperationGroup.scss';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Transaction, Category, Account } from '../../services/types';
import { OperationItem } from '../OperationItem/OperationItem';
import currencyOptions from '../../constants/currencyOptions.json';

interface Props {
  date: string;
  transactions: Transaction[];
  categoryMap: Map<string, Category>;
  accountMap: Map<string, Account>;
  todayLabel?: string;
}

export const OperationGroup: React.FC<Props> = ({
  date,
  transactions,
  categoryMap,
  accountMap,
  todayLabel,
}) => {
  const formattedDate =
    todayLabel || format(new Date(date), 'd MMMM', { locale: ru });

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const total = sortedTransactions.reduce((sum, tx) => {
    const sign = tx.type === 'income' ? 1 : tx.type === 'expense' ? -1 : 0;
    return sum + sign * tx.amount;
  }, 0);

  const currency = sortedTransactions[0]?.currency || 'RUB';
  const currencyOption = currencyOptions.find((opt) => opt.value === currency);
  const currencySymbol = currencyOption
    ? currencyOption.label.split(' ')[0]
    : currency;
  const locale = currency === 'RUB' ? 'ru-RU' : 'en-US';

  return (
    <div className="operation-group">
      <div className="group-header">
        <div
          className={todayLabel ? 'group-date group-date-custom' : 'group-date'}
        >
          {formattedDate}
        </div>
        <div className="group-total">
          {total > 0 ? '+' : ''}
          {total.toLocaleString(locale)} {currencySymbol}
        </div>
      </div>
      <div className="group-items">
        {sortedTransactions.map((tx) => (
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
