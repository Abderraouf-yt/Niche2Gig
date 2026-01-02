
export interface Niche {
  niche: string;
  description: string;
  averagePrice: number;
  demand: number;
  competition: number;
  trend: number;
  gigTitles: string[];
  gigDescription: string;
  keywords: string[];
  faqs: { question: string; answer: string }[];
  battlePlan: string;
  competitorWeakness: string;
  competitionNote: string;
  targetAudience: string;
  marketingChannels: string[];
  painPoints: string[];
}

export interface ScoreBreakdown {
  demand: number;
  competition: number;
  price: number;
  trend: number;
}

export interface ScoredNiche extends Niche {
  score: number;
  breakdown: ScoreBreakdown;
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
