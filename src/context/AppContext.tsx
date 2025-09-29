import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { http } from '../api';
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
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [streak, setStreak] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [completedToday, setCompletedToday] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [skipsUsedToday, setSkipsUsedToday] = useState(0);
  const [swipesUsedToday, setSwipesUsedToday] = useState(0);
  const [viewedChallenges, setViewedChallenges] = useState<number[]>([]);
  const [selectedChallenges, setSelectedChallenges] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<Challenge[]>([]);
  const [challengesTakenToday, setChallengesTakenToday] = useState(0);

  const maxSkipsPerDay = isPremium ? 999 : 5;
  const maxSwipesPerDay = isPremium ? 999 : 15;

  useEffect(() => {
    loadAppData();
  }, []);

  const loadAppData = async () => {
    try {
      const data = await AsyncStorage.getItem('appData');
      const today = new Date().toDateString();
      let lastDayDate = await AsyncStorage.getItem('lastDayDate');
      
      if (!lastDayDate) {
        await AsyncStorage.setItem('lastDayDate', today);
        lastDayDate = today;
      }

      const viewedData = await AsyncStorage.getItem('viewedChallenges');
      if (viewedData) {
        setViewedChallenges(JSON.parse(viewedData));
      }

      const selectedData = await AsyncStorage.getItem('selectedChallenges');
      if (selectedData) {
        setSelectedChallenges(JSON.parse(selectedData));
      }
      
      if (data) {
        const parsed = JSON.parse(data);
        setStreak(parsed.streak || 0);
        setCompletedCount(parsed.completedCount || 0);
        setIsPremium(parsed.isPremium || false);
        setFavorites(parsed.favorites || []);
        
        if (lastDayDate !== today) {
          setCompletedToday(false);
          setActiveChallenge(null);
          setSkipsUsedToday(0);
          setSwipesUsedToday(0);
          setChallengesTakenToday(0);
          await AsyncStorage.setItem('lastDayDate', today);
        } else {
          setCompletedToday(parsed.completedToday || false);
          setActiveChallenge(parsed.activeChallenge || null);
          setSkipsUsedToday(parsed.skipsUsedToday || 0);
          setSwipesUsedToday(parsed.swipesUsedToday || 0);
          setChallengesTakenToday(parsed.challengesTakenToday || 0);
        }
      } else {
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

  useEffect(() => {
    saveAppData();
  }, [streak, completedCount, completedToday, isPremium, skipsUsedToday, swipesUsedToday, favorites, activeChallenge, challengesTakenToday]);

  const addToFavorites = (challenge: Challenge) => {
    if (favorites.length >= 10 && !isPremium) {
      Alert.alert('Favorites limit reached', 'Upgrade to Premium for unlimited favorites.');
      return;
    }
    if (!favorites.find(fav => fav.id === challenge.id)) {
      setFavorites([...favorites, challenge]);
    }
  };

  const removeFromFavorites = (challengeId: number) => {
    setFavorites(favorites.filter(fav => fav.id !== challengeId));
  };

  const completeChallenge = async (challenge?: Challenge) => {
    const target = challenge || activeChallenge;
    if (!target) return;
    try {
      await http.post(`/api/challenges/${target.id}/complete`);

      const { data } = await http.get('/api/profile/stats');
      queryClient.setQueryData(
        ['progress-stats'],
        data
      );

      setCompletedToday(true);
      setStreak(typeof data?.streak === 'number' ? data.streak : streak + 1);
      setCompletedCount(typeof data?.total_completed === 'number' ? data.total_completed : completedCount + 1);

      setSelectedChallenges(prev => prev.filter(id => id !== target.id));
      markAsViewed(target.id);
      setActiveChallenge(null);

      const today = new Date().toDateString();
      await AsyncStorage.setItem('lastCompletedDate', today);
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
    if (!activeChallenge) return;
    
    const today = new Date().toDateString();
    
    setSkipsUsedToday(skipsUsedToday + 1);
    setActiveChallenge(null);
    
    await AsyncStorage.setItem('lastSkipDate', today);
  };

  const canSkip = () => {
    return skipsUsedToday < maxSkipsPerDay;
  };

  const canTakeNewChallenge = () => {
    if (isPremium) return true;
    return !completedToday && challengesTakenToday < 5;
  };

  const canSwipe = () => {
    return swipesUsedToday < maxSwipesPerDay;
  };

  const useSwipe = () => {
    setSwipesUsedToday(prev => prev + 1);
  };

  const markAsViewed = (challengeId: number) => {
    setViewedChallenges(prev => {
      if (!prev.includes(challengeId)) {
        const newViewed = [...prev, challengeId];
        AsyncStorage.setItem('viewedChallenges', JSON.stringify(newViewed));
        return newViewed;
      }
      return prev;
    });
  };

  const getUnviewedChallenges = (challenges: Challenge[]) => {
    return challenges.filter(challenge => !viewedChallenges.includes(challenge.id));
  };

  const markAsSelected = (challengeId: number) => {
    setSelectedChallenges(prev => {
      if (!prev.includes(challengeId)) {
        const newSelected = [...prev, challengeId];
        AsyncStorage.setItem('selectedChallenges', JSON.stringify(newSelected));
        return newSelected;
      }
      return prev;
    });
  };

  const isSelected = (challengeId: number) => {
    return selectedChallenges.includes(challengeId);
  };


  const handleSetActiveChallenge = (challenge: Challenge | null) => {
    setActiveChallenge(challenge);
    if (challenge) {
      setChallengesTakenToday(prev => prev + 1);
    }
  };

  const resetToNewDay = async () => {
    const today = new Date().toDateString();
    await AsyncStorage.setItem('lastDayDate', today);
    setCompletedToday(false);
    setActiveChallenge(null);
    setSkipsUsedToday(0);
    setSwipesUsedToday(0);
    setChallengesTakenToday(0);
    setSelectedChallenges([]);
  };

  const resetTodayData = async () => {
    try {
      console.log('🔄 Resetting today\'s data...');
      
      await AsyncStorage.multiRemove([
        'lastDayDate',
        'appData',
        'selectedChallenges',
        'viewedChallenges'
      ]);
      
      setCompletedToday(false);
      setActiveChallenge(null);
      setSkipsUsedToday(0);
      setSwipesUsedToday(0);
      setChallengesTakenToday(0);
      setSelectedChallenges([]);
      setViewedChallenges([]);
      
      const data = {
        streak,
        completedCount,
        completedToday: false,
        isPremium,
        skipsUsedToday: 0,
        swipesUsedToday: 0,
        favorites,
        activeChallenge: null,
        challengesTakenToday: 0,
      };
      await AsyncStorage.setItem('appData', JSON.stringify(data));
      
      console.log('✅ Today\'s data cleared successfully!');
      console.log('📊 Current state:', {
        completedToday,
        swipesUsedToday: 0,
        challengesTakenToday: 0,
        skipsUsedToday: 0
      });
    } catch (error) {
      console.error('❌ Failed to reset today\'s data:', error);
    }
  };

  const checkAndResetForNewDay = async (): Promise<boolean> => {
    try {
      const today = new Date().toDateString();
      const lastDayDate = await AsyncStorage.getItem('lastDayDate');
      
      if (lastDayDate && lastDayDate !== today) {
        await resetToNewDay();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking new day:', error);
      return false;
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      await checkAndResetForNewDay();
    }, 60000);

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
      resetToNewDay,
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
