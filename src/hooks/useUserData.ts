import { useCallback } from 'react';
import { useAsyncStorage } from './useAsyncStorage';
import { UserStats, STORAGE_KEYS } from '../types/hooks';

const initialUserStats: UserStats = {
  streak: 0,
  completedCount: 0,
  isPremium: false,
};

export function useUserData() {
  const [userStats, saveUserStats] = useAsyncStorage<UserStats>(STORAGE_KEYS.USER_STATS, initialUserStats);

  const updateStats = useCallback(async (updates: Partial<UserStats>) => {
    const newStats = { ...userStats, ...updates };
    await saveUserStats(newStats);
  }, [userStats, saveUserStats]);

  const incrementStreak = useCallback(async () => {
    await updateStats({ streak: userStats.streak + 1 });
  }, [userStats.streak, updateStats]);

  const incrementCompletedCount = useCallback(async () => {
    await updateStats({ completedCount: userStats.completedCount + 1 });
  }, [userStats.completedCount, updateStats]);

  const setPremium = useCallback(async (isPremium: boolean) => {
    await updateStats({ isPremium });
  }, [updateStats]);

  return {
    userStats,
    updateStats,
    incrementStreak,
    incrementCompletedCount,
    setPremium,
  };
}
