import React, { useRef, useState } from 'react';
import './AddCategoryPage.scss';
import { useNavigate } from 'react-router';
import { Input } from '../../components/Input/Input';
import { ActionButton } from '../../components/ActionButton/ActionButton';
import { ButtonSelector } from '../../components/ButtonSelector/ButtonSelector';
import { CategoryIcon } from '../../components/CategoryIcon/CategoryIcon';
import { IconPicker } from '../../components/IconPicker/IconPicker';
import { ColorPicker } from '../../components/ColorPicker/ColorPicker';
import provider from '../../services/provider';
import type { Option } from '../../components/ButtonSelector/ButtonSelector';
import type { TransactionType } from '../../services/types';
import { PASTEL_COLORS } from '../../constants/colors';
import rawIcons from '../../constants/categoryIcons.json';

const categoryIcons: string[] = rawIcons.map((icon) => icon.name);
type PastelColor = (typeof PASTEL_COLORS)[number];

const typeOptions: Option[] = [
  { value: 'income', label: 'Доход' },
  { value: 'expense', label: 'Расход' },
];

export const AddCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const inputRef = useRef<{ validate: () => boolean }>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [color, setColor] = useState<PastelColor>(PASTEL_COLORS[0]);
  const [iconName, setIconName] = useState(categoryIcons[0]);

  const handleSave = async () => {
    const isValid = inputRef.current?.validate();
    if (isValid) {
      await provider.addCategory({
        name,
        type,
        color,
        icon: iconName,
      });
      navigate('/categories');
    }
  };

  return (
    <>
      <h1 className="title">Новая категория</h1>
      <div className="preview-wrapper">
        <CategoryIcon
          name={name || 'Название'}
          color={color}
          iconName={iconName}
          showLabel={true}
        />
      </div>
      <div className="options-wrapper">
        <div className="option-wrapper">
          <h2 className="subtitle">Тип</h2>
          <ButtonSelector
            options={typeOptions}
            initialSelected={type}
            onSelect={(value) => setType(value as TransactionType)}
          />
        </div>

        <div className="option-wrapper">
          <h2 className="subtitle">Название</h2>
          <Input
            ref={inputRef}
            value={name}
            type="text"
            placeholder="Введите..."
            required={true}
            onChange={(value) => setName(value as string)}
          />
        </div>

        <div className="option-wrapper">
          <h2 className="subtitle">Цвет фона</h2>
          <ColorPicker<PastelColor>
            colors={PASTEL_COLORS}
            selectedColor={color}
            onSelect={setColor}
          />
        </div>

        <div className="option-wrapper">
          <h2 className="subtitle">Иконка</h2>
          <IconPicker
            icons={categoryIcons}
            selectedIcon={iconName}
            onSelect={setIconName}
            backgroundColor={'transparent'}
          />
        </div>

        <div className="option-wrapper">
          <ActionButton
            label="Создать"
            onClick={handleSave}
          />
        </div>
      </div>
    </>
  );
};
