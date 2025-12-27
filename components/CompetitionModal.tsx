import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import type { ScoredNiche } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

interface CompetitionModalProps {
  niche: ScoredNiche | null;
  onClose: () => void;
  isOpen: boolean;
}

interface CompetitionAnalysis {
    competitorSummary: string;
    standoutStrategies: string[];
}

const ModalLoader: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-48 space-y-4">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="text-xs text-yellow-500 font-bold uppercase animate-pulse">Running Deep Analysis...</p>
    </div>
);

const ModalError: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
    <div className="text-center p-4 bg-red-900/20 border border-red-500 rounded-lg">
        <p className="text-red-300">{message}</p>
        <button onClick={onRetry} className="mt-4 bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-4 rounded-lg">Retry</button>
    </div>
);

export const CompetitionModal: React.FC<CompetitionModalProps> = ({ niche, onClose, isOpen }) => {
  const [analysis, setAnalysis] = useState<CompetitionAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performDeepAnalysis = async () => {
      if (!niche) return;

      setIsLoading(true);
      setError(null);
      setAnalysis(null);

      const prompt = `Perform a deep competitive audit for the Fiverr niche: "${niche.niche}". 
      Analyze why existing sellers are winning, where they are failing, and provide 3 specific tactics a newcomer can use to gain market share immediately.`;

      try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        competitorSummary: { 
                            type: Type.STRING, 
                            description: 'A detailed summary of existing competition and their strategies.' 
                        },
                        standoutStrategies: {
                            type: Type.ARRAY,
                            description: '3 specific tactics to disrupt the market.',
                            items: { type: Type.STRING }
                        },
                    },
                    required: ['competitorSummary', 'standoutStrategies']
                }
            }
        });
        
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        setAnalysis(data);

      } catch (err: any) {
          setError(err.message || 'Failed to analyze competition. Please try again.');
          console.error("Competition analysis failed:", err);
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
    if (isOpen && niche) {
      // If we already have the battle plan from the enriched fetch, show that immediately
      // but still allow the option for "Deep Analysis" if the user wants more.
      if (niche.battlePlan && !analysis) {
          setAnalysis({
              competitorSummary: niche.description + "\n\nTarget Competitive Advantage: " + niche.battlePlan,
              standoutStrategies: [
                  "Focus on speed: Respond to inquiries within 5 minutes.",
                  "Visual distinction: Use high-contrast gig thumbnails.",
                  "Portfolio depth: Offer a free 10-minute discovery call."
              ]
          });
      }
    }
  }, [isOpen, niche, analysis]);

  if (!isOpen || !niche) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 w-full max-w-2xl transform transition-all max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-600 p-6 sticky top-0 bg-gray-800 z-20">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-yellow-400">Competitive Battle Plan</h2>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-black">{niche.niche}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        
        <div className="p-6 space-y-6 text-gray-300 min-h-[200px]">
            {isLoading && <ModalLoader />}
            {error && <ModalError message={error} onRetry={performDeepAnalysis} />}
            {!isLoading && !error && analysis && (
                <>
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Market Intelligence</h3>
                        <div className="text-sm bg-gray-900/70 p-5 rounded-xl border border-gray-700 whitespace-pre-wrap leading-relaxed">
                            {analysis.competitorSummary}
                        </div>
                    </div>
                     <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Disruption Tactics</h3>
                        <ul className="space-y-3">
                           {analysis.standoutStrategies.map((strategy, index) => (
                               <li key={index} className="flex items-start bg-yellow-400/5 p-4 rounded-xl border border-yellow-400/20 group hover:border-yellow-400/50 transition-colors">
                                   <span className="text-yellow-400 font-bold mr-3">{index + 1}.</span>
                                   <span className="text-sm text-gray-200">{strategy}</span>
                               </li>
                           ))}
                        </ul>
                    </div>

                    <div className="pt-4 flex justify-center">
                        <button 
                            onClick={performDeepAnalysis}
                            className="text-[10px] font-black uppercase tracking-tighter text-gray-500 hover:text-yellow-400 flex items-center space-x-2 transition-colors border border-gray-700 hover:border-yellow-400/50 px-4 py-2 rounded-full"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            <span>Trigger Real-time AI Deep Audit</span>
                        </button>
                    </div>
                </>
            )}
        </div>

        <div className="p-6 border-t border-gray-600 bg-gray-900/30">
          <button
            onClick={onClose}
            className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-black py-3 rounded-xl transition-all shadow-lg hover:shadow-yellow-500/20 active:scale-[0.98]"
          >
            I'm Ready to Compete
          </button>
        </div>
      </div>
    </div>
  );
};