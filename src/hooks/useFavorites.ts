import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useAsyncStorageArray } from './useAsyncStorage';
import { Challenge } from '../types/challenge';
import { STORAGE_KEYS } from '../types/hooks';

export function useFavorites(isPremium: boolean) {
  const [favorites, setFavorites, addToFavorites, removeFromFavorites] = useAsyncStorageArray<Challenge>(STORAGE_KEYS.FAVORITES, []);

  const handleAddToFavorites = useCallback((challenge: Challenge) => {
    if (favorites.length >= 10 && !isPremium) {
      Alert.alert('Favorites limit reached', 'Upgrade to Premium for unlimited favorites.');
      return;
    }
    if (!favorites.find(fav => fav.id === challenge.id)) {
      addToFavorites(challenge);
    }
  }, [favorites, isPremium, addToFavorites]);

  const handleRemoveFromFavorites = useCallback((challengeId: number) => {
    removeFromFavorites(challengeId);
  }, [removeFromFavorites]);

  return {
    favorites,
    addToFavorites: handleAddToFavorites,
    removeFromFavorites: handleRemoveFromFavorites,
  };
}
