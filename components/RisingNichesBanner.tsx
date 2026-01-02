import React, { useMemo } from 'react';
import type { ScoredNiche } from '../types';

interface RisingNichesBannerProps {
  data: ScoredNiche[];
  onNicheClick: (nicheName: string) => void;
}

export const RisingNichesBanner: React.FC<RisingNichesBannerProps> = ({ data, onNicheClick }) => {
  const risingNiches = useMemo(() => {
    return data
      .filter(niche => niche.trend > 0.6)
      .sort((a, b) => b.trend - a.trend)
      .slice(0, 3);
  }, [data]);

  if (risingNiches.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 shadow-2xl border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-cyan-400 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        Market Hotspots: High Velocity Trends
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {risingNiches.map(niche => (
          <div key={niche.niche} className="group bg-gray-900/60 p-5 rounded-xl border border-gray-700 hover:border-emerald-500/50 transition-all duration-300 flex flex-col h-full">
            <div className="flex items-start justify-between space-x-2 mb-3">
              <h3 className="font-bold text-white text-lg leading-tight flex-1" title={niche.niche}>{niche.niche}</h3>
              <div className="flex flex-col items-end">
                  <svg 
                    className="w-5 h-5 text-emerald-400 animate-trend-up flex-shrink-0" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-[10px] font-black text-emerald-500 mt-1">{Math.round(niche.trend * 100)}% Growth</span>
              </div>
            </div>

            <div className="space-y-4 flex-1">
                <div>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-1">Target Persona</span>
                    <p className="text-xs text-cyan-300 font-medium">{niche.targetAudience}</p>
                </div>

                <div>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-1 text-emerald-500/80">Market Gap Analysis</span>
                    <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                        {niche.description}
                    </p>
                </div>

                <div className="p-3 bg-emerald-900/10 rounded-lg border border-emerald-500/20">
                    <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest block mb-1">Execution Strategy</span>
                    <p className="text-xs text-emerald-50/90 leading-relaxed italic">
                        "{niche.battlePlan}"
                    </p>
                </div>
            </div>

            <button 
                onClick={() => onNicheClick(niche.niche)}
                className="mt-5 w-full bg-gray-700/50 hover:bg-emerald-600 group-hover:bg-emerald-600/80 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all text-gray-300 hover:text-white border border-gray-600 group-hover:border-emerald-500/50"
            >
                View Full Strategy Blueprint
            </button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes trend-up {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-3px) translateX(2px); }
        }
        .animate-trend-up {
          animation: trend-up 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};