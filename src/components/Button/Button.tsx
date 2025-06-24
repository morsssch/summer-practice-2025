import React from 'react';
import './Button.scss';
import { NavLink } from 'react-router';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps {
  label: string;
  icon?: LucideIcon;
  to?: string;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  icon: Icon,
  to,
  onClick,
  className = 'button'
}) => {
  const content = (
    <>
      {Icon && <Icon size={18} />}
      {label}
    </>
  );

  if (to) {
    return (
      <NavLink
        to={to}
        className={className}
      >
        {content}
      </NavLink>
    );
  }

  return (
    <button
      onClick={onClick}
      className={className}
    >
      {content}
    </button>
  );
};
