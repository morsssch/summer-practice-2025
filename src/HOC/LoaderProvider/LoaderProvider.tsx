import type { JSX, ReactNode } from 'react';
import { useCallback, useState } from 'react';
import { LoaderContext } from './LoaderContext';

export const LoaderProvider = ({ children }: { children: ReactNode; }): JSX.Element => {
  const [isGlobalLoading, setGlobalLoading] = useState(false);
  const [isLocalLoading, setLocalLoading] = useState(false);

  const setGlobalLoadingHandler = useCallback((x: boolean) => {
    setGlobalLoading(x);
  }, []);
  const setLocalLoadingHandler = useCallback((x: boolean) => {
    setLocalLoading(x);
  }, []);

  return (
    <LoaderContext.Provider
      value={{
        isGlobalLoading, setGlobalLoading: setGlobalLoadingHandler,
        isLocalLoading, setLocalLoading: setLocalLoadingHandler,
      }}
    >
      {children}
    </LoaderContext.Provider>
  );
};
