import React, { useEffect } from 'react';
import { useLoader } from '../../utils/useLoader.ts';
import Loader from '../../components/Loader/index.tsx';
import { AppRouter } from './index.ts';

export const AppInitial: React.FC = () => {
  const { isGlobalLoading, setGlobalLoading, 
    isLocalLoading, setLocalLoading } = useLoader();

  useEffect(() => {
    setGlobalLoading(true);
    setTimeout(() => {
      setGlobalLoading(false);
    }, 1000);
  }, []);

  return isGlobalLoading ? (
    <Loader type="global" />
  ) : (
    <>
      <AppRouter />
      {isLocalLoading && <Loader type="local" />}
    </>
  );
};
