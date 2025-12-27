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
        const success = exportToCSV(data, 'fiverr_market_report.csv');
        if (success) {
            showToast('Full Market Report exported to CSV!', 'success');
        } else {
            showToast('No data to export.', 'error');
        }
    };

    const handleExportJSON = () => {
        const success = exportToJSON(data, 'fiverr_market_report.json');
        if (success) {
            showToast('Full Market Report exported to JSON!', 'success');
        } else {
            showToast('No data to export.', 'error');
        }
    };

    return (
        <>
            <div className="flex space-x-2">
                <button
                    onClick={handleExportCSV}
                    className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-center text-gray-200 bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-600 hover:border-cyan-400 focus:ring-4 focus:outline-none focus:ring-gray-800 transition-all"
                >
                    Export Full Report (CSV)
                </button>
                <button
                    onClick={handleExportJSON}
                    className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-center text-gray-200 bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-600 hover:border-cyan-400 focus:ring-4 focus:outline-none focus:ring-gray-800 transition-all"
                >
                    Export JSON
                </button>
            </div>
            {toast.visible && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(prev => ({...prev, visible: false}))} />}
        </>
    );
};