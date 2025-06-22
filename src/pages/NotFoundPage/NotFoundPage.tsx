import React from 'react';
import './NotFoundPage.scss';
import { CupSoda } from 'lucide-react';
import { ActionButton } from '../../components/ActionButton/ActionButton';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page">
      <h1 className="title">404</h1>
      <h2 className="subtitle">Страница не найдена</h2>
      <ActionButton label={'На главную'} to={"/"} icon={CupSoda}/>
    </div>
  );
};
