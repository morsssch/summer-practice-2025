import React from 'react';
import './MinorButton.scss';
interface MinorButtonProps {
    label: string;
    to?: string;
    onClick?: () => void;
    className?: string;
}
export declare const MinorButton: React.FC<MinorButtonProps>;
export {};
