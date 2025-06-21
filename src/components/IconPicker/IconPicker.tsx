import React from 'react';
import './IconPicker.scss';
import { CategoryIcon } from '../CategoryIcon/CategoryIcon';

interface IconPickerProps {
  icons: string[];
  selectedIcon: string;
  onSelect: (icon: string) => void;
  backgroundColor?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  icons,
  selectedIcon,
  onSelect,
  backgroundColor = '#f0f0f0',
}) => {
  return (
    <div className="icon-picker-grid">
      {icons.map((icon) => (
        <button
          key={icon}
          className={`icon-picker-button ${selectedIcon === icon ? 'selected' : ''}`}
          onClick={() => onSelect(icon)}
        >
          <CategoryIcon
            name=""
            color={backgroundColor}
            iconName={icon}
            showLabel={false}
          />
        </button>
      ))}
    </div>
  );
};
