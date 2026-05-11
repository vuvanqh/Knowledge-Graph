import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';

export const useRegister = () => {
  return useMutation({
    mutationFn: (userData: Record<string, unknown>) => authService.register(userData),
  });
};
