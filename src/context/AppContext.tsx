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
  // Current active challenge
  activeChallenge: Challenge | null;
  setActiveChallenge: (challenge: Challenge | null) => void;
  
  // Statistics
  streak: number;
  completedCount: number;
  completedToday: boolean;
  
  // Premium status
  isPremium: boolean;
  setIsPremium: (premium: boolean) => void;
  
  // Skips
  skipsUsedToday: number;
  maxSkipsPerDay: number;
  
  // Swipes (global logic)
  swipesUsedToday: number;
  maxSwipesPerDay: number;
  canSwipe: () => boolean;
  useSwipe: () => void;
  
  // Viewed challenges
  viewedChallenges: number[];
  markAsViewed: (challengeId: number) => void;
  getUnviewedChallenges: (challenges: Challenge[]) => Challenge[];
  
  // Selected challenges (chosen but not completed)
  selectedChallenges: number[];
  markAsSelected: (challengeId: number) => void;
  isSelected: (challengeId: number) => boolean;
  
  // Favorites
  favorites: Challenge[];
  addToFavorites: (challenge: Challenge) => void;
  removeFromFavorites: (challengeId: number) => void;
  
  // Actions
  completeChallenge: () => void;
  skipChallenge: () => void;
  canSkip: () => boolean;
  canTakeNewChallenge: () => boolean;
  resetToNewDay: () => Promise<void>;
  checkAndResetForNewDay: () => Promise<boolean>;
  resetTodayData: () => Promise<void>;
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
  const [selectedChallenges, setSelectedChallenges] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<Challenge[]>([]);
  const [challengesTakenToday, setChallengesTakenToday] = useState(0);

  const maxSkipsPerDay = isPremium ? 999 : 5;
  const maxSwipesPerDay = isPremium ? 999 : 15;

  // Load data on startup
  useEffect(() => {
    loadAppData();
  }, []);

  const loadAppData = async () => {
    try {
      const data = await AsyncStorage.getItem('appData');
      const today = new Date().toDateString();
      let lastCompletedDate = await AsyncStorage.getItem('lastCompletedDate');
      
      // If no lastCompletedDate - set today's date
      if (!lastCompletedDate) {
        await AsyncStorage.setItem('lastCompletedDate', today);
        lastCompletedDate = today;
      }

      // Load viewed challenges
      const viewedData = await AsyncStorage.getItem('viewedChallenges');
      if (viewedData) {
        setViewedChallenges(JSON.parse(viewedData));
      }

      // Load selected challenges
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
        
        // If new day - reset everything
        if (lastCompletedDate !== today) {
          setCompletedToday(false);
          setActiveChallenge(null);
          setSkipsUsedToday(0);
          setChallengesTakenToday(0);
          // Update date
          await AsyncStorage.setItem('lastCompletedDate', today);
        } else {
          // Same day - restore state
          setCompletedToday(parsed.completedToday || false);
          setActiveChallenge(parsed.activeChallenge || null);
          setSkipsUsedToday(parsed.skipsUsedToday || 0);
          setSwipesUsedToday(parsed.swipesUsedToday || 0);
          setChallengesTakenToday(parsed.challengesTakenToday || 0);
        }
      } else {
        // No data - set defaults
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

  // Save data on change
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

  const completeChallenge = async () => {
    if (!activeChallenge) return;
    
    const today = new Date().toDateString();
    
    setCompletedCount(completedCount + 1);
    setCompletedToday(true);
    setStreak(streak + 1);
    
    // Remove from selected and add to viewed
    setSelectedChallenges(prev => prev.filter(id => id !== activeChallenge.id));
    markAsViewed(activeChallenge.id);
    
    setActiveChallenge(null);
    
    // Save completion date
    await AsyncStorage.setItem('lastCompletedDate', today);
  };

  const skipChallenge = async () => {
    if (!activeChallenge) return;
    
    const today = new Date().toDateString();
    
    setSkipsUsedToday(skipsUsedToday + 1);
    setActiveChallenge(null);
    
    // Save skip date
    await AsyncStorage.setItem('lastSkipDate', today);
  };

  const canSkip = () => {
    return skipsUsedToday < maxSkipsPerDay;
  };

  const canTakeNewChallenge = () => {
    // In free version - can take challenge if not completed today AND taken less than 5
    // In Premium - always can
    if (isPremium) return true;
    return !completedToday && challengesTakenToday < 5;
  };

  const canSwipe = () => {
    // Can swipe if swipe limit not exceeded
    return swipesUsedToday < maxSwipesPerDay;
  };

  const useSwipe = () => {
    // Use one swipe
    setSwipesUsedToday(prev => prev + 1);
  };

  const markAsViewed = (challengeId: number) => {
    setViewedChallenges(prev => {
      if (!prev.includes(challengeId)) {
        const newViewed = [...prev, challengeId];
        // Save to AsyncStorage
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
        // Save to AsyncStorage
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
      // Increase taken challenges counter
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
    setSelectedChallenges([]); // Reset selected challenges
    // Viewed challenges are NOT reset - they remain forever
  };

  const resetTodayData = async () => {
    try {
      console.log('🔄 Resetting today\'s data...');
      
      // Clear ALL data from AsyncStorage
      await AsyncStorage.multiRemove([
        'lastCompletedDate',
        'appData',
        'selectedChallenges',
        'viewedChallenges'
      ]);
      
      // Reset all today's data in state
      setCompletedToday(false);
      setActiveChallenge(null);
      setSkipsUsedToday(0);
      setSwipesUsedToday(0);
      setChallengesTakenToday(0);
      setSelectedChallenges([]);
      setViewedChallenges([]);
      
      // Update app data in storage
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
      const lastCompletedDate = await AsyncStorage.getItem('lastCompletedDate');
      
      // If new day - reset state
      if (lastCompletedDate && lastCompletedDate !== today) {
        await resetToNewDay();
        return true; // Was new day
      }
      return false; // Same day
    } catch (error) {
      console.error('Error checking new day:', error);
      return false;
    }
  };

  // Check for new day every minute
  useEffect(() => {
    const interval = setInterval(async () => {
      await checkAndResetForNewDay();
    }, 60000); // Check every minute

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
