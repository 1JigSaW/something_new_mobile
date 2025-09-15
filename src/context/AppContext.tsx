import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Challenge {
  id: number;
  title: string;
  short_description: string;
  category: string;
  tags: string;
  size: 'small' | 'medium' | 'large';
  estimated_duration_min: number;
  is_premium_only: boolean;
  created_at: string;
  updated_at: string;
}

interface AppContextType {
  // Текущая активная карточка
  activeChallenge: Challenge | null;
  setActiveChallenge: (challenge: Challenge | null) => void;
  
  // Статистика
  streak: number;
  completedCount: number;
  completedToday: boolean;
  
  // Premium статус
  isPremium: boolean;
  setIsPremium: (premium: boolean) => void;
  
  // Пропуски
  skipsUsedToday: number;
  maxSkipsPerDay: number;
  
  // Избранное
  favorites: Challenge[];
  addToFavorites: (challenge: Challenge) => void;
  removeFromFavorites: (challengeId: number) => void;
  
  // Действия
  completeChallenge: () => void;
  skipChallenge: () => void;
  canSkip: () => boolean;
  canTakeNewChallenge: () => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [streak, setStreak] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [completedToday, setCompletedToday] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [skipsUsedToday, setSkipsUsedToday] = useState(0);
  const [favorites, setFavorites] = useState<Challenge[]>([]);

  const maxSkipsPerDay = isPremium ? 999 : 5;

  // Загружаем данные при запуске
  useEffect(() => {
    loadAppData();
  }, []);

  const loadAppData = async () => {
    try {
      console.log('Loading app data from AsyncStorage...');
      const data = await AsyncStorage.getItem('appData');
      console.log('Loaded data:', data);
      
      const today = new Date().toDateString();
      const lastCompletedDate = await AsyncStorage.getItem('lastCompletedDate');
      
      if (data) {
        const parsed = JSON.parse(data);
        setStreak(parsed.streak || 0);
        setCompletedCount(parsed.completedCount || 0);
        
        // Сбрасываем completedToday если прошлый день был другой
        const wasCompletedToday = parsed.completedToday && lastCompletedDate === today;
        setCompletedToday(wasCompletedToday);
        
        setIsPremium(parsed.isPremium || false);
        
        // Сбрасываем пропуски если новый день
        const lastSkipDate = await AsyncStorage.getItem('lastSkipDate');
        const skipsUsedToday = lastSkipDate === today ? (parsed.skipsUsedToday || 0) : 0;
        setSkipsUsedToday(skipsUsedToday);
        setFavorites(parsed.favorites || []);
        setActiveChallenge(parsed.activeChallenge || null);
        console.log('App data loaded successfully');
      } else {
        console.log('No saved data found, using defaults');
      }
    } catch (error) {
      console.error('Error loading app data:', error);
      // Устанавливаем значения по умолчанию при ошибке
      setStreak(0);
      setCompletedCount(0);
      setCompletedToday(false);
      setIsPremium(false);
      setSkipsUsedToday(0);
      setFavorites([]);
      setActiveChallenge(null);
    }
  };

  const saveAppData = async () => {
    try {
      const data = {
        streak,
        completedCount,
        completedToday,
        isPremium,
        skipsUsedToday,
        favorites,
        activeChallenge,
      };
      console.log('Saving app data to AsyncStorage:', data);
      await AsyncStorage.setItem('appData', JSON.stringify(data));
      console.log('App data saved successfully');
    } catch (error) {
      console.error('Error saving app data:', error);
    }
  };

  // Сохраняем данные при изменении
  useEffect(() => {
    saveAppData();
  }, [streak, completedCount, completedToday, isPremium, skipsUsedToday, favorites, activeChallenge]);

  const addToFavorites = (challenge: Challenge) => {
    if (favorites.length >= 10 && !isPremium) {
      Alert.alert('Лимит избранного достигнут', 'Обновитесь до Premium для безлимитного сохранения.');
      return;
    }
    if (!favorites.find(fav => fav.id === challenge.id)) {
      setFavorites([...favorites, challenge]);
    }
  };

  const removeFromFavorites = (challengeId: number) => {
    setFavorites(favorites.filter(fav => fav.id !== challengeId));
  };

  const completeChallenge = async () => {
    if (!activeChallenge) return;
    
    const today = new Date().toDateString();
    
    setCompletedCount(completedCount + 1);
    setCompletedToday(true);
    setStreak(streak + 1);
    setActiveChallenge(null);
    
    // Сохраняем дату завершения
    await AsyncStorage.setItem('lastCompletedDate', today);
  };

  const skipChallenge = async () => {
    if (!activeChallenge) return;
    
    const today = new Date().toDateString();
    
    setSkipsUsedToday(skipsUsedToday + 1);
    setActiveChallenge(null);
    
    // Сохраняем дату пропуска
    await AsyncStorage.setItem('lastSkipDate', today);
  };

  const canSkip = () => {
    return skipsUsedToday < maxSkipsPerDay;
  };

  const canTakeNewChallenge = () => {
    // В бесплатной версии - только если не завершили сегодня
    // В Premium - всегда можно
    if (isPremium) return true;
    return !completedToday;
  };

  return (
    <AppContext.Provider value={{
      activeChallenge,
      setActiveChallenge,
      streak,
      completedCount,
      completedToday,
      isPremium,
      setIsPremium,
      skipsUsedToday,
      maxSkipsPerDay,
      favorites,
      addToFavorites,
      removeFromFavorites,
      completeChallenge,
      skipChallenge,
      canSkip,
      canTakeNewChallenge,
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
