import React from 'react';
import './Header.scss';
import { ProfileButton } from '../ProfileButton/ProfileButton';
import { NotificationsButton } from '../NotificationsButton/NotificationsButton';

interface HeaderProps {
  name: string;
}

export const Header: React.FC<HeaderProps> = ({ name }) => {
  return (
    <div className="header">
      <div className="profile-wrapper">
        <ProfileButton />
        <p>
          С возвращением, <br /> {name}
        </p>
      </div>
      <NotificationsButton count={4}/>
    </div>
  );
};

export default Header;
