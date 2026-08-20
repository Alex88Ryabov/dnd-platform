import type { LevelSkillGrant, SkillId } from '../model/types';
import { ANY_SKILL } from '../data/core';

export interface SkillGrantTotal {
  count: number;
  // из чего выбирать; undefined — ограничений нет
  from?: SkillId[];
}

function total(active: LevelSkillGrant[]): SkillGrantTotal {
  const lists = active.map((g) => g.from);
  const limited = lists.length > 0 && lists.every((list) => list !== undefined);
  return {
    count: active.reduce((sum, g) => sum + g.count, 0),
    from: limited ? [...new Set(lists.flat() as SkillId[])] : undefined,
  };
}

// сколько навыков (или компетентности) класс уже выдал к указанному уровню
export function grantsUpTo(grants: LevelSkillGrant[] | undefined, level: number): SkillGrantTotal {
  return total((grants ?? []).filter((g) => g.level <= level));
}

// что класс даёт ровно на этом уровне — для повышения уровня
export function grantAtLevel(grants: LevelSkillGrant[] | undefined, level: number): SkillGrantTotal {
  return total((grants ?? []).filter((g) => g.level === level));
}

// снять навык или добавить, если ещё есть свободные места
export function toggleChoice(chosen: SkillId[], limit: number, skillId: SkillId): SkillId[] {
  if (chosen.includes(skillId)) {
    return chosen.filter((s) => s !== skillId);
  }
  return chosen.length < limit ? [...chosen, skillId] : chosen;
}

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
