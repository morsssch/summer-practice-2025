import React from 'react';
import './Dropdown.scss';
interface DropdownOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}
interface BaseDropdownProps {
    options: DropdownOption[];
    placeholder?: string;
    disabled?: boolean;
    searchable?: boolean;
    label?: string;
    error?: string;
    className?: string;
    required?: boolean;
}
interface SingleSelectDropdownProps extends BaseDropdownProps {
    multiSelect?: false;
    value?: string | number;
    onChange?: (value: string | number) => void;
}
interface MultiSelectDropdownProps extends BaseDropdownProps {
    multiSelect: true;
    value?: (string | number)[];
    onChange?: (value: (string | number)[]) => void;
}
type DropdownProps = SingleSelectDropdownProps | MultiSelectDropdownProps;
export declare const Dropdown: React.FC<DropdownProps>;
export {};
