import React, { useState, useMemo } from 'react';
import type { ScoredNiche } from '../types';
import { ROIModal } from './ROIModal';
import { GigTaskModal } from './GigTaskModal';
import { CompetitionModal } from './CompetitionModal';

interface ResultsTableProps {
  data: ScoredNiche[];
}

const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="relative group flex items-center ml-1.5">
    <span className="text-gray-500 cursor-help text-xs border border-gray-600 rounded-full w-4 h-4 flex items-center justify-center">
      ?
    </span>
    <div className="absolute bottom-full mb-2 w-max max-w-xs bg-gray-900 text-white text-xs rounded py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 border border-gray-700 shadow-lg">
      {text}
    </div>
  </div>
);

const getScoreColor = (score: number, invert = false) => {
    if ((!invert && score > 7) || (invert && score < 4)) return 'text-emerald-400';
    if ((!invert && score > 4) || (invert && score < 7)) return 'text-yellow-400';
    return 'text-red-400';
};

const TrendIndicator: React.FC<{ trend: number }> = ({ trend }) => {
    const getTrendInfo = (t: number) => {
        if (t > 0.6) {
            return {
                icon: '🔺',
                color: 'text-emerald-400',
                description: 'Rising',
                interpretation: 'High buyer interest, excellent for new gigs.'
            };
        }
        if (t < -0.6) {
             return {
                icon: '🔻',
                color: 'text-red-400',
                description: 'Declining',
                interpretation: 'Market is shrinking, proceed with caution.'
            };
        }
        return {
            icon: '➡️',
            color: 'text-yellow-400',
            description: 'Stable',
            interpretation: 'Consistent demand with established competition.'
        };
    };

    const trendInfo = getTrendInfo(trend);

    return (
        <div className="relative group flex items-center justify-center w-full">
            <span className={`${trendInfo.color} text-lg`}>{trendInfo.icon}</span>
            <div className="absolute bottom-full mb-2 w-max max-w-xs bg-gray-900 text-white text-xs rounded py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 border border-gray-700 shadow-lg text-left">
                <p className="font-bold">{`Direction: ${trendInfo.description}`}</p>
                <p>{`Value: ${trend.toFixed(2)}`}</p>
                <p className="italic text-gray-400 mt-1">{trendInfo.interpretation}</p>
            </div>
        </div>
    );
};

export const ResultsTable: React.FC<ResultsTableProps> = ({ data }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof ScoredNiche | 'actions'; direction: 'ascending' | 'descending' } | null>({ key: 'score', direction: 'descending' });
  const [selectedNiche, setSelectedNiche] = useState<{ niche: ScoredNiche | null; modal: 'roi' | 'gig' | 'competition' | null }>({ niche: null, modal: null });


  // Fix: Replaced the sorting logic with a type-safe implementation to prevent TypeScript errors when comparing values of different types (string vs number).
  const sortedData = useMemo(() => {
    if (!sortConfig || sortConfig.key === 'actions') return data;
    const key = sortConfig.key as keyof ScoredNiche;

    const sorted = [...data].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortConfig.direction === 'ascending' ? valA - valB : valB - valA;
      }
      
      const strA = String(valA);
      const strB = String(valB);
      
      return sortConfig.direction === 'ascending' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
    return sorted;
  }, [data, sortConfig]);

  const requestSort = (key: keyof ScoredNiche | 'actions') => {
    if (key === 'actions') return;
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (key: keyof ScoredNiche | 'actions') => {
      if (!sortConfig || sortConfig.key !== key || key === 'actions') return ' ↕';
      return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  }

  const columns: { key: keyof ScoredNiche | 'actions'; label: string; tooltip?: string }[] = [
      { key: 'score', label: 'Score', tooltip: 'A 0-100 score indicating overall opportunity based on your weights.' },
      { key: 'niche', label: 'Niche', tooltip: 'The name of the service category.' },
      { key: 'averagePrice', label: 'Avg. Price', tooltip: 'Estimated average price in USD for a standard project.' },
      { key: 'demand', label: 'Demand', tooltip: 'A 1-10 score of current market demand from buyers.' },
      { key: 'competition', label: 'Competition', tooltip: 'A 1-10 score of the number of active sellers. Lower is better.' },
      { key: 'trend', label: 'Trend', tooltip: 'Market direction from -1 (declining) to 1 (growing).' },
      { key: 'actions', label: 'Actions' },
  ];

  const handleCloseModal = () => setSelectedNiche({ niche: null, modal: null });

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {columns.map(({ key, label, tooltip }) => (
                   <th
                      key={key as React.Key}
                      scope="col"
                      onClick={() => requestSort(key)}
                      className={`px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider select-none ${key !== 'actions' ? 'cursor-pointer hover:bg-gray-700' : ''} transition-colors`}
                   >
                     <div className="flex items-center">
                      {label}
                      {tooltip && <InfoTooltip text={tooltip} />}
                      <span className="ml-1 w-4">{getSortIndicator(key)}</span>
                     </div>
                   </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-900/50 divide-y divide-gray-700">
            {sortedData.map((niche) => (
              <tr key={niche.niche} className="hover:bg-gray-800/60 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-cyan-400 w-12 text-center">{niche.score}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-white max-w-xs truncate" title={niche.niche}>{niche.niche}</div>
                  <p className="text-xs text-gray-400 w-64 truncate" title={niche.description}>
                      {niche.description}
                  </p>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                  ${niche.averagePrice.toLocaleString()}
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium text-center ${getScoreColor(niche.demand)}`}>
                  {niche.demand}/10
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium text-center ${getScoreColor(niche.competition, true)}`}>
                  {niche.competition}/10
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <TrendIndicator trend={niche.trend} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                        <button onClick={() => setSelectedNiche({niche, modal: 'roi'})} className="text-cyan-400 hover:text-cyan-300 transition-colors text-xs bg-cyan-900/50 hover:bg-cyan-800/50 px-2 py-1 rounded">Estimate ROI</button>
                        <button onClick={() => setSelectedNiche({niche, modal: 'gig'})} className="text-emerald-400 hover:text-emerald-300 transition-colors text-xs bg-emerald-900/50 hover:bg-emerald-800/50 px-2 py-1 rounded">Turn into Gig</button>
                        <button onClick={() => setSelectedNiche({niche, modal: 'competition'})} className="text-yellow-400 hover:text-yellow-300 transition-colors text-xs bg-yellow-900/50 hover:bg-yellow-800/50 px-2 py-1 rounded">View Competition</button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ROIModal isOpen={selectedNiche.modal === 'roi'} niche={selectedNiche.niche} onClose={handleCloseModal} />
      <GigTaskModal isOpen={selectedNiche.modal === 'gig'} niche={selectedNiche.niche} onClose={handleCloseModal} />
      <CompetitionModal isOpen={selectedNiche.modal === 'competition'} niche={selectedNiche.niche} onClose={handleCloseModal} />
    </>
  );
};
