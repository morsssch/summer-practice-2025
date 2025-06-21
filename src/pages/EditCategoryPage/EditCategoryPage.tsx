import React, { useEffect, useRef, useState } from 'react';
import './EditCategoryPage.scss';
import { useNavigate, useParams } from 'react-router';
import { useConfirmDeletion } from '../../HOC/useConfirmDeletion';
import type { Category, TransactionType } from '../../services/types';
import { PASTEL_COLORS } from '../../constants/colors';
import rawIcons from '../../constants/categoryIcons.json';

import { Input } from '../../components/Input/Input';
import { ActionButton } from '../../components/ActionButton/ActionButton';
import { ButtonSelector } from '../../components/ButtonSelector/ButtonSelector';
import { CategoryIcon } from '../../components/CategoryIcon/CategoryIcon';
import { IconPicker } from '../../components/IconPicker/IconPicker';
import { ColorPicker } from '../../components/ColorPicker/ColorPicker';
import provider from '../../services/provider';
import type { Option } from '../../components/ButtonSelector/ButtonSelector';

const categoryIcons: string[] = rawIcons.map((icon) => icon.name);

const typeOptions: Option[] = [
  { value: 'income', label: 'Доход' },
  { value: 'expense', label: 'Расход' },
];

export const EditCategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const inputRef = useRef<{ validate: () => boolean }>(null);
  const confirmDeletion = useConfirmDeletion();

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [color, setColor] = useState<string>(PASTEL_COLORS[0]);
  const [iconName, setIconName] = useState(categoryIcons[0]);

  useEffect(() => {
    const fetchCategory = async () => {
      const categories = await provider.getCategories();
      const found = categories.find((a) => a.id === id);

      if (!found) {
        navigate('/settings/categories');
        return;
      }

      setCategory(found);
      setName(found.name);
      setType(found.type);
      setColor(found.color);
      setIconName(found.icon);
      setLoading(false);
    };
    fetchCategory();
  }, [id, navigate]);

  const handleSaveClick = () => {
    const isValid = inputRef.current?.validate();
    if (isValid) {
      handleSave();
    }
  };

  const handleSave = async () => {
    if (!category) {
      return;
    }
    await provider.updateCategory({
      ...category,
      name,
      type,
      color,
      icon: iconName,
    });
    navigate('/settings/categories');
  };

  const handleDelete = () => {
    if (!category) {
      return;
    }

    confirmDeletion(`категорию «${category.name}»`, async () => {
      await provider.deleteCategory(category.id);
      navigate('/settings/categories');
    });
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <>
      <h1 className="title">Настройка категории</h1>
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
          <ColorPicker
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
            label="Сохранить"
            onClick={handleSaveClick}
          />
          <ActionButton
            label="Удалить"
            onClick={handleDelete}
            danger={true}
          />
        </div>
      </div>
    </>
  );
};
