import { useQuery } from '@tanstack/react-query';
import { http } from '../../api';
import { API } from '../../api/endpoints';
import { ProgressStats } from '../../types/challenge';

export function useProgressStats() {
  return useQuery<ProgressStats>({
    queryKey: ['progress-stats'],
    queryFn: async () => {
      const { data } = await http.get(API.profile.stats());
      return data as ProgressStats;
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}


