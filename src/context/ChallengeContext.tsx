import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Challenge {
  id: number;
  title: string;
  description: string;
  duration: string;
  size: 'small' | 'medium' | 'large';
}

interface ChallengeContextType {
  selectedChallenge: Challenge | null;
  setSelectedChallenge: (challenge: Challenge | null) => void;
  selectedForToday: Array<{
    id: number;
    title: string;
    size: 'small' | 'medium' | 'large';
  }>;
  setSelectedForToday: (challenges: Array<{
    id: number;
    title: string;
    size: 'small' | 'medium' | 'large';
  }>) => void;
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export function ChallengeProvider({ children }: { children: ReactNode }) {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [selectedForToday, setSelectedForToday] = useState<Array<{
    id: number;
    title: string;
    size: 'small' | 'medium' | 'large';
  }>>([]);

  return (
    <ChallengeContext.Provider value={{
      selectedChallenge,
      setSelectedChallenge,
      selectedForToday,
      setSelectedForToday,
    }}>
      {children}
    </ChallengeContext.Provider>
  );
}

export function useChallengeContext() {
  const context = useContext(ChallengeContext);
  if (context === undefined) {
    throw new Error('useChallengeContext must be used within a ChallengeProvider');
  }
  return context;
}
