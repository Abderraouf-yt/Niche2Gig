
import React from 'react';

interface LoaderProps {
    progress: number;
    message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ progress, message = "Analyzing Niches..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-md p-8">
      <div className="relative">
          <div className="w-24 h-24 border-4 border-cyan-500/20 border-solid rounded-full"></div>
          <div className="absolute inset-0 w-24 h-24 border-4 border-cyan-400 border-t-transparent border-solid rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-cyan-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
          </div>
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-xl font-bold text-white tracking-tight">Market Intelligence Scan</p>
        <p className="text-sm text-cyan-400/80 font-medium h-5 animate-pulse">{message}</p>
      </div>

      <div className="w-full space-y-2">
          <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden border border-gray-600">
            <div 
              className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-full rounded-full transition-all duration-300 ease-linear shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center px-1">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Progress</span>
              <span className="text-xs font-black text-cyan-400 tabular-nums">{Math.round(progress)}%</span>
          </div>
      </div>
      
      <div className="bg-gray-900/40 p-3 rounded-lg border border-gray-700/50 w-full">
          <p className="text-[10px] text-gray-500 italic text-center leading-tight">
              Using Gemini 3 Flash with Google Search Grounding. This deep synthesis can take up to 2 minutes during peak load.
          </p>
      </div>
    </div>
  );
};
