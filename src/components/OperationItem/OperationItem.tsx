import React from 'react';
import './OperationItem.scss';
import clsx from 'clsx';
import { useNavigate } from 'react-router';
import type { Transaction, Category, Account } from '../../services/types';
import { CategoryIcon } from '../CategoryIcon/CategoryIcon';
import { getCurrencySymbol } from '../../utils/getCurrencySymbol';

interface OperationItemProps {
  transaction: Transaction;
  categoryMap: Map<string, Category>;
  accountMap: Map<string, Account>;
}

export const OperationItem: React.FC<OperationItemProps> = ({
  transaction,
  categoryMap,
  accountMap,
}) => {
  const isTransfer = transaction.type === 'transfer';
  const navigate = useNavigate();

  const category = transaction.categoryId
    ? categoryMap.get(transaction.categoryId)
    : null;

  const iconName = isTransfer ? 'CreditCard' : category?.icon || 'Wallet';
  const color = isTransfer ? '#cccccc' : category?.color || '#cccccc';
  const name = isTransfer
    ? 'Перевод между счетами'
    : category?.name || 'Без категории';

  const toAccount =
    isTransfer && transaction.toId ? accountMap.get(transaction.toId) : null;

  const subtitle = isTransfer
    ? `${transaction.accountName} → ${toAccount?.name || 'неизвестно'}`
    : transaction.accountName;

  const handleClick = () => {
    navigate(`/operations/${transaction.id}`);
  };

  return (
    <div className="operation-item" onClick={handleClick}>
      <CategoryIcon
        name={name}
        color={color}
        iconName={iconName}
        showLabel={false}
      />
      <div className="operation-item-wrapper">
        <div className="operation-info">
          <div className="operation-title">
            {transaction.comment?.trim() || name}
          </div>
          <div className="operation-subtitle">{subtitle}</div>
        </div>
        <div
          className={clsx('operation-amount', {
            income: transaction.type === 'income',
            expense: transaction.type === 'expense',
            transfer: transaction.type === 'transfer',
          })}
        >
          {transaction.type === 'expense' ? '-' : ''}
          {transaction.amount.toLocaleString()}{' '}
          {getCurrencySymbol(transaction.currency)}
        </div>
      </div>
    </div>
  );
};
