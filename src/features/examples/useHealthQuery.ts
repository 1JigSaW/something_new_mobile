import { useQuery } from '@tanstack/react-query';
import { http } from '../../api';

type HealthResponse = {
  status: string,
};

export function useHealthQuery() {
  return useQuery<HealthResponse>({
    queryKey: ['health'],
    queryFn: async () => {
      const { data } = await http.get<HealthResponse>('/health');
      return data;
    },
    staleTime: 60_000,
  });
}


