import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import './ui.css';

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
  children?: React.ReactNode;
  disabled?: boolean;
}

export function Button({ className = '', variant = 'primary', size = 'md', isLoading, icon, children, disabled, ref, ...props }: ButtonProps) {
  const baseClasses = 'btn-base';
  const variantClasses = `btn-${variant}`;
  const sizeClasses = `btn-${size}`;
  
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="mr-2">
           <div className="btn-spinner" />
        </span>
      )}
      {!isLoading && icon && <span className="mr-2 btn-icon">{icon}</span>}
      {children}
    </motion.button>
  );
}


