export type UserRole = 'senior' | 'family' | 'caretaker';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  linkedSeniorId?: string;
  relationToSenior?: string; // e.g. "Self", "Son", "Nurse", "Daughter"
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  priority: number;
}

export interface SeniorProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  address: string;
  conditions: string[];
  allergies: string[];
  emergencyContacts: EmergencyContact[];
  inviteCode: string;
  seniorModeEnabled: boolean;
  seniorModeTextSize: 'normal' | 'large' | 'extra-large';
  preferredLanguage: 'en-IN' | 'hi-IN';
  // Privacy Consent matrix: which user/family member can view which categories
  privacyConsent: {
    [userId: string]: {
      medicines: boolean;
      score: boolean;
      location: boolean;
      records: boolean;
      appointments: boolean;
    };
  };
}

export interface Medicine {
  id: string;
  seniorId: string;
  name: string;
  dosage: string;
  frequency: string;
  scheduledTimes: string[]; // e.g. ["08:00", "20:00"]
  instructions: string;
  category: string;
  stockCount: number;
  pillsPerDose: number;
  dailyDoseCount: number;
  refillThreshold: number; // e.g. 5 days or 10 pills
  colorTag: string;
  createdAt: string;
}

export interface DoseLog {
  id: string;
  seniorId: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  status: 'pending' | 'taken' | 'skipped' | 'missed' | 'snoozed';
  takenAt?: string;
  takenByRole?: UserRole;
  notes?: string;
}

export interface CareTask {
  id: string;
  seniorId: string;
  title: string;
  category: 'walk' | 'meal' | 'vitals' | 'hydration' | 'exercise' | 'checkin';
  scheduledTime: string; // HH:mm
  assignedRole: 'senior' | 'caretaker';
  status: 'pending' | 'completed' | 'skipped';
  completedAt?: string;
  completedByRole?: UserRole;
  vitalsData?: {
    bpSystolic?: number;
    bpDiastolic?: number;
    pulse?: number;
    bloodSugar?: number;
    waterGlasses?: number;
  };
  notes?: string;
}

export interface ScoreHistoryPoint {
  date: string; // YYYY-MM-DD
  overall: number; // 0-100
  medicineAdherence: number;
  taskCompletion: number;
  appointmentAttendance: number;
  checkinConsistency: number;
}

export interface CareContinuityScore {
  overall: number;
  medicineAdherence: number;
  taskCompletion: number;
  appointmentAttendance: number;
  checkinConsistency: number;
  trend: 'improving' | 'stable' | 'declining';
  pointChange7d: number; // e.g. -14
  explanation: string;
  dropReasons: string[];
  history: ScoreHistoryPoint[];
}

export interface RoutineDriftAlert {
  id: string;
  seniorId: string;
  activityName: string;
  timeSlot: string; // e.g. "Evening (8:00 PM)"
  category: 'medicine' | 'task';
  baselineCompletion: number; // e.g. 95%
  recentCompletion: number; // e.g. 40%
  dropPercent: number; // e.g. 55%
  severity: 'mild' | 'moderate' | 'critical';
  detectedDate: string;
  explanation: string;
  status: 'active' | 'acknowledged' | 'investigating';
}

export interface EscalationStep {
  step: 1 | 2 | 3 | 4;
  title: string;
  recipient: string;
  recipientRole: UserRole | 'emergency';
  delayMinutes: number;
  sentAt?: string;
  status: 'pending' | 'sent' | 'acknowledged' | 'resolved';
}

export interface EscalationLadderEvent {
  id: string;
  seniorId: string;
  medicineId: string;
  doseLogId?: string;
  medicineName: string;
  dosage: string;
  scheduledTime: string;
  scheduledDate: string;
  currentStep: 1 | 2 | 3 | 4;
  status: 'active' | 'resolved' | 'escalated';
  triggeredAt: string;
  steps: EscalationStep[];
}

export interface Appointment {
  id: string;
  seniorId: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: 'scheduled' | 'completed' | 'cancelled' | 'attended';
  notes?: string;
}

export interface NotificationItem {
  id: string;
  seniorId: string;
  targetRole: UserRole | 'all';
  title: string;
  message: string;
  type: 'medicine' | 'drift' | 'escalation' | 'sos' | 'refill' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface MedicalRecord {
  id: string;
  seniorId: string;
  title: string;
  recordType: 'prescription' | 'lab_report' | 'discharge_summary' | 'doctor_note';
  date: string;
  doctorName?: string;
  hospitalOrLab?: string;
  summary: string;
  tags: string[];
}

export interface DoctorVisitSummary {
  seniorId: string;
  generatedAt: string;
  appointmentId?: string;
  language: 'en' | 'hi';
  dateRange: string;
  continuityScore: number;
  adherenceRate: number;
  missedDosesSummary: string[];
  driftAlertsSummary: string[];
  vitalsSummary: string;
  symptomsReported: string[];
  suggestedDoctorQuestions: string[];
  plainLanguageNotes: string;
}
