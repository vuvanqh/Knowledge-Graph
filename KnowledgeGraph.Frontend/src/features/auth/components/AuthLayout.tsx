import React from 'react';
import { motion } from 'framer-motion';
import { Network } from 'lucide-react';
import { Card } from '../../../components/ui';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="login-container">
      <div className="login-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="login-grid"></div>
      </div>
      
      <motion.div 
        className="login-card-wrapper"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', damping: 25 }}
      >
        <Card glass glow className="login-card">
          <div className="login-header">
            <div className="logo-icon-large">
              <Network size={36} className="logo-svg" />
              <div className="logo-glow"></div>
            </div>
            <h1 className="text-gradient">{title}</h1>
            <p>{subtitle}</p>
          </div>
          {children}
        </Card>
      </motion.div>
    </div>
  );
};
