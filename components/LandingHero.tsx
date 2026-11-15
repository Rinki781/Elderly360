'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import {
  HeartPulse,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Users,
  Clock,
  Activity,
  Award,
} from 'lucide-react';

interface LandingHeroProps {
  onEnterDashboard: () => void;
  onOpenInviteModal?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onEnterDashboard,
  onOpenInviteModal,
}) => {
  const { switchRole } = useApp();

  const handleLaunchRole = (role: UserRole) => {
    switchRole(role);
    onEnterDashboard();
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-elder-50/70 via-white to-slate-50 py-12 md:py-20 border-b border-slate-200">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-elder-200/30 to-teal-100/20 blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-elder-100/80 border border-elder-200 text-elder-800 text-xs font-bold tracking-wide uppercase mb-5">
            <Sparkles className="w-3.5 h-3.5 text-elder-600" />
            Hackathon Project: Proactive Elderly Care Continuity
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-tight">
            Noticing when elderly care{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-elder-600 via-teal-600 to-cyan-600 underline decoration-elder-300 decoration-wavy">
              quietly slips
            </span>
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
            Most apps only remind seniors with basic alarms. <strong className="text-slate-900 font-semibold">ELDERLY360</strong> tracks daily care routines, computes an explainable <span className="text-elder-700 font-semibold">Care Continuity Score</span>, detects quiet routine drift (like skipped evening doses or walks), and automatically escalates to family and caretakers before emergencies occur.
          </p>

          {/* Critical for judging: Try Demo Card */}
          <div className="mt-8 p-6 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 max-w-2xl mx-auto text-left">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-elder-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-elder-600" /> Judging Demo Mode
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  Try Live Demo Instantly (No Signup Required)
                </h2>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                30-day pre-seeded
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              Pre-loaded with 30 days of realistic history for <strong>Ramesh Sharma (72)</strong> with hypertension and diabetes. Notice the deliberate evening adherence drop in the last 6 days!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleLaunchRole('senior')}
                className="group relative flex flex-col p-3 rounded-xl border-2 border-elder-200 hover:border-elder-600 bg-elder-50/50 hover:bg-elder-50 transition text-left"
              >
                <span className="text-xl mb-1">👴</span>
                <span className="text-sm font-bold text-slate-900 group-hover:text-elder-700">Senior Role</span>
                <span className="text-[11px] text-slate-500">Ramesh Sharma, 72</span>
                <span className="mt-2 text-[10px] text-elder-700 font-semibold flex items-center gap-1">
                  Launch Senior View <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                </span>
              </button>

              <button
                onClick={() => handleLaunchRole('family')}
                className="group relative flex flex-col p-3 rounded-xl border-2 border-slate-200 hover:border-teal-600 bg-slate-50/50 hover:bg-teal-50/50 transition text-left"
              >
                <span className="text-xl mb-1">👨‍👧</span>
                <span className="text-sm font-bold text-slate-900 group-hover:text-teal-700">Family Role</span>
                <span className="text-[11px] text-slate-500">Aarav Sharma (Son)</span>
                <span className="mt-2 text-[10px] text-teal-700 font-semibold flex items-center gap-1">
                  Launch Family View <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                </span>
              </button>

              <button
                onClick={() => handleLaunchRole('caretaker')}
                className="group relative flex flex-col p-3 rounded-xl border-2 border-slate-200 hover:border-sky-600 bg-slate-50/50 hover:bg-sky-50/50 transition text-left"
              >
                <span className="text-xl mb-1">🩺</span>
                <span className="text-sm font-bold text-slate-900 group-hover:text-sky-700">Caretaker Role</span>
                <span className="text-[11px] text-slate-500">Priya Singh (Nurse)</span>
                <span className="mt-2 text-[10px] text-sky-700 font-semibold flex items-center gap-1">
                  Launch Caretaker View <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                </span>
              </button>
            </div>

            {onOpenInviteModal && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Have a Senior Invite Code?</span>
                <button
                  onClick={onOpenInviteModal}
                  className="font-bold text-elder-700 hover:underline flex items-center gap-1"
                >
                  <Users className="w-3.5 h-3.5" /> Link with Invite Code
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 4 Key Pillars Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Care Continuity Score</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Transparent 0-100 score weighted across medications (50%), tasks (25%), appointments (15%), and check-ins (10%).
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Routine Drift Detection</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Compares the last 7 days against a 21-day baseline. Instantly spots when evening doses or walks decline by 30%+.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Automated Escalation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Missed dose triggers: Senior reminder &rarr; Caretaker alert &rarr; Family escalation &rarr; Emergency SOS protocol.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Senior Privacy & Voice</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Granular consent matrix per family member, simplified Senior Mode with giant buttons, and bilingual voice assistant.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
