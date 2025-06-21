import React, { useState } from 'react';
import { Modal } from '../../components/Modal';
import { ModalContext } from './ModalContext';
import type { ModalConfigI, ModalProviderPropsI } from './types';

export const ModalProvider: React.FC<ModalProviderPropsI> = ({ children }) => {
  const [config, setConfig] = useState<ModalConfigI>({});
  const [isOpen, setIsOpen] = useState(false);

  const showModal = (config: ModalConfigI): void => {
    setConfig(config);
    setIsOpen(true);
  };

  const hideModal = (): void => {
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {isOpen && <Modal {...config} />}
    </ModalContext.Provider>
  );
};
