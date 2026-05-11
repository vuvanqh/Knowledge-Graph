import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Bell, Database, Key } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Card, Button, Input } from '../components/ui';
import { useToast } from '../hooks/useToast';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast('Settings saved successfully', 'success');
    }, 800);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'data', label: 'Data Management', icon: <Database size={18} /> },
    { id: 'api', label: 'API Keys', icon: <Key size={18} /> },
  ];

  return (
    <div className="settings-container">
      <motion.div 
        className="settings-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-gradient">Settings</h1>
        <p>Manage your account and platform preferences</p>
      </motion.div>

      <div className="settings-layout">
        <motion.div 
          className="settings-sidebar-wrapper"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card glass className="settings-sidebar">
            <nav className="settings-nav">
              {tabs.map(tab => (
                <button 
                  key={tab.id}
                  className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon} {tab.label}
                  {activeTab === tab.id && (
                    <motion.div className="tab-indicator" layoutId="tab-indicator" />
                  )}
                </button>
              ))}
            </nav>
          </Card>
        </motion.div>

        <motion.div 
          className="settings-content-wrapper"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card glass className="settings-content">
            {activeTab === 'profile' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="settings-section">
                  <h2>Profile Information</h2>
                  <div className="profile-details">
                    <div className="avatar-upload">
                      <div className="avatar-placeholder">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                        <div className="avatar-glow" />
                      </div>
                      <Button variant="secondary">Change Avatar</Button>
                    </div>
                    
                    <div className="form-group-row">
                      <Input 
                        label="Username" 
                        defaultValue={user?.username || ''} 
                        icon={<User size={18} />}
                      />
                      <Input 
                        label="Email Address" 
                        type="email" 
                        defaultValue={`${user?.username || 'user'}@example.com`} 
                        icon={<User size={18} />}
                      />
                    </div>
                  </div>
                </div>

                <div className="settings-divider"></div>

                <div className="settings-section">
                  <h2>System Preferences</h2>
                  <div className="preferences-list">
                    <div className="preference-item">
                      <div className="pref-info">
                        <h4>Dark Mode</h4>
                        <p>Use the dark theme across the application</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="preference-item">
                      <div className="pref-info">
                        <h4>Auto-Process Documents</h4>
                        <p>Automatically start ingestion pipeline when files are uploaded</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="settings-actions">
                  <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
                    Save Changes
                  </Button>
                </div>
              </motion.div>
            )}
            
            {activeTab !== 'profile' && (
              <motion.div 
                className="settings-placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p>Configuration options for {tabs.find(t => t.id === activeTab)?.label} will appear here.</p>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
