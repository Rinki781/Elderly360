'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { RoutineDriftAlert } from '@/types';
import {
  TrendingDown,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BellRing,
  HelpCircle,
  Activity,
} from 'lucide-react';

export const RoutineDriftView: React.FC = () => {
  const { driftAlerts, seniorProfile, showToast } = useApp();

  const handleAcknowledge = (alertId: string) => {
    showToast(`Drift alert acknowledged. Caretaker notified to check in.`);
  };

  const getSeverityBadge = (severity: RoutineDriftAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Critical Drift (&gt;50% drop)
          </span>
        );
      case 'moderate':
        return (
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Moderate Drift (&gt;35% drop)
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full">
            Routine Watch (&gt;25% drop)
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Routine Drift Detection Engine
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Compares recent 7-day adherence against the previous 21-day personalized baseline per time-slot
          </p>
        </div>

        <div className="text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Baseline Window: <strong>21 Days</strong> vs <strong>Last 7 Days</strong></span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-4">
        {driftAlerts.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800 text-sm">No Routine Drift Detected</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {seniorProfile.name}&apos;s care pattern matches their historical baseline across all morning, afternoon, and evening slots.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {driftAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-5 rounded-xl border transition-all ${
                  alert.severity === 'critical'
                    ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                    : 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {getSeverityBadge(alert.severity)}
                    <h4 className="text-base font-bold text-slate-900 mt-2">
                      {alert.activityName}
                    </h4>
                    <p className="text-xs text-slate-600 font-semibold flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Time Slot: {alert.timeSlot}
                    </p>
                  </div>

                  <span className="text-xs font-black text-rose-700 bg-white px-2 py-1 rounded-md border border-rose-200 shadow-2xs">
                    -{alert.dropPercent}% Drop
                  </span>
                </div>

                {/* Visual baseline comparison bar */}
                <div className="my-4 bg-white p-3 rounded-lg border border-slate-200/80 space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>21-Day Baseline Adherence:</span>
                      <strong className="text-slate-800">{alert.baselineCompletion}%</strong>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${alert.baselineCompletion}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>Last 7 Days (Observed):</span>
                      <strong className="text-rose-700 font-bold">{alert.recentCompletion}%</strong>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full"
                        style={{ width: `${alert.recentCompletion}%` }}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {alert.explanation}
                </p>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">
                    Detected: {alert.detectedDate}
                  </span>

                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition shadow-2xs"
                  >
                    <BellRing className="w-3.5 h-3.5 text-elder-600" />
                    <span>Acknowledge & Investigate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
