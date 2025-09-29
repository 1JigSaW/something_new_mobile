import { useQuery } from '@tanstack/react-query';
import { http } from '../../api';
import { API } from '../../api/endpoints';
import { Challenge, ChallengeFilters } from '../../types/challenge';

export function useRandomChallengesQuery({
  limit = 5,
  category,
  size,
  freeOnly = false,
}: ChallengeFilters & { limit?: number }) {
  return useQuery<Challenge[]>({
    queryKey: ['random-challenges', { limit, category, size, freeOnly }],
    queryFn: async () => {
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
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
