'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { LandingHero } from '@/components/LandingHero';
import { Dashboard } from '@/components/Dashboard';
import { InviteModal } from '@/components/InviteModal';
import { NotificationsDrawer } from '@/components/NotificationsDrawer';
import { HeartPulse, Award, Shield, ArrowUp } from 'lucide-react';

export default function HomePage() {
  const { seniorProfile } = useApp();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showLandingBanner, setShowLandingBanner] = useState(true);

  return (
    <div className={`min-h-screen flex flex-col ${seniorProfile.seniorModeEnabled ? 'text-lg bg-amber-50/20' : ''}`}>
      {/* Top Navbar */}
      <Navbar
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Hero / Pitch & Demo Launch Section */}
      {showLandingBanner && (
        <section id="landing">
          <LandingHero
            onEnterDashboard={() => {
              const el = document.getElementById('dashboard');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenInviteModal={() => setIsInviteModalOpen(true)}
          />
        </section>
      )}

      {/* Main App Container */}
      <main id="dashboard" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Dashboard
          onOpenInviteModal={() => setIsInviteModalOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-elder-600 text-white flex items-center justify-center font-bold">
              <HeartPulse className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-slate-800">ELDERLY360</span>
            <span>— Proactive Elderly Care Continuity</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="hover:text-elder-700 transition"
            >
              Invite Family
            </button>
            <span>•</span>
            <button
              onClick={() => {
                const el = document.getElementById('landing');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-elder-700 transition"
            >
              Back to Overview
            </button>
            <span>•</span>
            <span>7-Hour Hackathon Edition</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
}
