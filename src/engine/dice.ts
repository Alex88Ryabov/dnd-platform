import type { DieRoll } from '../model/types';

export type RollMode = 'normal' | 'adv' | 'dis';

export interface FormulaResult {
  total: number;
  detail: DieRoll[];
  modifier: number;
}

export interface D20Result {
  total: number;
  d20s: number[];
  kept: number;
  modifier: number;
  crit?: 'success' | 'fail';
}

export function rollDie(die: number): number {
  return Math.floor(Math.random() * die) + 1;
}

export function rollDice(count: number, die: number): number[] {
  const results: number[] = [];
  for (let i = 0; i < count; i++) {
    results.push(rollDie(die));
  }
  return results;
}

export function dieAverage(die: number): number {
  return Math.ceil(die / 2 + 0.5);
}

// Разбирает формулу вида «2d6+1d8+3» или «1d20-2»
export function parseFormula(formula: string): { specs: { count: number; die: number }[]; modifier: number } | null {
  const clean = formula.replace(/\s+/g, '').replace(/к/gi, 'd').replace(/д/gi, 'd').toLowerCase();
  if (!/^[-+]?(\d*d\d+|\d+)([-+](\d*d\d+|\d+))*$/.test(clean)) {
    return null;
  }
  const specs: { count: number; die: number }[] = [];
  let modifier = 0;
  const tokens = clean.match(/[-+]?[^-+]+/g) ?? [];
  for (const token of tokens) {
    const sign = token.startsWith('-') ? -1 : 1;
    const body = token.replace(/^[-+]/, '');
    if (body.includes('d')) {
      const [countStr, dieStr] = body.split('d');
      const count = countStr === '' ? 1 : parseInt(countStr, 10);
      const die = parseInt(dieStr, 10);
      if (!die || count > 100 || die > 1000) {
        return null;
      }
      if (sign < 0) {
        // отрицательные кости не поддерживаем — считаем формулу некорректной
        return null;
      }
      specs.push({ count, die });
    } else {
      modifier += sign * parseInt(body, 10);
    }
  }
  return { specs, modifier };
}

export function rollFormula(formula: string): FormulaResult | null {
  const parsed = parseFormula(formula);
  if (!parsed) {
    return null;
  }
  const detail: DieRoll[] = parsed.specs.map((spec) => ({
    die: spec.die,
    results: rollDice(spec.count, spec.die),
  }));
  const diceSum = detail.reduce((sum, roll) => sum + roll.results.reduce((a, b) => a + b, 0), 0);
  return { total: diceSum + parsed.modifier, detail, modifier: parsed.modifier };
}

export function d20Roll(modifier: number, mode: RollMode = 'normal'): D20Result {
  const d20s = mode === 'normal' ? [rollDie(20)] : [rollDie(20), rollDie(20)];
  const kept = mode === 'dis' ? Math.min(...d20s) : Math.max(...d20s);
  const crit = kept === 20 ? 'success' : kept === 1 ? 'fail' : undefined;
  return { total: kept + modifier, d20s, kept, modifier, crit };
}

// Классика создания персонажа: 4d6, отбрасываем меньшую
export function rollAbilityScore(): { rolls: number[]; dropped: number; total: number } {
  const rolls = rollDice(4, 6);
  const sorted = [...rolls].sort((a, b) => a - b);
  const dropped = sorted[0];
  const total = sorted[1] + sorted[2] + sorted[3];
  return { rolls, dropped, total };
}

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

export function formatModifier(value: number): string {
  return value >= 0 ? `+${value}` : `−${Math.abs(value)}`;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
