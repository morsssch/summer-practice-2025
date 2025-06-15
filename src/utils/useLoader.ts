import { useContext } from 'react';
import { LoaderContext } from '../HOC/LoaderProvider';
import type { LoaderContextType } from '../HOC/LoaderProvider/types';

export const useLoader = (): LoaderContextType => {
  return useContext(LoaderContext);
};
