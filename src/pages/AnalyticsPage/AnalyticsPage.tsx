import React from 'react';
import './AnalyticsPage.scss';
import FinanceChart from '../../components/FinanceChart/FinanceChart';

export const AnalyticsPage: React.FC = () => {
  return (
    <>
      <h1 className="title">Аналитика</h1>
      <FinanceChart />
    </>
  );
};
