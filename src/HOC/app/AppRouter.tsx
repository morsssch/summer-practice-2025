import { Navigate, Route, Routes } from 'react-router';
import React from 'react';
import Layout from '../../layouts/Layout.tsx';
import { HomePage } from '../../pages/HomePage/HomePage';
import { HistoryPage } from '../../pages/HistoryPage/HistoryPage';
import { AnalyticsPage } from '../../pages/AnalyticsPage/AnalyticsPage';
import { OtherPage } from '../../pages/OtherPage/OtherPage';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="other" element={<OtherPage />} />
      </Route>
    </Routes>
  );
};