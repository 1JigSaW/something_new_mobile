export interface DailyData {
  completedToday: boolean;
  skipsUsedToday: number;
  swipesUsedToday: number;
  challengesTakenToday: number;
  activeChallenge: any | null;
}

export interface UserStats {
  streak: number;
  completedCount: number;
  isPremium: boolean;
}

export interface StorageKeys {
  DAILY_DATA: 'dailyData';
  USER_STATS: 'userStats';
  FAVORITES: 'favorites';
  VIEWED_CHALLENGES: 'viewedChallenges';
  SELECTED_CHALLENGES: 'selectedChallenges';
  LAST_DAY_DATE: 'lastDayDate';
  AUTH_USER: 'auth_user';
}

export const STORAGE_KEYS: StorageKeys = {
  DAILY_DATA: 'dailyData',
  USER_STATS: 'userStats',
  FAVORITES: 'favorites',
  VIEWED_CHALLENGES: 'viewedChallenges',
  SELECTED_CHALLENGES: 'selectedChallenges',
  LAST_DAY_DATE: 'lastDayDate',
  AUTH_USER: 'auth_user',
};
