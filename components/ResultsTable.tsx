
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
  <div className="flex flex-col bg-gray-950/40 p-2.5 rounded-xl border border-white/5 backdrop-blur-sm group hover:border-white/10 transition-all">
    <span className="text-[9px] uppercase text-gray-500 font-black tracking-widest mb-1">{label}</span>
    <div className={`flex items-center space-x-1.5 font-black ${color}`}>
      {icon && <span className="text-xs">{icon}</span>}
      <span className="text-sm">{value}</span>
    </div>
  </div>
);

const RiskMeter: React.FC<{ value: number; label: string; invert?: boolean }> = ({ value, label, invert }) => {
  const percentage = value * 10;
  const getColor = () => {
    if (invert) {
        if (value > 7) return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
        if (value > 4) return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]';
        return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
    }
    if (value > 7) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
    if (value > 4) return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]';
    return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
  };

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex justify-between items-center text-[8px] font-black uppercase text-gray-500 tracking-tighter">
        <span>{label}</span>
        <span>{value}/10</span>
      </div>
      <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-out ${getColor()}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const TrendBadge: React.FC<{ trend: number }> = ({ trend }) => {
  const isRising = trend > 0.6;
  const isDeclining = trend < -0.3;
  const color = isRising ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' : isDeclining ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
  const icon = isRising ? '⚡' : isDeclining ? '🔻' : '➖';
  const label = isRising ? 'High Velocity' : isDeclining ? 'Cooling' : 'Stable';

  return (
    <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-tight ${color}`}>
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
};

export const ResultsTable: React.FC<ResultsTableProps> = ({ data, expandedNiche, setExpandedNiche }) => {
  const [selectedNiche, setSelectedNiche] = useState<{ niche: ScoredNiche | null; modal: 'roi' | 'gig' | 'competition' | null }>({ niche: null, modal: null });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((niche) => (
        <div 
          key={niche.niche}
          id={`niche-card-${niche.niche}`}
          className={`group flex flex-col bg-gray-900/60 backdrop-blur-xl border rounded-[2rem] transition-all duration-500 hover:shadow-[0_0_40px_rgba(34,211,238,0.15)] overflow-hidden ${
            expandedNiche === niche.niche ? 'border-cyan-500/50 ring-1 ring-cyan-500/20 scale-[1.02]' : 'border-white/5 hover:border-white/20'
          }`}
        >
          <div className="p-7 space-y-5">
            <div className="flex justify-between items-start">
              <TrendBadge trend={niche.trend} />
              <div className="text-right">
                <span className="text-[9px] font-black text-gray-500 uppercase block tracking-widest">Score Index</span>
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-sm">{niche.score}</span>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black text-white leading-tight group-hover:text-cyan-400 transition-colors">{niche.niche}</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed italic line-clamp-2">"{niche.description}"</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <MetricBadge label="Avg. Price" value={`$${niche.averagePrice}`} color="text-emerald-400" icon="💰" />
              <MetricBadge label="Demand" value={`${niche.demand}/10`} color="text-cyan-400" icon="📈" />
            </div>

            <div className="space-y-4 pt-2">
               <RiskMeter label="Scalability Potential" value={niche.scalabilityIndex} invert />
               <RiskMeter label="AI Disruption Risk" value={niche.aiDisruptionRisk} />
            </div>
          </div>

          <div className="mt-auto px-7 pb-7 space-y-4">
             {expandedNiche === niche.niche && (
               <div className="animate-in fade-in slide-in-from-top-4 duration-500 pt-2 border-t border-white/5 space-y-6">
                  {/* Strategic Forecast */}
                  <div>
                    <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2 flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mr-2 animate-pulse"></span>
                      Strategic Forecast
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed font-medium">{niche.strategicForecast}</p>
                  </div>

                  {/* Audience & Pain Points Context */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gray-950/40 p-4 rounded-2xl border border-white/5 space-y-3">
                        <h5 className="text-[9px] font-black text-white uppercase tracking-[0.2em] opacity-60">Audience Friction Points</h5>
                        <ul className="space-y-1.5">
                          {niche.painPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start text-[11px] text-red-400/80 font-medium">
                              <span className="mr-2 text-red-500/50">•</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                    </div>

                    <div className="bg-gray-950/40 p-4 rounded-2xl border border-white/5 space-y-3">
                        <h5 className="text-[9px] font-black text-white uppercase tracking-[0.2em] opacity-60">Growth Channels</h5>
                        <div className="flex flex-wrap gap-2">
                          {niche.marketingChannels.map(c => (
                            <span key={c} className="text-[9px] px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold uppercase tracking-tighter">
                              {c}
                            </span>
                          ))}
                        </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
                    <p className="text-[10px] text-gray-400 italic">Targeting: <span className="text-white font-bold">{niche.targetAudience}</span></p>
                    <button 
                      onClick={() => exportSingleNicheBlueprint(niche)}
                      className="w-full flex items-center justify-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-cyan-500 hover:text-white transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <span>Get Master Strategy</span>
                    </button>
                  </div>
               </div>
             )}

            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setExpandedNiche(expandedNiche === niche.niche ? null : niche.niche)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-black py-3 rounded-2xl text-[10px] uppercase tracking-widest transition-all flex items-center justify-center space-x-2 border border-white/5"
              >
                <span>{expandedNiche === niche.niche ? 'Collapse' : 'Deep Analysis'}</span>
                <svg className={`w-3 h-3 transition-transform duration-500 ${expandedNiche === niche.niche ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="flex space-x-2">
                 <button onClick={() => setSelectedNiche({niche, modal: 'gig'})} className="p-3 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-white rounded-2xl transition-all border border-cyan-500/20" title="Blueprint">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                 </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <ROIModal isOpen={selectedNiche.modal === 'roi'} niche={selectedNiche.niche} onClose={() => setSelectedNiche({ niche: null, modal: null })} />
      <GigTaskModal isOpen={selectedNiche.modal === 'gig'} niche={selectedNiche.niche} onClose={() => setSelectedNiche({ niche: null, modal: null })} />
      <CompetitionModal isOpen={selectedNiche.modal === 'competition'} niche={selectedNiche.niche} onClose={() => setSelectedNiche({ niche: null, modal: null })} />
    </div>
  );
};
