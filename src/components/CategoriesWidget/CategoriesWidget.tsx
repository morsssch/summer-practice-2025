import React from 'react';
import './CategoriesWidget.scss';
import { useNavigate } from 'react-router';
import { CategoryIcon } from '../CategoryIcon/CategoryIcon';
import type { TransactionType } from '../../services/types';

interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
}

interface CategoriesWidgetProps {
  mode: 'edit' | 'select';
  type: TransactionType;
  categories: Category[];
  selectedCategoryId?: string;
  onSelect?: (categoryId: string) => void;
  disabled?: boolean;
}

export const CategoriesWidget: React.FC<CategoriesWidgetProps> = ({
  mode,
  type,
  categories,
  selectedCategoryId,
  onSelect,
  disabled = false,
}) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: Category) => {
    if (mode === 'edit') {
      navigate(`/settings/categories/${category.id}/edit`);
    } else if (mode === 'select' && onSelect) {
      onSelect(category.id);
    }
  };

  const filteredCategories = categories.filter((cat) => cat.type === type);

  if (filteredCategories.length === 0) {
    return (
      <p className="empty-placeholder">
        У вас ещё не создано ни одной категории
      </p>
    );
  }

  return (
    <div className={`categories-widget-grid ${disabled ? 'disabled' : ''}`}>
      {filteredCategories.map((category) => (
        <CategoryIcon
          key={category.id}
          name={category.name}
          color={category.color}
          iconName={category.icon}
          showLabel={true}
          isActive={mode === 'select' && selectedCategoryId === category.id}
          onClick={() => handleCategoryClick(category)}
        />
      ))}
    </div>
  );
};
