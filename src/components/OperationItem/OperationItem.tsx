import React, { useEffect } from 'react';
import './OperationItem.scss';
import clsx from 'clsx';
import { motion, useMotionValue, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
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
  const x = useMotionValue(0);
  const controls = useAnimation();

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

  useEffect(() => {
    const unsubscribe = x.onChange((value: number) => {
      if (value > 0) {
        controls.start({ x: 0, transition: { duration: 0 } });
        x.set(0);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [x, controls]);

  const handleDragEnd = () => {
    const threshold = -100;
    if (x.get() < threshold) {
      navigate(`/operations/${transaction.id}`);
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300 } });
    }
  };

  return (
    <div className="operation-swipe-container">
      <div className="operation-background">
        <div className="operation-background-inner">
          <p className="right-title">Подробности</p>
          <div className="right-action">
            Перейти
            <ArrowUpRight size={16} />
          </div>
        </div>
      </div>
      <motion.div
        className="operation-item"
        drag="x"
        dragConstraints={{ left: -110, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x }}
        animate={controls}
        whileTap={{ cursor: 'grabbing' }}
      >
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
      </motion.div>
    </div>
  );
};
