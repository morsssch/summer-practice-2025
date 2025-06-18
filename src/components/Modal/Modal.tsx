import React from 'react';
import type { ModalConfigI } from '../../HOC/ModalProvider';
import { useModal } from '../../utils/useModal';
import './modal.scss';
import { iconMap } from '../../utils/iconMap';

type ModalPropsI = ModalConfigI;

export const Modal = React.forwardRef<HTMLDialogElement, ModalPropsI>(
  
  (props, ref) => {
    const { hideModal } = useModal();
    const {
      body,
      title,
      icon,
      primaryText = 'Продолжить',
      secondaryText = 'Закрыть',
      overrideContent,
      primaryHandler = hideModal,
      secondaryHandler = hideModal,
    } = props;

    return (
      <dialog
        className="modal"
        ref={ref}
      >
        <div className="modal__content">
          {overrideContent ? (
            React.cloneElement(overrideContent, { closeHandler: hideModal })
          ) : (
            <>
            </>
          )}
        </div>
      </dialog>
    );
  },
);
