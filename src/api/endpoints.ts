export const API = {
  auth: {
    requestCode: () => `/api/v1/auth/request-code`,
    verify: () => `/api/v1/auth/verify`,
    me: () => `/api/v1/auth/me`,
  },
  users: {
    me: () => `/api/v1/users/me`,
    meAuth: () => `/api/v1/users/me-auth`,
  },
  challenges: {
    complete: ({ id }: { id: number }) => `/api/v1/challenges/${id}/complete`,
    list: () => `/api/v1/challenges/`,
    random: () => `/api/v1/challenges/random`,
  },
  profile: {
    stats: () => `/api/v1/profile/stats`,
    day: () => `/api/v1/profile/day`,
  },
  activity: {
    swipe: () => `/api/v1/activity/swipe`,
    view: () => `/api/v1/activity/view`,
    select: () => `/api/v1/activity/select`,
    favorite: () => `/api/v1/activity/favorite`,
    removeFavorite: ({ id }: { id: number }) => `/api/v1/activity/favorite/${id}`,
    favorites: () => `/api/v1/activity/favorites`,
    viewed: () => `/api/v1/activity/viewed`,
    selected: () => `/api/v1/activity/selected`,
    swipesToday: () => `/api/v1/activity/swipes/today`,
  },
} as const;


