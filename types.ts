
export interface Niche {
  niche: string;
  description: string;
  averagePrice: number;
  demand: number;
  competition: number;
  trend: number;
  scalabilityIndex: number; // 1-10: How easy to scale via AI/automation
  aiDisruptionRisk: number; // 1-10: Risk of being fully replaced by AI
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
  strategicForecast: string; // Renamed from strategicForecast2027
}

export interface ScoreBreakdown {
  demand: number;
  competition: number;
  price: number;
  trend: number;
  scalability: number;
}

export interface ScoredNiche extends Niche {
  score: number;
  breakdown: ScoreBreakdown;
}

export type NicheGoal = 'balanced' | 'quick-start' | 'high-ticket' | 'trend-hunter' | 'ai-hybrid' | 'custom';

export interface ScoringWeights {
  demand: number;
  competition: number;
  averagePrice: number;
  trend: number;
  scalability: number;
}

export interface FilterState {
  price: { min: number; max: number };
  demand: { min: number; max: number };
  competition: { min: number; max: number };
}
