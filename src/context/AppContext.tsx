import React, { createContext, useContext, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { http } from '../api';
import { API } from '../api/endpoints';
import { shouldUseFallback } from '../config';
import { useDailyData, useUserData, useFavorites, useViewedChallenges, useSelectedChallenges } from '../hooks';
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
  useSwipe: () => void;

  viewedChallenges: number[];
  markAsViewed: (challengeId: number) => void;
  getUnviewedChallenges: (challenges: Challenge[]) => Challenge[];

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  
  const { dailyData, updateDailyData, resetForNewDay, resetTodayData } = useDailyData();
  const { userStats, incrementStreak, incrementCompletedCount, setPremium } = useUserData();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites(userStats.isPremium);
  const { viewedChallenges, markAsViewed, getUnviewedChallenges } = useViewedChallenges();
  const { selectedChallenges, markAsSelected, isSelected, removeFromSelected } = useSelectedChallenges();

  const maxSkipsPerDay = userStats.isPremium ? 999 : 5;
  const maxSwipesPerDay = userStats.isPremium ? 999 : 15;

  const canSkip = () => {
    return dailyData.skipsUsedToday < maxSkipsPerDay;
  };

  const canSwipe = () => {
    return dailyData.swipesUsedToday < maxSwipesPerDay;
  };

  const useSwipe = async () => {
    await updateDailyData({ swipesUsedToday: dailyData.swipesUsedToday + 1 });
  };

  const canTakeNewChallenge = () => {
    if (userStats.isPremium) return true;
    return !dailyData.completedToday && dailyData.challengesTakenToday < 5;
  };

  const completeChallenge = async (challenge?: Challenge) => {
    const target = challenge || dailyData.activeChallenge;
    if (!target) return;
    
    try {
      let stats: any | null = null;
      const useFallback = shouldUseFallback();

      if (!useFallback) {
        try {
          await http.post(API.challenges.complete({ id: target.id }));
          const { data } = await http.get(API.profile.stats());
          stats = data;
        } catch (e) {
          stats = null;
        }
      }

      if (stats) {
        queryClient.setQueryData(['progress-stats'], stats);
        await updateDailyData({ completedToday: true });
        await incrementStreak();
        await incrementCompletedCount();
      } else {
        await updateDailyData({ completedToday: true });
        await incrementStreak();
        await incrementCompletedCount();

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const existing: any = queryClient.getQueryData(['progress-stats']);
        const days = 30;
        const baseStats = existing || {
          daily_stats: Array.from({ length: days }, (_v, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() - (days - 1 - i));
            return { date: d.toISOString().split('T')[0], completed: 0 };
          }),
          streak: 0,
          total_completed: 0,
        };
        const updatedDaily = (baseStats.daily_stats || []).map((s: any) => (
          s.date === todayStr ? { ...s, completed: Math.max(1, Number(s.completed || 0)) } : s
        ));
        queryClient.setQueryData(['progress-stats'], {
          daily_stats: updatedDaily,
          streak: (baseStats.streak || 0) + 1,
          total_completed: (baseStats.total_completed || 0) + 1,
        });
      }

      await removeFromSelected(target.id);
      await markAsViewed(target.id);
      await updateDailyData({ activeChallenge: null });
    } catch (error: any) {
      if (error?.response?.status === 429) {
        Alert.alert('Limit reached', 'You can complete only one challenge per day. Come back tomorrow!');
      } else {
        Alert.alert('Error', 'Failed to save completion. Please try again.');
        console.error('completeChallenge error:', error);
      }
    }
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
      return true;
    } catch (error) {
      console.error('Error checking new day:', error);
      return false;
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
      swipesUsedToday: dailyData.swipesUsedToday,
      maxSwipesPerDay,
      canSwipe,
      useSwipe,
      viewedChallenges,
      markAsViewed,
      getUnviewedChallenges,
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
      resetTodayData,
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
