'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  CheckCircle2,
  Clock,
  Volume2,
  PhoneCall,
  AlertOctagon,
  Sparkles,
  ArrowLeft,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SeniorModeViewProps {
  onOpenVoiceAssistant: () => void;
  onTriggerSOS: () => void;
}

export const SeniorModeView: React.FC<SeniorModeViewProps> = ({
  onOpenVoiceAssistant,
  onTriggerSOS,
}) => {
  const {
    seniorProfile,
    updateSeniorProfile,
    todayDoseLogs,
    markDose,
    showToast,
  } = useApp();

  const textSize = seniorProfile.seniorModeTextSize || 'large';

  // Find the next pending or missed dose for today, or fallback to first
  const pendingDose =
    todayDoseLogs.find((l) => l.status === 'pending') ||
    todayDoseLogs.find((l) => l.status === 'missed') ||
    todayDoseLogs[0];

  const handlePrimaryTake = () => {
    if (pendingDose) {
      markDose(pendingDose.id, 'taken');
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // Confetti fallback
      }
      showToast(`Medicine marked as taken! Well done, ${seniorProfile.name}!`);
    }
  };

  const handleSkip = () => {
    if (pendingDose) {
      markDose(pendingDose.id, 'skipped', 'Skipped by senior in Senior Mode');
      showToast('Medicine dose marked as skipped. Caretaker has been notified.');
    }
  };

  // Text size classes
  const fontClass =
    textSize === 'extra-large'
      ? 'text-2xl'
      : textSize === 'large'
      ? 'text-xl'
      : 'text-lg';

  const headingClass =
    textSize === 'extra-large'
      ? 'text-4xl'
      : textSize === 'large'
      ? 'text-3xl'
      : 'text-2xl';

  return (
    <div className="bg-slate-950 text-white min-h-[85vh] rounded-3xl p-6 sm:p-10 border-4 border-slate-800 shadow-2xl flex flex-col justify-between space-y-8 animate-fade-in">
      {/* Top Bar: Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-elder-400 bg-elder-950/80 border border-elder-500/40 px-3 py-1 rounded-full">
            Simplified Senior Mode
          </span>
          <h2 className={`font-black text-white mt-2 ${headingClass}`}>
            Namaste, {seniorProfile.name}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Text Size Switcher */}
          <div className="flex items-center bg-slate-900 border-2 border-slate-700 p-1 rounded-xl">
            <span className="text-xs font-bold text-slate-400 px-2">Text:</span>
            {(['normal', 'large', 'extra-large'] as const).map((sz) => (
              <button
                key={sz}
                onClick={() => updateSeniorProfile({ seniorModeTextSize: sz })}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition ${
                  textSize === sz
                    ? 'bg-amber-400 text-slate-950 shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {sz === 'normal' ? 'A' : sz === 'large' ? 'A+' : 'A++'}
              </button>
            ))}
          </div>

          <button
            onClick={() => updateSeniorProfile({ seniorModeEnabled: false })}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Standard Mode</span>
          </button>
        </div>
      </div>

      {/* ONE PRIMARY ACTION PER SCREEN */}
      <div className="max-w-2xl mx-auto w-full my-auto text-center space-y-6">
        {pendingDose ? (
          <div className="bg-slate-900 border-4 border-amber-400 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-4 py-1.5 rounded-full font-bold text-sm">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Next Scheduled Action ({pendingDose.scheduledTime})</span>
            </div>

            <div>
              <p className="text-slate-400 font-semibold text-sm sm:text-base">
                Time to take your scheduled dose:
              </p>
              <h3 className={`font-black text-amber-300 mt-2 ${headingClass}`}>
                {pendingDose.medicineName} ({pendingDose.dosage})
              </h3>
              <p className={`text-slate-300 font-medium mt-2 ${fontClass}`}>
                Scheduled for {pendingDose.scheduledTime} with water after food.
              </p>
            </div>

            {/* Giant Primary Action Button */}
            <button
              onClick={handlePrimaryTake}
              className="w-full py-6 px-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl font-black text-2xl sm:text-3xl shadow-xl shadow-emerald-500/30 border-4 border-emerald-300 flex items-center justify-center gap-3 transition-transform active:scale-95"
            >
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-slate-950" />
              <span>YES, I TOOK THIS MEDICINE</span>
            </button>

            {/* Secondary Skip Option */}
            <button
              onClick={handleSkip}
              className="w-full py-3 text-slate-400 hover:text-rose-300 text-sm sm:text-base font-bold flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              <span>I cannot take this right now (Skip dose)</span>
            </button>
          </div>
        ) : (
          <div className="bg-slate-900 border-4 border-emerald-500 rounded-3xl p-10 shadow-2xl space-y-4">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-4xl">
              ✅
            </div>
            <h3 className={`font-black text-emerald-400 ${headingClass}`}>
              All Doses Completed!
            </h3>
            <p className={`text-slate-300 ${fontClass}`}>
              You have taken all your scheduled medicines for today. Stay hydrated and rest well!
            </p>
          </div>
        )}
      </div>

      {/* 3 Large Accessible Secondary Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800">
        {/* Voice Assistant */}
        <button
          onClick={onOpenVoiceAssistant}
          className="p-5 bg-elder-900/60 hover:bg-elder-800/80 text-white border-2 border-elder-500/50 rounded-2xl flex items-center justify-center gap-3 font-bold text-base transition group"
        >
          <Volume2 className="w-7 h-7 text-elder-400 group-hover:scale-110 transition" />
          <span>Speak (Hindi / English)</span>
        </button>

        {/* Call Son Aarav */}
        <a
          href="tel:+919811154321"
          className="p-5 bg-blue-950/60 hover:bg-blue-900/80 text-white border-2 border-blue-500/50 rounded-2xl flex items-center justify-center gap-3 font-bold text-base transition group"
        >
          <PhoneCall className="w-7 h-7 text-blue-400 group-hover:scale-110 transition" />
          <span>Call Son (Aarav)</span>
        </a>

        {/* Emergency SOS */}
        <button
          onClick={onTriggerSOS}
          className="p-5 bg-rose-950 hover:bg-rose-900 text-white border-2 border-rose-500 rounded-2xl flex items-center justify-center gap-3 font-black text-base shadow-lg shadow-rose-950/50 transition active:scale-95 group"
        >
          <AlertOctagon className="w-7 h-7 text-rose-400 group-hover:animate-bounce" />
          <span>Emergency SOS</span>
        </button>
      </div>
    </div>
  );
};
