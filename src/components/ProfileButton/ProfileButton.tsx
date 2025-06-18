import React from 'react';
import './ProfileButton.scss';
import { NavLink } from 'react-router-dom';
import { User } from 'lucide-react';

export const ProfileButton: React.FC = () => {
  return (
    <NavLink
      to={'/profile'}
      className="profile"
    >
      <User />
    </NavLink>
  );
};
