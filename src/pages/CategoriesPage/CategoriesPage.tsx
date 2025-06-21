import React, { useEffect, useState } from 'react';
import './CategoriesPage.scss';
import { useNavigate } from 'react-router';
import { ActionButton } from '../../components/ActionButton/ActionButton';
import { CategoriesWidget } from '../../components/CategoriesWidget/CategoriesWidget';
import provider from '../../services/provider';
import type { Category } from '../../services/types';

export const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const incomeCategories = await provider.getCategories('income');
      const expenseCategories = await provider.getCategories('expense');
      setCategories([...incomeCategories, ...expenseCategories]);
    };
    fetchCategories();
  }, []);

  return (
    <>
      <h1 className="title">Категории</h1>
      <ActionButton
        label="Добавить"
        onClick={() => navigate('/settings/categories/new')}
      />
      <div className="options-wrapper">
        <div className="option-wrapper">
          <h2 className="subtitle">Категории для доходов</h2>
          <CategoriesWidget
            mode="edit"
            type="income"
            categories={categories}
          />
        </div>
        <div className="option-wrapper">
          <h2 className="subtitle">Категории для расходов</h2>
          <CategoriesWidget
            mode="edit"
            type="expense"
            categories={categories}
          />
        </div>
      </div>
    </>
  );
};
