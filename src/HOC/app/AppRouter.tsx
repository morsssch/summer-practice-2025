import { Navigate, Route, Routes } from 'react-router';
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

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<HomePage />} />
        
        <Route path="accounts" element={<AccountsPage/>} />
        <Route path="accounts/new" element={<AddAccountPage />} />
        <Route path="accounts/:id/edit" element={<EditAccountPage />} />

        <Route path="settings/categories" element={<CategoriesPage />} />
        <Route path="settings/categories/new" element={<AddCategoryPage />} />
        <Route path="settings/categories/:id/edit" element={<EditCategoryPage />} />
        
        <Route path="operations" element={<OperationsPage />} />
        <Route path="operations/new" element={<AddOperationPage />} />

        
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="other" element={<OtherPage />} />


      </Route>
    </Routes>
  );
};