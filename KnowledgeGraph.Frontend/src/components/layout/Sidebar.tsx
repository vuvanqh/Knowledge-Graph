import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Network, FileText, Search, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Knowledge Graph', path: '/graph', icon: <Network size={20} /> },
    { name: 'AI Search', path: '/search', icon: <Search size={20} /> },
    { name: 'Documents', path: '/documents', icon: <FileText size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="sidebar glass-panel">

      <div className="sidebar-header">
        <div className="logo-icon">
          <Network size={24} color="var(--accent-primary)" />
        </div>
        <h2>Synapse</h2>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>

            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="activeNavIndicator" 
                    className="nav-indicator" 
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </>
            )}

          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="version-tag">v1.0.0-beta</div>
      </div>
      
    </aside>
  );
};

export default Sidebar;
