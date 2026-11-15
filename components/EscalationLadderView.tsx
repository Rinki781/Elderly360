'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ShieldAlert,
  FastForward,
  CheckCircle2,
  Clock,
  User,
  Users,
  PhoneCall,
  AlertOctagon,
  Settings,
  Sparkles,
} from 'lucide-react';

export const EscalationLadderView: React.FC = () => {
  const {
    escalationEvent,
    advanceEscalationLadder,
    resolveEscalation,
    simulateTimeMissedDose,
    isSimulatingTime,
    seniorProfile,
    showToast,
  } = useApp();

  const [timingMode, setTimingMode] = useState<'standard' | 'demo'>('standard');

  const currentStep = escalationEvent?.currentStep || 1;

  const stepsConfig = [
    {
      step: 1,
      title: 'Senior Voice & App Gentle Reminder',
      description: 'Audio chime and screen prompt for senior to take scheduled dose.',
      recipient: `${seniorProfile.name} (Senior)`,
      delayStandard: '0 mins',
      delayDemo: '0 secs',
      icon: '👴',
    },
    {
      step: 2,
      title: 'Caretaker Alert & Verification',
      description: 'Dispatches high-priority push alert to assigned eldercare nurse.',
      recipient: 'Priya Singh (Primary Caretaker)',
      delayStandard: '15 mins',
      delayDemo: '1 min',
      icon: '🩺',
    },
    {
      step: 3,
      title: 'Family Urgent Escalation (SMS + App)',
      description: 'Direct SMS text alert and call prompt sent to primary family guardian.',
      recipient: 'Aarav Sharma (Son)',
      delayStandard: '30 mins',
      delayDemo: '2 mins',
      icon: '👨‍👧',
    },
    {
      step: 4,
      title: 'Emergency Contact & SOS Protocol',
      description: 'Suggests emergency dispatch, calls secondary doctor & emergency contacts.',
      recipient: 'Emergency Protocol (Family + Helpline)',
      delayStandard: '60 mins',
      delayDemo: '3 mins',
      icon: '🚨',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Automated Escalation Ladder
            </h2>
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                escalationEvent?.status === 'resolved'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800 animate-pulse'
              }`}
            >
              {escalationEvent?.status === 'resolved' ? 'Resolved' : `Level ${currentStep} Active`}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Progressive safety escalation triggered upon missed evening medication doses
          </p>
        </div>

        {/* Timing Mode */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setTimingMode('standard')}
              className={`px-2.5 py-1 rounded transition ${
                timingMode === 'standard' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Standard (15m/30m/60m)
            </button>
            <button
              onClick={() => setTimingMode('demo')}
              className={`px-2.5 py-1 rounded transition ${
                timingMode === 'demo' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Demo Fast (1m/2m/3m)
            </button>
          </div>
        </div>
      </div>

      {/* Escalation Event Summary Card */}
      {escalationEvent && (
        <div className="bg-slate-50/70 border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Active Incident:</span>
            <strong className="text-slate-900">
              {escalationEvent.medicineName} ({escalationEvent.dosage})
            </strong>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">Scheduled: {escalationEvent.scheduledTime}</span>
          </div>

          <div className="flex items-center gap-2">
            {escalationEvent.status !== 'resolved' ? (
              <button
                onClick={() => resolveEscalation(escalationEvent.id)}
                className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Dose Taken & Resolve</span>
              </button>
            ) : (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Incident Resolved
              </span>
            )}
          </div>
        </div>
      )}

      {/* Visual Timeline of the 4 Steps */}
      <div className="p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          {stepsConfig.map((item, index) => {
            const stepNum = item.step;
            const isPassed = currentStep > stepNum;
            const isCurrent = currentStep === stepNum && escalationEvent?.status !== 'resolved';
            const isPending = currentStep < stepNum;
            const isResolved = escalationEvent?.status === 'resolved';

            return (
              <div
                key={stepNum}
                className={`p-4 rounded-xl border relative flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/30 shadow-md'
                    : isPassed || (isResolved && stepNum <= currentStep)
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-white border-slate-200 opacity-60'
                }`}
              >
                {/* Step badge */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isCurrent
                          ? 'bg-rose-500 text-white animate-pulse'
                          : isPassed
                          ? 'bg-emerald-200 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isCurrent ? 'Current Alert' : isPassed ? 'Dispatched' : `Step ${stepNum}`}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-slate-400 block">
                    Trigger Delay: {timingMode === 'standard' ? item.delayStandard : item.delayDemo}
                  </span>

                  <h4 className="font-bold text-slate-900 text-xs mt-1 leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-[11px]">
                  <span className="text-slate-400 block text-[10px]">Recipient:</span>
                  <strong className="text-slate-800">{item.recipient}</strong>
                </div>
              </div>
            );
          })}
        </div>

        {/* Step Progression Controls */}
        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-slate-600">
            <strong className="text-slate-900">Judging Tip:</strong> Click &quot;Simulate Time&quot; or &quot;Advance Step&quot; to test each tier of the escalation ladder in real time.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={advanceEscalationLadder}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold transition flex items-center gap-1"
            >
              <span>Advance to Next Step</span> &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
