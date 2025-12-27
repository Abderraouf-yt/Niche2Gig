import React from 'react';
import type { ScoredNiche } from '../types';

interface NicheChartProps {
  data: ScoredNiche[];
  onNicheClick: (nicheName: string) => void;
}

const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
  const isTop3 = rank <= 3;
  const colors = {
    1: 'bg-gradient-to-br from-yellow-300 to-yellow-600 text-yellow-950 border-yellow-200 shadow-[0_0_15px_rgba(234,179,8,0.4)]',
    2: 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900 border-slate-100',
    3: 'bg-gradient-to-br from-orange-400 to-orange-700 text-orange-950 border-orange-300',
    default: 'bg-gray-800 text-gray-400 border-gray-700'
  };

  const style = isTop3 ? colors[rank as 1|2|3] : colors.default;
  const icon = rank === 1 ? '🏆' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;

  return (
    <div className={`flex items-center justify-center min-w-[40px] h-[40px] rounded-xl border-2 font-black text-sm transition-all duration-500 transform group-hover:scale-110 ${style}`}>
      {icon || rank}
    </div>
  );
};

const LeaderboardRow: React.FC<{ niche: ScoredNiche; rank: number; onClick: () => void }> = ({ niche, rank, onClick }) => {
  const isExcellent = niche.score > 85;
  const isGood = niche.score > 65;
  
  const barColor = isExcellent ? 'bg-cyan-400' : isGood ? 'bg-emerald-400' : 'bg-yellow-400';
  const glowClass = isExcellent ? 'shadow-[0_0_12px_rgba(34,211,238,0.6)]' : '';

  return (
    <div 
      onClick={onClick}
      className="group flex items-center space-x-5 p-4 rounded-2xl hover:bg-white/[0.04] cursor-pointer transition-all duration-300 border border-transparent hover:border-gray-800/50"
    >
      <RankBadge rank={rank} />
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-end mb-2">
          <div className="flex flex-col">
            <h4 className="text-[15px] font-bold text-gray-100 group-hover:text-cyan-400 transition-colors truncate tracking-tight pr-2">
              {niche.niche}
            </h4>
            <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-0.5">
               Market Opportunity
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-lg font-black tabular-nums leading-none ${isExcellent ? 'text-cyan-400' : 'text-gray-300'}`}>
              {niche.score}
            </span>
            <span className="text-[9px] text-gray-500 font-bold uppercase">Points</span>
          </div>
        </div>
        
        <div className="relative w-full h-2.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800 shadow-inner">
          <div 
            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${barColor} ${glowClass}`}
            style={{ width: `${niche.score}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export const NicheChart: React.FC<NicheChartProps> = ({ data, onNicheClick }) => {
  const top10 = data.slice(0, 10);

  return (
    <div className="h-full overflow-y-auto custom-scrollbar pr-3 space-y-2 py-2">
      {top10.length > 0 ? (
        top10.map((niche, index) => (
          <LeaderboardRow 
            key={niche.niche} 
            niche={niche} 
            rank={index + 1} 
            onClick={() => onNicheClick(niche.niche)}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50 space-y-2">
           <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
           </svg>
           <p className="text-sm font-medium">No niches found for current criteria</p>
        </div>
      )}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.2);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.3);
        }
      `}</style>
    </div>
  );
};