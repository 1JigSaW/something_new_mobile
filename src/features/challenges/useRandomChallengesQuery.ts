import { useQuery } from '@tanstack/react-query';
import { http } from '../../api';

export type Challenge = {
  id: number,
  title: string,
  short_description: string,
  category: string,
  tags: string,
  size: 'small' | 'medium' | 'large',
  estimated_duration_min: number,
  is_premium_only: boolean,
  created_at: string,
  updated_at: string,
};

export function useRandomChallengesQuery({
  limit = 5,
  category,
  size,
  freeOnly = false,
}: {
  limit?: number,
  category?: string,
  size?: string,
  freeOnly?: boolean,
}) {
  return useQuery<Challenge[]>({
    queryKey: ['random-challenges', { limit, category, size, freeOnly }],
    queryFn: async () => {
      console.log('Fetching random challenges from:', 'http://127.0.0.1:8001/api/challenges/random');
      console.log('Params:', { limit, category, size, free_only: freeOnly });
      
      try {
        const { data } = await http.get<Challenge[]>(
          '/api/challenges/random',
          { 
            params: { 
              limit,
              category,
              size,
              free_only: freeOnly 
            } 
          }
        );
        console.log('Random Challenges API Response:', data);
        console.log('Random Challenges count:', data?.length);
        return data;
      } catch (error) {
        console.error('Random Challenges API Error:', error);
        if ((error as any).response?.data) {
          console.error('Random Challenges API Error details:', (error as any).response.data);
        } else {
          console.error('Random Challenges API Error details: No response data available');
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
}
