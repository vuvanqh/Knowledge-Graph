import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout: React.FC = () => {
  return (
    <div className="layout-container">
      <div className="bg-noise" />
      <div className="bg-grid" />
      
      <Sidebar />
      <div className="main-content-wrapper z-10">
        <Header />

        <main className="main-content">
          <Outlet />
        </main>
      </div>
      
    </div>
  );
};

export default MainLayout;
