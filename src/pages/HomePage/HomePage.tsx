import React from 'react';
import Header from '../../components/Header/Header';
import { BalanceWidget } from '../../components/BalanceWidget/BalanceWidget';
import { TodayExpensesWidget } from '../../components/TodayExpensesWidget/TodayExpensesWidget';
import { TopCategoriesWidget } from '../../components/TopCategoriesWidget';
import { TodayOperationsWidget } from '../../components/TodayOperationsWidget';

export const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <BalanceWidget />
      <TodayExpensesWidget />
      <TopCategoriesWidget />
      <TodayOperationsWidget />
    </>
  );
};

export default HomePage;
