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
  
  // Свайпы (общая логика)
  swipesUsedToday: number;
  maxSwipesPerDay: number;
  canSwipe: () => boolean;
  useSwipe: () => void;
  
  // Просмотренные карточки
  viewedChallenges: number[];
  markAsViewed: (challengeId: number) => void;
  getUnviewedChallenges: (challenges: Challenge[]) => Challenge[];
  
  // Избранное
  favorites: Challenge[];
  addToFavorites: (challenge: Challenge) => void;
  removeFromFavorites: (challengeId: number) => void;
  
  // Действия
  completeChallenge: () => void;
  skipChallenge: () => void;
  canSkip: () => boolean;
  canTakeNewChallenge: () => boolean;
  resetToNewDay: () => Promise<void>;
  checkAndResetForNewDay: () => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [streak, setStreak] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [completedToday, setCompletedToday] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [skipsUsedToday, setSkipsUsedToday] = useState(0);
  const [swipesUsedToday, setSwipesUsedToday] = useState(0);
  const [viewedChallenges, setViewedChallenges] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<Challenge[]>([]);
  const [challengesTakenToday, setChallengesTakenToday] = useState(0);

  const maxSkipsPerDay = isPremium ? 999 : 5;
  const maxSwipesPerDay = isPremium ? 999 : 15;

  // Загружаем данные при запуске
  useEffect(() => {
    loadAppData();
  }, []);

  const loadAppData = async () => {
    try {
      const data = await AsyncStorage.getItem('appData');
      const today = new Date().toDateString();
      let lastCompletedDate = await AsyncStorage.getItem('lastCompletedDate');
      
      // Если нет lastCompletedDate - устанавливаем сегодняшнюю дату
      if (!lastCompletedDate) {
        await AsyncStorage.setItem('lastCompletedDate', today);
        lastCompletedDate = today;
      }

      // Загружаем просмотренные карточки
      const viewedData = await AsyncStorage.getItem('viewedChallenges');
      if (viewedData) {
        setViewedChallenges(JSON.parse(viewedData));
      }
      
      if (data) {
        const parsed = JSON.parse(data);
        setStreak(parsed.streak || 0);
        setCompletedCount(parsed.completedCount || 0);
        setIsPremium(parsed.isPremium || false);
        setFavorites(parsed.favorites || []);
        
        // Если новый день - сбрасываем все
        if (lastCompletedDate !== today) {
          setCompletedToday(false);
          setActiveChallenge(null);
          setSkipsUsedToday(0);
          setChallengesTakenToday(0);
          // Обновляем дату
          await AsyncStorage.setItem('lastCompletedDate', today);
        } else {
          // Тот же день - восстанавливаем состояние
          setCompletedToday(parsed.completedToday || false);
          setActiveChallenge(parsed.activeChallenge || null);
          setSkipsUsedToday(parsed.skipsUsedToday || 0);
          setSwipesUsedToday(parsed.swipesUsedToday || 0);
          setChallengesTakenToday(parsed.challengesTakenToday || 0);
        }
      } else {
        // Нет данных - устанавливаем по умолчанию
        setStreak(0);
        setCompletedCount(0);
        setCompletedToday(false);
        setIsPremium(false);
        setSkipsUsedToday(0);
        setFavorites([]);
        setActiveChallenge(null);
        setChallengesTakenToday(0);
      }
    } catch (error) {
      console.error('Error loading app data:', error);
      setStreak(0);
      setCompletedCount(0);
      setCompletedToday(false);
      setIsPremium(false);
      setSkipsUsedToday(0);
      setFavorites([]);
      setActiveChallenge(null);
      setChallengesTakenToday(0);
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
        swipesUsedToday,
        favorites,
        activeChallenge,
        challengesTakenToday,
      };
      await AsyncStorage.setItem('appData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving app data:', error);
    }
  };

  // Сохраняем данные при изменении
  useEffect(() => {
    saveAppData();
  }, [streak, completedCount, completedToday, isPremium, skipsUsedToday, swipesUsedToday, favorites, activeChallenge, challengesTakenToday]);

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
    // В бесплатной версии - можно взять челлендж если не завершили сегодня И взяли меньше 5
    // В Premium - всегда можно
    if (isPremium) return true;
    return !completedToday && challengesTakenToday < 5;
  };

  const canSwipe = () => {
    // Можно свайпать если не превышен лимит свайпов
    return swipesUsedToday < maxSwipesPerDay;
  };

  const useSwipe = () => {
    // Используем один свайп
    setSwipesUsedToday(prev => prev + 1);
  };

  const markAsViewed = (challengeId: number) => {
    setViewedChallenges(prev => {
      if (!prev.includes(challengeId)) {
        const newViewed = [...prev, challengeId];
        // Сохраняем в AsyncStorage
        AsyncStorage.setItem('viewedChallenges', JSON.stringify(newViewed));
        return newViewed;
      }
      return prev;
    });
  };

  const getUnviewedChallenges = (challenges: Challenge[]) => {
    return challenges.filter(challenge => !viewedChallenges.includes(challenge.id));
  };


  const handleSetActiveChallenge = (challenge: Challenge | null) => {
    setActiveChallenge(challenge);
    if (challenge) {
      // Увеличиваем счетчик взятых челленджей
      setChallengesTakenToday(prev => prev + 1);
    }
  };

  const resetToNewDay = async () => {
    const today = new Date().toDateString();
    await AsyncStorage.setItem('lastCompletedDate', today);
    setCompletedToday(false);
    setActiveChallenge(null);
    setSkipsUsedToday(0);
    setSwipesUsedToday(0);
    setChallengesTakenToday(0);
    // Просмотренные карточки НЕ сбрасываем - они остаются навсегда
  };

  const checkAndResetForNewDay = async (): Promise<boolean> => {
    try {
      const today = new Date().toDateString();
      const lastCompletedDate = await AsyncStorage.getItem('lastCompletedDate');
      
      // Если новый день - сбрасываем состояние
      if (lastCompletedDate && lastCompletedDate !== today) {
        await resetToNewDay();
        return true; // Был новый день
      }
      return false; // Тот же день
    } catch (error) {
      console.error('Ошибка при проверке нового дня:', error);
      return false;
    }
  };

  // Проверяем новый день каждую минуту
  useEffect(() => {
    const interval = setInterval(async () => {
      await checkAndResetForNewDay();
    }, 60000); // Проверяем каждую минуту

    return () => clearInterval(interval);
  }, [checkAndResetForNewDay]);

  return (
    <AppContext.Provider value={{
      activeChallenge,
      setActiveChallenge: handleSetActiveChallenge,
      streak,
      completedCount,
      completedToday,
      isPremium,
      setIsPremium,
      skipsUsedToday,
      maxSkipsPerDay,
      swipesUsedToday,
      maxSwipesPerDay,
      canSwipe,
      useSwipe,
      viewedChallenges,
      markAsViewed,
      getUnviewedChallenges,
      favorites,
      addToFavorites,
      removeFromFavorites,
      completeChallenge,
      skipChallenge,
      canSkip,
      canTakeNewChallenge,
      resetToNewDay,
      checkAndResetForNewDay,
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
