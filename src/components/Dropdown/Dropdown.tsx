import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

export const Dropdown: React.FC<DropdownProps> = (props) => {
  const {
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    disabled = false,
    searchable = false,
    multiSelect = false,
    label,
    error,
    className = '',
    required = false,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValues, setSelectedValues] = useState<(string | number)[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value === undefined) {
      setSelectedValues([]);
      return;
    }

    if (multiSelect) {
      if (Array.isArray(value)) {
        setSelectedValues(value);
      } else {
        console.error(
          'Для множественного выбора значение должно быть массивом',
        );
        setSelectedValues([]);
      }
    } else {
      if (typeof value === 'string' || typeof value === 'number') {
        setSelectedValues([value]);
      } else {
        console.error(
          'Для одиночного выбора, значение может быть строкой или числом',
        );
        setSelectedValues([]);
      }
    }
  }, [value, multiSelect]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (isOpen) {
        setSearchTerm('');
      }
    }
  };

  const handleSelect = (optionValue: string | number) => {
    if (multiSelect) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];

      setSelectedValues(newValues);
      if (onChange) {
        (onChange as (value: (string | number)[]) => void)(newValues);
      }
    } else {
      setSelectedValues([optionValue]);
      if (onChange) {
        (onChange as (value: string | number) => void)(optionValue);
      }
      setIsOpen(false);
    }
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }

    if (multiSelect) {
      if (selectedValues.length > 2) {
        return `${selectedValues.length} selected`;
      }
      return options
        .filter((option) => selectedValues.includes(option.value))
        .map((option) => option.label)
        .join(', ');
    }

    return (
      options.find((option) => option.value === selectedValues[0])?.label ||
      placeholder
    );
  };

  const removeSelected = (
    optionValue: string | number,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    const newValues = selectedValues.filter((v) => v !== optionValue);
    setSelectedValues(newValues);
    if (multiSelect && onChange) {
      (onChange as (value: (string | number)[]) => void)(newValues);
    } else if (onChange) {
      (onChange as (value: string | number) => void)('');
    }
  };

  return (
    <div
      className={`dropdown-container ${className} ${disabled ? 'disabled' : ''}`}
      ref={dropdownRef}
    >
      {label && (
        <label className="dropdown-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}

      <div
        className={`dropdown-header ${isOpen ? 'open' : ''} ${error ? 'error' : ''}`}
        onClick={toggleDropdown}
      >
        <div className="dropdown-selected">
          {multiSelect && selectedValues.length > 0 ? (
            <div className="selected-tags">
              {options
                .filter((option) => selectedValues.includes(option.value))
                .slice(0, 2)
                .map((option) => (
                  <div
                    key={option.value}
                    className="selected-tag"
                  >
                    {option.label}
                    <button
                      type="button"
                      className="remove-tag"
                      onClick={(e) => removeSelected(option.value, e)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              {selectedValues.length > 2 && (
                <div className="selected-tag more">
                  +{selectedValues.length - 2}
                </div>
              )}
            </div>
          ) : (
            getDisplayText()
          )}
        </div>
        <div className="dropdown-arrow">
          <motion.svg
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </motion.svg>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="dropdown-list"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {searchable && (
              <div className="dropdown-search">
                <input
                  type="text"
                  placeholder="Введите..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
            )}

            <div className="dropdown-options">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`dropdown-option ${
                      selectedValues.includes(option.value) ? 'selected' : ''
                    } ${option.disabled ? 'disabled' : ''}`}
                    onClick={() =>
                      !option.disabled && handleSelect(option.value)
                    }
                  >
                    {multiSelect && (
                      <input
                        type="checkbox"
                        checked={selectedValues.includes(option.value)}
                        readOnly
                        className="option-checkbox"
                      />
                    )}
                    {option.label}
                  </div>
                ))
              ) : (
                <div className="dropdown-no-options">Ничего не найдено</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <div className="dropdown-error">{error}</div>}
    </div>
  );
};
