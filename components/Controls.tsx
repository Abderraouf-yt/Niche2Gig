import React from 'react';
import type { ScoringWeights } from '../types';

interface ControlsProps {
  weights: ScoringWeights;
  setWeights: React.Dispatch<React.SetStateAction<ScoringWeights>>;
  onAnalyze: () => void;
  isLoading: boolean;
}

const Slider: React.FC<{ label: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; min?: number; max?: number; step?: number; }> = ({ label, value, onChange, min = -10, max = 10, step = 1 }) => (
  <div className="space-y-2">
    <label className="flex justify-between text-sm font-medium text-gray-300">
      <span>{label}</span>
      <span className="font-bold text-cyan-400">{value}</span>
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-cyan-500"
    />
  </div>
);

export const Controls: React.FC<ControlsProps> = ({ weights, setWeights, onAnalyze, isLoading }) => {
  const handleWeightChange = (key: keyof ScoringWeights) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeights(prev => ({ ...prev, [key]: Number(e.target.value) }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white border-b border-gray-600 pb-3 mb-3">Scoring Weights</h2>
        <p className="text-sm text-gray-400">Adjust the importance of each metric to tailor the profitability score.</p>
      </div>
      
      <Slider label="Demand" value={weights.demand} onChange={handleWeightChange('demand')} />
      <Slider label="Competition" value={weights.competition} onChange={handleWeightChange('competition')} />
      <Slider label="Average Price" value={weights.averagePrice} onChange={handleWeightChange('averagePrice')} />
      <Slider label="Trend" value={weights.trend} onChange={handleWeightChange('trend')} />

      <button
        onClick={onAnalyze}
        disabled={isLoading}
        className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-cyan-500/30"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          <span>Re-Analyze Niches</span>
        )}
      </button>
    </div>
  );
};
