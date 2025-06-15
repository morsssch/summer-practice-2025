import React, { useRef, useState } from 'react';
import { Modal } from '../../components/Modal';
import { ModalContext } from './ModalContext';
import type { ModalConfigI, ModalProviderPropsI } from './types';

export const ModalProvider: React.FC<ModalProviderPropsI> = ({ children }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [config, setConfig] = useState<ModalConfigI>({});

  const showModal = (config: ModalConfigI): void => {
    setConfig(config);
    dialogRef?.current.showModal();
  };

  const hideModal = (): void => {
    dialogRef?.current.close();
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Modal
        ref={dialogRef}
        {...config}
      />
    </ModalContext.Provider>
  );
};
