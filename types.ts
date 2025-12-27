// Fix: Define the types used throughout the application.
export interface Niche {
  niche: string;
  description: string;
  averagePrice: number;
  demand: number;
  competition: number;
  trend: number;
}

export interface ScoredNiche extends Niche {
  score: number;
}

export type NicheGoal = 'balanced' | 'quick-start' | 'high-ticket' | 'trend-hunter' | 'custom';

export interface ScoringWeights {
  demand: number;
  competition: number;
  averagePrice: number;
  trend: number;
}

export interface FilterState {
  price: { min: number; max: number };
  demand: { min: number; max: number };
  competition: { min: number; max: number };
}