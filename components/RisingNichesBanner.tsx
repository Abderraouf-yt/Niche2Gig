import React, { useMemo } from 'react';
import type { ScoredNiche } from '../types';

interface RisingNichesBannerProps {
  data: ScoredNiche[];
}

export const RisingNichesBanner: React.FC<RisingNichesBannerProps> = ({ data }) => {
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
      <h2 className="text-2xl font-bold mb-4 text-cyan-400 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        Fastest Rising Niches
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {risingNiches.map(niche => (
          <div key={niche.niche} className="bg-gray-900/60 p-4 rounded-lg border border-gray-700 hover:border-cyan-500 transition-colors">
            <h3 className="font-bold text-white truncate" title={niche.niche}>{niche.niche}</h3>
            <p className="text-sm text-emerald-400 font-semibold mt-1">
              Trend: {niche.trend.toFixed(2)} 🔺
            </p>
            <p className="text-xs text-gray-400 mt-2 italic">
              Tip: This niche shows strong growth. Consider offering a specialized gig to capture new demand.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};