import type { SkillId } from '../model/types';
import { ANY_SKILL } from '../data/core';

// Варианты для выбора навыка: список источника без тех, что уже есть у героя.
// Если оставшихся вариантов меньше, чем нужно выбрать, добавляем остальные навыки —
// по правилу «это владение уже есть → возьмите взамен другое».
export function skillPool(from: SkillId[], taken: SkillId[], count: number): SkillId[] {
  const free = from.filter((id) => !taken.includes(id));
  if (free.length >= count) {
    return free;
  }
  return [...free, ...ANY_SKILL.filter((id) => !free.includes(id) && !taken.includes(id))];
}
