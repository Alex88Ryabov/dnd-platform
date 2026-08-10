import type { Character } from '../model/types';
import { derive } from './derive';

// Короткий отдых: восстанавливаются ресурсы «короткого» восстановления и ячейки пакта
export function applyShortRest(char: Character): Character {
  const stats = derive(char);
  const shortKeys = new Set(
    stats.resources.filter((r) => r.recharge === 'short').map((r) => r.key),
  );
  return {
    ...char,
    resources: char.resources.map((r) => (shortKeys.has(r.key) ? { ...r, used: 0 } : r)),
    customResources: char.customResources.map((r) => (r.recharge === 'short' ? { ...r, used: 0 } : r)),
    spells: { ...char.spells, pactUsed: 0 },
    updatedAt: new Date().toISOString(),
  };
}

// Трата костей хитов на коротком отдыхе
export function spendHitDice(char: Character, results: number[]): Character {
  const stats = derive(char);
  const conMod = stats.mods.con;
  const healed = results.reduce((sum, r) => sum + Math.max(0, r + conMod), 0);
  return {
    ...char,
    hpCurrent: Math.min(stats.hpMax, char.hpCurrent + healed),
    hitDiceSpent: Math.min(stats.hitDiceTotal, char.hitDiceSpent + results.length),
    updatedAt: new Date().toISOString(),
  };
}

// Долгий отдых 2024: все хиты, все кости хитов, все ячейки, ресурсы, −1 истощение
export function applyLongRest(char: Character): Character {
  const stats = derive(char);
  return {
    ...char,
    hpCurrent: stats.hpMax,
    hpTemp: 0,
    hitDiceSpent: 0,
    deathSaves: { successes: 0, failures: 0 },
    exhaustion: Math.max(0, char.exhaustion - 1),
    resources: char.resources.map((r) => ({ ...r, used: 0 })),
    customResources: char.customResources.map((r) => (r.recharge === 'none' ? r : { ...r, used: 0 })),
    spells: {
      ...char.spells,
      slotsUsed: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      pactUsed: 0,
    },
    heroicInspiration: char.speciesId === 'human' ? true : char.heroicInspiration,
    concentratingOn: undefined,
    updatedAt: new Date().toISOString(),
  };
}
