import { useCallback } from 'react';
import { useAsyncStorageNumberArray } from './useAsyncStorage';
import { STORAGE_KEYS } from '../types/hooks';

export function useCompletedChallenges() {
  const [
    completedChallenges,
    setCompletedChallenges,
    addCompletedChallenge,
    removeCompletedChallenge,
  ] = useAsyncStorageNumberArray(
    STORAGE_KEYS.COMPLETED_CHALLENGES,
    []
  );

  const markAsCompleted = useCallback(
    async (
      challengeId: number
    ) => {
      await addCompletedChallenge(challengeId);
    },
    [
      addCompletedChallenge
    ]
  );

  const isCompleted = useCallback(
    (
      challengeId: number
    ) => {
      return completedChallenges.includes(challengeId);
    },
    [
      completedChallenges
    ]
  );

  return {
    completedChallenges,
    setCompletedChallenges,
    markAsCompleted,
    isCompleted,
    removeCompletedChallenge,
  };
}


