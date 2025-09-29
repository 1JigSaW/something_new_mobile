import { useQuery } from '@tanstack/react-query';
import { http } from '../../api';
import { API } from '../../api/endpoints';
import { ProgressStats } from '../../types/challenge';
import { ENV } from '../../config/env';

export function useProgressStats() {
  return useQuery<ProgressStats>({
    queryKey: ['progress-stats'],
    queryFn: async () => {
      const { data } = await http.get(API.profile.stats());
      return data as ProgressStats;
    },
    staleTime: ENV.QUERY_STALE_TIME,
    refetchOnWindowFocus: false,
    retry: ENV.QUERY_RETRY_COUNT,
  });
}


