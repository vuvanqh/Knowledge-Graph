import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Bell, Search, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header glass-panel">
      <div className="header-search">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Quick search..." className="search-input" />
      </div>
      
      <div className="header-actions">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>
        
        <div className="user-menu">
          <div className="user-info">
            <span className="user-name">{user?.username || 'Guest'}</span>
          </div>
          <button className="icon-btn" onClick={logout} title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
