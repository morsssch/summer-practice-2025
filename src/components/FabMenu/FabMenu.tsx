import React, { useState } from 'react';
import './FabMenu.scss';
import { AudioLines, CornerDownRight, PencilLine, Plus } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const FabMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const buttons = [
    { to: '/', label: 'Классическое добавление —', icon: <CornerDownRight /> },
    { to: '/', label: 'Записать операцию текстом —', icon: <PencilLine /> },
    { to: '/', label: 'Надиктовать операцию —', icon: <AudioLines /> },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fab-overlay"
            onClick={toggleMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <div className="fab-container">
        <AnimatePresence>
          {isOpen &&
            buttons.map((btn, i) => (
              <motion.div
                className="fab-button-wrapper"
                key={i}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -i * 58 }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <span className="fab-label">{btn.label}</span>
                <NavLink
                  className="fab-button"
                  to={btn.to}
                  onClick={toggleMenu}
                >
                  {btn.icon}
                </NavLink>
              </motion.div>
            ))}
        </AnimatePresence>

        <button
          className="fab-button"
          onClick={toggleMenu}
        >
          <Plus />
        </button>
      </div>
    </>
  );
};
