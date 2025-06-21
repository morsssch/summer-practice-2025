import React from 'react';
import Header from '../../components/Header/Header';
import { BalanceWidget } from '../../components/BalanceWidget/BalanceWidget';
import { ActionButton } from '../../components/ActionButton/ActionButton';

export const HomePage: React.FC = () => {
  return (
    <>
      <Header name={'Мария'} />
      <BalanceWidget />
      <ActionButton label={'Категории'} to='/settings/categories'/>
    </>
  );
};

export default HomePage;
