import React from 'react';
import './Input.scss';
type InputType = 'text' | 'number' | 'email' | 'password' | 'date' | 'tel' | 'url' | 'textarea';
interface InputProps {
    type?: InputType;
    value: string | number;
    onChange: (value: string | number) => void;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    min?: number;
    max?: number;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    errorMessage?: string;
    className?: string;
    autoFocus?: boolean;
    rows?: number;
}
interface InputRef {
    validate: () => boolean;
}
export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<InputRef>>;
export {};
