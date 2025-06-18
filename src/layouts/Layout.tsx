import React from 'react';
import { useLocation, Outlet } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { FabMenu } from '../components/FabMenu/FabMenu';
import { BottomNav } from '../components/BottomNav/BottomNav';
import './Layout.scss';

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            className="content-wrapper"
            key={location.pathname}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ width: '100%' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <FabMenu />
      <BottomNav />
    </>
  );
};

export default Layout;
