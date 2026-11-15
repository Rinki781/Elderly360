'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CareTask } from '@/types';
import {
  CheckCircle2,
  Clock,
  Plus,
  Footprints,
  Activity,
  Droplets,
  Utensils,
  Dumbbell,
  UserCheck,
  Sparkles,
} from 'lucide-react';

export const TaskManager: React.FC = () => {
  const { todayTasks, updateTaskStatus, addCareTask, seniorProfile, currentUser } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Vitals record modal state
  const [vitalsModalTask, setVitalsModalTask] = useState<CareTask | null>(null);
  const [vitalsData, setVitalsData] = useState({
    bpSystolic: 128,
    bpDiastolic: 84,
    pulse: 72,
    waterGlasses: 8,
  });

  // New task form state
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    category: 'walk' as CareTask['category'],
    scheduledTime: '17:00',
    assignedRole: 'senior' as 'senior' | 'caretaker',
    notes: '',
  });

  const getCategoryIcon = (cat: CareTask['category']) => {
    switch (cat) {
      case 'walk':
        return <Footprints className="w-4 h-4 text-emerald-600" />;
      case 'vitals':
        return <Activity className="w-4 h-4 text-rose-600" />;
      case 'hydration':
        return <Droplets className="w-4 h-4 text-sky-600" />;
      case 'meal':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'exercise':
        return <Dumbbell className="w-4 h-4 text-indigo-600" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskForm.title) return;

    addCareTask({
      seniorId: seniorProfile.id,
      title: newTaskForm.title,
      category: newTaskForm.category,
      scheduledTime: newTaskForm.scheduledTime,
      assignedRole: newTaskForm.assignedRole,
      status: 'pending',
      notes: newTaskForm.notes || undefined,
    });

    setShowAddModal(false);
    setNewTaskForm({
      title: '',
      category: 'walk',
      scheduledTime: '17:00',
      assignedRole: 'senior',
      notes: '',
    });
  };

  const filteredTasks = todayTasks.filter((t) => {
    if (filter === 'pending') return t.status === 'pending';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  const completedCount = todayTasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Daily Care Tasks</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Routine activities (walks, vitals, hydration) assigned to senior or caretaker
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md transition ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              All ({todayTasks.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-md transition ${
                filter === 'pending' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Pending ({todayTasks.length - completedCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 rounded-md transition ${
                filter === 'completed' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Done ({completedCount})
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-elder-600 hover:bg-elder-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Task list */}
      <div className="p-4 sm:p-6 space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No care tasks in this category.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition ${
                  isCompleted
                    ? 'bg-slate-50/60 border-slate-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      {getCategoryIcon(task.category)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          className={`font-bold text-sm ${
                            isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'
                          }`}
                        >
                          {task.title}
                        </h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-slate-500" />
                          Assigned: {task.assignedRole === 'caretaker' ? 'Caretaker (Priya)' : 'Senior (Ramesh)'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> {task.scheduledTime}
                        </span>
                        {task.vitalsData && (
                          <span className="font-semibold text-elder-700 bg-elder-50 px-2 py-0.5 rounded">
                            {task.vitalsData.bpSystolic &&
                              `BP: ${task.vitalsData.bpSystolic}/${task.vitalsData.bpDiastolic} mmHg`}
                            {task.vitalsData.waterGlasses &&
                              `${task.vitalsData.waterGlasses} Glasses Water`}
                          </span>
                        )}
                      </div>

                      {task.notes && (
                        <p className="text-xs text-slate-500 mt-1 italic">
                          Note: {task.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {isCompleted ? (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'pending')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold transition"
                      >
                        Undo
                      </button>
                    ) : (
                      <>
                        {task.category === 'vitals' ? (
                          <button
                            onClick={() => setVitalsModalTask(task)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-elder-600 hover:bg-elder-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                          >
                            <Activity className="w-3.5 h-3.5" />
                            Log Vitals & Complete
                          </button>
                        ) : (
                          <button
                            onClick={() => updateTaskStatus(task.id, 'completed')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Mark Complete
                          </button>
                        )}
                        <button
                          onClick={() => updateTaskStatus(task.id, 'skipped', undefined, 'Senior skipped due to fatigue')}
                          className="px-2.5 py-1.5 text-slate-500 hover:text-rose-600 text-xs font-medium"
                        >
                          Skip
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

      {/* Record Vitals Modal */}
      {vitalsModalTask && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">
              Record Vitals: {vitalsModalTask.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter readings measured for {seniorProfile.name}
            </p>

            <div className="space-y-3 my-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Systolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    value={vitalsData.bpSystolic}
                    onChange={(e) =>
                      setVitalsData({ ...vitalsData, bpSystolic: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Diastolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    value={vitalsData.bpDiastolic}
                    onChange={(e) =>
                      setVitalsData({ ...vitalsData, bpDiastolic: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Resting Pulse (BPM)
                </label>
                <input
                  type="number"
                  value={vitalsData.pulse}
                  onChange={(e) =>
                    setVitalsData({ ...vitalsData, pulse: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setVitalsModalTask(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  updateTaskStatus(vitalsModalTask.id, 'completed', vitalsData, 'Vitals logged by caregiver');
                  setVitalsModalTask(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-elder-600 hover:bg-elder-700 text-white rounded-lg shadow"
              >
                Save & Mark Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">Add New Daily Care Task</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Evening 15-minute garden walk"
                  value={newTaskForm.title}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-elder-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newTaskForm.category}
                    onChange={(e) =>
                      setNewTaskForm({
                        ...newTaskForm,
                        category: e.target.value as CareTask['category'],
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-elder-500"
                  >
                    <option value="walk">Morning/Evening Walk</option>
                    <option value="vitals">Vitals (BP/Sugar)</option>
                    <option value="hydration">Hydration / Water</option>
                    <option value="meal">Meal / Nutrition</option>
                    <option value="exercise">Exercise / Stretch</option>
                    <option value="checkin">General Check-in</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Scheduled Time</label>
                  <input
                    type="time"
                    value={newTaskForm.scheduledTime}
                    onChange={(e) =>
                      setNewTaskForm({ ...newTaskForm, scheduledTime: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-elder-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assigned To</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTaskForm({ ...newTaskForm, assignedRole: 'senior' })}
                    className={`py-2 text-xs font-bold rounded-lg border text-center transition ${
                      newTaskForm.assignedRole === 'senior'
                        ? 'bg-elder-50 border-elder-500 text-elder-800'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    Senior (Ramesh)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTaskForm({ ...newTaskForm, assignedRole: 'caretaker' })}
                    className={`py-2 text-xs font-bold rounded-lg border text-center transition ${
                      newTaskForm.assignedRole === 'caretaker'
                        ? 'bg-elder-50 border-elder-500 text-elder-800'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    Caretaker (Priya)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Notes / Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Ensure cane is used, drink 1 glass of water after"
                  value={newTaskForm.notes}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, notes: e.target.value })}
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
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
