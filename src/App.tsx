import React from 'react';
import { AppInitial } from './HOC/app';
import './styles/base/main.scss';
import { ModalProvider } from './HOC/ModalProvider';
import { LoaderProvider } from './HOC/LoaderProvider';

const App: React.FC = () => {
  return (
    <ModalProvider>
      <LoaderProvider>
          <AppInitial />
      </LoaderProvider>
    </ModalProvider>
  );
};

export default App;
