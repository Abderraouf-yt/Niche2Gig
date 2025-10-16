import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { FilterControls } from './components/FilterControls';
import { ResultsTable } from './components/ResultsTable';
import { NicheChart } from './components/NicheChart';
import { ExportButtons } from './components/ExportButtons';
import { Loader } from './components/Loader';
import { RisingNichesBanner } from './components/RisingNichesBanner';
import { fetchNicheData } from './services/geminiService';
import type { Niche, ScoringWeights, ScoredNiche, FilterState } from './types';

const App: React.FC = () => {
  const [niches, setNiches] = useState<Niche[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

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


  const handleAnalyze = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setProgress(0);

    const progressInterval = setInterval(() => {
        setProgress(prev => {
            if (prev >= 95) {
                clearInterval(progressInterval);
                return 95;
            }
            return prev + 1;
        });
    }, 250);

    try {
      const nicheData = await fetchNicheData();
      clearInterval(progressInterval);
      setProgress(100);
      setNiches(nicheData);
      setTimeout(() => setIsLoading(false), 500); // Show 100% briefly
    } catch (err: any) {
      clearInterval(progressInterval);
      console.error(err);
      setError(err.message || 'An unknown error occurred. Please check your API key and network connection.');
      setIsLoading(false);
      setProgress(0);
    }
  }, []);
  
  useEffect(() => {
    handleAnalyze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scoredNiches = useMemo<ScoredNiche[]>(() => {
    if (!niches || niches.length === 0) return [];
    
    const filtered = niches.filter(niche => 
        niche.averagePrice >= filters.price.min &&
        niche.averagePrice <= filters.price.max &&
        niche.demand >= filters.demand.min &&
        niche.demand <= filters.demand.max &&
        niche.competition >= filters.competition.min &&
        niche.competition <= filters.competition.max
    );

    if (filtered.length === 0) return [];

    const maxPrice = Math.max(...filtered.map(n => n.averagePrice), 1);

    const calculatedNiches = filtered.map(niche => {
      // Data validation for score calculation
      const demand = typeof niche.demand === 'number' ? niche.demand : 0;
      const competition = typeof niche.competition === 'number' ? niche.competition : 0;
      const price = typeof niche.averagePrice === 'number' ? niche.averagePrice : 0;
      const trend = typeof niche.trend === 'number' ? niche.trend : 0;
      
      const demandScore = demand * weights.demand;
      const competitionScore = competition * weights.competition;
      const priceScore = (price / maxPrice) * 10 * weights.averagePrice;
      const trendScore = trend * weights.trend;
      
      const rawScore = demandScore + competitionScore + priceScore + trendScore;
      return { ...niche, score: rawScore };
    });

    const minScore = Math.min(...calculatedNiches.map(n => n.score));
    const maxScore = Math.max(...calculatedNiches.map(n => n.score));
    
    // Normalize score to 0-100
    return calculatedNiches.map(niche => ({
      ...niche,
      score: maxScore > minScore ? Math.round(((niche.score - minScore) / (maxScore - minScore)) * 100) : 50
    })).sort((a, b) => b.score - a.score);

  }, [niches, weights, filters]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
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
              <div className="flex justify-center items-center h-96 bg-gray-800/50 rounded-lg p-6 shadow-2xl border border-gray-700">
                <Loader progress={progress} />
              </div>
            ) : error ? (
              <div className="flex flex-col justify-center items-center h-96 bg-red-900/20 border border-red-500 rounded-lg p-6 text-red-300">
                  <h3 className="text-xl font-bold mb-4 text-red-200">Analysis Failed</h3>
                  <p className="text-center mb-6 max-w-md">{error}</p>
                  <button
                    onClick={handleAnalyze}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
              </div>
            ) : niches.length > 0 ? (
              <div className="space-y-8">
                {scoredNiches.length > 0 ? (
                    <>
                        <RisingNichesBanner data={scoredNiches} />
                        <div className="bg-gray-800/50 rounded-lg p-6 shadow-2xl border border-gray-700">
                          <h2 className="text-2xl font-bold mb-4 text-cyan-400">Top 10 Niches</h2>
                          <div className="h-80">
                            <NicheChart data={scoredNiches.slice(0, 10)} />
                          </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-6 shadow-2xl border border-gray-700">
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-cyan-400">
                                Filtered Analysis ({scoredNiches.length} results)
                            </h2>
                            <ExportButtons data={scoredNiches} />
                          </div>
                          <ResultsTable data={scoredNiches} />
                        </div>
                    </>
                ) : (
                    <div className="flex justify-center items-center h-96 bg-gray-800/50 rounded-lg p-6 shadow-2xl border border-gray-700">
                        <p className="text-gray-400 text-center">No niches match your current filter criteria.</p>
                    </div>
                )}
              </div>
            ) : (
                 <div className="flex justify-center items-center h-96 bg-gray-800/50 rounded-lg p-6 shadow-2xl border border-gray-700">
                    <p className="text-gray-400 text-center">Click "Analyze Niches" to get started.</p>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;