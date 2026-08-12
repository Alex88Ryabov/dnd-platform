import { useEffect, useState } from 'react';
import type { DieRoll } from '../model/types';
import { formatModifier } from '../engine/dice';
import { useT } from '../i18n/tr';
import { T_DICE } from '../i18n/ui/dice';
import { sfx } from '../audio/sound';

export interface RollDisplay {
  label: string;
  who?: string;
  kind: 'd20' | 'formula';
  d20s?: number[];
  kept?: number;
  detail?: DieRoll[];
  modifier: number;
  total: number;
  crit?: 'success' | 'fail';
  dc?: number;
  success?: boolean;
}

let trigger: ((roll: RollDisplay) => void) | null = null;

export function showRoll(roll: RollDisplay) {
  sfx.dice();
  trigger?.(roll);
}

const D20_FACE = (
  <svg viewBox="0 0 100 100" width="120" height="120" fill="none">
    <defs>
      <linearGradient id="ro-face" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#2c2352" />
        <stop offset="1" stopColor="#161028" />
      </linearGradient>
    </defs>
    <polygon
      points="50,3 91,26 91,74 50,97 9,74 9,26"
      fill="url(#ro-face)"
      stroke="#d4a94e"
      strokeWidth="3"
    />
    <polygon points="50,17 76,32 76,64 50,81 24,64 24,32" fill="none" stroke="#d4a94e" strokeWidth="1.2" strokeOpacity="0.5" />
  </svg>
);

export function RollOverlay() {
  const [roll, setRoll] = useState<RollDisplay | null>(null);
  const [phase, setPhase] = useState<'rolling' | 'result'>('rolling');
  const t = useT();

  useEffect(() => {
    trigger = (next) => {
      setRoll(next);
      setPhase('rolling');
    };
    return () => {
      trigger = null;
    };
  }, []);

  useEffect(() => {
    if (!roll) {
      return;
    }
    const toResult = setTimeout(() => {
      setPhase('result');
      if (roll.crit === 'success') {
        sfx.crit();
      } else if (roll.crit === 'fail') {
        sfx.fumble();
      }
    }, 900);
    const dismiss = setTimeout(() => setRoll(null), 4600);
    return () => {
      clearTimeout(toResult);
      clearTimeout(dismiss);
    };
  }, [roll]);

  if (!roll) {
    return null;
  }

  const verdict = roll.dc !== undefined && phase === 'result'
    ? roll.success
      ? { text: t(T_DICE.success), color: 'var(--success)' }
      : { text: t(T_DICE.fail), color: 'var(--danger)' }
    : null;

  return (
    <div
      className="modal-overlay"
      style={{ zIndex: 150, cursor: 'pointer' }}
      onMouseDown={() => setRoll(null)}
    >
      <div className="center" style={{ userSelect: 'none' }}>
        {roll.who && (
          <div className="script gold" style={{ fontSize: 24, marginBottom: 4 }}>{roll.who}</div>
        )}
        <div className="muted" style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 14 }}>
          {roll.label}
        </div>

        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div className={phase === 'rolling' ? 'rolling' : roll.crit === 'success' ? 'crit-success' : roll.crit === 'fail' ? 'crit-fail' : ''} style={{ display: 'inline-block', borderRadius: 24 }}>
            {D20_FACE}
            {phase === 'result' && (
              <div
                className="result-pop"
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: 44,
                  fontWeight: 700,
                  color: roll.crit === 'success' ? 'var(--gold-bright)' : roll.crit === 'fail' ? 'var(--danger)' : 'var(--parchment)',
                  textShadow: '0 2px 12px rgba(0,0,0,0.8)',
                }}
              >
                {roll.kind === 'd20' ? roll.kept : roll.total - roll.modifier}
              </div>
            )}
          </div>
        </div>

        {phase === 'result' && (
          <div className="float-in" style={{ marginTop: 10 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 46, fontWeight: 700, color: 'var(--parchment)' }}>
              {roll.total}
              {roll.modifier !== 0 && (
                <span className="muted" style={{ fontSize: 20, marginLeft: 10 }}>
                  ({roll.kind === 'd20' ? roll.kept : roll.total - roll.modifier} {formatModifier(roll.modifier)})
                </span>
              )}
            </div>
            {roll.kind === 'd20' && roll.d20s && roll.d20s.length > 1 && (
              <div className="small muted">
                {t(T_DICE.diceKept, { list: roll.d20s.join(t(T_DICE.and)), kept: roll.kept ?? '' })}
              </div>
            )}
            {roll.kind === 'formula' && roll.detail && (
              <div className="small muted">
                {roll.detail.map((d, i) => (
                  <span key={i} style={{ marginRight: 8 }}>
                    d{d.die}: [{d.results.join(', ')}]
                  </span>
                ))}
              </div>
            )}
            {roll.crit === 'success' && (
              <div className="gold glow-gold" style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700 }}>
                {t(T_DICE.critSuccess)}
              </div>
            )}
            {roll.crit === 'fail' && (
              <div style={{ color: 'var(--danger)', fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700 }}>
                {t(T_DICE.critFail)}
              </div>
            )}
            {verdict && (
              <div
                className="result-pop"
                style={{
                  marginTop: 6,
                  fontFamily: 'var(--font-display)',
                  fontSize: 30,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: verdict.color,
                }}
              >
                {verdict.text}
                <span className="muted" style={{ fontSize: 15, marginLeft: 8 }}>{t(T_DICE.dc, { dc: roll.dc ?? '' })}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
