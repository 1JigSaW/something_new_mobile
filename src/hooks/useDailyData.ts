import { useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodayKey } from '../utils';
import { useAsyncStorage } from './useAsyncStorage';
import { DailyData, STORAGE_KEYS } from '../types/hooks';

const initialDailyData: DailyData = {
  completedToday: false,
  skipsUsedToday: 0,
  swipesUsedToday: 0,
  challengesTakenToday: 0,
  activeChallenge: null,
};

export function useDailyData() {
  const [dailyData, saveDailyData] = useAsyncStorage<DailyData>(STORAGE_KEYS.DAILY_DATA, initialDailyData);
  const todayKey = getTodayKey();

  const updateDailyData = useCallback(async (updates: Partial<DailyData>) => {
    const newData = { ...dailyData, ...updates };
    await saveDailyData(newData);
  }, [dailyData, saveDailyData]);

  const resetForNewDay = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_DAY_DATE, todayKey);
      await saveDailyData(initialDailyData);
    } catch (error) {
      console.error('Error resetting for new day:', error);
    }
  }, [todayKey, saveDailyData]);

  const resetTodayData = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.LAST_DAY_DATE,
        STORAGE_KEYS.DAILY_DATA,
        STORAGE_KEYS.SELECTED_CHALLENGES,
        STORAGE_KEYS.VIEWED_CHALLENGES
      ]);
      await saveDailyData(initialDailyData);
    } catch (error) {
      console.error('Error resetting today data:', error);
    }
  }, [saveDailyData]);

  useEffect(() => {
    const loadDailyData = async () => {
      try {
        const lastDayDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_DAY_DATE);
        
        if (lastDayDate && lastDayDate !== todayKey) {
          await resetForNewDay();
        }
      } catch (error) {
        console.error('Error loading daily data:', error);
      }
    };
    
    loadDailyData();
  }, [todayKey, resetForNewDay]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const lastDayDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_DAY_DATE);
        if (lastDayDate && lastDayDate !== todayKey) {
          await resetForNewDay();
        }
      } catch (error) {
        console.error('Error checking new day:', error);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [todayKey, resetForNewDay]);

  return {
    dailyData,
    updateDailyData,
    resetForNewDay,
    resetTodayData,
  };
}
