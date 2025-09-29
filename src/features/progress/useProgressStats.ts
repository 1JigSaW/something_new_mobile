import { useQuery } from '@tanstack/react-query';
import { http } from '../../api';
import { API } from '../../api/endpoints';
import { ProgressStats } from '../../types/challenge';
import { ENV } from '../../config/env';

export function useProgressStats() {
  return useQuery<ProgressStats>({
    queryKey: ['progress-stats'],
    queryFn: async () => {
      console.log('Fetching progress stats...');
      try {
        const { data } = await http.get(API.profile.stats());
        console.log('Progress stats fetched successfully:', data);
        return data as ProgressStats;
      } catch (error) {
        console.error('Error fetching progress stats:', error);
        throw error;
      }
    },
    staleTime: ENV.QUERY_STALE_TIME,
    refetchOnWindowFocus: false,
    retry: ENV.QUERY_RETRY_COUNT,
  });
}


