/**
 * calculateOneRepMax: Brzycki formula for estimating 1RM.
 */
export function calculateOneRepMax(weightKg: number, reps: number): number {
  if (reps <= 1) return weightKg;
  if (reps > 30) return weightKg; // Formula degrades above 30 reps
  return Math.round(weightKg * (36 / (37 - reps)));
}

/**
 * calculateBMI: Body Mass Index calculation.
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  if (heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
}

/**
 * calculateVolumeLoad: Total workout volume (Weight * Reps * Sets).
 */
export function calculateVolumeLoad(sets: { weightKg?: number; reps?: number; completed: boolean }[]): number {
  return sets
    .filter((s) => s.completed)
    .reduce((acc, s) => acc + (s.weightKg ?? 0) * (s.reps ?? 0), 0);
}
