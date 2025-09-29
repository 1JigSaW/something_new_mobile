import { useQuery } from '@tanstack/react-query';
import { http } from '../../api';

export function useProgressStats() {
  return useQuery({
    queryKey: ['progress-stats'],
    queryFn: async () => {
      try {
        const { data } = await http.get('/api/profile/stats');
        return data as {
          daily_stats: Array<{ date: string; completed: number }>,
          streak: number,
          total_completed: number,
        };
      } catch (error) {
        const today = new Date();
        const days = 30;
        const daily_stats = Array.from({ length: days }, (_v, i) => {
          const d = new Date(today);
          d.setDate(today.getDate() - (days - 1 - i));
          return {
            date: d.toISOString().split('T')[0],
            completed: 0,
          };
        });
        return {
          daily_stats,
          streak: 0,
          total_completed: 0,
        };
      }
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}


