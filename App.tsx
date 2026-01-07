
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
      const savedWeights = localStorage.getItem('fiverrNicheWeights_v4');
      if (savedWeights) return JSON.parse(savedWeights);
    } catch (e) {}
    return {
      demand: 6,
      competition: -4,
      averagePrice: 4,
      trend: 5,
      scalability: 8,
    };
  });

  useEffect(() => {
    localStorage.setItem('fiverrNicheWeights_v4', JSON.stringify(weights));
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
    setLoadingMessage('Activating Strategic Intelligence Node...');
    
    cleanupInterval();
    intervalRef.current = window.setInterval(() => {
        setProgress(prev => {
            if (prev < 30) {
                setLoadingMessage('Scanning current marketplace dynamics...');
                return prev + 0.4;
            }
            if (prev < 70) {
                setLoadingMessage('Auditing live 2026 competitor data...');
                return prev + 0.2;
            }
            if (prev < 95) {
                setLoadingMessage('Synthesizing high-conversion blueprints...');
                return prev + 0.1;
            }
            return prev;
        });
    }, 150);

    try {
      const nicheData = await fetchNicheData();
      cleanupInterval();
      setProgress(100);
      setLoadingMessage('Synthesis complete.');
      setNiches(nicheData);
      await new Promise(r => setTimeout(r, 600));
      setIsLoading(false);
    } catch (err: any) {
      cleanupInterval();
      setError(err.message || 'Strategic node failed to respond.');
      setIsLoading(false);
      setProgress(0);
    }
  }, [cleanupInterval]);

  const scoredNiches = useMemo<ScoredNiche[]>(() => {
    if (!niches.length) return [];
    
    const filtered = niches.filter(n => 
      n.averagePrice >= filters.price.min && n.averagePrice <= filters.price.max &&
      n.demand >= filters.demand.min && n.demand <= filters.demand.max &&
      n.competition >= filters.competition.min && n.competition <= filters.competition.max
    );

    const maxPrice = Math.max(...filtered.map(n => n.averagePrice), 1);

    const calculated = filtered.map(niche => {
      const d = niche.demand * weights.demand;
      const c = niche.competition * weights.competition;
      const p = (niche.averagePrice / maxPrice) * 10 * weights.averagePrice;
      const t = niche.trend * 10 * weights.trend;
      const s = niche.scalabilityIndex * weights.scalability;
      
      const raw = d + c + p + t + s;
      
      const breakdown: ScoreBreakdown = {
        demand: Math.max(0, d),
        competition: Math.max(0, Math.abs(c)),
        price: Math.max(0, p),
        trend: Math.max(0, t),
        scalability: Math.max(0, s)
      };

      return { ...niche, score: raw, breakdown };
    });

    const scores = calculated.map(n => n.score);
    const minS = Math.min(...scores);
    const maxS = Math.max(...scores);
    
    return calculated.map(niche => ({
      ...niche,
      score: maxS > minS ? Math.round(((niche.score - minS) / (maxS - minS)) * 100) : 50
    })).sort((a, b) => b.score - a.score);
  }, [niches, weights, filters]);

  return (
    <div className="min-h-screen bg-[#020617] text-gray-100 selection:bg-cyan-500/30 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full"></div>
      </div>

      <Header />
      
      <main className="container mx-auto px-6 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <aside className="lg:col-span-4 xl:col-span-3 space-y-8">
            <div className="sticky top-28 space-y-8">
              <div className="bg-gray-900/40 backdrop-blur-2xl rounded-3xl p-7 border border-white/5 shadow-2xl">
                <Controls weights={weights} setWeights={setWeights} onAnalyze={handleAnalyze} isLoading={isLoading} />
              </div>
              <div className="bg-gray-900/40 backdrop-blur-2xl rounded-3xl p-7 border border-white/5 shadow-2xl">
                <FilterControls filters={filters} setFilters={setFilters} />
              </div>
            </div>
          </aside>

          <section className="lg:col-span-8 xl:col-span-9 space-y-12">
            {isLoading && !niches.length ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-900/20 backdrop-blur-xl rounded-[3rem] border border-white/5 shadow-inner">
                <Loader progress={progress} message={loadingMessage} />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center min-h-[50vh] bg-red-500/5 border border-red-500/10 rounded-[3rem] p-12 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
                <h3 className="text-2xl font-black text-red-200 uppercase mb-4 tracking-tight">Strategic Node Offline</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">{error}</p>
                <button onClick={handleAnalyze} className="px-10 py-4 bg-red-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-500 transition-all shadow-lg shadow-red-900/20">Restart Strategic Analysis</button>
              </div>
            ) : niches.length > 0 ? (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                <RisingNichesBanner data={scoredNiches} onNicheClick={setExpandedNiche} />
                
                <div className="grid grid-cols-1 xl:grid-cols-1 gap-10">
                   <div className="bg-gray-900/30 backdrop-blur-xl rounded-[3rem] border border-white/5 p-8 shadow-2xl overflow-hidden relative group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                         <svg className="w-32 h-32 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                      </div>
                      <h2 className="text-2xl font-black text-white mb-8 tracking-tighter flex items-center">
                        <span className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mr-3 text-cyan-400">📊</span>
                        Current Opportunity Leads
                      </h2>
                      <div className="h-[500px]">
                        <NicheChart data={scoredNiches.slice(0, 10)} onNicheClick={setExpandedNiche} />
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-end gap-6 mb-2">
                    <div>
                      <h2 className="text-3xl font-black text-white tracking-tighter">Strategic Intelligence Hub</h2>
                      <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">2026 Active Market Surveillance</p>
                    </div>
                    <ExportButtons data={scoredNiches} />
                  </div>
                  <ResultsTable data={scoredNiches} expandedNiche={expandedNiche} setExpandedNiche={setExpandedNiche} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-10">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-cyan-600/20 to-blue-600/20 blur-3xl animate-pulse absolute inset-0"></div>
                  <div className="relative z-10 w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center backdrop-blur-xl shadow-2xl">
                    <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  </div>
                </div>
                <div className="space-y-4 max-w-lg">
                  <h2 className="text-4xl font-black text-white tracking-tighter">Market Connectivity Pending</h2>
                  <p className="text-gray-400 leading-relaxed font-medium">Initiate the 2026 market scan to synthesize current freelancer trends and competitive gaps. Adjust filters to refine your entry strategy.</p>
                </div>
                <button onClick={handleAnalyze} className="group relative px-12 py-5 bg-cyan-600 rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] text-white hover:bg-cyan-500 transition-all shadow-2xl shadow-cyan-500/40 active:scale-95 overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                   Begin Strategic Audit
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="container mx-auto px-6 py-12 border-t border-white/5 mt-20 text-center">
         <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">&copy; 2026 Strategic Intelligence Ecosystem</p>
      </footer>
    </div>
  );
};

export default App;
