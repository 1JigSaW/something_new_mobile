import { useCallback } from 'react';
import { useAsyncStorageNumberArray } from './useAsyncStorage';
import { STORAGE_KEYS } from '../types/hooks';

export function useSelectedChallenges() {
  const [selectedChallenges, setSelectedChallenges, addSelectedChallenge, removeSelectedChallenge] = useAsyncStorageNumberArray(STORAGE_KEYS.SELECTED_CHALLENGES, []);

  const markAsSelected = useCallback(async (challengeId: number) => {
    await addSelectedChallenge(challengeId);
  }, [addSelectedChallenge]);

  const isSelected = useCallback((challengeId: number) => {
    return selectedChallenges.includes(challengeId);
  }, [selectedChallenges]);

  const removeFromSelected = useCallback(async (challengeId: number) => {
    await removeSelectedChallenge(challengeId);
  }, [removeSelectedChallenge]);

  return {
    selectedChallenges,
    markAsSelected,
    isSelected,
    removeFromSelected,
  };
}
