import React from 'react';
import './DesktopLockPage.scss';

export const DesktopLockPage: React.FC = () => {
  return (
    <div className="desktop-lock">
      <h1 className="title">Ошибка</h1>
      <h2 className="subtitle">
        На данный момент приложение доступно только на мобильных устройствах
      </h2>
    </div>
  );
};
