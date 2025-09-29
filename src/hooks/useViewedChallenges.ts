import { useCallback } from 'react';
import { useAsyncStorageNumberArray } from './useAsyncStorage';
import { Challenge } from '../types/challenge';
import { STORAGE_KEYS } from '../types/hooks';

export function useViewedChallenges() {
  const [viewedChallenges, setViewedChallenges, addViewedChallenge] = useAsyncStorageNumberArray(STORAGE_KEYS.VIEWED_CHALLENGES, []);

  const markAsViewed = useCallback(async (challengeId: number) => {
    await addViewedChallenge(challengeId);
  }, [addViewedChallenge]);

  const getUnviewedChallenges = useCallback((challenges: Challenge[]) => {
    return challenges.filter(challenge => !viewedChallenges.includes(challenge.id));
  }, [viewedChallenges]);

  return {
    viewedChallenges,
    markAsViewed,
    getUnviewedChallenges,
  };
}
