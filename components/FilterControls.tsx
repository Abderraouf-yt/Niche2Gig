import React from 'react';
import type { FilterState } from '../types';

interface FilterControlsProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

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
    <label className="block text-sm font-medium text-gray-300">{label}</label>
    <div className="flex items-center space-x-2">
      <span className="text-xs text-gray-400">{prefix}{min}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={valueMin}
        onChange={(e) => onChange('min', Math.min(Number(e.target.value), valueMax))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={valueMax}
        onChange={(e) => onChange('max', Math.max(Number(e.target.value), valueMin))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
      />
      <span className="text-xs text-gray-400">{prefix}{max}</span>
    </div>
     <div className="text-center text-sm font-bold text-cyan-400">{prefix}{valueMin} - {prefix}{valueMax}</div>
  </div>
);

const MinMaxInput: React.FC<{
    label: string;
    valueMin: number;
    valueMax: number;
    onChange: (key: 'min' | 'max', value: number) => void;
}> = ({ label, valueMin, valueMax, onChange }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">{label}</label>
        <div className="flex items-center justify-between space-x-2">
            <input
                type="number"
                min="1"
                max="10"
                value={valueMin}
                onChange={(e) => onChange('min', Math.max(1, Math.min(Number(e.target.value), valueMax)))}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-center text-sm"
                placeholder="Min"
            />
            <span className="text-gray-400">-</span>
            <input
                type="number"
                min="1"
                max="10"
                value={valueMax}
                 onChange={(e) => onChange('max', Math.min(10, Math.max(Number(e.target.value), valueMin)))}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-center text-sm"
                placeholder="Max"
            />
        </div>
    </div>
);


export const FilterControls: React.FC<FilterControlsProps> = ({ filters, setFilters }) => {

  const handlePriceChange = (key: 'min' | 'max', value: number) => {
    setFilters(prev => ({ ...prev, price: { ...prev.price, [key]: value }}));
  };
  
  const handleDemandChange = (key: 'min' | 'max', value: number) => {
    setFilters(prev => ({ ...prev, demand: { ...prev.demand, [key]: value }}));
  };

  const handleCompetitionChange = (key: 'min' | 'max', value: number) => {
    setFilters(prev => ({ ...prev, competition: { ...prev.competition, [key]: value }}));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white border-b border-gray-600 pb-3">Filter Results</h2>
      
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

      <MinMaxInput
        label="Demand (1-10)"
        valueMin={filters.demand.min}
        valueMax={filters.demand.max}
        onChange={handleDemandChange}
      />
      
       <MinMaxInput
        label="Competition (1-10)"
        valueMin={filters.competition.min}
        valueMax={filters.competition.max}
        onChange={handleCompetitionChange}
      />

    </div>
  );
};
