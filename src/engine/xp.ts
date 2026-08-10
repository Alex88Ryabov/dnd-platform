import { XP_FOR_LEVEL } from '../data/core';

export function xpForNextLevel(level: number): number | null {
  if (level >= 20) {
    return null;
  }
  return XP_FOR_LEVEL[level + 1];
}

export function canLevelUp(level: number, xp: number): boolean {
  const next = xpForNextLevel(level);
  if (next === null) {
    return false;
  }
  return xp >= next;
}

export function xpProgress(level: number, xp: number): number {
  const current = XP_FOR_LEVEL[level] ?? 0;
  const next = xpForNextLevel(level);
  if (next === null) {
    return 1;
  }
  const span = next - current;
  if (span <= 0) {
    return 1;
  }
  return Math.max(0, Math.min(1, (xp - current) / span));
}
