import { createContext } from 'react';
import type { LoaderContextType } from './types';

export const LoaderContext = createContext<LoaderContextType | undefined>(undefined);
