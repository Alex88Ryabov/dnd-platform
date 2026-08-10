import { useState } from 'react';
import { useStore } from '../../store/store';
import { checkRoll, formulaRoll } from '../../engine/rolling';
import { rollAbilityScore } from '../../engine/dice';
import { showRoll } from '../../components/RollOverlay';
import { sfx } from '../../audio/sound';

const DICE = [4, 6, 8, 10, 12, 20, 100];

const DIE_SHAPES: Record<number, string> = {
  4: 'polygon(50% 0%, 100% 100%, 0% 100%)',
  6: 'none',
  8: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  10: 'polygon(50% 0%, 95% 40%, 78% 100%, 22% 100%, 5% 40%)',
  12: 'polygon(50% 0%, 90% 25%, 100% 65%, 75% 100%, 25% 100%, 0% 65%, 10% 25%)',
  20: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
  100: 'polygon(50% 0%, 95% 40%, 78% 100%, 22% 100%, 5% 40%)',
};

export function DiceView() {
  const rollLog = useStore((s) => s.rollLog);
  const clearRollLog = useStore((s) => s.clearRollLog);
  const [pool, setPool] = useState<Record<number, number>>({});
  const [modifier, setModifier] = useState(0);
  const [mode, setMode] = useState<'normal' | 'adv' | 'dis'>('normal');
  const [customFormula, setCustomFormula] = useState('');

  const poolEntries = DICE.filter((d) => (pool[d] ?? 0) > 0).map((d) => ({ die: d, count: pool[d] }));
  const poolEmpty = poolEntries.length === 0;
  const singleD20 = poolEntries.length === 1 && poolEntries[0].die === 20 && poolEntries[0].count === 1;

  const addDie = (die: number) => {
    sfx.click();
    setPool((p) => ({ ...p, [die]: Math.min(20, (p[die] ?? 0) + 1) }));
  };

  const removeDie = (die: number) => {
    setPool((p) => ({ ...p, [die]: Math.max(0, (p[die] ?? 0) - 1) }));
  };

  const doRoll = () => {
    if (poolEmpty) {
      return;
    }
    if (singleD20) {
      checkRoll({ label: 'Бросок d20', modifier, mode });
    } else {
      const formula = poolEntries.map((e) => `${e.count}d${e.die}`).join('+')
        + (modifier !== 0 ? (modifier > 0 ? `+${modifier}` : `${modifier}`) : '');
      formulaRoll({ label: 'Бросок', formula });
    }
  };

  const rollStat = () => {
    const r = rollAbilityScore();
    sfx.dice();
    showRoll({
      label: `Характеристика: 4d6, без меньшей (${r.rolls.join(', ')} → убрана ${r.dropped})`,
      kind: 'formula',
      detail: [{ die: 6, results: r.rolls }],
      modifier: 0,
      total: r.total,
    });
    useStore.getState().pushRoll({
      label: `4d6 без меньшей [${r.rolls.join(', ')}]`,
      rolls: [{ die: 6, results: r.rolls }],
      modifier: 0,
      total: r.total,
    });
  };

  const rollCustom = () => {
    if (!customFormula.trim()) {
      return;
    }
    const ok = formulaRoll({ label: 'Своя формула', formula: customFormula.trim() });
    if (!ok) {
      sfx.fumble();
    }
  };

  return (
    <div className="col" style={{ gap: 18 }}>
      <h1 style={{ fontSize: 34 }}>Броски кубиков</h1>

      <section className="panel panel-ornate">
        <div className="section-title">Выберите кости</div>
        <div className="row-wrap" style={{ gap: 14, justifyContent: 'center', padding: '6px 0 14px' }}>
          {DICE.map((die) => (
            <div key={die} className="center">
              <button
                className="die-shape"
                onClick={() => addDie(die)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  removeDie(die);
                }}
                title={`Добавить d${die} (правый клик — убрать)`}
                style={{
                  width: 74,
                  height: 74,
                  clipPath: DIE_SHAPES[die] === 'none' ? undefined : DIE_SHAPES[die],
                  borderRadius: die === 6 ? 14 : 4,
                  background: (pool[die] ?? 0) > 0
                    ? 'linear-gradient(160deg, var(--gold-bright), var(--gold-dim))'
                    : 'linear-gradient(160deg, var(--bg-raise), var(--bg-panel))',
                  border: '1px solid var(--border-strong)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 19,
                  color: (pool[die] ?? 0) > 0 ? '#241a08' : 'var(--parchment)',
                }}
              >
                d{die}
              </button>
              <div className="small" style={{ marginTop: 5, height: 18 }}>
                {(pool[die] ?? 0) > 0 && (
                  <span className="chip chip-active">×{pool[die]}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="row-wrap" style={{ gap: 14, justifyContent: 'center', alignItems: 'center' }}>
          <div className="row" style={{ gap: 6 }}>
            <span className="muted small">Модификатор</span>
            <button className="icon-btn" onClick={() => setModifier((m) => m - 1)}>−</button>
            <b style={{ fontFamily: 'var(--font-display)', fontSize: 20, minWidth: 34, textAlign: 'center' }}>
              {modifier >= 0 ? `+${modifier}` : modifier}
            </b>
            <button className="icon-btn" onClick={() => setModifier((m) => m + 1)}>+</button>
          </div>

          {singleD20 && (
            <div className="row" style={{ gap: 6 }}>
              {(['normal', 'adv', 'dis'] as const).map((m) => (
                <button
                  key={m}
                  className={`chip chip-clickable${mode === m ? ' chip-active' : ''}`}
                  onClick={() => setMode(m)}
                >
                  {m === 'normal' ? 'Обычный' : m === 'adv' ? '⏫ Преимущество' : '⏬ Помеха'}
                </button>
              ))}
            </div>
          )}

          <button className="btn btn-primary btn-lg pulse-ready" onClick={doRoll} disabled={poolEmpty}>
            🎲 БРОСИТЬ!
          </button>
          {!poolEmpty && (
            <button className="btn btn-ghost btn-sm" onClick={() => setPool({})}>
              Сбросить набор
            </button>
          )}
        </div>
      </section>

      <div className="grid-2">
        <section className="panel">
          <div className="section-title">Быстрые броски</div>
          <div className="row-wrap" style={{ gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => checkRoll({ label: 'Бросок d20', modifier: 0 })}>d20</button>
            <button className="btn btn-ghost btn-sm" onClick={() => checkRoll({ label: 'd20 с преимуществом', modifier: 0, mode: 'adv' })}>⏫ Преимущество</button>
            <button className="btn btn-ghost btn-sm" onClick={() => checkRoll({ label: 'd20 с помехой', modifier: 0, mode: 'dis' })}>⏬ Помеха</button>
            <button className="btn btn-ghost btn-sm" onClick={() => formulaRoll({ label: 'Урон', formula: '2d6' })}>2d6</button>
            <button className="btn btn-ghost btn-sm" onClick={() => formulaRoll({ label: 'Урон', formula: '1d8+3' })}>1d8+3</button>
            <button className="btn btn-ghost btn-sm" onClick={rollStat}>4d6 без меньшей</button>
          </div>
          <div className="divider" />
          <div className="row" style={{ gap: 8 }}>
            <input
              className="grow"
              placeholder="Своя формула: 3d6+2, 1d20+5, 8d6…"
              value={customFormula}
              onChange={(e) => setCustomFormula(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  rollCustom();
                }
              }}
            />
            <button className="btn btn-primary btn-sm" onClick={rollCustom}>Бросить</button>
          </div>
        </section>

        <section className="panel">
          <div className="row spread">
            <div className="section-title" style={{ marginBottom: 0 }}>История бросков</div>
            {rollLog.length > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={clearRollLog}>Очистить</button>
            )}
          </div>
          <div className="col" style={{ gap: 6, marginTop: 10, maxHeight: 420, overflowY: 'auto' }}>
            {rollLog.length === 0 && <div className="muted small">Пока тихо. Бросьте что-нибудь!</div>}
            {rollLog.map((roll) => (
              <div key={roll.id} className="row spread" style={{ padding: '5px 8px', borderRadius: 8, background: 'rgba(0,0,0,0.18)' }}>
                <div className="small grow" style={{ minWidth: 0 }}>
                  <div className="muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {roll.who && <span className="gold">{roll.who} · </span>}
                    {roll.label}
                  </div>
                  <div className="faint" style={{ fontSize: 12 }}>
                    {roll.rolls.map((r) => `d${r.die}[${r.results.join(',')}]`).join(' ')}
                    {roll.modifier !== 0 ? ` ${roll.modifier > 0 ? '+' : ''}${roll.modifier}` : ''}
                    {' · '}{new Date(roll.ts).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <b
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 21,
                    color: roll.crit === 'success' ? 'var(--gold-bright)' : roll.crit === 'fail' ? 'var(--danger)' : 'var(--parchment)',
                  }}
                >
                  {roll.total}
                </b>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
