import React from 'react';
import './NotificationsButton.scss';
import { NavLink } from 'react-router-dom';
import { Bell } from 'lucide-react';

interface NotificationsButtonProps {
  count?: number;
}

export const NotificationsButton: React.FC<NotificationsButtonProps> = ({
  count,
}) => {
  const showCount = Number.isInteger(count) && count! > 0;

  return (
    <NavLink
      to="/notifications"
      className="notifications"
    >
      <Bell />
      {showCount && <span className="notifications-count">{count}</span>}
    </NavLink>
  );
};
