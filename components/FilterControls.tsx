import React, { useState } from 'react';
import type { FilterState } from '../types';

interface FilterControlsProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

interface FilterPreset {
  id: string;
  label: string;
  icon: string;
  desc: string;
  state: FilterState;
}

const PRESETS: FilterPreset[] = [
  {
    id: 'all',
    label: 'All Leads',
    icon: '🌐',
    desc: 'No filters applied',
    state: { price: { min: 0, max: 2000 }, demand: { min: 1, max: 10 }, competition: { min: 1, max: 10 } }
  },
  {
    id: 'high-growth',
    label: 'High Growth',
    icon: '📈',
    desc: 'Demand > 6, Comp < 6',
    state: { price: { min: 0, max: 2000 }, demand: { min: 6, max: 10 }, competition: { min: 1, max: 6 } }
  },
  {
    id: 'low-entry',
    label: 'Low Entry',
    icon: '🚪',
    desc: 'Competition < 4 only',
    state: { price: { min: 0, max: 2000 }, demand: { min: 1, max: 10 }, competition: { min: 1, max: 4 } }
  },
  {
    id: 'premium',
    label: 'Premium',
    icon: '💎',
    desc: 'Price > $150 only',
    state: { price: { min: 150, max: 2000 }, demand: { min: 1, max: 10 }, competition: { min: 1, max: 10 } }
  }
];

const RangeInput: React.FC<{
    label: string;
    min: number;
    max: number;
    valueMin: number;
    valueMax: number;
    onChange: (key: 'min' | 'max', value: number) => void;
    step?: number;
    prefix?: string;
}> = ({ label, min, max, valueMin, valueMax, onChange, step = 1, prefix = '' }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
        <label className="block text-xs font-medium text-gray-400">{label}</label>
        <span className="text-xs font-bold text-cyan-400">{prefix}{valueMin} - {prefix}{valueMax}</span>
    </div>
    <div className="flex items-center space-x-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={valueMin}
        onChange={(e) => onChange('min', Math.min(Number(e.target.value), valueMax))}
        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={valueMax}
        onChange={(e) => onChange('max', Math.max(Number(e.target.value), valueMin))}
        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
      />
    </div>
  </div>
);

const MinMaxInput: React.FC<{
    label: string;
    valueMin: number;
    valueMax: number;
    onChange: (key: 'min' | 'max', value: number) => void;
}> = ({ label, valueMin, valueMax, onChange }) => (
    <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-400">{label}</label>
        <div className="flex items-center justify-between space-x-2">
            <input
                type="number"
                min="1"
                max="10"
                value={valueMin}
                onChange={(e) => onChange('min', Math.max(1, Math.min(Number(e.target.value), valueMax)))}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-center text-xs text-white focus:border-cyan-500 outline-none"
                placeholder="Min"
            />
            <span className="text-gray-500">-</span>
            <input
                type="number"
                min="1"
                max="10"
                value={valueMax}
                 onChange={(e) => onChange('max', Math.min(10, Math.max(Number(e.target.value), valueMin)))}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-center text-xs text-white focus:border-cyan-500 outline-none"
                placeholder="Max"
            />
        </div>
    </div>
);


export const FilterControls: React.FC<FilterControlsProps> = ({ filters, setFilters }) => {
  const [activePreset, setActivePreset] = useState<string>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handlePresetSelect = (preset: FilterPreset) => {
    setActivePreset(preset.id);
    setFilters(preset.state);
  };

  const handlePriceChange = (key: 'min' | 'max', value: number) => {
    setActivePreset('custom');
    setFilters(prev => ({ ...prev, price: { ...prev.price, [key]: value }}));
  };
  
  const handleDemandChange = (key: 'min' | 'max', value: number) => {
    setActivePreset('custom');
    setFilters(prev => ({ ...prev, demand: { ...prev.demand, [key]: value }}));
  };

  const handleCompetitionChange = (key: 'min' | 'max', value: number) => {
    setActivePreset('custom');
    setFilters(prev => ({ ...prev, competition: { ...prev.competition, [key]: value }}));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white border-b border-gray-600 pb-3 mb-4">Quick Filters</h2>
        <div className="grid grid-cols-2 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset)}
              className={`p-3 rounded-lg border text-left transition-all ${
                activePreset === preset.id
                  ? 'bg-cyan-900/30 border-cyan-500 ring-1 ring-cyan-500'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="text-xl mb-1">{preset.icon}</div>
              <div className="font-bold text-sm text-white">{preset.label}</div>
              <div className="text-[10px] text-gray-400 leading-tight">{preset.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-gray-400 hover:text-cyan-400 transition-colors flex items-center space-x-1 mb-4"
        >
          <span>{showAdvanced ? 'Hide' : 'Show'} Range Filters</span>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showAdvanced && (
          <div className="space-y-5 bg-gray-900/40 p-4 rounded-lg border border-gray-700 animate-in fade-in slide-in-from-top-2 duration-200">
            <RangeInput 
                label="Price Range"
                min={0}
                max={2000}
                step={50}
                valueMin={filters.price.min}
                valueMax={filters.price.max}
                onChange={handlePriceChange}
                prefix="$"
            />

            <div className="grid grid-cols-2 gap-4">
                <MinMaxInput
                    label="Demand (1-10)"
                    valueMin={filters.demand.min}
                    valueMax={filters.demand.max}
                    onChange={handleDemandChange}
                />
                
                <MinMaxInput
                    label="Comp. (1-10)"
                    valueMin={filters.competition.min}
                    valueMax={filters.competition.max}
                    onChange={handleCompetitionChange}
                />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};