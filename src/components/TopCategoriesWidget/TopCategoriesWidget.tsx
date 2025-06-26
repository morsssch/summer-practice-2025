import React, { useEffect, useState } from 'react';
import './TopCategoriesWidget.scss';
import { NavLink } from 'react-router';
import { MinorButton } from '../MinorButton';
import { CategoryIcon } from '../CategoryIcon';
import provider from '../../services/provider';
import type { Category } from '../../services/types';
import currencyOptions from '../../constants/currencyOptions.json';

interface CategorySpending {
  category: Category;
  total: number;
}

export const TopCategoriesWidget: React.FC = () => {
  const [topCategories, setTopCategories] = useState<CategorySpending[]>([]);
  const [defaultCurrency, setDefaultCurrency] = useState<string>('RUB');

  useEffect(() => {
    const fetchData = async () => {
      const [transactions, categories, currency] = await Promise.all([
        provider.getTransactions(),
        provider.getCategories('expense'),
        provider.getDefaultCurrency(),
      ]);

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const monthlyExpenses = transactions.filter(
        (tx) =>
          tx.type === 'expense' &&
          new Date(tx.date).getMonth() === currentMonth &&
          new Date(tx.date).getFullYear() === currentYear,
      );

      const categoryTotals = categories.map((category) => ({
        category,
        total: monthlyExpenses
          .filter((tx) => tx.categoryId === category.id)
          .reduce((sum, tx) => sum + tx.amount, 0),
      }));

      const sortedCategories = categoryTotals
        .filter((item) => item.total > 0)
        .sort((a, b) => b.total - a.total)
        .slice(0, 3);

      setTopCategories(sortedCategories);
      setDefaultCurrency(currency || 'RUB');
    };

    fetchData();
  }, []);

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
        <h2 className="subtitle">В этом месяце</h2>
        <MinorButton
          to="/analytics"
          label="Подробнее"
        />
      </div>
      <p className='annotation'>Больше всего вы тратили в этих категориях</p>
      <div className="top-categories-widget-wrapper">
        {topCategories.length > 0 ? (
          topCategories.map(({ category, total }) => (
            <NavLink
              key={category.id}
              className="category-item"
              to={`/operations?categories=${category.id}`}
            >
              <CategoryIcon
                name={category.name}
                color={category.color}
                iconName={category.icon}
                showLabel={false}
              />
              <p className="category-amount">
                {total.toLocaleString(locale)} {currencySymbol}
              </p>
              <p className="category-name">{category.name}</p>
            </NavLink>
          ))
        ) : (
          <p>Нет расходов в этом месяце</p>
        )}
      </div>
    </div>
  );
};
