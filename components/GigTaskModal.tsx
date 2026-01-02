
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

  // Synthesize 3 additional high-conversion titles based on the USP (Battle Plan) and Audience
  const synthesizedTitles = useMemo(() => {
    const { niche: nicheName, targetAudience, battlePlan, competitorWeakness } = niche;
    
    // Cleaning strings for cleaner titles
    const cleanPlan = battlePlan.replace(/\.$/, '');
    const cleanAudience = targetAudience.replace(/\.$/, '');
    const cleanWeakness = (competitorWeakness || 'generic quality').split('.')[0].toLowerCase();

    return [
      `Surgical ${nicheName} for ${cleanAudience} | ${cleanPlan} Framework`,
      `Scale your ${cleanAudience} ROI with the ${cleanPlan} Strategy`,
      `Stop ${cleanWeakness} | High-Performance ${nicheName} via ${cleanPlan}`
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

  // 2025 High-Conversion PAS Framework Constructor
  const structuredDescription = `
[THE PROBLEM]
Most providers in the ${niche.niche} space offer generic, outdated solutions that ignore the specific needs of ${niche.targetAudience}. Core frustration: ${niche.painPoints[0]}.

[THE AGITATION]
In 2025, a "one-size-fits-all" approach results in lost ROI. Ignoring ${niche.painPoints[1] || 'market trends'} leads to stagnation.

[THE SOLUTION: MY UNIQUE USP]
I specialize in ${niche.niche} with a tactical focus on: ${niche.battlePlan}. 

[WHAT YOU GET]
${gigDescription}

[WHY ME?]
I don't just perform tasks; I deliver transformations. My workflow is optimized for ${niche.targetAudience}, ensuring you skip the typical market bottlenecks.
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
                <h2 className="text-xl font-black text-white tracking-tighter uppercase italic">Strategic Blueprint 25/26</h2>
            </div>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-[0.2em] font-black">{niche.niche}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-3xl leading-none">&times;</button>
        </div>
        
        <div className="p-8 space-y-10 overflow-y-auto custom-scrollbar">
            {/* 2025 Market Sentiment Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    </div>
                    <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">Winning Edge (The USP)</h3>
                    <p className="text-sm leading-relaxed text-emerald-50/90 font-medium italic">"{niche.battlePlan}"</p>
                </div>
                <div className="bg-cyan-500/5 border border-cyan-500/20 p-5 rounded-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-3 opacity-10">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <h3 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-3">Target & Channels</h3>
                    <div className="space-y-2">
                      <p className="text-sm leading-relaxed text-cyan-50/90 font-medium">{niche.targetAudience}</p>
                      <div className="flex flex-wrap gap-1">
                        {niche.marketingChannels.map(c => (
                          <span key={c} className="text-[8px] px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-black uppercase tracking-tighter">#{c}</span>
                        ))}
                      </div>
                    </div>
                </div>
            </div>

            {/* 1. Psychological Hooks (Titles) */}
            <section>
                <div className="flex items-center space-x-3 mb-5">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-sm">01</span>
                    <h3 className="font-black text-white text-lg uppercase tracking-tight">Conversion-First Titles</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    {allTitles.map((title, index) => (
                         <div key={index} className={`relative p-5 pr-20 rounded-2xl border transition-all group shadow-inner ${index >= (niche.gigTitles?.length || 0) ? 'bg-cyan-900/10 border-cyan-500/30 hover:border-cyan-400' : 'bg-gray-800/40 border-gray-700/50 hover:border-emerald-500/40'}`}>
                            <p className="text-sm font-bold text-gray-100 leading-tight">{title}</p>
                            <span className={`text-[8px] absolute bottom-2 left-5 uppercase font-black ${index >= (niche.gigTitles?.length || 0) ? 'text-cyan-500/70' : 'text-emerald-500/50'}`}>
                              {index >= (niche.gigTitles?.length || 0) ? 'USP SYnthesis active' : 'Authority Hook Active'}
                            </span>
                            <CopyButton textToCopy={title} />
                        </div>
                    ))}
                    <div className="mt-2 text-[9px] text-gray-500 italic flex items-center">
                        <svg className="w-3 h-3 mr-1 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Last 3 titles synthesized using ROI-focused USP formulas from your Battle Plan.
                    </div>
                </div>
            </section>

             {/* 2. Transformation Story (Description) */}
            <section>
                <div className="flex items-center space-x-3 mb-5">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-sm">02</span>
                    <h3 className="font-black text-white text-lg uppercase tracking-tight">High-Persuasion Gig Description</h3>
                </div>
                <div className="relative bg-gray-800/40 p-6 pr-20 rounded-2xl border border-gray-700/50 shadow-inner group">
                    <div className="absolute top-4 left-4 flex space-x-2">
                        <span className="text-[7px] px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-black uppercase tracking-widest">PAS Framework</span>
                        <span className="text-[7px] px-1.5 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-black uppercase tracking-widest">USP Integrated</span>
                    </div>
                    <div className="text-sm font-sans whitespace-pre-wrap leading-relaxed text-gray-300 italic pt-6">
                        {structuredDescription}
                    </div>
                    <CopyButton textToCopy={structuredDescription} label="Copy Optimized Copy" />
                    <div className="mt-4 p-3 bg-gray-900/50 rounded-xl border border-gray-700 text-[10px] text-gray-500">
                        <span className="font-black text-emerald-500 uppercase mr-1">Pro Tip:</span> 
                        Addresses key pain points: <span className="text-red-400 font-bold">{niche.painPoints.join(', ')}</span>. Use this copy to establish immediate authority.
                    </div>
                </div>
            </section>

            {/* 3. Pricing & Tags Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <section>
                    <div className="flex items-center space-x-3 mb-5">
                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-40