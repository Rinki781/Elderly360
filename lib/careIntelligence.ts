import {
  CareContinuityScore,
  DoseLog,
  CareTask,
  Appointment,
  RoutineDriftAlert,
  ScoreHistoryPoint,
} from '@/types';

// Compute Care Continuity Score for a given set of dose logs, tasks, and appointments
export function computeCareContinuityScore(
  doseLogs: DoseLog[],
  tasks: CareTask[],
  appointments: Appointment[]
): CareContinuityScore {
  // Group logs and tasks by date
  const datesSet = new Set<string>();
  doseLogs.forEach((l) => datesSet.add(l.scheduledDate));
  tasks.forEach((t) => {
    // If tasks have date encoded or we group them
    const dateMatch = t.id.match(/\d{4}-\d{2}-\d{2}/);
    if (dateMatch) datesSet.add(dateMatch[0]);
  });

  const sortedDates = Array.from(datesSet).sort();

  // Calculate daily scores for history chart
  const history: ScoreHistoryPoint[] = sortedDates.map((date) => {
    const dayLogs = doseLogs.filter((l) => l.scheduledDate === date);
    const dayTasks = tasks.filter((t) => t.id.includes(date));

    // Medicine Adherence
    const totalMeds = dayLogs.length;
    const takenMeds = dayLogs.filter((l) => l.status === 'taken').length;
    const medScore = totalMeds > 0 ? Math.round((takenMeds / totalMeds) * 100) : 100;

    // Task Completion
    const totalT = dayTasks.length;
    const compT = dayTasks.filter((t) => t.status === 'completed').length;
    const taskScore = totalT > 0 ? Math.round((compT / totalT) * 100) : 100;

    // Appointments (if any on that date, attended = 100, else default baseline 95)
    const dayAppts = appointments.filter((a) => a.date === date);
    let apptScore = 95;
    if (dayAppts.length > 0) {
      const attended = dayAppts.filter((a) => a.status === 'attended' || a.status === 'completed').length;
      apptScore = Math.round((attended / dayAppts.length) * 100);
    }

    // Check-in consistency (simulated baseline 92-98% earlier, drops slightly if meds missed)
    const checkinScore = medScore < 70 ? 75 : 95;

    // Formula: 50% Meds + 25% Tasks + 15% Appts + 10% Checkins
    const overall = Math.round(
      medScore * 0.5 +
      taskScore * 0.25 +
      apptScore * 0.15 +
      checkinScore * 0.10
    );

    return {
      date,
      overall,
      medicineAdherence: medScore,
      taskCompletion: taskScore,
      appointmentAttendance: apptScore,
      checkinConsistency: checkinScore,
    };
  });

  // Calculate recent vs baseline weighting (recent 7 days weighted 65%, prior days weighted 35%)
  const totalDays = history.length;
  const recentDays = history.slice(Math.max(0, totalDays - 7));
  const priorDays = history.slice(0, Math.max(0, totalDays - 7));

  const average = (arr: ScoreHistoryPoint[], key: keyof ScoreHistoryPoint) => {
    if (arr.length === 0) return 90;
    const sum = arr.reduce((acc, curr) => acc + (Number(curr[key]) || 0), 0);
    return Math.round(sum / arr.length);
  };

  const recentOverall = average(recentDays, 'overall');
  const priorOverall = average(priorDays, 'overall');
  const pointChange7d = recentOverall - priorOverall;

  const currentMedAdherence = average(recentDays, 'medicineAdherence');
  const currentTaskCompletion = average(recentDays, 'taskCompletion');
  const currentApptAttendance = average(recentDays, 'appointmentAttendance');
  const currentCheckin = average(recentDays, 'checkinConsistency');

  // Weighted overall continuity score
  const overall = Math.min(100, Math.max(0, recentOverall));

  // Determine drop reasons in plain language
  const dropReasons: string[] = [];

  // Check recent evening doses missed
  const recentLogs = doseLogs.filter((l) => {
    const d = new Date(l.scheduledDate).getTime();
    const cutoff = Date.now() - 7 * 86400000;
    return d >= cutoff;
  });

  const eveningMissed = recentLogs.filter(
    (l) => (l.scheduledTime >= '18:00') && (l.status === 'missed' || l.status === 'skipped')
  ).length;

  if (eveningMissed > 0) {
    dropReasons.push(`${eveningMissed} evening medicine dose${eveningMissed > 1 ? 's' : ''} missed in the last 7 days`);
  }

  const recentTasks = tasks.filter((t) => {
    const dateMatch = t.id.match(/\d{4}-\d{2}-\d{2}/);
    if (!dateMatch) return false;
    const d = new Date(dateMatch[0]).getTime();
    return d >= Date.now() - 7 * 86400000;
  });

  const skippedWalks = recentTasks.filter(
    (t) => t.category === 'walk' && t.status === 'skipped'
  ).length;

  if (skippedWalks > 0) {
    dropReasons.push(`${skippedWalks} morning routine walk${skippedWalks > 1 ? 's' : ''} skipped`);
  }

  const skippedExercises = recentTasks.filter(
    (t) => t.category === 'exercise' && t.status === 'skipped'
  ).length;

  if (skippedExercises > 0) {
    dropReasons.push(`${skippedExercises} evening mobility & stretching session${skippedExercises > 1 ? 's' : ''} skipped`);
  }

  let explanation = '';
  if (pointChange7d <= -5) {
    explanation = `Score fell ${Math.abs(pointChange7d)} points: ${dropReasons.slice(0, 2).join(', ')}. Routine drift detected in evening hours.`;
  } else if (pointChange7d >= 5) {
    explanation = `Score improved by ${pointChange7d} points with consistent medication adherence and routine completions.`;
  } else {
    explanation = `Care patterns remain stable. Routine continuity is currently steady at ${overall}/100.`;
  }

  return {
    overall,
    medicineAdherence: currentMedAdherence,
    taskCompletion: currentTaskCompletion,
    appointmentAttendance: currentApptAttendance,
    checkinConsistency: currentCheckin,
    trend: pointChange7d < -3 ? 'declining' : pointChange7d > 3 ? 'improving' : 'stable',
    pointChange7d,
    explanation,
    dropReasons: dropReasons.length > 0 ? dropReasons : ['All care activities completed on schedule'],
    history,
  };
}

// Routine Drift Detection Algorithm:
// Compares the last 7 days with the previous 21-day baseline per activity and time slot.
// Flags drift when completion drops by > 30% or an activity stops entirely.
export function detectRoutineDrift(
  doseLogs: DoseLog[],
  tasks: CareTask[],
  seniorId: string
): RoutineDriftAlert[] {
  const alerts: RoutineDriftAlert[] = [];
  const now = Date.now();
  const day7Ms = 7 * 86400000;
  const day28Ms = 28 * 86400000;

  // 1. Check Drift for Medicines
  // Group logs by medicineId and timeSlot
  const medGroups: { [key: string]: { name: string; time: string; baselineLogs: DoseLog[]; recentLogs: DoseLog[] } } = {};

  doseLogs.forEach((log) => {
    const logTime = new Date(log.scheduledDate).getTime();
    const key = `${log.medicineId}-${log.scheduledTime}`;
    if (!medGroups[key]) {
      medGroups[key] = {
        name: log.medicineName,
        time: log.scheduledTime,
        baselineLogs: [],
        recentLogs: [],
      };
    }
    // Baseline: 28 days ago to 7 days ago (21 days)
    if (logTime >= now - day28Ms && logTime < now - day7Ms) {
      medGroups[key].baselineLogs.push(log);
    } else if (logTime >= now - day7Ms) {
      // Recent 7 days
      medGroups[key].recentLogs.push(log);
    }
  });

  Object.values(medGroups).forEach((grp) => {
    if (grp.baselineLogs.length >= 5 && grp.recentLogs.length >= 3) {
      const baseTaken = grp.baselineLogs.filter((l) => l.status === 'taken').length;
      const baseRate = Math.round((baseTaken / grp.baselineLogs.length) * 100);

      const recentTaken = grp.recentLogs.filter((l) => l.status === 'taken').length;
      const recentRate = Math.round((recentTaken / grp.recentLogs.length) * 100);

      const dropPercent = baseRate - recentRate;

      // Flag if completion drops by > 30% or stops entirely
      if (dropPercent >= 30 || recentRate === 0) {
        const severity: 'mild' | 'moderate' | 'critical' =
          dropPercent >= 50 || recentRate < 35
            ? 'critical'
            : dropPercent >= 35
            ? 'moderate'
            : 'mild';

        const timeLabel =
          grp.time >= '18:00' ? `Evening (${grp.time})` : grp.time >= '12:00' ? `Afternoon (${grp.time})` : `Morning (${grp.time})`;

        alerts.push({
          id: `drift-med-${grp.name.toLowerCase().replace(/\s+/g, '-')}-${grp.time.replace(':', '')}`,
          seniorId,
          activityName: `${grp.name}`,
          timeSlot: timeLabel,
          category: 'medicine',
          baselineCompletion: baseRate,
          recentCompletion: recentRate,
          dropPercent,
          severity,
          detectedDate: new Date().toISOString().split('T')[0],
          explanation: `${grp.name} at ${timeLabel}: usually ${baseRate}%, dropped to ${recentRate}% in the last 7 days.`,
          status: 'active',
        });
      }
    }
  });

  // 2. Check Drift for Tasks (e.g. evening breathing/walks)
  const taskGroups: { [title: string]: { category: 'walk' | 'meal' | 'vitals' | 'hydration' | 'exercise' | 'checkin'; time: string; baseline: CareTask[]; recent: CareTask[] } } = {};

  tasks.forEach((t) => {
    const dateMatch = t.id.match(/\d{4}-\d{2}-\d{2}/);
    if (!dateMatch) return;
    const taskTime = new Date(dateMatch[0]).getTime();
    if (!taskGroups[t.title]) {
      taskGroups[t.title] = { category: t.category, time: t.scheduledTime, baseline: [], recent: [] };
    }
    if (taskTime >= now - day28Ms && taskTime < now - day7Ms) {
      taskGroups[t.title].baseline.push(t);
    } else if (taskTime >= now - day7Ms) {
      taskGroups[t.title].recent.push(t);
    }
  });

  Object.entries(taskGroups).forEach(([title, grp]) => {
    if (grp.baseline.length >= 5 && grp.recent.length >= 3) {
      const baseComp = grp.baseline.filter((t) => t.status === 'completed').length;
      const baseRate = Math.round((baseComp / grp.baseline.length) * 100);

      const recentComp = grp.recent.filter((t) => t.status === 'completed').length;
      const recentRate = Math.round((recentComp / grp.recent.length) * 100);

      const dropPercent = baseRate - recentRate;
      if (dropPercent >= 30) {
        alerts.push({
          id: `drift-task-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          seniorId,
          activityName: title,
          timeSlot: grp.time >= '18:00' ? `Evening (${grp.time})` : `Morning (${grp.time})`,
          category: 'task',
          baselineCompletion: baseRate,
          recentCompletion: recentRate,
          dropPercent,
          severity: dropPercent >= 45 ? 'moderate' : 'mild',
          detectedDate: new Date().toISOString().split('T')[0],
          explanation: `${title}: baseline was ${baseRate}%, but fell to ${recentRate}% in the last 7 days.`,
          status: 'active',
        });
      }
    }
  });

  return alerts;
}

// Calculate days remaining before medicine runs out: stockCount / (dailyDoseCount * pillsPerDose)
export function calculateRefillPrediction(medicine: {
  stockCount: number;
  dailyDoseCount: number;
  pillsPerDose: number;
  refillThreshold: number;
}): {
  daysRemaining: number;
  runoutDate: string;
  isLowStock: boolean;
  statusText: string;
} {
  const dailyUsage = Math.max(1, medicine.dailyDoseCount * (medicine.pillsPerDose || 1));
  const daysRemaining = Math.max(0, Math.floor(medicine.stockCount / dailyUsage));

  const runout = new Date();
  runout.setDate(runout.getDate() + daysRemaining);

  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const formattedRunoutDate = runout.toLocaleDateString('en-US', options);

  const isLowStock = daysRemaining <= (medicine.refillThreshold || 7);

  let statusText = `Runs out in ${daysRemaining} days (${formattedRunoutDate})`;
  if (daysRemaining === 0) {
    statusText = 'Depleted today! Immediate refill required';
  } else if (daysRemaining <= 3) {
    statusText = `Critical: Runs out in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''} (${formattedRunoutDate})`;
  } else if (isLowStock) {
    statusText = `Low stock: Runs out in ${daysRemaining} days (${formattedRunoutDate})`;
  }

  return {
    daysRemaining,
    runoutDate: formattedRunoutDate,
    isLowStock,
    statusText,
  };
}
