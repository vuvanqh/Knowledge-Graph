import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useToast } from './useToast';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => {
      const user = authService.getCurrentUser();
      return user;
    },
    staleTime: Infinity,
  });

  const logout = async () => {
    await authService.logout();
    queryClient.setQueryData(['currentUser'], null);
    addToast('Logged out successfully', 'info');
    navigate('/login');
  };

  return {
    user,
    isAuthenticated: !!user,
    loading: isLoading,
    logout,
  };
};
