
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type, GenerateContentResponse } from '@google/genai';
import type { ScoredNiche } from '../types';

interface CompetitionModalProps {
  niche: ScoredNiche | null;
  onClose: () => void;
  isOpen: boolean;
}

interface CompetitionAnalysis {
    competitorSummary: string;
    standoutStrategies: string[];
    enemyWeakness: string;
}

export const CompetitionModal: React.FC<CompetitionModalProps> = ({ niche, onClose, isOpen }) => {
  const [analysis, setAnalysis] = useState<CompetitionAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const performDeepAnalysis = async () => {
      if (!niche) return;
      setIsLoading(true);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `AUDIT DATE: JANUARY 2026.
      Task: Tactical strike analysis for the niche: "${niche.niche}". 
      Audience: "${niche.targetAudience}".
      Current Weakness: "${niche.competitorWeakness}".
      
      Identify 1 major tactical flaw in current 2026 top sellers. 
      Provide 3 disruption tactics for immediate market entry.`;

      try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        competitorSummary: { type: Type.STRING },
                        standoutStrategies: { type: Type.ARRAY, items: { type: Type.STRING } },
                        enemyWeakness: { type: Type.STRING }
                    },
                    required: ['competitorSummary', 'standoutStrategies', 'enemyWeakness']
                }
            }
        });
        
        const result = JSON.parse(response.text?.trim() || "{}");
        setAnalysis(result);
      } catch (err) {
          console.error("Audit failed:", err);
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
    if (isOpen && niche && !analysis) {
        if (niche.battlePlan) {
            setAnalysis({
                competitorSummary: niche.description,
                enemyWeakness: niche.competitorWeakness || "Legacy profiles with excessive manual delay.",
                standoutStrategies: [
                    niche.battlePlan, 
                    "Optimize for high-velocity 2026 delivery standards", 
                    "Implement direct strategy consulting"
                ]
            });
        }
    }
  }, [isOpen, niche, analysis]);

  if (!isOpen || !niche) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 backdrop-blur-md">
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-yellow-500 uppercase tracking-tighter italic">Tactical Intelligence Audit</h2>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{niche.niche}</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-3xl leading-none">&times;</button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-yellow-500/20 border-solid rounded-full"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-yellow-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                    </div>
                    <div className="text-center">
                        <p className="text-yellow-500 font-black uppercase tracking-widest text-xs animate-pulse">Running Market Audit...</p>
                        <p className="text-[10px] text-gray-500 mt-2">Connecting to live nodes for current 2026 competitor data</p>
                    </div>
                </div>
            ) : analysis && (
                <>
                    <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl relative overflow-hidden group">
                        <h3 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-3">Target Vulnerability</h3>
                        <p className="text-sm italic text-red-50/90 leading-relaxed font-medium">"{analysis.enemyWeakness}"</p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center">
                            <span className="w-4 h-px bg-gray-700 mr-2"></span>
                            Counter-Offensive Tactics
                            <span className="w-4 h-px bg-gray-700 ml-2"></span>
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                           {analysis.standoutStrategies.map((s, i) => (
                               <div key={i} className="flex items-start space-x-4 bg-gray-800/40 p-5 rounded-2xl border border-gray-700/50 hover:border-yellow-500/30 transition-all group shadow-inner">
                                   <span className="flex-shrink-0 w-6 h-6 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 flex items-center justify-center font-black text-xs italic">{i+1}</span>
                                   <span className="text-sm font-medium text-gray-200 leading-tight">{s}</span>
                               </div>
                           ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-800 flex flex-col items-center space-y-4">
                        <button 
                            onClick={performDeepAnalysis} 
                            disabled={isLoading}
                            className="group w-full max-w-sm flex items-center justify-center space-x-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 py-4 px-8 rounded-2xl hover:bg-yellow-500 hover:text-gray-950 transition-all active:scale-[0.98]"
                        >
                            <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span className="text-xs font-black uppercase tracking-widest">
                                Refresh Strategic Audit
                            </span>
                        </button>
                    </div>
                </>
            )}
        </div>

        <div className="p-6 bg-gray-900 border-t border-gray-800">
            <button 
                onClick={onClose} 
                className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-black py-4 rounded-xl transition-all uppercase tracking-widest text-xs border border-gray-700"
            >
                Confirm Strategy
            </button>
        </div>
      </div>
    </div>
  );
};
