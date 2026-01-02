
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { FilterControls } from './components/FilterControls';
import { ResultsTable } from './components/ResultsTable';
import { NicheChart } from './components/NicheChart';
import { ExportButtons } from './components/ExportButtons';
import { Loader } from './components/Loader';
import { RisingNichesBanner } from './components/RisingNichesBanner';
import { fetchNicheData } from './services/geminiService';
import type { Niche, ScoringWeights, ScoredNiche, FilterState, ScoreBreakdown } from './types';

const App: React.FC = () => {
  const [niches, setNiches] = useState<Niche[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Initializing market scan...');
  const [expandedNiche, setExpandedNiche] = useState<string | null>(null);
  
  const intervalRef = useRef<number | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    price: { min: 0, max: 2000 },
    demand: { min: 1, max: 10 },
    competition: { min: 1, max: 10 },
  });
  
  const [weights, setWeights] = useState<ScoringWeights>(() => {
    try {
      const savedWeights = localStorage.getItem('fiverrNicheWeights');
      if (savedWeights) {
        return JSON.parse(savedWeights);
      }
    } catch (error) {
      console.error("Failed to parse weights from localStorage", error);
    }
    return {
      demand: 5,
      competition: -5,
      averagePrice: 4,
      trend: 3,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('fiverrNicheWeights', JSON.stringify(weights));
    } catch (error) {
      console.error("Failed to save weights to localStorage", error);
    }
  }, [weights]);

  const cleanupInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setProgress(0);
    setLoadingMessage('Activating Search Grounding...');
    
    cleanupInterval();

    // Adjusted progress speed to feel consistent over a 30-60 second window
    intervalRef.current = window.setInterval(() => {
        setProgress(prev => {
            if (prev < 20) {
                setLoadingMessage('Tapping into global search nodes...');
                return prev + 0.5;
            }
            if (prev < 60) {
                setLoadingMessage('Identifying 2025 market gaps...');
                return prev + 0.3;
            }
            if (prev < 95) {
                setLoadingMessage('Generating tactical blueprints...');
                return prev + 0.15;
            }
            return prev;
        });
    }, 200);

    try {
      const nicheData = await fetchNicheData();
      cleanupInterval();
      setProgress(100);
      setLoadingMessage('Analysis complete!');
      setNiches(nicheData);
      await new Promise(r => setTimeout(r, 400));
      setIsLoading(false);
    } catch (err: any) {
      cleanupInterval();
      console.error(err);
      setError(err.message || 'Analysis failed. Market nodes are unresponsive.');
      setIsLoading(false);
      setProgress(0);
    }
  }, [cleanupInterval]);
  
  useEffect(() => {
    return cleanupInterval;
  }, [cleanupInterval]);

  const scoredNiches = useMemo<ScoredNiche[]>(() => {
    if (!niches || niches.length === 0) return [];
    
    const filtered = niches.filter(niche => {
        const price = niche.averagePrice ?? 0;
        const demand = niche.demand ?? 5;
        const competition = niche.competition ?? 5;

        return price >= filters.price.min &&
               price <= filters.price.max &&
               demand >= filters.demand.min &&
               demand <= filters.demand.max &&
               competition >= filters.competition.min &&
               competition <= filters.competition.max;
    });

    if (filtered.length === 0) return [];

    const maxPrice = Math.max(...filtered.map(n => n.averagePrice ?? 1), 1);

    const calculatedNiches = filtered.map(niche => {
      const demand = typeof niche.demand === 'number' ? niche.demand : 5;
      const competition = typeof niche.competition === 'number' ? niche.competition : 5;
      const price = typeof niche.averagePrice === 'number' ? niche.averagePrice : 0;
      const trend = typeof niche.trend === 'number' ? niche.trend : 0;
      
      const demandScore = demand * weights.demand;
      const competitionScore = competition * weights.competition;
      const priceScore = (price / maxPrice) * 10 * weights.averagePrice;
      const trendScore = trend * weights.trend;
      
      const rawScore = demandScore + competitionScore + priceScore + trendScore;
      
      const breakdown: ScoreBreakdown = {
        demand: Math.max(0, demandScore),
        competition: Math.max(0, Math.abs(competitionScore)),
        price: Math.max(0, priceScore),
        trend: Math.max(0, trendScore)
      };

      return { ...niche, score: rawScore, breakdown };
    });

    const minScore = Math.min(...calculatedNiches.map(n => n.score));
    const maxScore = Math.max(...calculatedNiches.map(n => n.score));
    
    return calculatedNiches.map(niche => ({
      ...niche,
      score: maxScore > minScore ? Math.round(((niche.score - minScore) / (maxScore - minScore)) * 100) : 50
    })).sort((a, b) => b.score - a.score);

  }, [niches, weights, filters]);

  const handleNicheSelect = useCallback((nicheName: string) => {
    setExpandedNiche(nicheName);
    
    setTimeout(() => {
      const element = document.getElementById(`niche-card-${nicheName}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-4', 'ring-cyan-500/50');
        setTimeout(() => {
            element.classList.remove('ring-4', 'ring-cyan-500/50');
        }, 2000);
      }
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-cyan-500/30">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 xl:col-span-3 space-y-8">
            <div className="bg-gray-800/50 rounded-lg p-6 shadow-2xl border border-gray-700">
              <Controls weights={weights} setWeights={setWeights} onAnalyze={handleAnalyze} isLoading={isLoading} />
            </div>
             <div className="bg-gray-800/50 rounded-lg p-6 shadow-2xl border border-gray-700">
              <FilterControls filters={filters} setFilters={setFilters} />
            </div>
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
            {isLoading && !niches.length ? (
              <div className="flex justify-center items-center h-[600px] bg-gray-800/50 rounded-lg p-6 shadow-2xl border border-gray-700">
                <Loader progress={progress} message={loadingMessage} />
              </div>
            ) : error ? (
              <div className="flex flex-col justify-center items-center h-[600px] bg-red-900/10 border border-red-500/30 rounded-2xl p-8 text-center">
                  <div className="bg-red-500/10 p-6 rounded-full mb-6 border border-red-500/20">
                    <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-red-200 uppercase tracking-tight">Intelligence Timeout</h3>
                  <p className="mb-8 max-w-md text-gray-400 leading-relaxed text-sm">
                    {error}
                  </p>
                  <button
                    onClick={handleAnalyze}
                    className="bg-red-600 hover:bg-red-500 text-white font-black py-4 px-10 rounded-xl transition-all active:scale-95 shadow-xl shadow-red-900/20 border border-red-400/20 uppercase text-xs tracking-widest"
                  >
                    Retry Analysis
                  </button>
                  <p className="mt-6 text-[10px] text-gray-600 italic">Market grounding success depends on real-time search node availability.</p>
              </div>
            ) : niches.length > 0 ? (
              <div className="space-y-8">
                {scoredNiches.length > 0 ? (
                    <>
                        <RisingNichesBanner data={scoredNiches} onNicheClick={handleNicheSelect} />
                        <div className="bg-gray-800/50 rounded-lg p-6 shadow-2xl border border-gray-700">
                          <h2 className="text-2xl font-bold mb-6 text-cyan-400">Top Rankings</h2>
                          <div className="max-h-[640px] h-[640px]">
                            <NicheChart data={scoredNiches.slice(0, 10)} onNicheClick={handleNicheSelect} />
                          </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-6 shadow-2xl border border-gray-700">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h2 className="text-2xl font-bold text-cyan-400">
                                Detailed Analysis ({scoredNiches.length})
                            </h2>
                            <ExportButtons data={scoredNiches} />
                          </div>
                          <ResultsTable 
                            data={scoredNiches} 
                            expandedNiche={expandedNiche} 
                            setExpandedNiche={setExpandedNiche} 
                          />
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col justify-center items-center h-96 bg-gray-800/50 rounded-lg p-6 shadow-2xl border border-gray-700 text-gray-400 space-y-4">
                        <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
                        <p className="text-center max-w-xs text-sm">No niches match your current filter criteria. Try expanding your ranges or resetting filters.</p>
                        <button onClick={() => setFilters({ price: { min: 0, max: 2000 }, demand: { min: 1, max: 10 }, competition: { min: 1, max: 10 }})} className="text-cyan-400 hover:text-cyan-300 underline text-xs font-black uppercase tracking-widest">Reset Filters</button>
                    </div>
                )}
              </div>
            ) : (
                 <div className="flex flex-col justify-center items-center h-[500px] bg-gray-800/50 rounded-2xl p-12 shadow-2xl border border-gray-700 text-gray-400 space-y-6 text-center">
                    <div className="bg-cyan-500/10 p-6 rounded-full border border-cyan-500/20">
                      <svg className="w-16 h-16 text-cyan-400 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Market Scanner Ready</h3>
                      <p className="max-w-md mx-auto text-sm leading-relaxed">Adjust your scoring weights and filters in the sidebar, then trigger the AI intelligence scan to discover under-served Fiverr niches for 2025.</p>
                    </div>
                    <button onClick={handleAnalyze} className="bg-cyan-600 text-white px-10 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-cyan-500 transition-all shadow-xl shadow-cyan-900/40 active:scale-95 border border-cyan-400/30">Start Market Analysis</button>
                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-600">Powered by Gemini 3 Flash & Google Search</p>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
