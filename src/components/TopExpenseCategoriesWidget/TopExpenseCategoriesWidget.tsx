import React, { useEffect, useRef, useState } from 'react';
import './TopExpenseCategoriesWidget.scss';
import { MoreVertical } from 'lucide-react';
import { CategoryIcon } from '../CategoryIcon';
import { MinorButton } from '../MinorButton';
import provider from '../../services/provider';
import type { Category } from '../../services/types';
import currencyOptions from '../../constants/currencyOptions.json';
import darkenColor from '../../utils/darkenColor';

interface Props {
  maxItems?: number;
}

interface CategorySpending {
  category: Category;
  total: number;
}

type Period = 'week' | 'month' | 'threeMonths';

export const TopExpenseCategoriesWidget: React.FC<Props> = ({
  maxItems = 5,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [categoriesSpending, setCategoriesSpending] = useState<
    CategorySpending[]
  >([]);
  const [defaultCurrency, setDefaultCurrency] = useState<string>('RUB');
  const [showAll, setShowAll] = useState(false);
  const [period, setPeriod] = useState<Period>('month');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [transactions, categories, currency] = await Promise.all([
        provider.getTransactions(),
        provider.getCategories('expense'),
        provider.getDefaultCurrency(),
      ]);

      const now = new Date();
      const startDate = new Date();
      if (period === 'week') {
        startDate.setDate(now.getDate() - 7);
      } else if (period === 'month') {
        startDate.setMonth(now.getMonth() - 1);
      } else if (period === 'threeMonths') {
        startDate.setMonth(now.getMonth() - 3);
      }
      startDate.setHours(0, 0, 0, 0);

      const filteredTransactions = transactions.filter(
        (tx) =>
          tx.type === 'expense' &&
          new Date(tx.date) >= startDate &&
          new Date(tx.date) <= now,
      );

      const categoryTotals = categories.map((category) => ({
        category,
        total: filteredTransactions
          .filter((tx) => tx.categoryId === category.id)
          .reduce((sum, tx) => sum + tx.amount, 0),
      }));

      const sortedCategories = categoryTotals
        .filter((item) => item.total > 0)
        .sort((a, b) => b.total - a.total);

      setCategoriesSpending(sortedCategories);
      setDefaultCurrency(currency || 'RUB');
    };

    fetchData();
  }, [period]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currencyOption = currencyOptions.find(
    (opt) => opt.value === defaultCurrency,
  );
  const currencySymbol = currencyOption
    ? currencyOption.label.split(' ')[0]
    : defaultCurrency;
  const locale = defaultCurrency === 'RUB' ? 'ru-RU' : 'en-US';

  const displayedCategories = showAll
    ? categoriesSpending
    : categoriesSpending.slice(0, maxItems);
  const maxTotal = categoriesSpending[0]?.total || 1;

  const periodOptions: { value: Period; label: string }[] = [
    { value: 'week', label: 'Неделя' },
    { value: 'month', label: 'Месяц' },
    { value: 'threeMonths', label: '3 месяца' },
  ];

  return (
    <div className="option-wrapper">
      <div className="option-header">
        <h2 className="subtitle">Наибольшие траты по категориям</h2>
        <div className="menu-wrapper">
          <MoreVertical
            size={24}
            className="menu-icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
          {isMenuOpen && (
            <div className="period-menu" ref={menuRef}>
              {periodOptions.map((opt) => (
                <button
                  key={opt.value}
                  className={`period-option ${period === opt.value ? 'active' : ''}`}
                  onClick={() => {
                    setPeriod(opt.value);
                    setIsMenuOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div
        className={`top-expense-categories-widget-wrapper ${showAll ? 'expanded' : ''}`}
      >
        {displayedCategories.length > 0 ? (
          displayedCategories.map(({ category, total }) => (
            <div
              key={category.id}
              className="category-item"
            >
              <CategoryIcon
                name={category.name}
                color={category.color}
                iconName={category.icon}
                showLabel={false}
              />
              <div className="category-details">
                <div className="category-progress">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${(total / maxTotal) * 100}%`,
                      background: darkenColor(category.color),
                      opacity: 0.5,
                    }}
                  />
                </div>
                <div className="category-info">
                  <p className="category-amount">
                    {total.toLocaleString(locale)} {currencySymbol}
                  </p>
                  <p className="category-name">{category.name}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Нет расходов за выбранный период</p>
        )}
      </div>
      {categoriesSpending.length > maxItems && (
        <MinorButton
          label={showAll ? 'Скрыть' : 'Показать все'}
          onClick={() => setShowAll(!showAll)}
        />
      )}
    </div>
  );
};
