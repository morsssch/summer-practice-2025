import React from 'react';
import './MinorButton.scss';
import { NavLink } from 'react-router';
import { ArrowUpRight } from 'lucide-react';

interface MinorButtonProps {
  label: string;
  to?: string;
  onClick?: () => void;
  className?: string;
}

export const MinorButton: React.FC<MinorButtonProps> = ({
  label,
  to,
  onClick,
  className = 'minor-button',
}) => {
  const content = (
    <>
      {label}
      <ArrowUpRight size={16}/>
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
