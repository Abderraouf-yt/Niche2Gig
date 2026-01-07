
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-[#020617]/70 backdrop-blur-2xl border-b border-white/5">
      <div className="container mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-cyan-600/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <svg className="w-6 h-6 text-cyan-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter leading-none">STRAT-NODE</h1>
            <p className="text-[8px] font-black text-cyan-500 uppercase tracking-[0.3em] mt-1.5 opacity-80">Market Intelligence Ecosystem</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
           <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Market Feed Active</span>
           </div>
           <div className="h-4 w-px bg-white/10"></div>
           <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest border border-cyan-500/30 px-3 py-1 rounded-full">v4.1.0-2026-ENGAGED</span>
        </div>
      </div>
    </header>
  );
};
