import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import type { ChangeEvent, FocusEvent } from 'react';
import './Input.scss';

type InputType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'date'
  | 'tel'
  | 'url'
  | 'textarea';

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

export const Input = forwardRef<InputRef, InputProps>(
  (
    {
      type = 'text',
      value,
      onChange,
      label,
      placeholder,
      required = false,
      disabled = false,
      min,
      max,
      maxLength,
      minLength,
      pattern,
      errorMessage = 'Недопустимое значение',
      className = '',
      autoFocus = false,
      rows = 4, // Дефолтное количество строк для textarea
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState<string>(String(value));
    const [isValid, setIsValid] = useState<boolean>(true);
    const [isTouched, setIsTouched] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
      setInternalValue(String(value));
      validateInput(parseValue(String(value)));
    }, [value]);

    const parseValue = (val: string): string | number => {
      if (type === 'number') {
        const num = parseFloat(val);
        return isNaN(num) ? '' : num;
      }
      return val;
    };

    const validateInput = (val: string | number): boolean => {
      const strVal = String(val);

      if (required && !strVal.trim()) {
        setError('Это поле обязательно');
        return false;
      }

      if (minLength && strVal.length < minLength) {
        setError(`Минимальная длина: ${minLength}`);
        return false;
      }

      if (maxLength && strVal.length > maxLength) {
        setError(`Максимальная длина: ${maxLength}`);
        return false;
      }

      if (
        type === 'email' &&
        strVal &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strVal)
      ) {
        setError('Введите корректную электронную почту');
        return false;
      }

      if (
        type === 'url' &&
        strVal &&
        !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
          strVal,
        )
      ) {
        setError('Введите корректный URL');
        return false;
      }

      if (type === 'number' && typeof val === 'number') {
        if (min !== undefined && val < min) {
          setError(`Минимальное значение: ${min}`);
          return false;
        }
        if (max !== undefined && val > max) {
          setError(`Максимальное значение: ${max}`);
          return false;
        }
      }

      if (pattern && strVal && !new RegExp(pattern).test(strVal)) {
        setError(errorMessage);
        return false;
      }

      setError('');
      return true;
    };

    const handleChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      const newValue = e.target.value;

      if (type === 'number') {
        // Разрешаем только цифры, точку и минус
        if (newValue && !/^-?\d*\.?\d*$/.test(newValue)) {
          return;
        }
      }

      setInternalValue(newValue);
      const parsedValue = parseValue(newValue);
      const valid = validateInput(parsedValue);
      setIsValid(valid);
      setIsTouched(true);

      if (valid || !isTouched) {
        onChange(parsedValue);
      }
    };

    const handleBlur = (
      e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setIsTouched(true);
      const parsedValue = parseValue(internalValue);
      const valid = validateInput(parsedValue);
      setIsValid(valid);
    };

    useImperativeHandle(ref, () => ({
      validate: () => {
        setIsTouched(true);
        const parsedValue = parseValue(internalValue);
        const valid = validateInput(parsedValue);
        setIsValid(valid);
        return valid;
      },
    }));

    const inputProps = {
      value: internalValue,
      onChange: handleChange,
      onBlur: handleBlur,
      placeholder,
      disabled,
      required,
      autoFocus,
      maxLength,
      minLength,
      pattern,
      className: `input-field ${!isValid && isTouched ? 'invalid' : ''}`,
    };

    return (
      <div className={`input-container ${className}`}>
        {label && (
          <label className="input-label">
            {label}
            {required && <span>*</span>}
          </label>
        )}
        {type === 'textarea' ? (
          <textarea
            {...inputProps}
            rows={rows}
            className={`input-field textarea ${!isValid && isTouched ? 'invalid' : ''}`}
          />
        ) : (
          <input
            type={type === 'number' ? 'text' : type}
            {...inputProps}
          />
        )}
        {!isValid && isTouched && <div className="input-error">{error}</div>}
      </div>
    );
  },
);
