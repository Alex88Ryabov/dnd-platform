import type { RollMode } from './dice';
import { d20Roll, rollFormula } from './dice';
import { useStore } from '../store/store';
import { showRoll } from '../components/RollOverlay';

export interface CheckOptions {
  label: string;
  modifier: number;
  mode?: RollMode;
  who?: string;
  dc?: number;
}

// Единая точка d20-бросков: бросок + журнал + красивый оверлей
export function checkRoll(opts: CheckOptions) {
  const result = d20Roll(opts.modifier, opts.mode ?? 'normal');
  // правило 2024: чистая 20 — всегда успех, чистая 1 — всегда провал
  const success = opts.dc === undefined
    ? undefined
    : result.crit === 'success'
      ? true
      : result.crit === 'fail'
        ? false
        : result.total >= opts.dc;

  useStore.getState().pushRoll({
    who: opts.who,
    label: opts.label,
    rolls: [{ die: 20, results: result.d20s, kept: [result.kept] }],
    modifier: opts.modifier,
    total: result.total,
    crit: result.crit,
    dc: opts.dc,
    success,
  });

  showRoll({
    label: opts.label,
    who: opts.who,
    kind: 'd20',
    d20s: result.d20s,
    kept: result.kept,
    modifier: opts.modifier,
    total: result.total,
    crit: result.crit,
    dc: opts.dc,
    success,
  });

  return { ...result, success };
}

export interface FormulaOptions {
  label: string;
  formula: string;
  who?: string;
}

export function formulaRoll(opts: FormulaOptions) {
  const result = rollFormula(opts.formula);
  if (!result) {
    return null;
  }
  useStore.getState().pushRoll({
    who: opts.who,
    label: `${opts.label} (${opts.formula})`,
    rolls: result.detail,
    modifier: result.modifier,
    total: result.total,
  });
  showRoll({
    label: `${opts.label} — ${opts.formula}`,
    who: opts.who,
    kind: 'formula',
    detail: result.detail,
    modifier: result.modifier,
    total: result.total,
  });
  return result;
}
