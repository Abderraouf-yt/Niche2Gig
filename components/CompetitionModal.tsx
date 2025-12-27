// Fix: Create the CompetitionModal component.
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
    <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent border-solid rounded-full animate-spin"></div>
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

  const fetchCompetitionAnalysis = async () => {
      if (!niche) return;

      setIsLoading(true);
      setError(null);
      setAnalysis(null);

      const prompt = `Analyze the competitive landscape for the Fiverr niche "${niche.niche}". Provide:
      1. A summary of top competitors, their pricing strategies (basic, standard, premium), and their unique selling propositions.
      2. A list of 3 actionable strategies for a new freelancer to stand out in this crowded market.`;

      try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        competitorSummary: { 
                            type: Type.STRING, 
                            description: 'A summary of the top competitors, their pricing, and unique selling points.' 
                        },
                        standoutStrategies: {
                            type: Type.ARRAY,
                            description: 'A list of 3 actionable strategies for a new freelancer to succeed.',
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
      fetchCompetitionAnalysis();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, niche]);

  if (!isOpen || !niche) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl p-6 border border-gray-700 w-full max-w-2xl mx-4 transform transition-all max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-600 pb-3 mb-4 sticky top-0 bg-gray-800 -mt-6 -mx-6 px-6 pt-6 z-10">
          <h2 className="text-xl font-bold text-yellow-400">Competition Analysis: "{niche.niche}"</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        
        <div className="space-y-6 text-gray-300 min-h-[200px]">
            {isLoading && <ModalLoader />}
            {error && <ModalError message={error} onRetry={fetchCompetitionAnalysis} />}
            {analysis && (
                <>
                    <div>
                        <h3 className="font-semibold text-lg mb-2 text-white">Competitor Landscape</h3>
                        <p className="text-sm bg-gray-900/70 p-4 rounded-md border border-gray-700 whitespace-pre-wrap">{analysis.competitorSummary}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg mb-2 text-white">How to Stand Out</h3>
                        <ul className="list-disc list-inside space-y-2 bg-gray-900/70 p-4 rounded-md border border-gray-700">
                           {analysis.standoutStrategies.map((strategy, index) => (
                               <li key={index} className="text-sm">{strategy}</li>
                           ))}
                        </ul>
                    </div>
                </>
            )}
        </div>

        <div className="mt-6 text-right border-t border-gray-600 pt-4 -mx-6 px-6 pb-0">
          <button
            onClick={onClose}
            className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};