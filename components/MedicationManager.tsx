'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Medicine, DoseLog } from '@/types';
import { calculateRefillPrediction } from '@/lib/careIntelligence';
import {
  Pill,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  RotateCw,
  Package,
  Calendar,
  Sparkles,
  ChevronRight,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MedicationManager: React.FC = () => {
  const {
    medicines,
    todayDoseLogs,
    doseLogs,
    markDose,
    addMedicine,
    refillMedicineStock,
    currentUser,
    seniorProfile,
    canViewCategory,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'today' | 'all' | 'history'>('today');
  const [showAddModal, setShowAddModal] = useState(false);
  const [refillModalMed, setRefillModalMed] = useState<Medicine | null>(null);
  const [refillCount, setRefillCount] = useState(30);

  // New med form state
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'Once daily',
    time1: '08:00',
    time2: '20:00',
    instructions: 'Take after meals with water',
    category: 'Hypertension',
    stockCount: 30,
    refillThreshold: 7,
  });

  const handleMarkTaken = (log: DoseLog) => {
    markDose(log.id, 'taken');
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // Ignore if confetti is unavailable
    }
  };

  const handleCreateMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const scheduledTimes =
      formData.frequency === 'Twice daily'
        ? [formData.time1, formData.time2]
        : [formData.time1];

    addMedicine({
      seniorId: seniorProfile.id,
      name: formData.name,
      dosage: formData.dosage || '1 tablet',
      frequency: formData.frequency,
      scheduledTimes,
      instructions: formData.instructions,
      category: formData.category,
      stockCount: Number(formData.stockCount) || 30,
      pillsPerDose: 1,
      dailyDoseCount: scheduledTimes.length,
      refillThreshold: Number(formData.refillThreshold) || 7,
      colorTag: '#0ea5e9',
    });

    setShowAddModal(false);
    setFormData({
      name: '',
      dosage: '',
      frequency: 'Once daily',
      time1: '08:00',
      time2: '20:00',
      instructions: 'Take after meals with water',
      category: 'Hypertension',
      stockCount: 30,
      refillThreshold: 7,
    });
  };

  // Privacy check: If current user role cannot view medicines, show privacy barrier
  if (!canViewCategory('medicines')) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-xs">
        <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Medication Access Restricted</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
          {seniorProfile.name} has customized their privacy consent settings. Medication records are restricted for your role.
        </p>
      </div>
    );
  }

  // Summary stats for today
  const totalToday = todayDoseLogs.length;
  const takenToday = todayDoseLogs.filter((l) => l.status === 'taken').length;
  const missedToday = todayDoseLogs.filter((l) => l.status === 'missed').length;
  const pendingToday = todayDoseLogs.filter((l) => l.status === 'pending').length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header bar */}
      <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Medication Management</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracking doses, adherence compliance, and predictive stock refills for {seniorProfile.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === 'today' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Today ({takenToday}/{totalToday})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Medicines ({medicines.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === 'history' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              History
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-elder-600 hover:bg-elder-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Med</span>
          </button>
        </div>
      </div>

      {/* Quick Progress Banner for Today */}
      {activeTab === 'today' && (
        <div className="bg-slate-50/70 border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">Today&apos;s Adherence:</span>
            <div className="flex items-center gap-2">
              <div className="w-24 sm:w-36 bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalToday > 0 ? (takenToday / totalToday) * 100 : 0}%` }}
                />
              </div>
              <span className="font-bold text-slate-900">
                {totalToday > 0 ? Math.round((takenToday / totalToday) * 100) : 0}%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-500 hidden sm:flex">
            <span className="flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" /> {takenToday} Taken
            </span>
            <span className="flex items-center gap-1 text-rose-700">
              <XCircle className="w-3.5 h-3.5" /> {missedToday} Missed
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <Clock className="w-3.5 h-3.5" /> {pendingToday} Pending
            </span>
          </div>
        </div>
      )}

      {/* Tab 1: Today's Schedule */}
      {activeTab === 'today' && (
        <div className="p-4 sm:p-6 space-y-3">
          {todayDoseLogs.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              No doses scheduled for today. Click &quot;Add Med&quot; to set up a prescription.
            </div>
          ) : (
            todayDoseLogs.map((log) => {
              const med = medicines.find((m) => m.id === log.medicineId);
              const refill = med
                ? calculateRefillPrediction(med)
                : { isLowStock: false, statusText: '', daysRemaining: 30 };

              const isTaken = log.status === 'taken';
              const isMissed = log.status === 'missed';
              const isPending = log.status === 'pending';

              return (
                <div
                  key={log.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isTaken
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : isMissed
                      ? 'bg-rose-50/50 border-rose-200 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isTaken
                            ? 'bg-emerald-100 text-emerald-800'
                            : isMissed
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        <Clock className="w-4 h-4 mr-0.5" />
                        {log.scheduledTime}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-900 text-base">{log.medicineName}</h4>
                          <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-md">
                            {log.dosage}
                          </span>
                          {refill.isLowStock && (
                            <span className="text-[11px] px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-md flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              Refill: {refill.daysRemaining}d left
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 mt-1">
                          {med?.instructions || 'Take with water after food'}
                        </p>

                        {log.notes && (
                          <p className="text-xs text-amber-700 mt-1 font-medium bg-amber-50 px-2 py-0.5 rounded inline-block">
                            Note: {log.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {isTaken ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Taken</span>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleMarkTaken(log)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow transition active:scale-95"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Mark Taken</span>
                          </button>

                          <button
                            onClick={() => markDose(log.id, 'skipped', 'Reported nausea / advised by caretaker')}
                            className="px-2.5 py-2 text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 rounded-lg text-xs font-semibold transition"
                            title="Mark as skipped"
                          >
                            Skip
                          </button>

                          <button
                            onClick={() => markDose(log.id, 'snoozed')}
                            className="px-2.5 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold transition"
                            title="Snooze for 15 minutes"
                          >
                            Snooze
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Full Medicines List with Refill Prediction */}
      {activeTab === 'all' && (
        <div className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medicines.map((med) => {
              const refill = calculateRefillPrediction(med);
              return (
                <div
                  key={med.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition bg-white flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {med.category}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-1">{med.name}</h4>
                        <p className="text-xs text-slate-600 font-medium">
                          {med.dosage} • {med.frequency} ({med.scheduledTimes.join(', ')})
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1 justify-end">
                          <Package className="w-3.5 h-3.5 text-slate-400" />
                          {med.stockCount} pills left
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mt-2 italic bg-slate-50 p-2 rounded">
                      &quot;{med.instructions}&quot;
                    </p>
                  </div>

                  {/* Refill status bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-500">Refill Prediction:</p>
                      <p
                        className={`text-xs font-bold ${
                          refill.isLowStock ? 'text-amber-700' : 'text-emerald-700'
                        }`}
                      >
                        {refill.statusText}
                      </p>
                    </div>

                    <button
                      onClick={() => setRefillModalMed(med)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-elder-50 hover:text-elder-700 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-slate-200"
                    >
                      <RotateCw className="w-3 h-3" />
                      Refill
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Adherence History (Last 10 days) */}
      {activeTab === 'history' && (
        <div className="p-4 sm:p-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Recent Adherence Log (Last 20 Recorded Doses)
          </h4>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {doseLogs.slice(0, 20).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      log.status === 'taken'
                        ? 'bg-emerald-500'
                        : log.status === 'missed'
                        ? 'bg-rose-500'
                        : 'bg-amber-500'
                    }`}
                  />
                  <div>
                    <span className="font-bold text-slate-900">{log.medicineName}</span>
                    <span className="text-slate-500 ml-2">({log.dosage})</span>
                    <p className="text-[11px] text-slate-400">
                      {log.scheduledDate} at {log.scheduledTime}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                      log.status === 'taken'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.status === 'missed'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {log.status}
                  </span>
                  {log.notes && (
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[140px]">
                      {log.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refill Modal */}
      {refillModalMed && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <h3 className="font-bold text-base text-slate-900">
              Refill Stock: {refillModalMed.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Currently {refillModalMed.stockCount} pills remaining in cabinet.
            </p>

            <div className="my-4">
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Number of Tablets / Pills to Add:
              </label>
              <div className="flex items-center gap-2">
                {[15, 30, 60].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRefillCount(num)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${
                      refillCount === num
                        ? 'bg-elder-600 text-white border-elder-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    +{num} Pills
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setRefillModalMed(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  refillMedicineStock(refillModalMed.id, refillCount);
                  setRefillModalMed(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-elder-600 hover:bg-elder-700 text-white rounded-lg shadow transition"
              >
                Confirm Refill (+{refillCount})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">Add New Prescription Medicine</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMedicine} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Medicine Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amlodipine"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-elder-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Dosage</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 mg"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-elder-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-elder-500"
                  >
                    <option value="Hypertension">Hypertension</option>
                    <option value="Diabetes">Diabetes</option>
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Vitamins & Minerals">Vitamins & Minerals</option>
                    <option value="Pain Relief">Pain Relief</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-elder-500"
                >
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Time (Dose 1)</label>
                  <input
                    type="time"
                    value={formData.time1}
                    onChange={(e) => setFormData({ ...formData, time1: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-elder-500"
                  />
                </div>
                {formData.frequency === 'Twice daily' && (
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Time (Dose 2)</label>
                    <input
                      type="time"
                      value={formData.time2}
                      onChange={(e) => setFormData({ ...formData, time2: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-elder-500"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Initial Stock Count</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.stockCount}
                    onChange={(e) => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-elder-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Refill Alert Threshold (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.refillThreshold}
                    onChange={(e) => setFormData({ ...formData, refillThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-elder-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Take after breakfast with warm water"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
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
                  Save Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
