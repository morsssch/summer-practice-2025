import React from 'react';
import './IconPicker.scss';
interface IconPickerProps {
    icons: string[];
    selectedIcon: string;
    onSelect: (icon: string) => void;
    backgroundColor?: string;
}
export declare const IconPicker: React.FC<IconPickerProps>;
export {};
