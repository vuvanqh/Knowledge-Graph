import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, ArrowRight } from 'lucide-react';
import { Button, Input } from '../../../components/ui';

interface AuthFormProps {
  mode: 'login' | 'register';
  isLoading: boolean;
  error: string;
  onClearError: () => void;
  onSubmit: (credentials: Record<string, string>) => void;
  onToggleMode: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, isLoading, error, onClearError, onSubmit, onToggleMode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isRegistering = mode === 'register';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      if (password !== confirmPassword) {
        onSubmit({ username, password, confirmPassword });
      } else {
        onSubmit({ username, password, confirmPassword });
      }
    } else {
      onSubmit({ username, password });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <AnimatePresence>
        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      
      <Input 
        label="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
        icon={<User size={18} />}
        required
      />
      
      <Input 
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        icon={<Lock size={18} />}
        required
      />

      <AnimatePresence>
        {isRegistering && (
          <motion.div
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
          >
            <Input 
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              icon={<Lock size={18} />}
              required={isRegistering}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="login-actions">
        <Button 
          type="submit" 
          variant="primary" 
          className="login-btn" 
          isLoading={isLoading}
          disabled={isLoading}
        >
          {!isLoading && (
            <>
              {isRegistering ? 'Create Account' : 'Sign In'} <ArrowRight size={18} />
            </>
          )}
        </Button>
      </div>
      
      <div className="login-footer">
        <p>
          {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
          <button 
            type="button" 
            className="link" 
            onClick={() => {
              onToggleMode();
              onClearError();
            }}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}
          >
            {isRegistering ? 'Sign In' : 'Register'}
          </button>
        </p>
      </div>
    </form>
  );
};
