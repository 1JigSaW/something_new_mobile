import { useQuery } from '@tanstack/react-query';
import { http } from '../../api';
import { API } from '../../api/endpoints';
import { Challenge, ChallengeFilters } from '../../types/challenge';
import { ENV } from '../../config/env';

export function useRandomChallengesQuery({
  limit = 5,
  category,
  size,
  freeOnly = false,
}: ChallengeFilters & { limit?: number }) {
  return useQuery<Challenge[]>({
    queryKey: ['random-challenges', { limit, category, size, freeOnly }],
    queryFn: async () => {
      console.log('Fetching random challenges...', { limit, category, size, freeOnly });
      try {
        const { data } = await http.get<Challenge[]>(
          API.challenges.random(),
          { 
            params: { 
              limit,
              category,
              size,
              free_only: freeOnly 
            } 
          }
        );
        console.log('Random challenges fetched successfully:', data.length, 'items');
        return data;
      } catch (error) {
        console.error('Error fetching random challenges:', error);
        throw error;
      }
    },
    staleTime: ENV.QUERY_STALE_TIME,
    refetchOnWindowFocus: false,
    retry: ENV.QUERY_RETRY_COUNT,
  });
}
