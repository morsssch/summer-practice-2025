import React from 'react';
import { Outlet } from 'react-router';
import { BottomNav } from '../components/BottomNav';

const Layout: React.FC = () => {
  return (
    <>
      <main>
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
};

export default Layout;
