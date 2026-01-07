
import React, { useState } from 'react';
import type { ScoringWeights, NicheGoal } from '../types';

interface ControlsProps {
  weights: ScoringWeights;
  setWeights: React.Dispatch<React.SetStateAction<ScoringWeights>>;
  onAnalyze: () => void;
  isLoading: boolean;
}

const PRESETS: Record<Exclude<NicheGoal, 'custom'>, ScoringWeights> = {
  'balanced': { demand: 5, competition: -5, averagePrice: 4, trend: 6, scalability: 7 },
  'quick-start': { demand: 8, competition: -10, averagePrice: 3, trend: 5, scalability: 5 },
  'high-ticket': { demand: 4, competition: -4, averagePrice: 10, trend: 3, scalability: 8 },
  'trend-hunter': { demand: 3, competition: -3, averagePrice: 4, trend: 10, scalability: 6 },
  'ai-hybrid': { demand: 6, competition: -4, averagePrice: 5, trend: 7, scalability: 10 },
};

const Slider: React.FC<{ label: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; min?: number; max?: number; step?: number; }> = ({ label, value, onChange, min = -10, max = 10, step = 1 }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
      <span>{label}</span>
      <span className={`px-2 py-0.5 rounded-md ${value > 0 ? 'bg-cyan-500/20 text-cyan-400' : 'bg-red-500/20 text-red-400'}`}>
        {value > 0 ? `+${value}` : value}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className="w-full h-1 bg-gray-800 rounded-full appearance-none cursor-pointer accent-cyan-500"
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
    { id: 'balanced', label: 'Balanced', icon: '⚖️', desc: 'Standard analysis' },
    { id: 'quick-start', label: 'Launch', icon: '⚡', desc: 'Low resistance' },
    { id: 'high-ticket', label: 'VIP', icon: '💎', desc: 'Max ROI per hour' },
    { id: 'ai-hybrid', label: 'Scalable', icon: '🤖', desc: 'Automation ready' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center">
           <span className="w-1 h-4 bg-cyan-500 mr-3"></span>
           Strategic Objectives
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => handleGoalSelect(goal.id as NicheGoal)}
              className={`p-4 rounded-2xl border transition-all flex flex-col items-start ${
                selectedGoal === goal.id
                  ? 'bg-cyan-500/10 border-cyan-500/50 ring-1 ring-cyan-500/20'
                  : 'bg-white/5 border-white/5 hover:border-white/10'
              }`}
            >
              <div className="text-xl mb-2">{goal.icon}</div>
              <div className="font-black text-xs text-white uppercase tracking-tight mb-1">{goal.label}</div>
              <div className="text-[9px] text-gray-500 font-medium leading-tight">{goal.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[9px] text-gray-400 font-black uppercase tracking-widest transition-all"
        >
          {showAdvanced ? 'Lock Core Config' : 'Access Weight Adjustors'}
        </button>

        {showAdvanced && (
          <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <Slider label="Demand" value={weights.demand} onChange={handleWeightChange('demand')} />
            <Slider label="Market Friction" value={weights.competition} onChange={handleWeightChange('competition')} />
            <Slider label="Ticket Value" value={weights.averagePrice} onChange={handleWeightChange('averagePrice')} />
            <Slider label="Growth Velocity" value={weights.trend} onChange={handleWeightChange('trend')} />
            <Slider label="Scalability" value={weights.scalability} onChange={handleWeightChange('scalability')} />
          </div>
        )}
      </div>

      <button
        onClick={onAnalyze}
        disabled={isLoading}
        className="group relative w-full bg-cyan-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-cyan-900/20 active:scale-95 overflow-hidden"
      >
        <div className="relative z-10 flex items-center justify-center space-x-3 text-xs uppercase tracking-[0.15em]">
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>Syncing Data...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              <span>Engage Intelligence</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
};
