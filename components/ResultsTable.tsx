import React, { useState, useMemo } from 'react';
import type { ScoredNiche } from '../types';
import { ROIModal } from './ROIModal';
import { GigTaskModal } from './GigTaskModal';
import { CompetitionModal } from './CompetitionModal';

interface ResultsTableProps {
  data: ScoredNiche[];
}

const MetricBadge: React.FC<{ label: string; value: number | string; color: string; icon?: string }> = ({ label, value, color, icon }) => (
  <div className="flex flex-col bg-gray-900/40 p-2 rounded border border-gray-700/50">
    <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">{label}</span>
    <div className={`flex items-center space-x-1 font-bold ${color}`}>
      {icon && <span>{icon}</span>}
      <span className="text-sm">{value}</span>
    </div>
  </div>
);

const TrendBadge: React.FC<{ trend: number }> = ({ trend }) => {
  const isRising = trend > 0.6;
  const isDeclining = trend < -0.6;
  const color = isRising ? 'text-emerald-400' : isDeclining ? 'text-red-400' : 'text-yellow-400';
  const icon = isRising ? '↗' : isDeclining ? '↘' : '→';
  const label = isRising ? 'Rising' : isDeclining ? 'Fading' : 'Stable';

  return (
    <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full bg-gray-900/80 border border-gray-700 text-[10px] font-bold ${color}`}>
      <span>{icon}</span>
      <span className="uppercase">{label}</span>
    </div>
  );
};

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const color = score > 70 ? '#22d3ee' : score > 40 ? '#facc15' : '#f87171';
  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <circle className="text-gray-700" strokeWidth="3" stroke="currentColor" fill="transparent" r="16" cx="18" cy="18" />
        <circle
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${score}, 100`}
          strokeLinecap="round"
          fill="transparent"
          r="16" cx="18" cy="18"
          className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-black" style={{ color }}>{score}</span>
      </div>
    </div>
  );
};

export const ResultsTable: React.FC<ResultsTableProps> = ({ data }) => {
  const [sortKey, setSortKey] = useState<keyof ScoredNiche>('score');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedNiche, setSelectedNiche] = useState<{ niche: ScoredNiche | null; modal: 'roi' | 'gig' | 'competition' | null }>({ niche: null, modal: null });
  const [expandedNiche, setExpandedNiche] = useState<string | null>(null);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      const multiplier = sortDir === 'asc' ? 1 : -1;
      if (typeof valA === 'number' && typeof valB === 'number') return (valA - valB) * multiplier;
      return String(valA).localeCompare(String(valB)) * multiplier;
    });
  }, [data, sortKey, sortDir]);

  const toggleSort = (key: keyof ScoredNiche) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sortOptions: { key: keyof ScoredNiche; label: string }[] = [
    { key: 'score', label: 'Match Score' },
    { key: 'averagePrice', label: 'Pricing' },
    { key: 'demand', label: 'Demand' },
    { key: 'competition', label: 'Competition' },
    { key: 'trend', label: 'Market Trend' },
  ];

  return (
    <div className="space-y-6">
      {/* Sort Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-800/30 rounded-xl border border-gray-700/50">
        <span className="text-xs font-bold text-gray-500 uppercase ml-2">Sort By:</span>
        {sortOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => toggleSort(opt.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 border ${
              sortKey === opt.key
                ? 'bg-cyan-600 border-cyan-400 text-white shadow-lg shadow-cyan-900/20'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            <span>{opt.label}</span>
            {sortKey === opt.key && (
              <span className="text-[10px] opacity-70">{sortDir === 'desc' ? '▼' : '▲'}</span>
            )}
          </button>
        ))}
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedData.map((niche) => (
          <div 
            key={niche.niche}
            className={`group relative flex flex-col bg-gray-800/40 rounded-2xl border transition-all duration-300 hover:shadow-2xl hover:bg-gray-800/60 ${
              expandedNiche === niche.niche ? 'ring-2 ring-cyan-500/50 border-cyan-500/50 bg-gray-800/80' : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            {/* Card Header */}
            <div className="p-5 flex justify-between items-start space-x-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                    <TrendBadge trend={niche.trend} />
                </div>
                <h3 className="text-lg font-bold text-white truncate group-hover:text-cyan-400 transition-colors" title={niche.niche}>
                  {niche.niche}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-1 mt-1">{niche.description}</p>
              </div>
              <ScoreGauge score={niche.score} />
            </div>

            {/* Metrics Grid */}
            <div className="px-5 pb-5 grid grid-cols-2 gap-3">
              <MetricBadge label="Demand" value={`${niche.demand}/10`} color={niche.demand > 7 ? 'text-emerald-400' : 'text-yellow-400'} />
              <MetricBadge label="Competition" value={`${niche.competition}/10`} color={niche.competition < 4 ? 'text-emerald-400' : 'text-red-400'} />
              <MetricBadge label="Avg. Price" value={`$${niche.averagePrice}`} color="text-cyan-400" icon="💰" />
              <MetricBadge label="Potential" value={niche.score > 80 ? 'High' : 'Med'} color="text-purple-400" icon="✨" />
            </div>

            {/* Expanded Content */}
            {expandedNiche === niche.niche && (
              <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-700 text-sm text-gray-300 leading-relaxed">
                  <h4 className="text-xs font-black text-gray-500 uppercase mb-2 tracking-widest">Opportunity Profile</h4>
                  {niche.description}
                </div>
              </div>
            )}

            {/* Action Footer */}
            <div className="mt-auto p-4 border-t border-gray-700/50 flex items-center justify-between bg-gray-900/20 rounded-b-2xl">
              <button 
                onClick={() => setExpandedNiche(expandedNiche === niche.niche ? null : niche.niche)}
                className="text-xs font-bold text-gray-500 hover:text-white transition-colors flex items-center space-x-1"
              >
                <span>{expandedNiche === niche.niche ? 'Less' : 'Details'}</span>
                <svg className={`w-3 h-3 transition-transform ${expandedNiche === niche.niche ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="flex space-x-1">
                <button 
                  onClick={() => setSelectedNiche({niche, modal: 'roi'})}
                  className="p-2 bg-cyan-900/40 hover:bg-cyan-600 text-cyan-400 hover:text-white rounded-lg transition-all border border-cyan-800/50"
                  title="ROI Calculator"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                </button>
                <button 
                  onClick={() => setSelectedNiche({niche, modal: 'gig'})}
                  className="p-2 bg-emerald-900/40 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg transition-all border border-emerald-800/50"
                  title="Gig Strategy"
                >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button 
                  onClick={() => setSelectedNiche({niche, modal: 'competition'})}
                  className="p-2 bg-yellow-900/40 hover:bg-yellow-600 text-yellow-400 hover:text-white rounded-lg transition-all border border-yellow-800/50"
                  title="Competitor Insights"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a4 4 0 110-5.292" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ROIModal isOpen={selectedNiche.modal === 'roi'} niche={selectedNiche.niche} onClose={() => setSelectedNiche({ niche: null, modal: null })} />
      <GigTaskModal isOpen={selectedNiche.modal === 'gig'} niche={selectedNiche.niche} onClose={() => setSelectedNiche({ niche: null, modal: null })} />
      <CompetitionModal isOpen={selectedNiche.modal === 'competition'} niche={selectedNiche.niche} onClose={() => setSelectedNiche({ niche: null, modal: null })} />
    </div>
  );
};