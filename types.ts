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
