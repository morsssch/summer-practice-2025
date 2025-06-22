import React from 'react';
import { useNavigate } from 'react-router';
import Header from '../../components/Header/Header';
import { BalanceWidget } from '../../components/BalanceWidget/BalanceWidget';
import { ActionButton } from '../../components/ActionButton/ActionButton';
import demoData from '../../constants/demoData.json'

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const handleDemoData = (): void => {
    localStorage.setItem('finance_data', JSON.stringify(demoData));
    navigate('/')
  }

  const handleClearData = (): void => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <>
      <Header name={'Мария'} />
      <BalanceWidget />
      <div className='option-wrapper'>
        <ActionButton label={'Категории'} to='/settings/categories'/>
        <ActionButton label={'Демонстрационные данные'} onClick={() => handleDemoData()}/>
        <ActionButton label={'Очистить данные'} onClick={() => handleClearData()}/>
      </div>
    </>
  );
};

export default HomePage;
