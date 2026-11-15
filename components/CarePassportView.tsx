'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MedicalRecord } from '@/types';
import {
  FileText,
  Printer,
  QrCode,
  AlertTriangle,
  Heart,
  Pill,
  Shield,
  Phone,
  Plus,
  Upload,
  Calendar,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const CarePassportView: React.FC = () => {
  const {
    seniorProfile,
    medicines,
    medicalRecords,
    addMedicalRecord,
    canViewCategory,
    showToast,
  } = useApp();

  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [recordForm, setRecordForm] = useState({
    title: '',
    recordType: 'prescription' as MedicalRecord['recordType'],
    doctorName: 'Dr. K. Mehta',
    hospitalOrLab: 'Apollo Clinic',
    summary: '',
    tags: 'Cardiology, BP',
  });

  const handlePrintPassport = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordForm.title) return;

    addMedicalRecord({
      seniorId: seniorProfile.id,
      title: recordForm.title,
      recordType: recordForm.recordType,
      date: new Date().toISOString().split('T')[0],
      doctorName: recordForm.doctorName,
      hospitalOrLab: recordForm.hospitalOrLab,
      summary: recordForm.summary,
      tags: recordForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setShowAddRecordModal(false);
    setRecordForm({
      title: '',
      recordType: 'prescription',
      doctorName: '',
      hospitalOrLab: '',
      summary: '',
      tags: '',
    });
  };

  // Privacy Check
  if (!canViewCategory('records')) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-xs">
        <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-3">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Digital Care Passport Restricted</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
          {seniorProfile.name} has customized their privacy consent settings. Medical records and Care Passport details are restricted for your role.
        </p>
      </div>
    );
  }

  // Emergency QR Code Data URL (using high quality public QR api for offline/demo robustness)
  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    `ELDERLY360-EMERGENCY-ID:${seniorProfile.id}|Name:${seniorProfile.name}|Age:${seniorProfile.age}|Blood:${seniorProfile.bloodGroup}|EmergContact:+919811154321`
  )}`;

  return (
    <div className="space-y-6">
      {/* Action bar for Passport */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-elder-600" />
            <span>Digital Care Passport</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              Emergency Ready
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Portable health record, allergies, verified prescriptions, and paramedic emergency QR
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddRecordModal(true)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Medical Record</span>
          </button>

          <button
            onClick={handlePrintPassport}
            className="px-3.5 py-1.5 bg-elder-600 hover:bg-elder-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Passport Card (PDF / Print optimized) */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-md overflow-hidden print:border-none print:shadow-none">
        {/* Top Identity Banner */}
        <div className="bg-gradient-to-r from-navy-900 via-slate-900 to-elder-950 text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white text-slate-900 flex items-center justify-center font-black text-2xl border-2 border-elder-400 shrink-0 shadow-lg">
              👴
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-widest bg-elder-500 text-slate-950 px-2 py-0.5 rounded">
                  OFFICIAL CARE PASSPORT
                </span>
                <span className="text-xs text-elder-300 font-mono">
                  ID: {seniorProfile.id}
                </span>
              </div>
              <h3 className="text-2xl font-black text-white mt-1">
                {seniorProfile.name}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Age: <strong>{seniorProfile.age} Years</strong> • Gender: <strong>{seniorProfile.gender}</strong> • Blood Group: <strong className="text-rose-400 text-sm">{seniorProfile.bloodGroup}</strong>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Address: {seniorProfile.address}
              </p>
            </div>
          </div>

          {/* Emergency QR Badge */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 text-slate-900 text-center shrink-0 self-start sm:self-auto shadow-sm">
            {/* QR code image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt="Emergency Care Passport QR Code"
              className="w-24 h-24 mx-auto rounded"
            />
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-600 block mt-1">
              Paramedic Scan
            </span>
          </div>
        </div>

        {/* Passport Grid Body */}
        <div className="p-6 space-y-6 divide-y divide-slate-100">
          {/* Section 1: Conditions & Allergies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Primary Chronic Conditions</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {seniorProfile.conditions.map((cond, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs font-bold"
                  >
                    {cond}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Known Allergies & Contraindications</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {seniorProfile.allergies.map((allergy, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    ⚠️ {allergy}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Active Prescriptions & Regimen */}
          <div className="pt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-3">
              <Pill className="w-3.5 h-3.5 text-teal-600" />
              <span>Current Verified Medications</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {medicines.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs space-y-1"
                >
                  <div className="flex justify-between items-start">
                    <strong className="text-slate-900">{m.name}</strong>
                    <span className="text-[10px] font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {m.dosage}
                    </span>
                  </div>
                  <p className="text-slate-500">
                    {m.frequency} ({m.scheduledTimes.join(', ')})
                  </p>
                  <p className="text-[11px] text-slate-600 italic">
                    &quot;{m.instructions}&quot;
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Emergency Contacts Hierarchy */}
          <div className="pt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-3">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>Emergency Contacts Protocol</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {seniorProfile.emergencyContacts.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl border border-slate-200 bg-white flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-elder-700 bg-elder-100 px-1.5 py-0.5 rounded">
                      Priority {c.priority}
                    </span>
                    <h5 className="font-bold text-slate-900 text-sm mt-1">{c.name}</h5>
                    <p className="text-slate-500">{c.relation}</p>
                  </div>
                  <a
                    href={`tel:${c.phone}`}
                    className="mt-2 text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{c.phone}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Clinical History & Uploaded Lab Reports */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Recent Clinical Records & Diagnostic Reports</span>
              </h4>
              <span className="text-[11px] text-slate-400">
                {medicalRecords.length} records on file
              </span>
            </div>

            <div className="space-y-2.5">
              {medicalRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                        {rec.recordType}
                      </span>
                      <strong className="text-slate-900 text-sm">{rec.title}</strong>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{rec.date}</span>
                    </div>

                    <p className="text-slate-600 mt-1 leading-relaxed">
                      {rec.summary}
                    </p>

                    <div className="flex items-center gap-2 mt-2 flex-wrap text-[11px]">
                      <span className="text-slate-400">Issued by: <strong>{rec.doctorName}</strong> ({rec.hospitalOrLab})</span>
                      {rec.tags.map((t, idx) => (
                        <span key={idx} className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Record Modal */}
      {showAddRecordModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">Add Medical Record or Lab Report</h3>
              <button
                onClick={() => setShowAddRecordModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Record Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lipid Profile & Liver Function Test"
                  value={recordForm.title}
                  onChange={(e) => setRecordForm({ ...recordForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-elder-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Record Type</label>
                  <select
                    value={recordForm.recordType}
                    onChange={(e) =>
                      setRecordForm({
                        ...recordForm,
                        recordType: e.target.value as MedicalRecord['recordType'],
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-elder-500"
                  >
                    <option value="prescription">Prescription</option>
                    <option value="lab_report">Lab Report</option>
                    <option value="discharge_summary">Discharge Summary</option>
                    <option value="doctor_note">Doctor Clinical Note</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Doctor / Lab Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Ananya Roy"
                    value={recordForm.doctorName}
                    onChange={(e) => setRecordForm({ ...recordForm, doctorName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-elder-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Clinical Summary / Key Findings *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. HbA1c 7.4%, Fasting Blood Sugar 132 mg/dL. Normal renal function."
                  value={recordForm.summary}
                  onChange={(e) => setRecordForm({ ...recordForm, summary: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-elder-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Diabetes, Blood Sugar, Quarterly"
                  value={recordForm.tags}
                  onChange={(e) => setRecordForm({ ...recordForm, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-elder-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddRecordModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-elder-600 hover:bg-elder-700 text-white rounded-lg shadow"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
