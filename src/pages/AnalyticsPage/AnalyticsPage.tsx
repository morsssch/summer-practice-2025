import React from 'react';
import './AnalyticsPage.scss';
import FinanceChart from '../../components/FinanceChart/FinanceChart';
import { TopExpenseCategoriesWidget } from '../../components/TopExpenseCategoriesWidget';

export const AnalyticsPage: React.FC = () => {
  return (
    <>
      <h1 className="title">Аналитика</h1>
      <FinanceChart />
      <TopExpenseCategoriesWidget maxItems={3}/>
    </>
  );
};
