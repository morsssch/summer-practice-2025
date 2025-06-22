import React from 'react';
import './ActionButton.scss';
import { NavLink } from 'react-router';
import type { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  label: string;
  icon?: LucideIcon;
  to?: string;
  onClick?: () => void;
  className?: string;
  danger?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  icon: Icon,
  to,
  onClick,
  danger,
  className = danger ? 'action-button danger' : 'action-button',
}) => {
  const content = (
    <>
      {label}
      {Icon && <Icon size={18} />}
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
