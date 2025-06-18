import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './BottomNav.scss';
import { House, History, ChartNoAxesCombined, Settings2 } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const navItems = [
    { to: '/home', icon: <House />, label: 'Главная' },
    { to: '/history', icon: <History />, label: 'История' },
    { to: '/analytics', icon: <ChartNoAxesCombined />, label: 'Аналитика' },
    { to: '/other', icon: <Settings2 />, label: 'Прочее' },
  ];

  useEffect(() => {
    if (!navRef.current) {return;}

    const activeWrapper = navRef.current.querySelector(
      `.nav-item-wrapper[data-path="${location.pathname}"]`,
    ) as HTMLElement;

    if (activeWrapper) {
      setIndicatorStyle({
        left: activeWrapper.offsetLeft - 1,
        width: activeWrapper.offsetWidth + 1,
      });
    }
  }, [location]);

  return (
    <div className="bottom-nav-wrapper">
      <nav
        className="bottom-nav"
        ref={navRef}
      >
        {navItems.map(({ to, icon, label }) => {
          const isActive = location.pathname === to;

          return (
            <NavLink
              key={to}
              to={to}
              className={`nav-item-wrapper${isActive ? ' active' : ''}`}
              data-path={to}
            >
              <div
                className='nav-item'
              >
                {icon}
                <p>{label}</p>
              </div>
            </NavLink>
          );
        })}

        <motion.div
          className="active-indicator"
          animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </nav>
    </div>
  );
};
