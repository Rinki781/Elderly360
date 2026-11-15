'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Appointment } from '@/types';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  Hospital,
  Sparkles,
} from 'lucide-react';

interface AppointmentManagerProps {
  onOpenDoctorVisitSummary?: (appt: Appointment) => void;
  prefilledFacility?: { name: string; specialty: string; address: string } | null;
}

export const AppointmentManager: React.FC<AppointmentManagerProps> = ({
  onOpenDoctorVisitSummary,
  prefilledFacility,
}) => {
  const {
    appointments,
    addAppointment,
    updateAppointmentStatus,
    seniorProfile,
    showToast,
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const [formData, setFormData] = useState({
    doctorName: prefilledFacility?.name || 'Dr. Ananya Roy, DM',
    specialty: prefilledFacility?.specialty || 'Endocrinologist',
    hospital: prefilledFacility?.name || 'Max Super Speciality Hospital',
    date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    time: '16:30',
    notes: 'Quarterly review for diabetes and blood pressure checkup.',
  });

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctorName || !formData.date) return;

    addAppointment({
      seniorId: seniorProfile.id,
      doctorName: formData.doctorName,
      specialty: formData.specialty,
      hospital: formData.hospital,
      date: formData.date,
      time: formData.time,
      status: 'scheduled',
      notes: formData.notes,
    });

    setShowAddModal(false);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const upcomingAppts = appointments.filter((a) => a.date >= todayStr && a.status !== 'cancelled');
  const pastAppts = appointments.filter((a) => a.date < todayStr || a.status === 'attended' || a.status === 'completed');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Doctor Appointments & Clinical Consultations
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Scheduled specialist visits feed the 15% appointment attendance score in the Care Continuity index
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === 'upcoming' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Upcoming ({upcomingAppts.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === 'past' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Past / Attended ({pastAppts.length})
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-elder-600 hover:bg-elder-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book Visit</span>
          </button>
        </div>
      </div>

      {/* Appointment list */}
      <div className="p-4 sm:p-6 space-y-3">
        {(activeTab === 'upcoming' ? upcomingAppts : pastAppts).length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No appointments found in this category. Click &quot;Book Visit&quot; to schedule a consultation.
          </div>
        ) : (
          (activeTab === 'upcoming' ? upcomingAppts : pastAppts).map((appt) => {
            const isAttended = appt.status === 'attended' || appt.status === 'completed';
            const isUpcoming = appt.status === 'scheduled';

            return (
              <div
                key={appt.id}
                className={`p-4 rounded-xl border transition-all ${
                  isAttended
                    ? 'bg-emerald-50/30 border-emerald-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex flex-col items-center justify-center shrink-0 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        {new Date(appt.date).toLocaleDateString([], { month: 'short' })}
                      </span>
                      <span className="text-base font-black text-slate-900">
                        {new Date(appt.date).getDate()}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-900 text-sm">{appt.doctorName}</h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {appt.specialty}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            isAttended
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-teal-100 text-teal-800'
                          }`}
                        >
                          {appt.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5 font-medium">
                        <Hospital className="w-3.5 h-3.5 text-slate-400" />
                        <span>{appt.hospital}</span>
                        <span className="text-slate-400">•</span>
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{appt.time}</span>
                      </p>

                      {appt.notes && (
                        <p className="text-xs text-slate-500 mt-1 italic">
                          &quot;{appt.notes}&quot;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {onOpenDoctorVisitSummary && (
                      <button
                        onClick={() => onOpenDoctorVisitSummary(appt)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-elder-600 to-teal-600 hover:from-elder-700 hover:to-teal-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-elder-200" />
                        <span>AI Pre-Visit Summary</span>
                      </button>
                    )}

                    {isUpcoming && (
                      <button
                        onClick={() => updateAppointmentStatus(appt.id, 'attended')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Attended</span>
                      </button>
                    )}

                    {isUpcoming && (
                      <button
                        onClick={() => updateAppointmentStatus(appt.id, 'cancelled')}
                        className="px-2.5 py-1.5 text-slate-500 hover:text-rose-600 text-xs font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">Book Doctor Consultation</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Doctor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Khanna, MS"
                  value={formData.doctorName}
                  onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-elder-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Specialty</label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-elder-500"
                  >
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Endocrinologist">Endocrinologist</option>
                    <option value="Orthopedic">Orthopedic</option>
                    <option value="General Physician">General Physician</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Hospital / Clinic</label>
                  <input
                    type="text"
                    placeholder="e.g. Apollo Clinic"
                    value={formData.hospital}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-elder-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-elder-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-elder-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reason / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Checkup for knee pain, review prescription"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-elder-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-elder-600 hover:bg-elder-700 text-white rounded-lg shadow"
                >
                  Schedule Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
