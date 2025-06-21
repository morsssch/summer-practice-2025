import React from 'react';
import { useLocation, Outlet } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { FabMenu } from '../components/FabMenu/FabMenu';
import { BottomNav } from '../components/BottomNav/BottomNav';
import './Layout.scss';

const Layout: React.FC = () => {
  const location = useLocation();
  const showFabMenu = location.pathname !== '/operations/new';

  return (
    <>
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            className="content-wrapper"
            key={location.pathname}
            initial={{ opacity: 0.5, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, ease: 'easeIn' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      {showFabMenu && <FabMenu />}
      <BottomNav />
    </>
  );
};

export default Layout;