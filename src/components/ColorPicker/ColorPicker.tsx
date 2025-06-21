import React from 'react';
import './ColorPicker.scss';

interface ColorPickerProps<T extends string> {
  colors: readonly T[]; // Поддерживает readonly массивы
  selectedColor: T;
  onSelect: (color: T) => void;
}

export const ColorPicker = <T extends string>({
  colors,
  selectedColor,
  onSelect,
}: ColorPickerProps<T>) => {
  return (
    <div className="color-picker-grid">
      {colors.map((color) => (
        <button
          key={color}
          className={`color-picker-button ${selectedColor === color ? 'selected' : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => onSelect(color)}
        />
      ))}
    </div>
  );
};
