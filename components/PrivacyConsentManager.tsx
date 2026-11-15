'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { DEMO_USERS, DEMO_FAMILY_ID, DEMO_CARETAKER_ID } from '@/lib/seedData';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Pill,
  Activity,
  MapPin,
  FileText,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

export const PrivacyConsentManager: React.FC = () => {
  const { seniorProfile, togglePrivacyConsent, currentUser } = useApp();

  const isSenior = currentUser.role === 'senior';

  const familyMembers = DEMO_USERS.filter((u) => u.role !== 'senior');

  const categories: {
    key: 'medicines' | 'score' | 'location' | 'records' | 'appointments';
    label: string;
    icon: React.ReactNode;
    desc: string;
  }[] = [
    {
      key: 'medicines',
      label: 'Medications & Doses',
      icon: <Pill className="w-4 h-4 text-teal-600" />,
      desc: 'Prescription details, scheduled times, and taken/missed logs',
    },
    {
      key: 'score',
      label: 'Care Continuity Score',
      icon: <Activity className="w-4 h-4 text-elder-600" />,
      desc: 'Composite 0-100 score, 30-day trends, and routine drift details',
    },
    {
      key: 'location',
      label: 'Live Location & GPS',
      icon: <MapPin className="w-4 h-4 text-rose-600" />,
      desc: 'Real-time location sharing during daily walks or emergencies',
    },
    {
      key: 'records',
      label: 'Digital Medical Records',
      icon: <FileText className="w-4 h-4 text-indigo-600" />,
      desc: 'Past lab reports, doctor notes, and care passport history',
    },
    {
      key: 'appointments',
      label: 'Doctor Appointments',
      icon: <Calendar className="w-4 h-4 text-amber-600" />,
      desc: 'Upcoming clinic bookings, doctor consultation notes',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Senior Data Privacy & Consent Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Empowering {seniorProfile.name} with granular control over who can view which parts of their medical life
          </p>
        </div>

        {!isSenior && (
          <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 self-start sm:self-center">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Read-Only: Controlled exclusively by Senior</span>
          </span>
        )}
      </div>

      {/* Senior Consent Explainer */}
      <div className="p-4 sm:p-6 space-y-6">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-600 mt-0.5 shadow-2xs">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">
              Strict Data Layer Enforcement
            </h4>
            <p className="mt-1 leading-relaxed text-slate-600">
              Privacy permissions are not merely visual toggles. When {seniorProfile.name} disables a category (e.g. location or medication) for a specific family member or caretaker, the underlying data layer refuses to deliver that dataset to their session.
            </p>
          </div>
        </div>

        {/* Matrix per Member */}
        <div className="space-y-6">
          {familyMembers.map((member) => {
            const memberConsents = seniorProfile.privacyConsent[member.id] || {
              medicines: true,
              score: true,
              location: true,
              records: true,
              appointments: true,
            };

            return (
              <div
                key={member.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold">
                      {member.role === 'family' ? '👨‍👧' : '🩺'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{member.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {member.relationToSenior} • {member.role.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    User ID: {member.id}
                  </span>
                </div>

                {/* Consent categories grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categories.map((cat) => {
                    const isGranted = memberConsents[cat.key] !== false;

                    return (
                      <div
                        key={cat.key}
                        className={`p-3 rounded-xl border transition flex items-start justify-between gap-3 ${
                          isGranted
                            ? 'bg-slate-50/60 border-slate-200'
                            : 'bg-rose-50/40 border-rose-200'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {cat.icon}
                            <span className="font-bold text-xs text-slate-900">
                              {cat.label}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight">
                            {cat.desc}
                          </p>
                        </div>

                        {/* Toggle switch */}
                        <button
                          type="button"
                          disabled={!isSenior}
                          onClick={() => togglePrivacyConsent(member.id, cat.key)}
                          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 shrink-0 ${
                            isGranted ? 'bg-emerald-600' : 'bg-slate-300'
                          } ${!isSenior ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                          title={
                            isSenior
                              ? `Toggle ${cat.label} access for ${member.name}`
                              : 'Only senior can change consent'
                          }
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                              isGranted ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
