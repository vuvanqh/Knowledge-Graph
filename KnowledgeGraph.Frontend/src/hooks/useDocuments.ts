import { useQuery } from '@tanstack/react-query';

const MOCK_DOCS = [
  { id: 1, name: 'Architecture_v1.pdf', size: '2.4 MB', date: '2023-10-12', status: 'processed' },
  { id: 2, name: 'Meeting_Notes_Q3.md', size: '15 KB', date: '2023-10-10', status: 'processed' },
  { id: 3, name: 'Database_Schema.sql', size: '45 KB', date: '2023-10-08', status: 'processed' },
];

export const useDocuments = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 600)); //network delay sim
      return MOCK_DOCS;
    },
  });
};
