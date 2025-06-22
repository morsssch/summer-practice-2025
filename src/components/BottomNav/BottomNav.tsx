import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router';
import { motion } from 'framer-motion';
import './BottomNav.scss';
import { House, History, ChartNoAxesCombined, Settings2 } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
  } | null>(null);

  const navItems = [
    { to: '/home', icon: <House />, label: 'Главная' },
    { to: '/operations', icon: <History />, label: 'История' },
    { to: '/analytics', icon: <ChartNoAxesCombined />, label: 'Аналитика' },
    { to: '/other', icon: <Settings2 />, label: 'Прочее' },
  ];
  
  useEffect(() => {
    if (!navRef.current) {
      return;
    }

    const isValidPath = navItems.some((item) => item.to === location.pathname);
    if (!isValidPath) {
      setIndicatorStyle(null);
      return;
    }

    const activeWrapper = navRef.current.querySelector(
      `.nav-item-wrapper[data-path="${location.pathname}"]`,
    ) as HTMLElement;

    if (activeWrapper) {
      setIndicatorStyle({
        left: activeWrapper.offsetLeft - 2,
        width: activeWrapper.offsetWidth + 4,
      });
    }
  }, [location.pathname]);

  return (
    <div className="bottom-nav-wrapper">
      <nav
        className="bottom-nav"
        ref={navRef}
      >
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end 
            className={({ isActive }) =>
              `nav-item-wrapper${isActive ? ' active' : ''}`
            }
            data-path={to}
          >
            <div className="nav-item">
              {icon}
              <p>{label}</p>
            </div>
          </NavLink>
        ))}

        {indicatorStyle && (
          <motion.div
            className="active-indicator"
            initial={false}
            animate={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
              opacity: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </nav>
    </div>
  );
};
