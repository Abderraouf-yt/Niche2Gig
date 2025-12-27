import React, { useState } from 'react';
import type { ScoringWeights, NicheGoal } from '../types';

interface ControlsProps {
  weights: ScoringWeights;
  setWeights: React.Dispatch<React.SetStateAction<ScoringWeights>>;
  onAnalyze: () => void;
  isLoading: boolean;
}

const PRESETS: Record<Exclude<NicheGoal, 'custom'>, ScoringWeights> = {
  'balanced': { demand: 5, competition: -5, averagePrice: 4, trend: 3 },
  'quick-start': { demand: 8, competition: -10, averagePrice: 2, trend: 4 },
  'high-ticket': { demand: 4, competition: -4, averagePrice: 10, trend: 2 },
  'trend-hunter': { demand: 3, competition: -3, averagePrice: 3, trend: 10 },
};

const Slider: React.FC<{ label: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; min?: number; max?: number; step?: number; }> = ({ label, value, onChange, min = -10, max = 10, step = 1 }) => (
  <div className="space-y-2">
    <label className="flex justify-between text-xs font-medium text-gray-400">
      <span>{label}</span>
      <span className="font-bold text-cyan-400">{value > 0 ? `+${value}` : value}</span>
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
    />
  </div>
);

export const Controls: React.FC<ControlsProps> = ({ weights, setWeights, onAnalyze, isLoading }) => {
  const [selectedGoal, setSelectedGoal] = useState<NicheGoal>('balanced');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGoalSelect = (goal: NicheGoal) => {
    setSelectedGoal(goal);
    if (goal !== 'custom') {
      setWeights(PRESETS[goal]);
    }
  };

  const handleWeightChange = (key: keyof ScoringWeights) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedGoal('custom');
    setWeights(prev => ({ ...prev, [key]: Number(e.target.value) }));
  };

  const goals = [
    { id: 'balanced', label: 'Balanced', icon: '⚖️', desc: 'Standard market analysis' },
    { id: 'quick-start', label: 'Quick Start', icon: '⚡', desc: 'Low competition focus' },
    { id: 'high-ticket', label: 'High Ticket', icon: '💰', desc: 'Maximize project value' },
    { id: 'trend-hunter', label: 'Trend Hunter', icon: '🚀', desc: 'Emerging growth focus' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white border-b border-gray-600 pb-3 mb-4">Discovery Goal</h2>
        <div className="grid grid-cols-2 gap-3">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => handleGoalSelect(goal.id as NicheGoal)}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedGoal === goal.id
                  ? 'bg-cyan-900/30 border-cyan-500 ring-1 ring-cyan-500'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="text-xl mb-1">{goal.icon}</div>
              <div className="font-bold text-sm text-white">{goal.label}</div>
              <div className="text-[10px] text-gray-400 leading-tight">{goal.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-gray-400 hover:text-cyan-400 transition-colors flex items-center space-x-1 mb-4"
        >
          <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Scoring Math</span>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showAdvanced && (
          <div className="space-y-4 bg-gray-900/40 p-4 rounded-lg border border-gray-700 animate-in fade-in slide-in-from-top-2 duration-200">
            <Slider label="Demand Priority" value={weights.demand} onChange={handleWeightChange('demand')} />
            <Slider label="Competition Resistance" value={weights.competition} onChange={handleWeightChange('competition')} />
            <Slider label="Price Importance" value={weights.averagePrice} onChange={handleWeightChange('averagePrice')} />
            <Slider label="Trend Sensitivity" value={weights.trend} onChange={handleWeightChange('trend')} />
            <p className="text-[10px] text-gray-500 italic mt-2">
              Values determine how much each metric influences the final 0-100 score.
            </p>
          </div>
        )}
      </div>

      <button
        onClick={onAnalyze}
        disabled={isLoading}
        className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-cyan-500/30 active:scale-95"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          <span>Refresh Niche Analysis</span>
        )}
      </button>
    </div>
  );
};