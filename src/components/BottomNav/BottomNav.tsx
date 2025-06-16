import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './BottomNav.scss';
import { House, History, ChartNoAxesCombined, Settings2 } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!navRef.current) {
      return;
    }
    const activeLink = navRef.current.querySelector('.nav-item.active') as HTMLElement;
    if (activeLink) {
      setIndicatorStyle({
        left: activeLink.offsetLeft - 20,
        width: activeLink.offsetWidth + 40,
      });
    }
  }, [location]);

  return (
    <div className="bottom-nav-wrapper">
      <nav className="bottom-nav" ref={navRef}>
        <NavLink to="/home" className="nav-item">
          <House />
          <p>Главная</p>
        </NavLink>
        <NavLink to="/history" className="nav-item">
          <History />
          <p>История</p>
        </NavLink>
        <NavLink to="/analytics" className="nav-item">
          <ChartNoAxesCombined />
          <p>Аналитика</p>
        </NavLink>
        <NavLink to="/other" className="nav-item">
          <Settings2 />
          <p>Прочее</p>
        </NavLink>

        {/* Плашка индикатора */}
        <motion.div
          className="active-indicator"
          animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </nav>
    </div>
  );
};
