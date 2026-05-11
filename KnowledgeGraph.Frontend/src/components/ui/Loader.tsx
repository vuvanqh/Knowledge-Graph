import React from 'react';
import './ui.css';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', className = '', fullScreen = false }) => {
  const loader = (
    <div className={`loader-container ${className}`}>
      <div className={`loader-spinner loader-${size}`} />
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loader}
      </div>
    );
  }

  return loader;
};
