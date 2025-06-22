import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
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

export const ButtonSelector: React.FC<ButtonSelectorProps> = ({
  options,
  onSelect,
  initialSelected,
  disabled = false,
}) => {
  const [selected, setSelected] = useState(initialSelected || options[0].value);
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {return;}

    const activeEl = container.querySelector(
      `[data-value="${selected}"]`,
    ) as HTMLElement | null;

    if (activeEl) {
      const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = activeEl;
      setIndicatorStyle({
        left: offsetLeft,
        top: offsetTop,
        width: offsetWidth,
        height: offsetHeight,
      });
    }
  }, [selected, options]);

  const handleClick = (value: string) => {
    if (disabled) {return;}
    setSelected(value);
    onSelect?.(value);
  };

  return (
    <div
      className={`button-selector ${disabled ? 'disabled' : ''}`}
      ref={containerRef}
    >
      {options.map(({ value, label }) => (
        <button
          key={value}
          data-value={value}
          onClick={() => handleClick(value)}
          className={`selector-button ${selected === value ? 'active' : ''}`}
          disabled={disabled}
        >
          <span className="button-content">{label}</span>
        </button>
      ))}

      {indicatorStyle && (
        <motion.div
          className="selector-indicator"
          initial={false}
          animate={{
            left: indicatorStyle.left,
            top: indicatorStyle.top,
            width: indicatorStyle.width,
            height: indicatorStyle.height,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </div>
  );
};
