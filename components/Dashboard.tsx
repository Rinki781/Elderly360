'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MedicationManager } from './MedicationManager';
import { TaskManager } from './TaskManager';
import { CareContinuityScoreView } from './CareContinuityScoreView';
import { RoutineDriftView } from './RoutineDriftView';
import { EscalationLadderView } from './EscalationLadderView';
import {
  HeartPulse,
  Activity,
  AlertTriangle,
  ShieldAlert,
  User,
  Users,
  Calendar,
  Pill,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingDown,
  Sparkles,
  Zap,
  TrendingUp,
} from 'lucide-react';

interface DashboardProps {
  onOpenInviteModal: () => void;
  onOpenNotifications: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenInviteModal,
  onOpenNotifications,
}) => {
  const {
    currentUser,
    seniorProfile,
    continuityScore,
    driftAlerts,
    escalationEvent,
    todayDoseLogs,
    todayTasks,
    simulateTimeMissedDose,
    canViewCategory,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'score' | 'drift' | 'escalation' | 'meds' | 'tasks'
  >('overview');

  // Adherence calculation for today
  const totalDoses = todayDoseLogs.length;
  const takenDoses = todayDoseLogs.filter((l) => l.status === 'taken').length;
  const missedDoses = todayDoseLogs.filter((l) => l.status === 'missed').length;

  const totalTasks = todayTasks.length;
  const completedTasks = todayTasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Role Banner / Context */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-slate-800 text-white p-5 sm:p-6 rounded-2xl shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-elder-500 to-teal-400 flex items-center justify-center text-white text-2xl font-black shadow-md shadow-elder-500/30">
            {currentUser.role === 'senior' ? '👴' : currentUser.role === 'family' ? '👨‍👧' : '🩺'}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider bg-elder-500/20 text-elder-300 border border-elder-500/30 px-2 py-0.5 rounded">
                Active Perspective: {currentUser.role.toUpperCase()}
              </span>
              <span className="text-xs text-slate-300">
                Logged in as <strong>{currentUser.name}</strong>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Senior Care Hub: <span className="text-elder-300">{seniorProfile.name}</span>, {seniorProfile.age}y
            </h1>

            <p className="text-xs text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
              <span>🩺 Conditions: {seniorProfile.conditions.join(', ')}</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-slate-400">
                Invite Code: <strong className="text-elder-200">{seniorProfile.inviteCode}</strong>
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenInviteModal}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Care Circle</span>
          </button>

          <button
            onClick={simulateTimeMissedDose}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 active:scale-95"
            title="Fast forward missed evening dose to test the Escalation Ladder"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Time</span>
          </button>
        </div>
      </div>

      {/* Routine Drift Warning Banner */}
      {driftAlerts.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-4 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <TrendingDown className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-amber-900">
                  Care Routine Drift Detected
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                  {driftAlerts[0].severity}
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5">
                {driftAlerts[0].explanation}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('drift')}
            className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 self-end sm:self-center bg-white px-3 py-1.5 rounded-lg border border-amber-200 shadow-2xs shrink-0"
          >
            Inspect Routine Drift <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Active Escalation Ladder Banner if ongoing */}
      {escalationEvent && escalationEvent.status !== 'resolved' && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 text-rose-600 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-rose-900">
                  Escalation Ladder Active: Step {escalationEvent.currentStep} of 4
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded">
                  {escalationEvent.medicineName} ({escalationEvent.scheduledTime})
                </span>
              </div>
              <p className="text-xs text-rose-800 mt-0.5">
                Current recipient alerted: <strong>{escalationEvent.steps.find((s) => s.step === escalationEvent.currentStep)?.recipient}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('escalation')}
            className="text-xs font-bold text-rose-900 hover:text-rose-950 flex items-center gap-1 self-end sm:self-center bg-white px-3 py-1.5 rounded-lg border border-rose-200 shadow-2xs shrink-0"
          >
            View Escalation Timeline <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 3 Key Vitals & Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Care Continuity Score Card */}
        <div
          onClick={() => setActiveTab('score')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-elder-400 transition"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-elder-600" /> Care Continuity Score
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-900">
                {canViewCategory('score') ? continuityScore.overall : '—'}
              </span>
              <span className="text-xs text-slate-500 font-semibold">/100</span>
              {canViewCategory('score') && (
                <span
                  className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                    continuityScore.pointChange7d < 0
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {continuityScore.pointChange7d > 0 ? `+${continuityScore.pointChange7d}` : continuityScore.pointChange7d} pts (7d)
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
              {canViewCategory('score') ? continuityScore.explanation : 'Restricted by privacy consent'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-elder-50 border border-elder-200 text-elder-700 flex items-center justify-center font-black text-lg">
            🩺
          </div>
        </div>

        {/* Today's Medications Progress */}
        <div
          onClick={() => setActiveTab('meds')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-teal-400 transition"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Pill className="w-3.5 h-3.5 text-teal-600" /> Today&apos;s Medications
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-900">
                {takenDoses} / {totalDoses}
              </span>
              <span className="text-xs font-bold text-emerald-700">
                ({totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 100}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {missedDoses > 0 ? `${missedDoses} dose missed today` : 'On track for scheduled morning doses'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-black text-lg">
            💊
          </div>
        </div>

        {/* Today's Tasks Progress */}
        <div
          onClick={() => setActiveTab('tasks')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-emerald-400 transition"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Daily Care Tasks
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-900">
                {completedTasks} / {totalTasks}
              </span>
              <span className="text-xs font-bold text-emerald-700">
                ({totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Walk, BP log, hydration, and stretching
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-black text-lg">
            ✅
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Today&apos;s Live Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab('score')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'score'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4 text-elder-500" />
          <span>Care Continuity Score (30d)</span>
        </button>

        <button
          onClick={() => setActiveTab('drift')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'drift'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingDown className="w-4 h-4 text-amber-500" />
          <span>Routine Drift ({driftAlerts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('escalation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'escalation'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>Escalation Ladder</span>
        </button>

        <button
          onClick={() => setActiveTab('meds')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'meds'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>Medications & Refill</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'tasks'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Care Tasks</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MedicationManager />
            <TaskManager />
          </div>
          <CareContinuityScoreView />
        </div>
      )}

      {activeTab === 'score' && <CareContinuityScoreView />}

      {activeTab === 'drift' && <RoutineDriftView />}

      {activeTab === 'escalation' && <EscalationLadderView />}

      {activeTab === 'meds' && <MedicationManager />}

      {activeTab === 'tasks' && <TaskManager />}
    </div>
  );
};
