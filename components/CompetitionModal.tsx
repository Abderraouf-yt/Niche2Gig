
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type, GenerateContentResponse } from '@google/genai';
import type { ScoredNiche } from '../types';

// Use direct process.env.API_KEY initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
      const prompt = `Perform a tactical strike analysis for Fiverr niche: "${niche.niche}". 
      Identify 1 major technical or UX weakness in current top sellers. Provide 3 high-impact disruption tactics.`;

      try {
        // Explicitly type response to avoid type inference issues
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
        setAnalysis(JSON.parse(response.text?.trim() || "{}"));
      } catch (err) {
          console.error(err);
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
    if (isOpen && niche && !analysis) {
        if (niche.battlePlan) {
            setAnalysis({
                competitorSummary: niche.description,
                enemyWeakness: niche.competitorWeakness || "Oversaturated generic profiles with slow turnaround.",
                standoutStrategies: [niche.battlePlan, "Guaranteed 24h delivery for MVP", "Interactive video consultation"]
            });
        }
    }
  }, [isOpen, niche, analysis]);

  if (!isOpen || !niche) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 w-full max-w-2xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-600 flex justify-between items-center">
          <h2 className="text-xl font-bold text-yellow-400 uppercase tracking-tighter">Tactical Intelligence: {niche.niche}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <div className="p-6 space-y-6">
            {isLoading ? (
                <div className="flex flex-col items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                    <p className="mt-4 text-yellow-400 font-bold">Scanning Competitor Profiles...</p>
                </div>
            ) : analysis && (
                <>
                    <div className="bg-red-900/10 border border-red-500/20 p-4 rounded-xl">
                        <h3 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">Enemy Weakness (The Gap)</h3>
                        <p className="text-sm italic">"{analysis.enemyWeakness}"</p>
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Counter-Offensive Tactics</h3>
                        <ul className="space-y-3">
                           {analysis.standoutStrategies.map((s, i) => (
                               <li key={i} className="flex items-center space-x-3 bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                                   <span className="text-yellow-400 font-bold">0{i+1}</span>
                                   <span className="text-sm">{s}</span>
                               </li>
                           ))}
                        </ul>
                    </div>
                    <button onClick={performDeepAnalysis} className="w-full py-2 text-[10px] font-black uppercase text-gray-500 hover:text-yellow-400 transition-colors">
                        Refresh Deep Market Audit
                    </button>
                </>
            )}
        </div>
        <div className="p-6 bg-gray-900/50">
            <button onClick={onClose} className="w-full bg-yellow-600 hover:bg-yellow-500 py-3 rounded-lg font-bold">Confirm Strategy</button>
        </div>
      </div>
    </div>
  );
};
