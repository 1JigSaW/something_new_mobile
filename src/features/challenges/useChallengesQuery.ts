import { useQuery } from '@tanstack/react-query';
import { http } from '../../api';

export type Challenge = {
  id: number,
  title: string,
  short_description?: string,
  category?: string,
  tags?: string,
  size: 'small' | 'medium' | 'large',
  estimated_duration_min?: number,
  is_premium_only: boolean,
  created_at: string,
  updated_at: string,
};

export function useChallengesQuery({
  freeOnly,
}: {
  freeOnly: boolean,
}) {
  return useQuery<Challenge[]>({
    queryKey: ['challenges', { freeOnly }],
    queryFn: async () => {
      console.log('Fetching challenges from:', 'http://localhost:8001/api/challenges/');
      console.log('Params:', { 'free_only': freeOnly });
      
      try {
        const { data } = await http.get<Challenge[]>(
          '/api/challenges/',
          { params: { 'free_only': freeOnly } }
        );
        console.log('API Response:', data);
        return data;
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
    staleTime: 60_000,
  });
}


