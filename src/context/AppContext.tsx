import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { http } from '../api';
import { API } from '../api/endpoints';
import { shouldUseFallback } from '../config';
import { useDailyData, useUserData, useFavorites, useViewedChallenges, useSelectedChallenges, useCompletedChallenges } from '../hooks';
import { Challenge } from '../types/challenge';

interface AppContextType {
  activeChallenge: Challenge | null;
  setActiveChallenge: (challenge: Challenge | null) => void;

  streak: number;
  completedCount: number;
  completedToday: boolean;

  isPremium: boolean;
  setIsPremium: (premium: boolean) => void;

  skipsUsedToday: number;
  maxSkipsPerDay: number;

  swipesUsedToday: number;
  maxSwipesPerDay: number;
  canSwipe: () => boolean;
  handleSwipe: () => Promise<void>;

  viewedChallenges: number[];
  markAsViewed: (challengeId: number) => void;
  getUnviewedChallenges: (challenges: Challenge[]) => Challenge[];

  completedChallenges: number[];
  isCompleted: (challengeId: number) => boolean;
  getDisplayChallenges: (
    challenges: Challenge[],
    options: {
      allowRepeatsOnExhausted: boolean,
    }
  ) => Challenge[];

  selectedChallenges: number[];
  markAsSelected: (challengeId: number) => void;
  isSelected: (challengeId: number) => boolean;

  favorites: Challenge[];
  addToFavorites: (challenge: Challenge) => void;
  removeFromFavorites: (challengeId: number) => void;

  completeChallenge: (challenge?: Challenge) => void;
  skipChallenge: () => void;
  canSkip: () => boolean;
  canTakeNewChallenge: () => boolean;
  resetToNewDay: () => Promise<void>;
  checkAndResetForNewDay: () => Promise<boolean>;
  resetTodayData: () => Promise<void>;
  resetAllUserData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  
  const { dailyData, updateDailyData, resetForNewDay, resetTodayData } = useDailyData();
  const { userStats, incrementStreak, incrementCompletedCount, setPremium, updateStats } = useUserData() as any;
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites(userStats.isPremium);
  const { viewedChallenges, markAsViewed, getUnviewedChallenges } = useViewedChallenges();
  const { selectedChallenges, markAsSelected, isSelected, removeFromSelected } = useSelectedChallenges();
  const { completedChallenges, markAsCompleted, isCompleted } = useCompletedChallenges();
  
  // Локальное состояние для счетчика свайпов (для мгновенного обновления UI)
  const [localSwipesUsedToday, setLocalSwipesUsedToday] = useState(dailyData.swipesUsedToday);

  // Синхронизация локального состояния с dailyData
  useEffect(() => {
    setLocalSwipesUsedToday(dailyData.swipesUsedToday);
  }, [dailyData.swipesUsedToday]);

  // Синхронизация с сервером при загрузке
  useEffect(() => {
    if (shouldUseFallback()) return; // Пропускаем в fallback режиме
    
    try {
      // Синхронизируем статистику
      queryClient.invalidateQueries({ queryKey: ['progress-stats'] });
      
      // Здесь можно добавить синхронизацию других данных
      // например, избранных, просмотренных челленджей и т.д.
    } catch (error) {
      console.error('Sync error:', error);
    }
  }, [queryClient]);

  const maxSkipsPerDay = userStats.isPremium ? 999 : 5;
  const maxSwipesPerDay = userStats.isPremium ? 999 : 15;

  const canSkip = () => {
    return dailyData.skipsUsedToday < maxSkipsPerDay;
  };

  const canSwipe = () => {
    return localSwipesUsedToday < maxSwipesPerDay;
  };

  const handleSwipe = async () => {
    setLocalSwipesUsedToday((prev) => prev + 1);
    const persistedCount = (dailyData.swipesUsedToday || 0) + 1;
    await updateDailyData({ swipesUsedToday: persistedCount });
  };

  const canTakeNewChallenge = () => {
    if (userStats.isPremium) return true;
    return !dailyData.completedToday && dailyData.challengesTakenToday < 5;
  };

  const completeChallenge = async (challenge?: Challenge) => {
    const target = challenge || dailyData.activeChallenge;
    if (!target) return;
    
    try {
      const useFallback = shouldUseFallback();

      if (!useFallback) {
        await http.post(API.challenges.complete({ id: target.id }));
        await updateDailyData({ completedToday: true });
        await incrementStreak();
        await incrementCompletedCount();

        // Немедленно обновляем локальный кэш статистики
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const existing: any = queryClient.getQueryData(['progress-stats']);
        const days = 30;
        const start = new Date(today);
        start.setDate(today.getDate() - (days - 1));
        const baseStats = existing || {
          daily_stats: Array.from({ length: days }).map((_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() - (days - 1 - i));
            return { date: d.toISOString().split('T')[0], completed: 0 };
          }),
          streak: 0,
          total_completed: 0,
          period: {
            start_date: start.toISOString().split('T')[0],
            end_date: todayStr,
          },
        };
        const updatedDaily = (baseStats.daily_stats || []).map((s: any) => (
          s.date === todayStr ? { ...s, completed: Math.max(1, Number(s.completed || 0)) } : s
        ));
        const updatedTotal = updatedDaily.reduce((acc: number, s: any) => acc + Number(s.completed || 0), 0);
        let updatedStreak = 0;
        for (let i = updatedDaily.length - 1; i >= 0; i -= 1) {
          if (Number(updatedDaily[i].completed || 0) > 0) updatedStreak += 1; else break;
        }
        queryClient.setQueryData(['progress-stats'], {
          daily_stats: updatedDaily,
          streak: updatedStreak,
          total_completed: updatedTotal,
          period: baseStats.period,
        });

        // И параллельно попросим свежие данные с сервера
        queryClient.invalidateQueries({ queryKey: ['progress-stats'] });
      } else {
        // Fallback режим - только локальные данные
        await updateDailyData({ completedToday: true });
        
        // Обновляем локальную статистику только в fallback режиме
        await incrementStreak();
        await incrementCompletedCount();

        // Немедленно обновляем локальный кэш статистики
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const existing: any = queryClient.getQueryData(['progress-stats']);
        const days = 30;
        const start = new Date(today);
        start.setDate(today.getDate() - (days - 1));
        const baseStats = existing || {
          daily_stats: Array.from({ length: days }).map((_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() - (days - 1 - i));
            return { date: d.toISOString().split('T')[0], completed: 0 };
          }),
          streak: 0,
          total_completed: 0,
          period: {
            start_date: start.toISOString().split('T')[0],
            end_date: todayStr,
          },
        };
        const updatedDaily = (baseStats.daily_stats || []).map((s: any) => (
          s.date === todayStr ? { ...s, completed: Math.max(1, Number(s.completed || 0)) } : s
        ));
        const updatedTotal = updatedDaily.reduce((acc: number, s: any) => acc + Number(s.completed || 0), 0);
        let updatedStreak = 0;
        for (let i = updatedDaily.length - 1; i >= 0; i -= 1) {
          if (Number(updatedDaily[i].completed || 0) > 0) updatedStreak += 1; else break;
        }
        queryClient.setQueryData(['progress-stats'], {
          daily_stats: updatedDaily,
          streak: updatedStreak,
          total_completed: updatedTotal,
          period: baseStats.period,
        });
      }

      // Локальные дневные данные (всегда)
      await updateDailyData({ activeChallenge: null });
      await removeFromSelected(target.id);
      await markAsViewed(target.id);
      await markAsCompleted(target.id);
      
    } catch (error: any) {
      if (error?.response?.status === 429) {
        Alert.alert('Limit reached', 'You can complete only one challenge per day. Come back tomorrow!');
      } else {
        // Graceful fallback to local completion to keep UX responsive
        try {
          await updateDailyData({ completedToday: true, activeChallenge: null });
          await incrementStreak();
          await incrementCompletedCount();
          const today = new Date();
          const todayStr = today.toISOString().split('T')[0];
          const existing: any = queryClient.getQueryData(['progress-stats']);
          const days = 30;
          const start = new Date(today);
          start.setDate(today.getDate() - (days - 1));
          const baseStats = existing || {
            daily_stats: Array.from({ length: days }).map((_, i) => {
              const d = new Date(today);
              d.setDate(today.getDate() - (days - 1 - i));
              return { date: d.toISOString().split('T')[0], completed: 0 };
            }),
            streak: 0,
            total_completed: 0,
            period: {
              start_date: start.toISOString().split('T')[0],
              end_date: todayStr,
            },
          };
          const updatedDaily = (baseStats.daily_stats || []).map((s: any) => (
            s.date === todayStr ? { ...s, completed: Math.max(1, Number(s.completed || 0)) } : s
          ));
          const updatedTotal = updatedDaily.reduce((acc: number, s: any) => acc + Number(s.completed || 0), 0);
          let updatedStreak = 0;
          for (let i = updatedDaily.length - 1; i >= 0; i -= 1) {
            if (Number(updatedDaily[i].completed || 0) > 0) updatedStreak += 1; else break;
          }
          queryClient.setQueryData(['progress-stats'], {
            daily_stats: updatedDaily,
            streak: updatedStreak,
            total_completed: updatedTotal,
            period: baseStats.period,
          });
          Alert.alert('Saved locally', 'Server error. Your completion is saved locally for now.');
        } catch (e) {
          Alert.alert('Error', 'Failed to save completion. Please try again.');
        }
        console.error('completeChallenge error:', error);
      }
    }
  };
  const getDisplayChallenges = (
    challenges: Challenge[],
    options: {
      allowRepeatsOnExhausted: boolean,
    }
  ) => {
    const notCompletedAndNotSelected = challenges.filter(
      (c) => !completedChallenges.includes(c.id) && !selectedChallenges.includes(c.id)
    );
    const unviewed = notCompletedAndNotSelected.filter((c) => !viewedChallenges.includes(c.id));
    if (unviewed.length > 0) {
      return unviewed;
    }
    if (options.allowRepeatsOnExhausted) {
      return notCompletedAndNotSelected;
    }
    return unviewed;
  };

  const skipChallenge = async () => {
    if (!dailyData.activeChallenge) return;
    
    await updateDailyData({ 
      skipsUsedToday: dailyData.skipsUsedToday + 1,
      activeChallenge: null 
    });
  };

  const setActiveChallenge = async (challenge: Challenge | null) => {
    await updateDailyData({ 
      activeChallenge: challenge,
      challengesTakenToday: challenge ? dailyData.challengesTakenToday + 1 : dailyData.challengesTakenToday 
    });
  };

  const checkAndResetForNewDay = async (): Promise<boolean> => {
    try {
      await resetForNewDay();
      setLocalSwipesUsedToday(0); // Сброс локального счетчика
      return true;
    } catch (error) {
      console.error('Error checking new day:', error);
      return false;
    }
  };

  const resetTodayDataWrapper = async () => {
    await resetTodayData();
    setLocalSwipesUsedToday(0); // Сброс локального счетчика
  };

  const resetAllUserData = async () => {
    try {
      await resetTodayDataWrapper();
      await updateStats({ streak: 0, completedCount: 0, isPremium: false });
      for (const fav of favorites) {
        await removeFromFavorites(fav.id);
      }
      queryClient.removeQueries({ queryKey: ['progress-stats'] });
    } catch (error) {
      console.error('resetAllUserData error:', error);
    }
  };

  
  return (
    <AppContext.Provider value={{
      activeChallenge: dailyData.activeChallenge,
      setActiveChallenge,
      streak: userStats.streak,
      completedCount: userStats.completedCount,
      completedToday: dailyData.completedToday,
      isPremium: userStats.isPremium,
      setIsPremium: setPremium,
      skipsUsedToday: dailyData.skipsUsedToday,
      maxSkipsPerDay,
      swipesUsedToday: localSwipesUsedToday,
      maxSwipesPerDay,
    canSwipe,
    handleSwipe,
      viewedChallenges,
      markAsViewed,
      getUnviewedChallenges,
      completedChallenges,
      isCompleted,
      getDisplayChallenges,
      selectedChallenges,
      markAsSelected,
      isSelected,
      favorites,
      addToFavorites,
      removeFromFavorites,
      completeChallenge,
      skipChallenge,
      canSkip,
      canTakeNewChallenge,
      resetToNewDay: resetForNewDay,
      checkAndResetForNewDay,
      resetTodayData: resetTodayDataWrapper,
      resetAllUserData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
