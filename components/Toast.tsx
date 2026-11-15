'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, showToast } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md animate-bounce-in">
      <div className="flex items-center gap-3 bg-navy-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-elder-500/30">
        <div className="w-8 h-8 rounded-full bg-elder-500/20 text-elder-400 flex items-center justify-center shrink-0">
          <Info className="w-5 h-5 text-elder-400" />
        </div>
        <p className="text-sm font-medium flex-1 text-slate-100">{toastMessage}</p>
        <button
          onClick={() => showToast('')}
          className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
