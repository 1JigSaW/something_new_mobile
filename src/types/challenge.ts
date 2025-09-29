export type Challenge = {
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
};

export type ChallengeFilters = {
  limit?: number;
  category?: string;
  size?: string;
  freeOnly?: boolean;
};

export type ProgressStats = {
  daily_stats: Array<{ date: string; completed: number }>;
  streak: number;
  total_completed: number;
};

export * from './hooks';
export * from './navigation';
