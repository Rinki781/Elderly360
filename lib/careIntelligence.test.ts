import { describe, it, expect } from 'vitest';
import {
  computeCareContinuityScore,
  detectRoutineDrift,
  calculateRefillPrediction,
} from './careIntelligence';

// Helpers: dates relative to today, so tests never go stale
const day = (n: number) =>
  new Date(Date.now() - n * 86400000).toISOString().split('T')[0];

const dose = (
  n: number,
  time: string,
  status: string,
  medicineId = 'med-1',
  medicineName = 'Metformin'
): any => ({
  id: `dose-${medicineId}-${day(n)}-${time}`,
  medicineId,
  medicineName,
  scheduledDate: day(n),
  scheduledTime: time,
  status,
});

const task = (n: number, title: string, category: string, status: string, time = '18:30'): any => ({
  id: `task-${title}-${day(n)}`,
  title,
  category,
  status,
  scheduledTime: time,
});

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

describe('computeCareContinuityScore', () => {
  it('gives a high, stable score when everything is completed', () => {
    const logs = range(0, 13).flatMap((n) => [dose(n, '08:00', 'taken'), dose(n, '20:30', 'taken')]);
    const result = computeCareContinuityScore(logs, [], []);

    expect(result.overall).toBeGreaterThanOrEqual(95);
    expect(result.medicineAdherence).toBe(100);
    expect(result.trend).toBe('stable');
    expect(result.dropReasons).toEqual(['All care activities completed on schedule']);
  });

  it('drops the score and explains why when evening doses are missed', () => {
    const logs = range(0, 13).flatMap((n) => [
      dose(n, '08:00', 'taken'),
      dose(n, '20:30', n <= 5 ? 'missed' : 'taken'),
    ]);
    const result = computeCareContinuityScore(logs, [], []);

    expect(result.pointChange7d).toBeLessThan(0);
    expect(result.trend).toBe('declining');
    expect(result.explanation).toContain('Score fell');
    expect(result.dropReasons[0]).toContain('evening medicine dose');
  });

  it('reports skipped morning walks as a drop reason', () => {
    const logs = range(0, 13).flatMap((n) => [dose(n, '08:00', 'taken'), dose(n, '20:30', n <= 5 ? 'missed' : 'taken')]);
    const tasks = range(0, 5).map((n) => task(n, 'Morning Walk', 'walk', 'skipped', '07:30'));
    const result = computeCareContinuityScore(logs, tasks, []);

    expect(result.dropReasons.some((r) => r.includes('walk'))).toBe(true);
  });

  it('keeps the score within 0 to 100 and returns history points', () => {
    const logs = range(0, 13).flatMap((n) => [dose(n, '20:30', 'missed')]);
    const result = computeCareContinuityScore(logs, [], []);

    expect(result.overall).toBeGreaterThanOrEqual(0);
    expect(result.overall).toBeLessThanOrEqual(100);
    expect(result.history).toHaveLength(14);
    expect(result.history[0]).toHaveProperty('overall');
  });

  it('counts a skipped dose as a missed one in the drop reasons', () => {
    const logs = range(0, 13).flatMap((n) => [dose(n, '20:30', n <= 2 ? 'skipped' : 'taken')]);
    const result = computeCareContinuityScore(logs, [], []);

    expect(result.dropReasons[0]).toContain('evening medicine dose');
  });
});

describe('detectRoutineDrift', () => {
  const baseline = range(10, 27).map((n) => dose(n, '20:30', 'taken'));

  it('flags critical drift when an evening dose is mostly missed', () => {
    const recent = range(0, 5).map((n) => dose(n, '20:30', n === 0 ? 'taken' : 'missed'));
    const alerts = detectRoutineDrift([...baseline, ...recent], [], 'senior-1');

    expect(alerts).toHaveLength(1);
    expect(alerts[0].category).toBe('medicine');
    expect(alerts[0].severity).toBe('critical');
    expect(alerts[0].baselineCompletion).toBe(100);
    expect(alerts[0].dropPercent).toBeGreaterThanOrEqual(30);
    expect(alerts[0].timeSlot).toContain('Evening');
    expect(alerts[0].seniorId).toBe('senior-1');
  });

  it('flags mild drift for a smaller drop', () => {
    // 4 of 6 recent doses taken: about 67% against a 100% baseline
    const recent = range(0, 5).map((n) => dose(n, '20:30', n <= 1 ? 'missed' : 'taken'));
    const alerts = detectRoutineDrift([...baseline, ...recent], [], 'senior-1');

    expect(alerts).toHaveLength(1);
    expect(alerts[0].severity).toBe('mild');
  });

  it('does not flag drift when adherence is stable', () => {
    const recent = range(0, 5).map((n) => dose(n, '20:30', 'taken'));
    const alerts = detectRoutineDrift([...baseline, ...recent], [], 'senior-1');

    expect(alerts).toEqual([]);
  });

  it('does not flag drift when there is too little baseline data', () => {
    const shortBaseline = range(10, 12).map((n) => dose(n, '20:30', 'taken'));
    const recent = range(0, 5).map((n) => dose(n, '20:30', 'missed'));
    const alerts = detectRoutineDrift([...shortBaseline, ...recent], [], 'senior-1');

    expect(alerts).toEqual([]);
  });

  it('detects drift in daily care tasks', () => {
    const baseTasks = range(10, 20).map((n) => task(n, 'Evening Stretches', 'exercise', 'completed'));
    const recentTasks = range(0, 5).map((n) => task(n, 'Evening Stretches', 'exercise', 'skipped'));
    const alerts = detectRoutineDrift([], [...baseTasks, ...recentTasks], 'senior-1');

    expect(alerts).toHaveLength(1);
    expect(alerts[0].category).toBe('task');
    expect(alerts[0].activityName).toBe('Evening Stretches');
    expect(alerts[0].recentCompletion).toBe(0);
  });
});

describe('calculateRefillPrediction', () => {
  it('computes days remaining from stock and daily usage', () => {
    const r = calculateRefillPrediction({ stockCount: 20, dailyDoseCount: 2, pillsPerDose: 1, refillThreshold: 7 });

    expect(r.daysRemaining).toBe(10);
    expect(r.isLowStock).toBe(false);
  });

  it('flags a critical refill when stock is almost out', () => {
    const r = calculateRefillPrediction({ stockCount: 6, dailyDoseCount: 2, pillsPerDose: 1, refillThreshold: 7 });

    expect(r.daysRemaining).toBe(3);
    expect(r.isLowStock).toBe(true);
    expect(r.statusText).toContain('Critical');
  });

  it('flags a depleted stock', () => {
    const r = calculateRefillPrediction({ stockCount: 0, dailyDoseCount: 2, pillsPerDose: 1, refillThreshold: 7 });

    expect(r.daysRemaining).toBe(0);
    expect(r.statusText).toBe('Depleted today! Immediate refill required');
  });

  it('accounts for multiple pills per dose', () => {
    const r = calculateRefillPrediction({ stockCount: 20, dailyDoseCount: 2, pillsPerDose: 2, refillThreshold: 7 });

    expect(r.daysRemaining).toBe(5);
    expect(r.statusText).toContain('Low stock');
  });
});