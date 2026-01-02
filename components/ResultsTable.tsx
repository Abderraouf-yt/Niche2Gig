
import React, { useState, useMemo } from 'react';
import type { ScoredNiche, ScoreBreakdown } from '../types';
import { ROIModal } from './ROIModal';
import { GigTaskModal } from './GigTaskModal';
import { CompetitionModal } from './CompetitionModal';
import { exportSingleNicheBlueprint } from '../utils/exportUtils';

interface ResultsTableProps {
  data: ScoredNiche[];
  expandedNiche: string | null;
  setExpandedNiche: (nicheName: string | null) => void;
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

const CompetitionBar: React.FC<{ level: number }> = ({ level }) => {
  const filledDots = Math.ceil(level / 2);
  
  const getColorClasses = () => {
    if (level <= 3) return { bg: 'bg-emerald-500', text: 'text-emerald-400', label: 'Easy' };
    if (level <= 7) return { bg: 'bg-yellow-500', text: 'text-yellow-400', label: 'Moderate' };
    return { bg: 'bg-red-500', text: 'text-red-400', label: 'Hard' };
  };

  const { bg, text, label } = getColorClasses();

  return (
    <div className="flex flex-col bg-gray-900/40 p-2 rounded border border-gray-700/50">
      <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-1">Entry</span>
      <div className="flex flex-col">
        <div className="flex space-x-1 mb-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${i <= filledDots ? bg : 'bg-gray-800'}`} 
            />
          ))}
        </div>
        <span className={`text-[10px] font-black uppercase text-right leading-none ${text}`}>
          {label}
        </span>
      </div>
    </div>
  );
};

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
    <div className="relative w-16 h-16 flex-shrink-0 flex flex-col items-center justify-center">
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
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
        <span className="text-lg font-black leading-none" style={{ color }}>{score}</span>
        <span className="text-[7px] font-black uppercase opacity-60 tracking-tighter" style={{ color }}>Index</span>
      </div>
    </div>
  );
};

const ScoreDNABreakdown: React.FC<{ breakdown: ScoreBreakdown }> = ({ breakdown }) => {
  const total = breakdown.demand + breakdown.competition + breakdown.price + breakdown.trend || 1;
  const factors = [
    { label: 'Demand', val: breakdown.demand, color: 'bg-cyan-500' },
    { label: 'Resistance', val: breakdown.competition, color: 'bg-emerald-500' },
    { label: 'Value', val: breakdown.price, color: 'bg-purple-500' },
    { label: 'Trend', val: breakdown.trend, color: 'bg-orange-500' }
  ];

  return (
    <div className="space-y-2 mb-4 bg-gray-950/40 p-3 rounded-lg border border-gray-700/50">
      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Market Strength DNA</h4>
      <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-gray-800">
        {factors.map((f, i) => (
          <div 
            key={i} 
            className={`${f.color} h-full transition-all duration-700 ease-out`} 
            style={{ width: `${(f.val / total) * 100}%` }}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
        {factors.map((f, i) => (
          <div key={i} className="flex items-center justify-between text-[9px] font-bold">
            <div className="flex items-center space-x-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${f.color}`} />
              <span className="text-gray-400 uppercase tracking-tight">{f.label}</span>
            </div>
            <span className="text-gray-200">{Math.round((f.val / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ResultsTable: React.FC<ResultsTableProps> = ({ data, expandedNiche, setExpandedNiche }) => {
  const [sortKey, setSortKey] = useState<keyof ScoredNiche>('score');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedNiche, setSelectedNiche] = useState<{ niche: ScoredNiche | null; modal: 'roi' | 'gig' | 'competition' | null }>({ niche: null, modal: null });

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      const multiplier = sortDir === 'asc' ? 1 : -1;
      if (typeof valA === 'number' && typeof valB === 'number') return (valA - valB) * multiplier;
      return String(valA).localeCompare(String(valB)) * multiplier;
    });
  }, [data, sortKey, sortDir]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedData.map((niche) => (
          <div 
            id={`niche-card-${niche.niche}`}
            key={niche.niche}
            className={`group relative flex flex-col bg-gray-800/40 rounded-2xl border transition-all duration-300 hover:shadow-2xl hover:bg-gray-800/60 ${
              expandedNiche === niche.niche ? 'ring-2 ring-cyan-500/50 border-cyan-500/50 bg-gray-800/80' : 'border-gray-700 hover:border-gray-600'
            }`}
          >
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

            <div className="px-5 pb-5 grid grid-cols-3 gap-2">
              <MetricBadge label="Demand" value={`${niche.demand}/10`} color={niche.demand > 7 ? 'text-emerald-400' : 'text-yellow-400'} />
              <MetricBadge label="Price" value={`$${niche.averagePrice}`} color="text-cyan-400" />
              <CompetitionBar level={niche.competition} />
            </div>

            {expandedNiche === niche.niche && (
              <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-700 text-sm text-gray-300 space-y-4">
                  <ScoreDNABreakdown breakdown={niche.breakdown} />
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Target Audience Insights</h4>
                      <p className="text-xs text-white font-bold mb-2">{niche.targetAudience}</p>
                      
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {niche.marketingChannels.map(channel => (
                          <span key={channel} className="text-[9px] px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-black uppercase tracking-tighter">
                            📍 {channel}
                          </span>
                        ))}
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[9px] font-black text-red-400/80 uppercase tracking-widest block">Top Pain Points:</span>
                        {niche.painPoints.map((pp, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-[10px] text-gray-400">
                            <span className="text-red-500 flex-shrink-0">•</span>
                            <span className="italic leading-tight">{pp}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-800">
                      <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Tactical Advantage</h4>
                      <p className="text-xs text-emerald-100 italic leading-relaxed">"{niche.battlePlan}"</p>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-1">Market Context</h4>
                      <p className="text-xs text-yellow-100/90 italic leading-relaxed">"{niche.competitionNote}"</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => exportSingleNicheBlueprint(niche)}
                    className="w-full mt-2 flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-[10px] font-black uppercase transition-colors text-cyan-400"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <span>Download Full Strategy</span>
                  </button>
                </div>
              </div>
            )}

            <div className="mt-auto p-4 border-t border-gray-700/50 flex items-center justify-between bg-gray-900/20 rounded-b-2xl">
              <button 
                onClick={() => setExpandedNiche(expandedNiche === niche.niche ? null : niche.niche)}
                className="text-xs font-bold text-gray-500 hover:text-white transition-colors flex items-center space-x-1"
              >
                <span>{expandedNiche === niche.niche ? 'Less' : 'Insights'}</span>
                <svg className={`w-3 h-3 transition-transform ${expandedNiche === niche.niche ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="flex space-x-1">
                <button onClick={() => setSelectedNiche({niche, modal: 'roi'})} className="p-2 bg-cyan-900/40 hover:bg-cyan-600 text-cyan-400 hover:text-white rounded-lg transition-all border border-cyan-800/50" title="ROI Calculator">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                </button>
                <button onClick={() => setSelectedNiche({niche, modal: 'gig'})} className="p-2 bg-emerald-900/40 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg transition-all border border-emerald-800/50" title="Gig Strategy">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button onClick={() => setSelectedNiche({niche, modal: 'competition'})} className="p-2 bg-yellow-900/40 hover:bg-yellow-600 text-yellow-400 hover:text-white rounded-lg transition-all border border-yellow-800/50" title="Competitor Insights">
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
