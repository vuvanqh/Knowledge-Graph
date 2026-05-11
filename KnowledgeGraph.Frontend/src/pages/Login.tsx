import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { useRegister } from '../hooks/useRegister';
import { AuthLayout } from '../features/auth/components/AuthLayout';
import { AuthForm } from '../features/auth/components/AuthForm';
import { useToast } from '../hooks/useToast';

const Login: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const { mutateAsync: login, isPending: isLoggingIn } = useLogin();
  const { mutateAsync: register, isPending: isRegisteringAction } = useRegister();

  const isLoading = isLoggingIn || isRegisteringAction;

  const handleSubmit = async (credentials: Record<string, string>) => {
    setError('');
    
    if (isRegistering && credentials.password !== credentials.confirmPassword) {
      const errorMsg = 'Passwords do not match.';
      setError(errorMsg);
      addToast(errorMsg, 'error');
      return;
    }

    try {
      if (isRegistering) {
        await register(credentials);
        addToast('Registration successful! Logging you in...', 'success');
        await login(credentials); // Auto-login after registration
      } else {
        await login(credentials);
        addToast('Welcome back!', 'success');
      }
      navigate('/');
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string, errors?: Record<string, string[]> } } };
      let errorMessage = 'An error occurred';
      
      if (errorObj?.response?.data?.errors) {
        const errors = errorObj.response.data.errors;
        const firstErrorKey = Object.keys(errors)[0];
        errorMessage = errors[firstErrorKey][0];
      } else if (errorObj?.response?.data?.message) {
        errorMessage = errorObj.response.data.message;
      } else if (isRegistering) {
        errorMessage = 'Registration failed. Username might be taken.';
      } else {
        errorMessage = 'Invalid credentials or server error.';
      }

      setError(errorMessage);
      addToast(errorMessage, 'error');
    }
  };

  return (
    <AuthLayout 
      title="Synapse" 
      subtitle={isRegistering ? 'Create a new account' : 'Sign in to access your knowledge graph'}
    >
      <AuthForm 
        mode={isRegistering ? 'register' : 'login'}
        isLoading={isLoading}
        error={error}
        onClearError={() => setError('')}
        onSubmit={handleSubmit}
        onToggleMode={() => setIsRegistering(!isRegistering)}
      />
    </AuthLayout>
  );
};

export default Login;
