'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Activity,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowDownRight,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export const CareContinuityScoreView: React.FC = () => {
  const { continuityScore, seniorProfile, canViewCategory } = useApp();
  const [mounted, setMounted] = useState(false);
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Privacy check
  if (!canViewCategory('score')) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-xs">
        <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Care Continuity Score Restricted</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
          {seniorProfile.name} has customized their privacy consent settings. Score trends and breakdowns are not visible for your role.
        </p>
      </div>
    );
  }

  // Format chart data for 30 days
  const chartData = (continuityScore.history || []).map((pt) => {
    // format "YYYY-MM-DD" -> "MMM D"
    const parts = pt.date.split('-');
    const label = `${parts[1]}/${parts[2]}`;
    return {
      date: label,
      fullDate: pt.date,
      overall: pt.overall,
      medicineAdherence: pt.medicineAdherence,
      taskCompletion: pt.taskCompletion,
    };
  });

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-elder-100 text-elder-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Care Continuity Score (0–100)
            </h2>
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
              Explainable AI
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Weighted composite tracking medicine compliance, routine tasks, appointments, and check-ins
          </p>
        </div>

        <button
          onClick={() => setShowFormulaModal(!showFormulaModal)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition self-start sm:self-center"
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
          <span>Formula Breakdown</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
      </div>

      {/* Transparent Formula Drawer if toggled */}
      {showFormulaModal && (
        <div className="bg-slate-50 p-4 border-b border-slate-200 text-xs text-slate-700 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between font-bold text-slate-900">
            <span>Mathematically Transparent Calculation Formula:</span>
            <span className="text-elder-700 font-mono">
              Score = 0.50(Meds) + 0.25(Tasks) + 0.15(Appts) + 0.10(Check-ins)
            </span>
          </div>
          <p className="text-slate-600">
            Recent 7-day performance is weighted 65% vs 35% for prior weeks to immediately capture slipping care habits before acute clinical crises arise.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-medium">
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Weight: 50%</span>
              <strong className="text-slate-900">Medication Adherence</strong>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Weight: 25%</span>
              <strong className="text-slate-900">Care Task Completion</strong>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Weight: 15%</span>
              <strong className="text-slate-900">Doctor Attendance</strong>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Weight: 10%</span>
              <strong className="text-slate-900">Check-in Consistency</strong>
            </div>
          </div>
        </div>
      )}

      {/* Score Hero & Explainability Reason Banner */}
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Giant Score Display */}
        <div className="flex flex-col justify-center items-center p-6 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Current Index
          </span>
          <div className="relative my-3">
            <div
              className={`w-32 h-32 rounded-full border-8 flex flex-col items-center justify-center ${getScoreColor(
                continuityScore.overall
              )}`}
            >
              <span className="text-4xl font-black tracking-tight text-slate-900">
                {continuityScore.overall}
              </span>
              <span className="text-xs font-bold text-slate-500">out of 100</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {continuityScore.pointChange7d < 0 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                {continuityScore.pointChange7d} pts vs 21d baseline
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                +{continuityScore.pointChange7d} pts improvement
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 mt-2">
            Status: {continuityScore.trend === 'declining' ? 'Routine Drift Alert' : 'Stable Care Routine'}
          </span>
        </div>

        {/* Middle & Right: Explainable Reason Breakdown */}
        <div className="lg:col-span-2 space-y-4 flex flex-col justify-between">
          {/* Plain English Explainability Box */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-900">
            <div className="flex items-center gap-2 mb-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Explainable Score Insight (Plain Language)
              </h4>
            </div>
            <p className="text-sm font-semibold text-amber-950 leading-relaxed">
              {continuityScore.explanation}
            </p>
            <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex flex-wrap gap-2 text-xs">
              {continuityScore.dropReasons.map((reason, idx) => (
                <span
                  key={idx}
                  className="bg-white/80 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200 font-medium flex items-center gap-1"
                >
                  <ArrowDownRight className="w-3 h-3 text-amber-600 shrink-0" />
                  {reason}
                </span>
              ))}
            </div>
          </div>

          {/* 4 Factor Contribution Bars */}
          <div className="space-y-2.5 text-xs">
            <h5 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Per-Factor Breakdown & Component Health
            </h5>

            {/* Factor 1: Meds (50%) */}
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>💊 Medication Adherence (50% weight)</span>
                <span className="font-bold text-slate-900">
                  {continuityScore.medicineAdherence}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    continuityScore.medicineAdherence < 75 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${continuityScore.medicineAdherence}%` }}
                />
              </div>
            </div>

            {/* Factor 2: Tasks (25%) */}
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>🏃 Daily Care Tasks & Vitals (25% weight)</span>
                <span className="font-bold text-slate-900">
                  {continuityScore.taskCompletion}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-teal-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${continuityScore.taskCompletion}%` }}
                />
              </div>
            </div>

            {/* Factor 3: Appts (15%) */}
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>🏥 Doctor Appointment Attendance (15% weight)</span>
                <span className="font-bold text-slate-900">
                  {continuityScore.appointmentAttendance}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${continuityScore.appointmentAttendance}%` }}
                />
              </div>
            </div>

            {/* Factor 4: Check-ins (10%) */}
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>📱 Check-in Consistency (10% weight)</span>
                <span className="font-bold text-slate-900">
                  {continuityScore.checkinConsistency}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${continuityScore.checkinConsistency}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 30-Day Trend Chart Section (Recharts) */}
      <div className="p-4 sm:p-6 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-elder-600" />
              30-Day Continuity Score Trend & Routine Drift Visualization
            </h4>
            <p className="text-xs text-slate-500">
              Notice the visible stability in days 1–24 (~90 pts), and deliberate slip in the last 6 days (~76 pts)
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-slate-700">
              <span className="w-3 h-3 rounded-full bg-elder-600 inline-block" />
              Overall Score
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-3 h-3 rounded-full bg-teal-400 inline-block" />
              Meds Adherence
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="medGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  interval={4}
                />
                <YAxis
                  domain={[30, 100]}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs space-y-1">
                          <p className="font-bold text-slate-200">{data.fullDate}</p>
                          <p className="text-elder-300 font-extrabold text-sm">
                            Score: {data.overall} / 100
                          </p>
                          <p className="text-slate-300">Medication: {data.medicineAdherence}%</p>
                          <p className="text-slate-300">Tasks: {data.taskCompletion}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="overall"
                  stroke="#0d9488"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#scoreGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="medicineAdherence"
                  stroke="#38bdf8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#medGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              Loading 30-day analytics chart...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
