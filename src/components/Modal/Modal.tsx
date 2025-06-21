import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ModalConfigI } from '../../HOC/ModalProvider';
import { useModal } from '../../utils/useModal';
import './modal.scss';
import { iconMap } from '../../utils/iconMap';
import { ActionButton } from '../ActionButton/ActionButton';

interface ModalPropsI extends ModalConfigI {
  buttonsConfig?: 'primaryOnly' | 'primaryAndSecondary';
}

export const Modal = (props: ModalPropsI) => {
  const { hideModal } = useModal();
  const {
    body,
    title,
    icon,
    primaryText = 'Продолжить',
    secondaryText = 'Отмена',
    overrideContent,
    primaryHandler = hideModal,
    secondaryHandler = hideModal,
    closeOutside = true,
    buttonsConfig = 'primaryAndSecondary',
  } = props;

  const backdropRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOutside && e.target === backdropRef.current) {
      hideModal();
    }
  };

  useEffect(() => {
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        hideModal();
      }
    };
    window.addEventListener('keydown', escHandler);
    return () => window.removeEventListener('keydown', escHandler);
  }, [hideModal]);

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        ref={backdropRef}
        onMouseDown={handleOutsideClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="modal"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <div className="modal__content">
            {overrideContent ? (
              React.cloneElement(overrideContent, { closeHandler: hideModal })
            ) : (
              <>
                {icon && <div className="modal__icon">{iconMap[icon]}</div>}
                {title && <h2 className="modal__title">{title}</h2>}
                {body && <p className="modal__body">{body}</p>}

                <div className="modal__actions">
                  {buttonsConfig === 'primaryAndSecondary' && (
                    <ActionButton
                      label={secondaryText}
                      onClick={secondaryHandler}
                    />
                  )}
                  <ActionButton
                    label={primaryText}
                    onClick={primaryHandler}
                    danger={buttonsConfig === 'primaryAndSecondary'}
                  />
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
