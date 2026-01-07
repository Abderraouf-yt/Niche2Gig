
import React, { useState, useMemo } from 'react';
import type { ScoredNiche } from '../types';

interface GigTaskModalProps {
  niche: ScoredNiche | null;
  onClose: () => void;
  isOpen: boolean;
}

const CopyButton: React.FC<{ textToCopy: string; label?: string }> = ({ textToCopy, label = "Copy" }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className={`absolute top-2 right-2 text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded transition-all z-10 ${copied ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-gray-700/80 hover:bg-emerald-600 text-gray-300'}`}
        >
            {copied ? 'Captured' : label}
        </button>
    );
};


export const GigTaskModal: React.FC<GigTaskModalProps> = ({ niche, onClose, isOpen }) => {
  if (!isOpen || !niche) return null;

  const synthesizedTitles = useMemo(() => {
    const { niche: nicheName, targetAudience, battlePlan, competitorWeakness } = niche;
    const cleanPlan = battlePlan.replace(/\.$/, '');
    const cleanAudience = targetAudience.replace(/\.$/, '');
    const cleanWeakness = (competitorWeakness || 'generic quality').split('.')[0].toLowerCase();

    return [
      `Strategic ${nicheName} for ${cleanAudience} | ${cleanPlan} Model`,
      `Accelerate your ${cleanAudience} Growth with ${cleanPlan} Tactics`,
      `Beyond ${cleanWeakness} | Premium ${nicheName} via ${cleanPlan}`
    ];
  }, [niche]);

  const allTitles = [...(niche.gigTitles || []), ...synthesizedTitles];
  const gigDescription = niche.gigDescription || "";
  const tags = (niche.keywords || []).join(', ');

  const pricing = {
      basic: Math.round(niche.averagePrice * 0.5),
      standard: niche.averagePrice,
      premium: Math.round(niche.averagePrice * 1.8),
  };

  const structuredDescription = `
[THE CHALLENGE]
Most current 2026 providers in the ${niche.niche} space rely on generic automation that fails to address the unique needs of ${niche.targetAudience}. Major friction point: ${niche.painPoints[0]}.

[THE OPPORTUNITY]
In today's fast-moving market, static solutions lead to stagnation. Failing to integrate ${niche.painPoints[1] || 'current trends'} means lost revenue.

[THE STRATEGIC ADVANTAGE]
I provide a specialized ${niche.niche} framework focused on: ${niche.battlePlan}. 

[CORE DELIVERABLES]
${gigDescription}

[WHY PARTNER WITH ME?]
I deliver ROI-focused transformations, not just tasks. My 2026 workflow is precision-tuned for ${niche.targetAudience}, bypassing common industry bottlenecks.
  `.trim();

  return (
    <div 
      className="fixed inset-0 bg-gray-950/90 backdrop-blur-md flex justify-center items-center z-50 transition-opacity p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-gray-700/50 w-full max-w-4xl transform transition-all max-h-[92vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-800 p-6 bg-gray-900/80 backdrop-blur-md z-30">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <h2 className="text-xl font-black text-white tracking-tighter uppercase italic">2026 Master Blueprint</h2>
            </div>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-[0.2em] font-black">{niche.niche}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-3xl leading-none">&times;</button>
        </div>
        
        <div className="p-8 space-y-10 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-2xl relative overflow-hidden group">
                    <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">Core USP</h3>
                    <p className="text-sm leading-relaxed text-emerald-50/90 font-medium italic">"{niche.battlePlan}"</p>
                </div>
                <div className="bg-cyan-500/5 border border-cyan-500/20 p-5 rounded-2xl relative overflow-hidden group">
                    <h3 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-3">Target Market</h3>
                    <div className="space-y-2">
                      <p className="text-sm leading-relaxed text-cyan-50/90 font-medium">{niche.targetAudience}</p>
                    </div>
                </div>
            </div>

            <section>
                <div className="flex items-center space-x-3 mb-5">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-sm">01</span>
                    <h3 className="font-black text-white text-lg uppercase tracking-tight">Optimized Gig Titles</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    {allTitles.map((title, index) => (
                         <div key={index} className={`relative p-5 pr-20 rounded-2xl border transition-all group shadow-inner ${index >= (niche.gigTitles?.length || 0) ? 'bg-cyan-900/10 border-cyan-500/30 hover:border-cyan-400' : 'bg-gray-800/40 border-gray-700/50 hover:border-emerald-500/40'}`}>
                            <p className="text-sm font-bold text-gray-100 leading-tight">{title}</p>
                            <CopyButton textToCopy={title} />
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <div className="flex items-center space-x-3 mb-5">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-sm">02</span>
                    <h3 className="font-black text-white text-lg uppercase tracking-tight">Persuasive Conversion Copy</h3>
                </div>
                <div className="relative bg-gray-800/40 p-6 pr-20 rounded-2xl border border-gray-700/50 shadow-inner group">
                    <div className="text-sm font-sans whitespace-pre-wrap leading-relaxed text-gray-300 italic">
                        {structuredDescription}
                    </div>
                    <CopyButton textToCopy={structuredDescription} label="Copy Strategy Copy" />
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <section>
                    <div className="flex items-center space-x-3 mb-5">
                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-sm">03</span>
                        <h3 className="font-black text-white text-lg uppercase tracking-tight">Price Structure</h3>
                    </div>
                    <div className="bg-gray-800/20 p-1 rounded-2xl border border-gray-700/50 overflow-hidden">
                        {[
                            { label: 'Basic Entry', price: pricing.basic, style: 'text-gray-400' },
                            { label: 'Standard Scale', price: pricing.standard, style: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20' },
                            { label: 'Authority Tier', price: pricing.premium, style: 'text-yellow-400' }
                        ].map((tier, i) => (
                            <div key={i} className={`flex justify-between items-center p-4 rounded-xl ${tier.style}`}>
                                <span className="text-[10px] font-black uppercase tracking-widest">{tier.label}</span>
                                <span className="text-lg font-black tabular-nums">${tier.price}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="flex items-center space-x-3 mb-5">
                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-sm">04</span>
                        <h3 className="font-black text-white text-lg uppercase tracking-tight">SEO Semantics</h3>
                    </div>
                    <div className="relative bg-gray-800/40 p-6 pr-20 rounded-2xl border border-gray-700/50 min-h-[120px] shadow-inner">
                        <div className="flex flex-wrap gap-2">
                            {(niche.keywords || []).map(tag => (
                                <span key={tag} className="px-3 py-1.5 bg-gray-900/80 rounded-full border border-gray-700 text-[10px] font-bold text-gray-400">#{tag}</span>
                            ))}
                        </div>
                        <CopyButton textToCopy={tags} label="Copy Tags" />
                    </div>
                </section>
            </div>
        </div>

        <div className="p-6 border-t border-gray-800 bg-gray-900 z-30">
          <button
            onClick={onClose}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl transition-all shadow-lg uppercase tracking-widest text-xs"
          >
            Acknowledge Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
