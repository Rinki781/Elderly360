'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import {
  HeartPulse,
  FastForward,
  RotateCcw,
  Bell,
  UserCheck,
  Shield,
  Menu,
  X,
  Sparkles,
  Volume2,
  Clock,
} from 'lucide-react';

interface NavbarProps {
  onOpenNotifications?: () => void;
  onOpenSeniorVoice?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNotifications,
  onOpenSeniorVoice,
}) => {
  const {
    currentUser,
    switchRole,
    simulateTimeMissedDose,
    isSimulatingTime,
    resetToDemoSeed,
    notifications,
    seniorProfile,
    updateSeniorProfile,
    formattedDemoTime,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(
    (n) => !n.read && (n.targetRole === 'all' || n.targetRole === currentUser.role)
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <a href="#dashboard" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-elder-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-elder-500/20 group-hover:scale-105 transition">
                <HeartPulse className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900">
                    ELDERLY<span className="text-elder-600">360</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-elder-100 text-elder-800 px-1.5 py-0.5 rounded-full">
                    Care Continuity
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Routine Drift & Smart Escalation
                </p>
              </div>
            </a>
          </div>

          {/* Center / Action Bar: Role Switcher & Demo Tools */}
          <div className="hidden md:flex items-center gap-3">
            {/* Role Switcher Pill Bar */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 px-2 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" /> View As:
              </span>
              {(['senior', 'family', 'caretaker'] as UserRole[]).map((role) => {
                const isActive = currentUser.role === role;
                return (
                  <button
                    key={role}
                    onClick={() => switchRole(role)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      isActive
                        ? 'bg-white text-elder-700 shadow-xs border border-slate-200/80 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {role === 'senior' && '👴 Senior (Ramesh)'}
                    {role === 'family' && '👨‍👧 Family (Aarav)'}
                    {role === 'caretaker' && '🩺 Caretaker (Priya)'}
                  </button>
                );
              })}
            </div>

            {/* Demo Clock Display */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-elder-600" />
              <span>Demo time: <strong className="text-slate-900">{formattedDemoTime}</strong></span>
            </div>

            {/* Simulate Time Button */}
            <button
              onClick={simulateTimeMissedDose}
              disabled={isSimulatingTime}
              title="Advance demo time by 30 mins to test missed dose & escalation ladder"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow-md transition active:scale-95 disabled:opacity-50"
            >
              <FastForward className={`w-3.5 h-3.5 ${isSimulatingTime ? 'animate-spin' : ''}`} />
              <span>Simulate Time</span>
            </button>

            {/* Reset Seed Button */}
            <button
              onClick={resetToDemoSeed}
              title="Reset 30-day realistic demo dataset"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* Senior Mode Toggle (for seniors or preview) */}
            <button
              onClick={() =>
                updateSeniorProfile({ seniorModeEnabled: !seniorProfile.seniorModeEnabled })
              }
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition border ${
                seniorProfile.seniorModeEnabled
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
              title="Toggle Senior-Friendly High Contrast & Large Text Mode"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {seniorProfile.seniorModeEnabled ? 'Senior Mode ON' : 'Senior Mode'}
              </span>
            </button>

            {/* Voice Assistant Shortcut */}
            {onOpenSeniorVoice && (
              <button
                onClick={onOpenSeniorVoice}
                title="Voice Assistant (Hindi / English)"
                className="p-2 text-elder-700 bg-elder-50 hover:bg-elder-100 rounded-lg transition border border-elder-200"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              title="Notifications Feed"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-4 space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Switch Perspective (Demo Roles)
          </p>
          <div className="grid grid-cols-1 gap-2">
            {(['senior', 'family', 'caretaker'] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => {
                  switchRole(role);
                  setMobileMenuOpen(false);
                }}
                className={`w-full py-2 px-3 rounded-lg text-sm text-left font-semibold flex items-center justify-between ${
                  currentUser.role === role
                    ? 'bg-elder-500 text-white font-bold'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                <span>
                  {role === 'senior' && '👴 Ramesh Sharma (Senior, 72)'}
                  {role === 'family' && '👨‍👧 Aarav Sharma (Son / Family)'}
                  {role === 'caretaker' && '🩺 Priya Singh (Caretaker Nurse)'}
                </span>
                {currentUser.role === role && <Shield className="w-4 h-4" />}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600 font-semibold px-1">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-elder-600" /> Demo Time:</span>
              <strong className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{formattedDemoTime}</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  simulateTimeMissedDose();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 px-3 bg-amber-500 text-white rounded-lg text-xs font-bold text-center"
              >
                ⚡ Simulate Time
              </button>
              <button
                onClick={() => {
                  resetToDemoSeed();
                  setMobileMenuOpen(false);
                }}
                className="py-2 px-3 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold"
              >
                ↺ Reset Seed
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
