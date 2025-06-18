import React, { useEffect } from 'react';
import { useLoader } from '../../utils/useLoader.ts';
import Loader from '../../components/Loader/index.tsx';
import { AppRouter } from './index.ts';

export const AppInitial: React.FC = () => {
  const { isGlobalLoading, setGlobalLoading, isLocalLoading, setLocalLoading } =
    useLoader();

  useEffect(() => {
    const handleLoad = () => setGlobalLoading(false);

    setGlobalLoading(true);

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => window.removeEventListener('load', handleLoad);
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
