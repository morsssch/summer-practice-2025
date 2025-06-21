import React from 'react';
import './CategoryIcon.scss';
import * as Icons from 'lucide-react';
import darkenColor from '../../utils/darkenColor';

interface CategoryIconProps {
  name: string;
  color: string;
  iconName: string;
  showLabel?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  name,
  color,
  iconName,
  showLabel = true,
  isActive = false,
  onClick,
}) => {
  const Icon = Icons[iconName] || Icons.Wallet;
  const iconColor = darkenColor(color, 0.6);

  return (
    <div
      className={`category-icon-container ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div
        className="icon-wrapper"
        style={{ backgroundColor: color }}
      >
        <Icon
          size={24}
          color={iconColor}
        />
      </div>
      {showLabel && <span className="category-name">{name || 'Category'}</span>}
    </div>
  );
};
