export const API = {
  auth: {
    login: () => `/api/auth/login`,
    verify: () => `/api/auth/verify`,
    me: () => `/api/auth/me`,
  },
  users: {
    me: () => `/api/users/me`,
    meAuth: () => `/api/users/me-auth`,
  },
  challenges: {
    complete: ({ id }: { id: number }) => `/api/challenges/${id}/complete`,
    list: () => `/api/challenges/`,
  },
  profile: {
    stats: () => `/api/profile/stats`,
  },
} as const;


