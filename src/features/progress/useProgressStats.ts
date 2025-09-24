import { useQuery } from '@tanstack/react-query';
import { http } from '../../api';

export function useProgressStats() {
  return useQuery({
    queryKey: ['progress-stats'],
    queryFn: async () => {
      const { data } = await http.get('/api/profile/stats');
      return data as {
        daily_stats: Array<{ date: string; completed: number }>,
        streak: number,
        total_completed: number,
      };
    },
    staleTime: 60 * 1000,
  });
}


