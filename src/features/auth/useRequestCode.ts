import { useMutation } from '@tanstack/react-query';
import { http } from '../../api';

type RequestCodeBody = {
  email: string,
};

export function useRequestCode() {
  return useMutation({
    mutationFn: async ({ email }: RequestCodeBody) => {
      await http.post('/api/auth/request-code', { email });
    },
  });
}


