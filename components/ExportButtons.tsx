import React, { useState, useEffect } from 'react';
import type { ScoredNiche } from '../types';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';

interface ExportButtonsProps {
  data: ScoredNiche[];
}

interface ToastState {
    message: string;
    type: 'success' | 'error';
    visible: boolean;
}

const Toast: React.FC<{ message: string; type: 'success' | 'error'; onDismiss: () => void }> = ({ message, type, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onDismiss]);
    
    const bgColor = type === 'success' ? 'bg-emerald-500' : 'bg-red-500';

    return (
        <div className={`fixed bottom-5 right-5 z-[100] ${bgColor} text-white py-2 px-4 rounded-lg shadow-lg transition-opacity duration-300 animate-in slide-in-from-bottom-5`}>
            {message}
        </div>
    );
};


export const ExportButtons: React.FC<ExportButtonsProps> = ({ data }) => {
    const [toast, setToast] = useState<ToastState>({ message: '', type: 'success', visible: false });

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type, visible: true });
    };

    const handleExportCSV = () => {
        const success = exportToCSV(data, 'fiverr_niche_analysis_blueprint.csv');
        if (success) {
            showToast('Full Deep Analysis exported to CSV!', 'success');
        } else {
            showToast('No data to export.', 'error');
        }
    };

    const handleExportJSON = () => {
        const success = exportToJSON(data, 'fiverr_niche_analysis_blueprint.json');
        if (success) {
            showToast('Full Strategy Blueprint exported to JSON!', 'success');
        } else {
            showToast('No data to export.', 'error');
        }
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row items-end gap-3">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter mb-1 mr-1">Includes Market Battle Plan</span>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleExportCSV}
                            className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-center text-gray-100 bg-cyan-600/20 border border-cyan-500/30 rounded-lg hover:bg-cyan-600 hover:border-cyan-400 focus:ring-4 focus:outline-none focus:ring-cyan-900 transition-all shadow-lg hover:shadow-cyan-500/20"
                        >
                            Export Strategy (CSV)
                        </button>
                        <button
                            onClick={handleExportJSON}
                            className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-center text-gray-200 bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-600 hover:border-cyan-400 focus:ring-4 focus:outline-none focus:ring-gray-800 transition-all"
                        >
                            Export JSON
                        </button>
                    </div>
                </div>
            </div>
            {toast.visible && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onDismiss={() => setToast(prev => ({...prev, visible: false}))} 
                />
            )}
        </>
    );
};
