import React from 'react';
import type { ScoredNiche } from '../types';

interface ROIModalProps {
  niche: ScoredNiche | null;
  onClose: () => void;
  isOpen: boolean;
}

export const ROIModal: React.FC<ROIModalProps> = ({ niche, onClose, isOpen }) => {
  if (!isOpen || !niche) return null;

  // Dummy calculation logic for demonstration
  const initialInvestment = 500;
  const projectsPerMonth = 5;
  const revenuePerMonth = projectsPerMonth * niche.averagePrice;
  const profitPerMonth = revenuePerMonth * 0.8; // Assuming 20% platform fees
  const monthsToBreakEven = profitPerMonth > 0 ? initialInvestment / profitPerMonth : Infinity;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl p-6 border border-gray-700 w-full max-w-lg mx-4 transform transition-all"
        onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <div className="flex justify-between items-center border-b border-gray-600 pb-3 mb-4">
          <h2 className="text-xl font-bold text-cyan-400">Potential ROI for "{niche.niche}"</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        
        <div className="space-y-4 text-gray-300">
            <p className="text-sm text-gray-400">{niche.description}</p>
            <div className="grid grid-cols-2 gap-4 bg-gray-900/50 p-4 rounded-md">
                <div>
                    <p className="text-xs text-gray-500 uppercase">Avg. Price</p>
                    <p className="text-lg font-semibold text-white">${niche.averagePrice}</p>
                </div>
                 <div>
                    <p className="text-xs text-gray-500 uppercase">Score</p>
                    <p className="text-lg font-semibold text-cyan-400">{niche.score}/100</p>
                </div>
                 <div>
                    <p className="text-xs text-gray-500 uppercase">Demand</p>
                    <p className="text-lg font-semibold">{niche.demand}/10</p>
                </div>
                 <div>
                    <p className="text-xs text-gray-500 uppercase">Competition</p>
                    <p className="text-lg font-semibold">{niche.competition}/10</p>
                </div>
            </div>
            
            <div className="pt-4">
                <h3 className="text-lg font-semibold text-white mb-2">Example Scenario</h3>
                <p className="text-sm">Based on a hypothetical initial investment of <span className="font-bold text-cyan-400">${initialInvestment}</span> (e.g., for tools, training) and completing <span className="font-bold text-cyan-400">{projectsPerMonth}</span> projects per month:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Estimated Monthly Revenue: <span className="font-semibold text-emerald-400">${revenuePerMonth.toFixed(2)}</span></li>
                    <li>Estimated Monthly Profit (after fees): <span className="font-semibold text-emerald-400">${profitPerMonth.toFixed(2)}</span></li>
                    <li>Months to Break-Even: <span className="font-semibold text-yellow-400">{isFinite(monthsToBreakEven) ? monthsToBreakEven.toFixed(1) : 'N/A'}</span></li>
                </ul>
                <p className="text-xs text-gray-500 mt-4">Disclaimer: These are rough estimates for illustrative purposes only and not financial advice.</p>
            </div>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
