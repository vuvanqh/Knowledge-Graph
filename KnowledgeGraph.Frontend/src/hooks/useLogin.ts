import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: Record<string, string>) => authService.login(credentials),
    onSuccess: () => {
      const user = authService.getCurrentUser();
      queryClient.setQueryData(['currentUser'], user);
    },
  });
};
