'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Appointment } from '@/types';
import {
  Sparkles,
  Printer,
  Copy,
  Check,
  Languages,
  Calendar,
  AlertTriangle,
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface DoctorVisitSummaryViewProps {
  appointment?: Appointment | null;
  onClose?: () => void;
}

export const DoctorVisitSummaryView: React.FC<DoctorVisitSummaryViewProps> = ({
  appointment,
  onClose,
}) => {
  const { seniorProfile, continuityScore, driftAlerts, showToast } = useApp();

  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const fetchSummary = async (lang: 'en' | 'hi' = language) => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'doctor_summary',
          language: lang,
          seniorName: seniorProfile.name,
          age: seniorProfile.age,
          conditions: seniorProfile.conditions,
          continuityScore: continuityScore.overall,
          scoreChange: continuityScore.pointChange7d,
          driftAlerts: driftAlerts.map((d) => d.explanation),
          missedDoses: ['Atorvastatin 10mg (Bedtime)', 'Metformin 500mg (Evening)'],
          vitals: 'Resting BP 144/88 mmHg, Pulse 74 bpm',
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setSummaryData(json.data);
      }
    } catch (err) {
      console.warn('Failed to fetch from /api/gemini, using local fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary(language);
  }, [language]);

  const handleCopyWeeklySummary = () => {
    if (summaryData?.weeklyCareSummary) {
      navigator.clipboard.writeText(summaryData.weeklyCareSummary);
      setCopied(true);
      showToast('Weekly care summary copied to clipboard for family WhatsApp!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-elder-200 shadow-md overflow-hidden space-y-4">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-elder-900 via-teal-900 to-navy-950 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-elder-500/20 text-elder-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-elder-400" />
            </div>
            <h2 className="text-lg font-bold text-white">
              Gemini Doctor-Visit Clinical Brief
            </h2>
            <span className="text-[10px] font-black uppercase tracking-wider bg-elder-400 text-slate-950 px-2 py-0.5 rounded-full">
              AI Generated
            </span>
          </div>
          <p className="text-xs text-elder-200/80 mt-1">
            Pre-consultation clinical synthesis of adherence shifts, drift alerts, and suggested questions for Dr.{' '}
            {appointment?.doctorName || 'Ananya Roy'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-elder-200 border border-white/20 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'हिंदी में पढ़ें' : 'English View'}</span>
          </button>

          <button
            onClick={() => fetchSummary(language)}
            disabled={loading}
            className="p-2 bg-white/10 hover:bg-white/20 text-elder-200 border border-white/20 rounded-lg transition"
            title="Re-generate summary"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-elder-500 hover:bg-elder-400 text-slate-950 rounded-lg text-xs font-bold transition flex items-center gap-1"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-6 space-y-6">
        {loading || !summaryData ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-10 h-10 border-4 border-elder-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-600">
              Synthesizing 30-day care telemetry into clinical consultation brief...
            </p>
          </div>
        ) : (
          <div className="space-y-6 text-xs text-slate-800">
            {/* Overview Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-slate-900">
                  {summaryData.summaryTitle}
                </h3>
                <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {summaryData.period}
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                {summaryData.clinicalOverview}
              </p>
            </div>

            {/* Section 1: Key Observed Changes Since Last Visit */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 mb-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>
                  {language === 'hi'
                    ? 'पिछली विजिट के बाद से मुख्य बदलाव (Changes Noted)'
                    : 'Key Telemetry Changes Since Last Visit (30-Day Window)'}
                </span>
              </h4>

              <div className="space-y-2">
                {summaryData.keyObservedChanges?.map((change: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-slate-800 font-medium leading-relaxed">
                      {change}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Suggested Questions for Doctor */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 mb-2.5">
                <HelpCircle className="w-4 h-4 text-elder-600" />
                <span>
                  {language === 'hi'
                    ? 'डॉक्टर से पूछने योग्य मुख्य सवाल (Suggested Questions for Doctor)'
                    : 'Suggested Empowered Questions to Ask the Doctor'}
                </span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {summaryData.suggestedQuestionsForDoctor?.map((q: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1 hover:border-elder-300 transition"
                  >
                    <span className="text-[10px] font-bold text-elder-700 uppercase tracking-wider">
                      Question {idx + 1}:
                    </span>
                    <p className="font-semibold text-slate-900 leading-snug">
                      &quot;{q}&quot;
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Weekly Care Summary for Families */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {language === 'hi'
                      ? 'परिवार के लिए साप्ताहिक सारांश'
                      : 'Weekly Care Summary for Family Group'}
                  </span>
                </span>
                <p className="text-slate-800 font-medium mt-1">
                  {summaryData.weeklyCareSummary}
                </p>
              </div>

              <button
                onClick={handleCopyWeeklySummary}
                className="px-3 py-1.5 bg-white hover:bg-emerald-100/60 text-emerald-900 border border-emerald-300 rounded-lg font-bold flex items-center gap-1 text-[11px] shrink-0 self-end sm:self-center transition shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy for WhatsApp'}</span>
              </button>
            </div>

            {/* Footer source note */}
            <div className="pt-2 text-[10px] text-slate-400 text-center">
              Generated by: {summaryData.generatedBy || 'ELDERLY360 AI Engine'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
