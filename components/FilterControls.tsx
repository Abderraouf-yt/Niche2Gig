
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
    isClamped?: boolean;
}> = ({ label, min, max, valueMin, valueMax, onChange, step = 1, prefix = '', isClamped }) => (
  <div className={`space-y-2 transition-colors duration-300 ${isClamped ? 'bg-red-500/10 p-2 -m-2 rounded-lg' : ''}`}>
    <div className="flex justify-between items-center">
        <label className={`block text-xs font-medium transition-colors ${isClamped ? 'text-red-400' : 'text-gray-400'}`}>
          {label} {isClamped && <span className="ml-1 text-[8px] uppercase tracking-widest">(Boundary Lock)</span>}
        </label>
        <span className={`text-xs font-bold transition-colors ${isClamped ? 'text-red-400' : 'text-cyan-400'}`}>
          {prefix}{valueMin} - {prefix}{valueMax}
        </span>
    </div>
    <div className="flex items-center space-x-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={valueMin}
        onChange={(e) => onChange('min', Number(e.target.value))}
        className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer transition-all ${isClamped ? 'accent-red-500 bg-red-900/40' : 'accent-cyan-500 bg-gray-700'}`}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={valueMax}
        onChange={(e) => onChange('max', Number(e.target.value))}
        className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer transition-all ${isClamped ? 'accent-red-500 bg-red-900/40' : 'accent-cyan-500 bg-gray-700'}`}
      />
    </div>
  </div>
);

const MinMaxInput: React.FC<{
    label: string;
    valueMin: number;
    valueMax: number;
    onChange: (key: 'min' | 'max', value: number) => void;
    isClamped?: boolean;
}> = ({ label, valueMin, valueMax, onChange, isClamped }) => (
    <div className={`space-y-2 transition-colors duration-300 ${isClamped ? 'bg-red-500/10 p-2 -m-2 rounded-lg' : ''}`}>
        <label className={`block text-xs font-medium transition-colors ${isClamped ? 'text-red-400' : 'text-gray-400'}`}>
          {label}
        </label>
        <div className="flex items-center justify-between space-x-2">
            <input
                type="number"
                min="1"
                max="10"
                value={valueMin}
                onChange={(e) => onChange('min', Number(e.target.value))}
                className={`w-full bg-gray-800 border rounded-md px-2 py-1 text-center text-xs text-white outline-none transition-colors ${isClamped ? 'border-red-500 text-red-200' : 'border-gray-700 focus:border-cyan-500'}`}
                placeholder="Min"
            />
            <span className="text-gray-500">-</span>
            <input
                type="number"
                min="1"
                max="10"
                value={valueMax}
                 onChange={(e) => onChange('max', Number(e.target.value))}
                className={`w-full bg-gray-800 border rounded-md px-2 py-1 text-center text-xs text-white outline-none transition-colors ${isClamped ? 'border-red-500 text-red-200' : 'border-gray-700 focus:border-cyan-500'}`}
                placeholder="Max"
            />
        </div>
        {isClamped && <p className="text-[9px] text-red-500 font-bold uppercase text-center">Min cannot exceed Max</p>}
    </div>
);


export const FilterControls: React.FC<FilterControlsProps> = ({ filters, setFilters }) => {
  const [activePreset, setActivePreset] = useState<string>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [clampedField, setClampedField] = useState<string | null>(null);

  const triggerFeedback = (field: string) => {
    setClampedField(field);
    setTimeout(() => setClampedField(null), 800);
  };

  const handlePresetSelect = (preset: FilterPreset) => {
    setActivePreset(preset.id);
    setFilters(preset.state);
  };

  const validateAndSet = (category: keyof FilterState, key: 'min' | 'max', val: number) => {
    setActivePreset('custom');
    const currentRange = filters[category];
    
    if (key === 'min' && val > currentRange.max) {
      triggerFeedback(category);
      setFilters(prev => ({ ...prev, [category]: { ...prev[category], min: prev[category].max } }));
      return;
    }
    
    if (key === 'max' && val < currentRange.min) {
      triggerFeedback(category);
      setFilters(prev => ({ ...prev, [category]: { ...prev[category], max: prev[category].min } }));
      return;
    }

    setFilters(prev => ({ ...prev, [category]: { ...prev[category], [key]: val } }));
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
                onChange={(k, v) => validateAndSet('price', k, v)}
                prefix="$"
                isClamped={clampedField === 'price'}
            />

            <div className="grid grid-cols-2 gap-4">
                <MinMaxInput
                    label="Demand (1-10)"
                    valueMin={filters.demand.min}
                    valueMax={filters.demand.max}
                    onChange={(k, v) => validateAndSet('demand', k, v)}
                    isClamped={clampedField === 'demand'}
                />
                
                <MinMaxInput
                    label="Comp. (1-10)"
                    valueMin={filters.competition.min}
                    valueMax={filters.competition.max}
                    onChange={(k, v) => validateAndSet('competition', k, v)}
                    isClamped={clampedField === 'competition'}
                />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
