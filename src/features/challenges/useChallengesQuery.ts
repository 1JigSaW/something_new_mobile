import { useQuery } from '@tanstack/react-query';
import { http } from '../../api';
import { Challenge } from '../../types/challenge';

export function useChallengesQuery({
  freeOnly,
}: {
  freeOnly: boolean;
}) {
  return useQuery<Challenge[]>({
    queryKey: ['challenges', { freeOnly }],
    queryFn: async () => {
      const { data } = await http.get<Challenge[]>(
        '/api/challenges/',
        { params: { 'free_only': freeOnly } }
      );
      return data;
    },
    staleTime: 60_000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}


