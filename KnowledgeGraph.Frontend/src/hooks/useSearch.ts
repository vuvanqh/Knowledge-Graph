import { useMutation } from '@tanstack/react-query';

export const useSearch = () => {
  return useMutation({
    mutationFn: async (query: string) => {
      console.log('Searching for:', query);
      // Simulate searching graph/vector DB
      await new Promise(r => setTimeout(r, 2000));
      
      return {
        answer: `Based on the knowledge graph, the architecture relies on a **microservices pattern**. 
    
The main components are:
1. API Gateway (ASP.NET Core)
2. ML/LLM Python Service
3. Vector Database
4. Graph Database

This approach ensures a clear separation of concerns as outlined in the design documents [1].`,
        reasoning: ['Analyzed query semantics', 'Retrieved 5 relevant graph nodes', 'Synthesized answer'],
        citations: [
          { id: 1, title: 'Architecture.md', snippet: 'The system uses a microservices architecture with a clear separation of concerns...' }
        ]
      };
    }
  });
};
