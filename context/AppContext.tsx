'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  SeniorProfile,
  Medicine,
  DoseLog,
  CareTask,
  Appointment,
  NotificationItem,
  EscalationLadderEvent,
  MedicalRecord,
  CareContinuityScore,
  RoutineDriftAlert,
} from '@/types';
import {
  DEMO_USERS,
  DEMO_SENIOR_PROFILE,
  DEMO_MEDICINES,
  DEMO_APPOINTMENTS,
  DEMO_NOTIFICATIONS,
  DEMO_ESCALATION_EVENT,
  DEMO_MEDICAL_RECORDS,
  generate30DaysDoseLogs,
  generate30DaysCareTasks,
  formatDate,
  DEMO_SENIOR_ID,
  DEMO_FAMILY_ID,
  DEMO_CARETAKER_ID,
} from '@/lib/seedData';
import { computeCareContinuityScore, detectRoutineDrift } from '@/lib/careIntelligence';

interface AppContextType {
  currentUser: User;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  seniorProfile: SeniorProfile;
  updateSeniorProfile: (updates: Partial<SeniorProfile>) => void;
  togglePrivacyConsent: (userId: string, category: keyof SeniorProfile['privacyConsent'][string]) => void;
  canViewCategory: (category: 'medicines' | 'score' | 'location' | 'records' | 'appointments') => boolean;
  medicines: Medicine[];
  addMedicine: (med: Omit<Medicine, 'id' | 'createdAt'>) => void;
  updateMedicine: (id: string, updates: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  refillMedicineStock: (id: string, addedPills: number) => void;
  doseLogs: DoseLog[];
  todayDoseLogs: DoseLog[];
  markDose: (logId: string, status: 'taken' | 'skipped' | 'snoozed', notes?: string) => void;
  careTasks: CareTask[];
  todayTasks: CareTask[];
  updateTaskStatus: (
    taskId: string,
    status: 'pending' | 'completed' | 'skipped',
    vitals?: CareTask['vitalsData'],
    notes?: string
  ) => void;
  addCareTask: (task: Omit<CareTask, 'id'>) => void;
  appointments: Appointment[];
  addAppointment: (appt: Omit<Appointment, 'id'>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  continuityScore: CareContinuityScore;
  driftAlerts: RoutineDriftAlert[];
  escalationEvent: EscalationLadderEvent | null;
  advanceEscalationLadder: () => void;
  resolveEscalation: (id: string) => void;
  simulateTimeMissedDose: () => void;
  linkWithInviteCode: (code: string, relationName: string) => { success: boolean; message: string };
  medicalRecords: MedicalRecord[];
  addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => void;
  resetToDemoSeed: () => void;
  demoTime: { hours: number; minutes: number };
  formattedDemoTime: string;
  isSimulatingTime: boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'elderly360_store_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS[0]); // Default to Senior Ramesh
  const [seniorProfile, setSeniorProfile] = useState<SeniorProfile>(DEMO_SENIOR_PROFILE);
  const [medicines, setMedicines] = useState<Medicine[]>(DEMO_MEDICINES);
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>([]);
  const [careTasks, setCareTasks] = useState<CareTask[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>(DEMO_APPOINTMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEMO_NOTIFICATIONS);
  const [escalationEvent, setEscalationEvent] = useState<EscalationLadderEvent | null>(DEMO_ESCALATION_EVENT);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(DEMO_MEDICAL_RECORDS);
  const [demoTime, setDemoTime] = useState<{ hours: number; minutes: number }>({ hours: 21, minutes: 30 });
  const [isSimulatingTime, setIsSimulatingTime] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const formattedDemoTime = `${demoTime.hours % 12 === 0 ? 12 : demoTime.hours % 12}:${String(
    demoTime.minutes
  ).padStart(2, '0')} ${demoTime.hours >= 12 ? 'PM' : 'AM'}`;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Initialize seed data or load from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.medicines && parsed.doseLogs && parsed.careTasks) {
            setMedicines(parsed.medicines);
            setDoseLogs(parsed.doseLogs);
            setCareTasks(parsed.careTasks);
            if (parsed.seniorProfile) setSeniorProfile(parsed.seniorProfile);
            if (parsed.appointments) setAppointments(parsed.appointments);
            if (parsed.notifications) setNotifications(parsed.notifications);
            if (parsed.escalationEvent) setEscalationEvent(parsed.escalationEvent);
            if (parsed.medicalRecords) setMedicalRecords(parsed.medicalRecords);
            setIsLoaded(true);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to load stored state:', err);
      }
      // Fallback to fresh seed
      resetToDemoSeed();
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;
    try {
      const dataToSave = {
        medicines,
        doseLogs,
        careTasks,
        seniorProfile,
        appointments,
        notifications,
        escalationEvent,
        medicalRecords,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (err) {
      console.error('Failed to persist state:', err);
    }
  }, [
    isLoaded,
    medicines,
    doseLogs,
    careTasks,
    seniorProfile,
    appointments,
    notifications,
    escalationEvent,
    medicalRecords,
  ]);

  const resetToDemoSeed = () => {
    setDemoTime({ hours: 21, minutes: 30 });
    const initialLogs = generate30DaysDoseLogs(new Date(), 21, 30);
    const initialTasks = generate30DaysCareTasks();
    setMedicines(DEMO_MEDICINES);
    setDoseLogs(initialLogs);
    setCareTasks(initialTasks);
    setSeniorProfile(DEMO_SENIOR_PROFILE);
    setAppointments(DEMO_APPOINTMENTS);
    setNotifications(DEMO_NOTIFICATIONS);
    setEscalationEvent(DEMO_ESCALATION_EVENT);
    setMedicalRecords(DEMO_MEDICAL_RECORDS);
    showToast('Demo data re-seeded with 30-day realistic pattern!');
  };

  // Switch Role
  const switchRole = (role: UserRole) => {
    const foundUser = DEMO_USERS.find((u) => u.role === role) || {
      id: `user-${role}`,
      name: role === 'senior' ? 'Ramesh Sharma' : role === 'family' ? 'Aarav Sharma' : 'Priya Singh',
      email: `${role}@elderly360.internal`,
      role,
      linkedSeniorId: DEMO_SENIOR_ID,
    };
    setCurrentUser(foundUser);
    showToast(`Switched perspective to: ${foundUser.name} (${role.toUpperCase()})`);
  };

  // Privacy Consent Enforcement
  const canViewCategory = (category: 'medicines' | 'score' | 'location' | 'records' | 'appointments'): boolean => {
    if (currentUser.role === 'senior') return true;
    const consents = seniorProfile.privacyConsent[currentUser.id];
    if (!consents) {
      // Default to true if not explicitly restricted
      return true;
    }
    return consents[category] !== false;
  };

  const togglePrivacyConsent = (userId: string, category: keyof SeniorProfile['privacyConsent'][string]) => {
    setSeniorProfile((prev) => {
      const currentMatrix = prev.privacyConsent[userId] || {
        medicines: true,
        score: true,
        location: true,
        records: true,
        appointments: true,
      };
      const updatedMatrix = {
        ...currentMatrix,
        [category]: !currentMatrix[category],
      };
      return {
        ...prev,
        privacyConsent: {
          ...prev.privacyConsent,
          [userId]: updatedMatrix,
        },
      };
    });
    showToast(`Updated privacy consent for ${category}`);
  };

  const updateSeniorProfile = (updates: Partial<SeniorProfile>) => {
    setSeniorProfile((prev) => ({ ...prev, ...updates }));
  };

  // Medicines Management
  const addMedicine = (med: Omit<Medicine, 'id' | 'createdAt'>) => {
    const newMed: Medicine = {
      ...med,
      id: `med-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setMedicines((prev) => [newMed, ...prev]);

    // Add today's pending logs for this medicine
    const todayStr = formatDate(new Date());
    const newLogs: DoseLog[] = med.scheduledTimes.map((time, idx) => ({
      id: `log-new-${newMed.id}-${todayStr}-${idx}`,
      seniorId: seniorProfile.id,
      medicineId: newMed.id,
      medicineName: newMed.name,
      dosage: newMed.dosage,
      scheduledDate: todayStr,
      scheduledTime: time,
      status: 'pending',
    }));
    setDoseLogs((prev) => [...newLogs, ...prev]);
    showToast(`Added medicine: ${newMed.name}`);
  };

  const updateMedicine = (id: string, updates: Partial<Medicine>) => {
    setMedicines((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    showToast('Medicine updated successfully');
  };

  const deleteMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
    showToast('Medicine removed');
  };

  const refillMedicineStock = (id: string, addedPills: number) => {
    setMedicines((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const newStock = m.stockCount + addedPills;
          return { ...m, stockCount: newStock };
        }
        return m;
      })
    );
    showToast(`Refilled ${addedPills} tablets!`);
  };

  // Mark Dose Taken / Skipped / Snoozed
  const markDose = (logId: string, status: 'taken' | 'skipped' | 'snoozed', notes?: string) => {
    setDoseLogs((prev) =>
      prev.map((log) => {
        if (log.id === logId) {
          const isTaken = status === 'taken';
          // If taken, decrement medicine stock count
          if (isTaken && log.status !== 'taken') {
            setMedicines((meds) =>
              meds.map((m) =>
                m.id === log.medicineId ? { ...m, stockCount: Math.max(0, m.stockCount - (m.pillsPerDose || 1)) } : m
              )
            );
          }
          return {
            ...log,
            status,
            takenAt: isTaken ? new Date().toISOString() : undefined,
            takenByRole: currentUser.role,
            notes: notes || log.notes,
          };
        }
        return log;
      })
    );

    // If an active escalation event matched this dose, resolve it
    if (escalationEvent && (escalationEvent.doseLogId === logId || status === 'taken')) {
      setEscalationEvent((prev) => (prev ? { ...prev, status: 'resolved' } : null));
    }

    if (status === 'taken') {
      showToast('Medicine marked as taken. Good job!');
    } else if (status === 'skipped') {
      showToast('Dose recorded as skipped. Reason logged.');
    } else {
      showToast('Reminder snoozed for 15 minutes.');
    }
  };

  // Today's Dose Logs filter (chronologically sorted by scheduled dose time)
  const todayStr = formatDate(new Date());
  const todayDoseLogs = doseLogs
    .filter((l) => l.scheduledDate === todayStr)
    .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

  // Today's Tasks
  const todayTasks = careTasks.filter((t) => t.id.includes(todayStr));

  // Care Tasks Management
  const updateTaskStatus = (
    taskId: string,
    status: 'pending' | 'completed' | 'skipped',
    vitals?: CareTask['vitalsData'],
    notes?: string
  ) => {
    setCareTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status,
            completedAt: status === 'completed' ? new Date().toISOString() : undefined,
            completedByRole: currentUser.role,
            vitalsData: vitals || t.vitalsData,
            notes: notes || t.notes,
          };
        }
        return t;
      })
    );
    showToast(status === 'completed' ? 'Task marked complete!' : `Task updated to ${status}`);
  };

  const addCareTask = (task: Omit<CareTask, 'id'>) => {
    const newTask: CareTask = {
      ...task,
      id: `task-${Date.now()}-${todayStr}`,
    };
    setCareTasks((prev) => [newTask, ...prev]);
    showToast(`Added care task: ${newTask.title}`);
  };

  // Appointments Management
  const addAppointment = (appt: Omit<Appointment, 'id'>) => {
    const newAppt: Appointment = {
      ...appt,
      id: `appt-${Date.now()}`,
    };
    setAppointments((prev) => [newAppt, ...prev]);
    showToast(`Booked appointment with ${newAppt.doctorName}`);
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    showToast(`Appointment status updated to ${status}`);
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications cleared');
  };

  // Medical Records
  const addMedicalRecord = (record: Omit<MedicalRecord, 'id'>) => {
    const newRecord: MedicalRecord = {
      ...record,
      id: `rec-${Date.now()}`,
    };
    setMedicalRecords((prev) => [newRecord, ...prev]);
    showToast(`Added ${record.title} to Care Passport`);
  };

  // Invite Code Link
  const linkWithInviteCode = (code: string, relationName: string): { success: boolean; message: string } => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === seniorProfile.inviteCode.toUpperCase()) {
      setCurrentUser((prev) => ({
        ...prev,
        linkedSeniorId: seniorProfile.id,
        relationToSenior: relationName || (prev.role === 'family' ? 'Family Member' : 'Assigned Caregiver'),
      }));
      showToast(`Successfully linked to senior: ${seniorProfile.name}`);
      return { success: true, message: `Connected to ${seniorProfile.name} (${relationName})` };
    }
    return { success: false, message: 'Invalid invite code. Try RAMESH-360 for demo senior.' };
  };

  // Care Continuity Score and Routine Drift
  const continuityScore = computeCareContinuityScore(doseLogs, careTasks, appointments);
  const driftAlerts = detectRoutineDrift(doseLogs, careTasks, seniorProfile.id);

  // Escalation Ladder Actions
  const advanceEscalationLadder = () => {
    if (!escalationEvent) {
      // Create new event for demo
      const newEvent: EscalationLadderEvent = {
        id: `esc-${Date.now()}`,
        seniorId: seniorProfile.id,
        medicineId: 'med-3',
        medicineName: 'Atorvastatin 10mg',
        dosage: '10 mg',
        scheduledTime: '21:00',
        scheduledDate: todayStr,
        currentStep: 1,
        status: 'active',
        triggeredAt: new Date().toISOString(),
        steps: [
          {
            step: 1,
            title: 'Senior Voice & App Notification',
            recipient: `${seniorProfile.name} (Senior)`,
            recipientRole: 'senior',
            delayMinutes: 0,
            sentAt: new Date().toISOString(),
            status: 'sent',
          },
          {
            step: 2,
            title: 'Caretaker Alert & Dose Verification',
            recipient: 'Priya Singh (Primary Caretaker)',
            recipientRole: 'caretaker',
            delayMinutes: 15,
            status: 'pending',
          },
          {
            step: 3,
            title: 'Family Urgent Notice (SMS + App)',
            recipient: 'Aarav Sharma (Son)',
            recipientRole: 'family',
            delayMinutes: 30,
            status: 'pending',
          },
          {
            step: 4,
            title: 'Emergency Contact & SOS Protocol',
            recipient: 'Emergency Contacts',
            recipientRole: 'emergency',
            delayMinutes: 60,
            status: 'pending',
          },
        ],
      };
      setEscalationEvent(newEvent);
      showToast('Escalation Ladder triggered: Step 1 Senior Notification');
      return;
    }

    // Advance to next step
    if (escalationEvent.currentStep < 4) {
      const nextStep = (escalationEvent.currentStep + 1) as 1 | 2 | 3 | 4;
      const updatedSteps = escalationEvent.steps.map((s) => {
        if (s.step === nextStep) {
          return { ...s, sentAt: new Date().toISOString(), status: 'sent' as const };
        }
        if (s.step < nextStep) {
          return { ...s, status: 'acknowledged' as const };
        }
        return s;
      });

      setEscalationEvent({
        ...escalationEvent,
        currentStep: nextStep,
        status: nextStep === 4 ? 'escalated' : 'active',
        steps: updatedSteps,
      });

      // Add a notification to the feed
      const stepInfo = updatedSteps.find((s) => s.step === nextStep);
      if (stepInfo) {
        setNotifications((prev) => [
          {
            id: `notif-esc-${Date.now()}`,
            seniorId: seniorProfile.id,
            targetRole: stepInfo.recipientRole === 'emergency' ? 'all' : (stepInfo.recipientRole as UserRole),
            title: `Escalation Ladder: Step ${nextStep} Triggered`,
            message: `Unresolved missed dose for ${escalationEvent.medicineName}. Alert dispatched to ${stepInfo.recipient}.`,
            type: 'escalation',
            timestamp: new Date().toISOString(),
            read: false,
          },
          ...prev,
        ]);
      }

      showToast(`Escalated to Step ${nextStep}: Alerted ${stepInfo?.recipient || 'Protocol'}`);
    } else {
      showToast('Escalation is already at Maximum Level (SOS Protocol)!');
    }
  };

  const resolveEscalation = (id: string) => {
    setEscalationEvent((prev) => (prev && prev.id === id ? { ...prev, status: 'resolved' } : prev));
    showToast('Escalation resolved: dose verified & logged.');
  };

  // "Simulate Time" button advances demo clock, updates doses and triggers escalation
  const simulateTimeMissedDose = () => {
    setIsSimulatingTime(true);

    // Advance clock by 30 minutes
    let newMinutes = demoTime.minutes + 30;
    let newHours = demoTime.hours;
    if (newMinutes >= 60) {
      newHours = (newHours + 1) % 24;
      newMinutes %= 60;
    }
    const updatedDemoTime = { hours: newHours, minutes: newMinutes };
    setDemoTime(updatedDemoTime);

    const timeStr = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
    const formatted = `${newHours % 12 === 0 ? 12 : newHours % 12}:${String(newMinutes).padStart(2, '0')} ${
      newHours >= 12 ? 'PM' : 'AM'
    }`;

    // Mark any pending doses scheduled up to the new demo time as missed
    setDoseLogs((prev) =>
      prev.map((log) => {
        if (log.scheduledDate === todayStr && log.status === 'pending' && log.scheduledTime <= timeStr) {
          return {
            ...log,
            status: 'missed',
            notes: 'Overdue: missed as demo time advanced past dose window',
          };
        }
        return log;
      })
    );

    advanceEscalationLadder();

    showToast(`Advanced demo clock to ${formatted}. Escalation ladder updated!`);

    setTimeout(() => {
      setIsSimulatingTime(false);
    }, 600);
  };

  return (
    <AppContext.Provider
      value={{
        demoTime,
        formattedDemoTime,
        currentUser,
        currentRole: currentUser.role,
        switchRole,
        seniorProfile,
        updateSeniorProfile,
        togglePrivacyConsent,
        canViewCategory,
        medicines,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        refillMedicineStock,
        doseLogs,
        todayDoseLogs,
        markDose,
        careTasks,
        todayTasks,
        updateTaskStatus,
        addCareTask,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        continuityScore,
        driftAlerts,
        escalationEvent,
        advanceEscalationLadder,
        resolveEscalation,
        simulateTimeMissedDose,
        linkWithInviteCode,
        medicalRecords,
        addMedicalRecord,
        resetToDemoSeed,
        isSimulatingTime,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
