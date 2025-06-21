import { useContext } from 'react';
import { ModalContext } from '../HOC/ModalProvider';

export const useConfirmDeletion = () => {
  const modal = useContext(ModalContext);
  if (!modal) {
    throw new Error('useConfirmDeletion must be used within ModalProvider');
  }

  const confirm = (itemName: string, onConfirm: () => void) => {
    modal.showModal({
      title: 'Удаление',
      body: `Вы точно хотите удалить ${itemName}?`,
      primaryText: 'Удалить',
      secondaryText: 'Отмена',
      primaryHandler: () => {
        modal.hideModal();
        onConfirm();
      },
      secondaryHandler: modal.hideModal,
    });
  };

  return confirm;
};
