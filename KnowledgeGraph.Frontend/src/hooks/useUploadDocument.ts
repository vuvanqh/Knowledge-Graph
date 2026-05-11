import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (filename: string) => {
      // The simulated upload process is visual in the component, 
      // but the actual submission to "backend" happens here.
      await new Promise(r => setTimeout(r, 1000));
      return {
        id: Date.now(),
        name: filename,
        size: (Math.random() * 5 + 0.1).toFixed(1) + ' MB',
        date: new Date().toISOString().split('T')[0],
        status: 'processed'
      };
    },
    onSuccess: (newDoc) => {
      queryClient.setQueryData(['documents'], (oldDocs: unknown[] | undefined) => {
        return [newDoc, ...(oldDocs || [])];
      });
    },
  });
};
