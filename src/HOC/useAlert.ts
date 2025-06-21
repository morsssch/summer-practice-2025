import { useContext } from 'react';
import { ModalContext } from '../HOC/ModalProvider';

export const useAlert = () => {
  const modal = useContext(ModalContext);
  if (!modal) {
    throw new Error('useAlert must be used within ModalProvider');
  }

  const alert = (message: string, title = 'Внимание') => {
    modal.showModal({
      title,
      body: message,
      primaryText: 'ОК',
      buttonsConfig: 'primaryOnly',
      primaryHandler: modal.hideModal,
    });
  };

  return alert;
};
