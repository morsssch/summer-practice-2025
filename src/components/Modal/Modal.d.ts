import type { ModalConfigI } from '../../HOC/ModalProvider';
import './modal.scss';
interface ModalPropsI extends ModalConfigI {
    buttonsConfig?: 'primaryOnly' | 'primaryAndSecondary';
}
export declare const Modal: (props: ModalPropsI) => import("react/jsx-runtime").JSX.Element;
export {};
