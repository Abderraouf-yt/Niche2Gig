import React from 'react';

interface LoaderProps {
    progress: number;
}

export const Loader: React.FC<LoaderProps> = ({ progress }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-full max-w-md">
      <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent border-solid rounded-full animate-spin"></div>
      <p className="text-lg text-gray-300 text-center">Analyzing Niches...</p>
      <div className="w-full bg-gray-700 rounded-full h-4 mt-4">
        <div 
          className="bg-cyan-500 h-4 rounded-full transition-all duration-300 ease-linear" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-lg font-bold text-cyan-400">{Math.round(progress)}%</p>
    </div>
  );
};