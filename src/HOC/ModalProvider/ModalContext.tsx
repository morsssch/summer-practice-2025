import { createContext } from 'react';
import type { ModalProviderContextI } from './types';

export const ModalContext = createContext<ModalProviderContextI | undefined>(undefined);
