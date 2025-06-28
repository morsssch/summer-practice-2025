import React from 'react';
import './DatePicker.scss';
type DatePickerType = 'single' | 'range';
export interface DatePickerProps {
    type?: DatePickerType;
    value: string | [string, string] | null;
    onChange: (value: string | [string, string] | null) => void;
    label?: string;
    placeholder?: string | [string, string];
    required?: boolean;
    disabled?: boolean;
    minDate?: Date;
    maxDate?: Date;
    className?: string;
    autoFocus?: boolean;
    dateFormat?: string;
    errorMessage?: string;
    weekStart?: 0 | 1;
    withTime?: boolean;
}
export interface DatePickerRef {
    validate: () => boolean;
    focus: () => void;
}
declare const DatePicker: React.ForwardRefExoticComponent<DatePickerProps & React.RefAttributes<DatePickerRef>>;
export default DatePicker;
