import React, { useState } from 'react';
import type { ScoredNiche } from '../types';

interface GigTaskModalProps {
  niche: ScoredNiche | null;
  onClose: () => void;
  isOpen: boolean;
}

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className={`absolute top-2 right-2 text-xs px-2 py-1 rounded transition-colors z-10 ${copied ? 'bg-emerald-500 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'}`}
        >
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};


export const GigTaskModal: React.FC<GigTaskModalProps> = ({ niche, onClose, isOpen }) => {
  if (!isOpen || !niche) return null;

  // Use pre-fetched enriched data
  const gigTitles = niche.gigTitles || [
    `I will be your expert in ${niche.niche}`,
    `I will provide professional ${niche.niche} services`,
    `I will help you with high-quality ${niche.niche}`,
  ];

  const gigDescription = niche.gigDescription || `Are you looking for top-tier ${niche.niche}? Look no further!\n\n${niche.description}`;

  const tags = (niche.keywords || niche.niche.toLowerCase().split(' ')).join(', ');

  const pricing = {
      basic: Math.round(niche.averagePrice * 0.5),
      standard: niche.averagePrice,
      premium: Math.round(niche.averagePrice * 1.8),
  };

  const battlePlan = niche.battlePlan || "Focus on delivering faster than the competition and providing a high-quality initial consultation to build trust.";

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 w-full max-w-3xl transform transition-all max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-600 p-6 sticky top-0 bg-gray-800 z-20">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-emerald-400">Gig Execution Blueprint</h2>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-black">{niche.niche}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        
        <div className="p-6 space-y-8 text-gray-300">
            {/* Battle Plan Banner */}
            <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl">
                <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2">Strategy: How to Win</h3>
                <p className="text-sm leading-relaxed text-emerald-100 italic">"{battlePlan}"</p>
            </div>

            {/* Gig Title */}
            <div>
                <h3 className="font-bold text-white mb-3 flex items-center">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-gray-900 text-xs flex items-center justify-center font-black mr-2">1</span>
                    Suggested Gig Titles
                </h3>
                <div className="space-y-2">
                    {gigTitles.map((title, index) => (
                         <div key={index} className="relative bg-gray-900/70 p-4 pr-16 rounded-xl border border-gray-700 group hover:border-emerald-500/50 transition-colors">
                            <p className="text-sm font-medium">{title}</p>
                            <CopyButton textToCopy={title} />
                        </div>
                    ))}
                </div>
            </div>

             {/* Gig Description */}
            <div>
                <h3 className="font-bold text-white mb-3 flex items-center">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-gray-900 text-xs flex items-center justify-center font-black mr-2">2</span>
                    High-Converting Description
                </h3>
                <div className="relative bg-gray-900/70 p-5 pr-16 rounded-xl border border-gray-700">
                    <div className="text-sm font-sans whitespace-pre-wrap leading-relaxed">{gigDescription}</div>
                    <CopyButton textToCopy={gigDescription} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pricing */}
                <div>
                    <h3 className="font-bold text-white mb-3 flex items-center text-sm">
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-gray-900 text-[10px] flex items-center justify-center font-black mr-2">3</span>
                        Pricing Strategy
                    </h3>
                    <div className="bg-gray-900/70 p-5 rounded-xl border border-gray-700 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500 uppercase">Basic</span>
                            <span className="text-emerald-400 font-bold">${pricing.basic}</span>
                        </div>
                        <div className="flex justify-between items-center bg-emerald-400/5 -mx-5 px-5 py-2">
                            <span className="text-xs text-gray-100 font-bold uppercase">Standard (Best)</span>
                            <span className="text-emerald-400 font-black">${pricing.standard}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500 uppercase">Premium</span>
                            <span className="text-emerald-400 font-bold">${pricing.premium}</span>
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <h3 className="font-bold text-white mb-3 flex items-center text-sm">
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-gray-900 text-[10px] flex items-center justify-center font-black mr-2">4</span>
                        Search Tags
                    </h3>
                    <div className="relative bg-gray-900/70 p-5 pr-16 rounded-xl border border-gray-700 min-h-[100px]">
                        <div className="flex flex-wrap gap-2">
                            {(niche.keywords || []).map(tag => (
                                <span key={tag} className="px-2 py-1 bg-gray-800 rounded border border-gray-600 text-[10px] font-mono">{tag}</span>
                            ))}
                        </div>
                        <CopyButton textToCopy={tags} />
                    </div>
                </div>
            </div>
            
             {/* FAQ */}
            <div>
                <h3 className="font-bold text-white mb-3 flex items-center">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-gray-900 text-xs flex items-center justify-center font-black mr-2">5</span>
                    Killer FAQs
                </h3>
                <div className="space-y-3">
                    {niche.faqs?.map((f, i) => (
                        <div key={i} className="relative bg-gray-900/70 p-4 pr-16 rounded-xl border border-gray-700">
                             <p className="text-xs font-bold text-emerald-400 mb-1">Q: {f.question}</p>
                             <p className="text-xs text-gray-300">A: {f.answer}</p>
                             <CopyButton textToCopy={`Q: ${f.question}\nA: ${f.answer}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="p-6 border-t border-gray-600 bg-gray-900/30">
          <button
            onClick={onClose}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98]"
          >
            Acknowledge Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};