import React from 'react';
import './ButtonSelector.scss';
export interface Option {
    value: string;
    label: string;
}
interface ButtonSelectorProps {
    options: Option[];
    onSelect?: (selectedValue: string) => void;
    initialSelected?: string;
    disabled?: boolean;
}
export declare const ButtonSelector: React.FC<ButtonSelectorProps>;
export {};
