import React from 'react';
import './ui.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  ref?: React.Ref<HTMLInputElement>;
}

export function Input({ className = '', label, error, icon, ref, ...props }: InputProps) {
  return (
    <div className="input-container">
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        {icon && <div className="input-icon">{icon}</div>}
        <input
          ref={ref}
          className={`input-field ${icon ? 'has-icon' : ''} ${error ? 'has-error' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
}
