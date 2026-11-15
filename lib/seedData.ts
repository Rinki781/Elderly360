import {
  User,
  SeniorProfile,
  Medicine,
  DoseLog,
  CareTask,
  Appointment,
  NotificationItem,
  EscalationLadderEvent,
  MedicalRecord,
} from '@/types';

export const DEMO_SENIOR_ID = 'senior-ramesh';
export const DEMO_FAMILY_ID = 'family-aarav';
export const DEMO_CARETAKER_ID = 'caretaker-priya';

export const DEMO_USERS: User[] = [
  {
    id: DEMO_SENIOR_ID,
    name: 'Ramesh Sharma',
    email: 'ramesh.sharma@demo.elderly360.internal',
    role: 'senior',
    phone: '+91 98201 12345',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    linkedSeniorId: DEMO_SENIOR_ID,
    relationToSenior: 'Self',
  },
  {
    id: DEMO_FAMILY_ID,
    name: 'Aarav Sharma',
    email: 'aarav.sharma@demo.elderly360.internal',
    role: 'family',
    phone: '+91 98111 54321',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    linkedSeniorId: DEMO_SENIOR_ID,
    relationToSenior: 'Son (Primary Family Guardian)',
  },
  {
    id: DEMO_CARETAKER_ID,
    name: 'Priya Singh',
    email: 'priya.singh@demo.elderly360.internal',
    role: 'caretaker',
    phone: '+91 97123 98765',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    linkedSeniorId: DEMO_SENIOR_ID,
    relationToSenior: 'Certified Eldercare Nurse',
  },
];

export const DEMO_SENIOR_PROFILE: SeniorProfile = {
  id: DEMO_SENIOR_ID,
  name: 'Ramesh Sharma',
  age: 72,
  gender: 'Male',
  bloodGroup: 'B+',
  address: 'Flat 402, Shanti Vihar Apartments, Sector 14, Gurugram, Haryana',
  conditions: ['Hypertension (Stage 2)', 'Type 2 Diabetes Mellitus', 'Mild Knee Osteoarthritis'],
  allergies: ['Penicillin (Skin rash)', 'Sulfa Antibiotics'],
  emergencyContacts: [
    {
      id: 'ec-1',
      name: 'Aarav Sharma',
      relation: 'Son',
      phone: '+91 98111 54321',
      priority: 1,
    },
    {
      id: 'ec-2',
      name: 'Dr. K. Mehta',
      relation: 'Primary Cardiologist',
      phone: '+91 98222 33445',
      priority: 2,
    },
    {
      id: 'ec-3',
      name: 'Max Hospital Emergency',
      relation: 'Hospital Helpline',
      phone: '1066',
      priority: 3,
    },
  ],
  inviteCode: 'RAMESH-360',
  seniorModeEnabled: false,
  seniorModeTextSize: 'normal',
  preferredLanguage: 'en-IN',
  privacyConsent: {
    [DEMO_FAMILY_ID]: {
      medicines: true,
      score: true,
      location: true,
      records: true,
      appointments: true,
    },
    [DEMO_CARETAKER_ID]: {
      medicines: true,
      score: true,
      location: false,
      records: true,
      appointments: true,
    },
  },
};

export const DEMO_MEDICINES: Medicine[] = [
  {
    id: 'med-1',
    seniorId: DEMO_SENIOR_ID,
    name: 'Telmisartan',
    dosage: '40 mg',
    frequency: 'Once daily',
    scheduledTimes: ['08:00'],
    instructions: 'Take in the morning with water after breakfast',
    category: 'Blood Pressure',
    stockCount: 28,
    pillsPerDose: 1,
    dailyDoseCount: 1,
    refillThreshold: 7,
    colorTag: '#0ea5e9', // Sky blue
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: 'med-2',
    seniorId: DEMO_SENIOR_ID,
    name: 'Metformin Hydrochloride',
    dosage: '500 mg',
    frequency: 'Twice daily',
    scheduledTimes: ['08:30', '20:30'],
    instructions: 'Take immediately after morning and evening meals',
    category: 'Diabetes Glycemic Control',
    stockCount: 18,
    pillsPerDose: 1,
    dailyDoseCount: 2,
    refillThreshold: 10,
    colorTag: '#10b981', // Emerald
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: 'med-3',
    seniorId: DEMO_SENIOR_ID,
    name: 'Atorvastatin',
    dosage: '10 mg',
    frequency: 'Once daily',
    scheduledTimes: ['21:00'],
    instructions: 'Take at bedtime for cholesterol control',
    category: 'Cardiovascular / Lipid',
    stockCount: 22,
    pillsPerDose: 1,
    dailyDoseCount: 1,
    refillThreshold: 7,
    colorTag: '#8b5cf6', // Violet
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: 'med-4',
    seniorId: DEMO_SENIOR_ID,
    name: 'Calcium Carbonate + Vit D3',
    dosage: '500 mg / 400 IU',
    frequency: 'Once daily',
    scheduledTimes: ['13:00'],
    instructions: 'Take after lunch with water',
    category: 'Bone & Joint Support',
    stockCount: 4, // Intentionally low for refill alert!
    pillsPerDose: 1,
    dailyDoseCount: 1,
    refillThreshold: 7,
    colorTag: '#f59e0b', // Amber
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: 'med-5',
    seniorId: DEMO_SENIOR_ID,
    name: 'Glimepiride',
    dosage: '1 mg',
    frequency: 'Once daily',
    scheduledTimes: ['08:00'],
    instructions: 'Take 10 minutes before morning breakfast',
    category: 'Diabetes',
    stockCount: 30,
    pillsPerDose: 1,
    dailyDoseCount: 1,
    refillThreshold: 8,
    colorTag: '#ec4899', // Pink
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
];

// Helper to format date YYYY-MM-DD
export function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate 30 days of realistic historical dose logs
// Pattern: Baseline (days 1-24) high adherence (~93%).
// Last 6 days: Evening medicines (Metformin 20:30 and Atorvastatin 21:00) drop to ~35%!
export function generate30DaysDoseLogs(today: Date = new Date()): DoseLog[] {
  const logs: DoseLog[] = [];

  for (let offset = 29; offset >= 0; offset--) {
    const logDate = new Date(today);
    logDate.setDate(today.getDate() - offset);
    const dateStr = formatDate(logDate);
    const isRecent6Days = offset < 6; // Last 6 days (including today)

    // Med 1: Telmisartan 08:00
    const m1Taken = Math.random() > 0.05; // 95% adherence
    logs.push({
      id: `log-m1-${dateStr}`,
      seniorId: DEMO_SENIOR_ID,
      medicineId: 'med-1',
      medicineName: 'Telmisartan',
      dosage: '40 mg',
      scheduledDate: dateStr,
      scheduledTime: '08:00',
      status: offset === 0 ? 'taken' : m1Taken ? 'taken' : 'missed',
      takenAt: m1Taken ? `${dateStr}T08:12:00Z` : undefined,
      takenByRole: 'senior',
    });

    // Med 2: Metformin 08:30 (morning dose)
    const m2mTaken = Math.random() > 0.08;
    logs.push({
      id: `log-m2-morn-${dateStr}`,
      seniorId: DEMO_SENIOR_ID,
      medicineId: 'med-2',
      medicineName: 'Metformin (Morning)',
      dosage: '500 mg',
      scheduledDate: dateStr,
      scheduledTime: '08:30',
      status: offset === 0 ? 'taken' : m2mTaken ? 'taken' : 'missed',
      takenAt: m2mTaken ? `${dateStr}T08:35:00Z` : undefined,
      takenByRole: 'senior',
    });

    // Med 2: Metformin 20:30 (evening dose - DRIFT HERE!)
    let m2eTaken: boolean;
    if (offset === 0) {
      // Today: pending or missed to demo escalation!
      m2eTaken = false;
    } else if (isRecent6Days) {
      // Deliberate drop: 4 out of last 6 missed!
      m2eTaken = offset % 3 === 0; // ~33%
    } else {
      m2eTaken = Math.random() > 0.1; // 90%
    }

    logs.push({
      id: `log-m2-eve-${dateStr}`,
      seniorId: DEMO_SENIOR_ID,
      medicineId: 'med-2',
      medicineName: 'Metformin (Evening)',
      dosage: '500 mg',
      scheduledDate: dateStr,
      scheduledTime: '20:30',
      status: offset === 0 ? 'missed' : m2eTaken ? 'taken' : 'missed',
      takenAt: m2eTaken ? `${dateStr}T20:45:00Z` : undefined,
      takenByRole: m2eTaken ? 'senior' : undefined,
      notes: !m2eTaken && isRecent6Days ? 'Fell asleep early in front of TV' : undefined,
    });

    // Med 3: Atorvastatin 21:00 (evening dose - DRIFT HERE!)
    let m3Taken: boolean;
    if (offset === 0) {
      m3Taken = false;
    } else if (isRecent6Days) {
      // Deliberate drop: 5 out of 6 missed!
      m3Taken = offset === 2; // only 1 taken
    } else {
      m3Taken = Math.random() > 0.08; // 92%
    }

    logs.push({
      id: `log-m3-${dateStr}`,
      seniorId: DEMO_SENIOR_ID,
      medicineId: 'med-3',
      medicineName: 'Atorvastatin',
      dosage: '10 mg',
      scheduledDate: dateStr,
      scheduledTime: '21:00',
      status: offset === 0 ? 'missed' : m3Taken ? 'taken' : 'missed',
      takenAt: m3Taken ? `${dateStr}T21:10:00Z` : undefined,
      takenByRole: m3Taken ? 'senior' : undefined,
      notes: !m3Taken && isRecent6Days ? 'Forgotten before sleep' : undefined,
    });

    // Med 4: Calcium + D3 13:00
    const m4Taken = Math.random() > 0.1;
    logs.push({
      id: `log-m4-${dateStr}`,
      seniorId: DEMO_SENIOR_ID,
      medicineId: 'med-4',
      medicineName: 'Calcium + Vit D3',
      dosage: '500 mg / 400 IU',
      scheduledDate: dateStr,
      scheduledTime: '13:00',
      status: offset === 0 ? 'taken' : m4Taken ? 'taken' : 'missed',
      takenAt: m4Taken ? `${dateStr}T13:20:00Z` : undefined,
      takenByRole: 'caretaker',
    });

    // Med 5: Glimepiride 08:00
    const m5Taken = Math.random() > 0.06;
    logs.push({
      id: `log-m5-${dateStr}`,
      seniorId: DEMO_SENIOR_ID,
      medicineId: 'med-5',
      medicineName: 'Glimepiride',
      dosage: '1 mg',
      scheduledDate: dateStr,
      scheduledTime: '08:00',
      status: offset === 0 ? 'taken' : m5Taken ? 'taken' : 'missed',
      takenAt: m5Taken ? `${dateStr}T08:05:00Z` : undefined,
      takenByRole: 'senior',
    });
  }

  return logs;
}

// Generate 30 days of daily care tasks
export function generate30DaysCareTasks(today: Date = new Date()): CareTask[] {
  const tasks: CareTask[] = [];

  for (let offset = 29; offset >= 0; offset--) {
    const taskDate = new Date(today);
    taskDate.setDate(today.getDate() - offset);
    const dateStr = formatDate(taskDate);
    const isRecent6Days = offset < 6;

    // Task 1: Morning Walk
    // In recent days, 2 walks skipped due to knee soreness
    const walkCompleted = isRecent6Days ? (offset !== 3 && offset !== 1) : Math.random() > 0.1;
    tasks.push({
      id: `task-walk-${dateStr}`,
      seniorId: DEMO_SENIOR_ID,
      title: 'Morning 20-min Garden Walk',
      category: 'walk',
      scheduledTime: '07:30',
      assignedRole: 'senior',
      status: offset === 0 ? 'completed' : walkCompleted ? 'completed' : 'skipped',
      completedAt: walkCompleted ? `${dateStr}T07:55:00Z` : undefined,
      completedByRole: 'senior',
      notes: !walkCompleted ? 'Skipped: Mild knee stiffness reported' : 'Completed brisk walk with walking cane',
    });

    // Task 2: BP & Pulse Monitoring (Caretaker)
    const bpCompleted = offset === 0 ? true : Math.random() > 0.05;
    tasks.push({
      id: `task-bp-${dateStr}`,
      seniorId: DEMO_SENIOR_ID,
      title: 'Blood Pressure & Heart Rate Log',
      category: 'vitals',
      scheduledTime: '09:00',
      assignedRole: 'caretaker',
      status: bpCompleted ? 'completed' : 'pending',
      completedAt: bpCompleted ? `${dateStr}T09:15:00Z` : undefined,
      completedByRole: 'caretaker',
      vitalsData: {
        bpSystolic: isRecent6Days ? 144 : 132, // Note: slightly elevated due to missed evening BP/metformin!
        bpDiastolic: isRecent6Days ? 88 : 82,
        pulse: 74,
      },
      notes: isRecent6Days ? 'BP slightly elevated over morning baseline.' : 'Vitals stable.',
    });

    // Task 3: Hydration Check (8 glasses water)
    const hydCompleted = Math.random() > 0.15;
    tasks.push({
      id: `task-hyd-${dateStr}`,
      seniorId: DEMO_SENIOR_ID,
      title: 'Hydration Target (2.0 Liters)',
      category: 'hydration',
      scheduledTime: '14:00',
      assignedRole: 'caretaker',
      status: offset === 0 ? 'completed' : hydCompleted ? 'completed' : 'skipped',
      completedAt: hydCompleted ? `${dateStr}T14:10:00Z` : undefined,
      completedByRole: 'caretaker',
      vitalsData: { waterGlasses: 7 },
    });

    // Task 4: Evening Breathing & Stretches (Senior)
    // Dropping in recent 6 days along with evening meds!
    const stretchCompleted = isRecent6Days ? (offset === 4) : Math.random() > 0.15;
    tasks.push({
      id: `task-stretch-${dateStr}`,
      seniorId: DEMO_SENIOR_ID,
      title: 'Evening Deep Breathing & Light Stretches',
      category: 'exercise',
      scheduledTime: '18:30',
      assignedRole: 'senior',
      status: offset === 0 ? 'pending' : stretchCompleted ? 'completed' : 'skipped',
      completedAt: stretchCompleted ? `${dateStr}T18:45:00Z` : undefined,
      completedByRole: 'senior',
      notes: !stretchCompleted && isRecent6Days ? 'Senior felt fatigued in the evening' : undefined,
    });
  }

  return tasks;
}

export const DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-1',
    seniorId: DEMO_SENIOR_ID,
    doctorName: 'Dr. K. Mehta, MD',
    specialty: 'Cardiologist',
    hospital: 'Apollo Clinic, Gurugram',
    date: formatDate(new Date(Date.now() - 18 * 86400000)),
    time: '11:00',
    status: 'attended',
    notes: 'BP was 134/84. Recommended maintaining Telmisartan 40mg and routine evening walks.',
  },
  {
    id: 'appt-2',
    seniorId: DEMO_SENIOR_ID,
    doctorName: 'Dr. Ananya Roy, DM',
    specialty: 'Endocrinologist',
    hospital: 'Max Super Speciality Hospital, Sector 43',
    date: formatDate(new Date(Date.now() + 2 * 86400000)),
    time: '16:30',
    status: 'scheduled',
    notes: 'Quarterly diabetic review & HbA1c check. Bring recent blood sugar logs and prescription.',
  },
  {
    id: 'appt-3',
    seniorId: DEMO_SENIOR_ID,
    doctorName: 'Dr. Rajesh Khanna, MS',
    specialty: 'Orthopedic Specialist',
    hospital: 'Fortis Memorial Research Institute',
    date: formatDate(new Date(Date.now() + 14 * 86400000)),
    time: '10:00',
    status: 'scheduled',
    notes: 'Knee joint checkup & review for physical therapy.',
  },
];

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    seniorId: DEMO_SENIOR_ID,
    targetRole: 'all',
    title: 'Drift Detected: Evening Adherence',
    message: 'Routine drift flagged: Evening Metformin & Atorvastatin completion dropped from 92% to 35% over the past 6 days.',
    type: 'drift',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    read: false,
  },
  {
    id: 'notif-2',
    seniorId: DEMO_SENIOR_ID,
    targetRole: 'family',
    title: 'Care Continuity Score Alert',
    message: 'Score declined by 14 points (now 76/100). Primary factor: 4 of last 6 evening medicine doses missed.',
    type: 'system',
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
    read: false,
  },
  {
    id: 'notif-3',
    seniorId: DEMO_SENIOR_ID,
    targetRole: 'all',
    title: 'Refill Warning: Calcium + Vit D3',
    message: 'Only 4 days of stock remaining (4 tablets left). Daily usage is 1 tablet. Please reorder.',
    type: 'refill',
    timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
    read: true,
  },
];

export const DEMO_ESCALATION_EVENT: EscalationLadderEvent = {
  id: 'esc-demo-today',
  seniorId: DEMO_SENIOR_ID,
  medicineId: 'med-3',
  medicineName: 'Atorvastatin',
  dosage: '10 mg',
  scheduledTime: '21:00',
  scheduledDate: formatDate(new Date()),
  currentStep: 2, // Currently at Step 2: Caretaker alerted
  status: 'active',
  triggeredAt: new Date(Date.now() - 45 * 60000).toISOString(),
  steps: [
    {
      step: 1,
      title: 'Senior Gentle Audio & Push Reminder',
      recipient: 'Ramesh Sharma (Senior)',
      recipientRole: 'senior',
      delayMinutes: 0,
      sentAt: new Date(Date.now() - 45 * 60000).toISOString(),
      status: 'acknowledged',
    },
    {
      step: 2,
      title: 'Caretaker Alert & Dose Check Notification',
      recipient: 'Priya Singh (Caretaker)',
      recipientRole: 'caretaker',
      delayMinutes: 15,
      sentAt: new Date(Date.now() - 30 * 60000).toISOString(),
      status: 'sent',
    },
    {
      step: 3,
      title: 'Family Guardian Escalation SMS & App Alert',
      recipient: 'Aarav Sharma (Son)',
      recipientRole: 'family',
      delayMinutes: 30,
      status: 'pending',
    },
    {
      step: 4,
      title: 'Emergency Contact & SOS Call Suggestion',
      recipient: 'Emergency Protocol (Family + Helpline)',
      recipientRole: 'emergency',
      delayMinutes: 60,
      status: 'pending',
    },
  ],
};

export const DEMO_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 'rec-1',
    seniorId: DEMO_SENIOR_ID,
    title: 'Cardiology Consultation & ECG Report',
    recordType: 'prescription',
    date: formatDate(new Date(Date.now() - 18 * 86400000)),
    doctorName: 'Dr. K. Mehta',
    hospitalOrLab: 'Apollo Clinic, Gurugram',
    summary: 'Sinus rhythm normal. Advised strict blood pressure monitoring. Continue Telmisartan 40mg. Follow-up in 3 months.',
    tags: ['Cardiology', 'ECG', 'Hypertension'],
  },
  {
    id: 'rec-2',
    seniorId: DEMO_SENIOR_ID,
    title: 'Comprehensive Metabolic Panel & HbA1c',
    recordType: 'lab_report',
    date: formatDate(new Date(Date.now() - 45 * 86400000)),
    doctorName: 'Dr. Ananya Roy',
    hospitalOrLab: 'Dr. Lal PathLabs',
    summary: 'HbA1c was 7.4%. Serum Creatinine 1.05 mg/dL (Normal). Fasting Blood Glucose 138 mg/dL. Lipid Profile shows LDL 112 mg/dL.',
    tags: ['Blood Test', 'HbA1c', 'Diabetes', 'Cholesterol'],
  },
  {
    id: 'rec-3',
    seniorId: DEMO_SENIOR_ID,
    title: 'Bilateral Knee X-Ray Report',
    recordType: 'discharge_summary',
    date: formatDate(new Date(Date.now() - 90 * 86400000)),
    doctorName: 'Dr. Rajesh Khanna',
    hospitalOrLab: 'Fortis Memorial Hospital',
    summary: 'Mild medial joint space narrowing bilaterally, consistent with Grade II osteoarthritis. Advised low-impact walking and calcium supplementation.',
    tags: ['Orthopedic', 'X-Ray', 'Osteoarthritis'],
  },
];
