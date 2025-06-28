import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import React from 'react';
import Layout from '../../layouts/Layout.tsx';
import { HomePage } from '../../pages/HomePage/HomePage';
import { AnalyticsPage } from '../../pages/AnalyticsPage/AnalyticsPage';
import { OtherPage } from '../../pages/OtherPage/OtherPage';
import { AccountsPage } from '../../pages/AccountsPage/AccountsPage';
import { AddAccountPage } from '../../pages/AddAccountPage/AddAccountPage';
import { EditAccountPage } from '../../pages/EditAccountPage/EditAccountPage';
import { AddCategoryPage } from '../../pages/AddCategoryPage/AddCategoryPage.tsx';
import { CategoriesPage } from '../../pages/CategoriesPage/CategoriesPage';
import { EditCategoryPage } from '../../pages/EditCategoryPage/EditCategoryPage.tsx';
import { OperationsPage } from '../../pages/OperationsPage/OperationsPage';
import { AddOperationPage } from '../../pages/AddOperationPage/AddOperationPage.tsx';
import { EditOperationPage } from '../../pages/EditOperationPage/EditOperationPage.tsx';
import { NotFoundPage } from '../../pages/NotFoundPage/NotFoundPage.tsx';
import { DesktopLockPage } from '../../pages/DesktopLockPage/DesktopLockPage.tsx';

const isMobile = () => {
  const ua = navigator.userAgent;
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(ua);
};

export const AppRouter: React.FC = () => {
  const isMobileDevice = isMobile();

  return (
    <BrowserRouter basename="/summer-practice-2025">
      <Routes>
        {isMobileDevice ? (
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />

            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/accounts/new" element={<AddAccountPage />} />
            <Route path="/accounts/:id/edit" element={<EditAccountPage />} />

            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/new" element={<AddCategoryPage />} />
            <Route path="/categories/:id/edit" element={<EditCategoryPage />} />

            <Route path="/operations" element={<OperationsPage />} />
            <Route path="/operations/new" element={<AddOperationPage />} />
            <Route path="/operations/:id" element={<EditOperationPage />} />

            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/other" element={<OtherPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        ) : (
          <>
            <Route path="/home" element={<DesktopLockPage />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};
