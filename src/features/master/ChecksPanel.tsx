import { useState } from 'react';
import type { Ability, SkillId } from '../../model/types';
import { useStore } from '../../store/store';
import { ABILITIES, ABILITY_NAMES, SKILLS } from '../../data/core';
import { derive } from '../../engine/derive';
import { d20Roll, formatModifier } from '../../engine/dice';
import type { RollMode } from '../../engine/dice';
import { checkRoll } from '../../engine/rolling';
import { sfx } from '../../audio/sound';

type CheckKind = 'skill' | 'save' | 'ability';

const DC_PRESETS: { dc: number; label: string }[] = [
  { dc: 5, label: 'Очень легко' },
  { dc: 10, label: 'Легко' },
  { dc: 15, label: 'Средне' },
  { dc: 20, label: 'Сложно' },
  { dc: 25, label: 'Очень сложно' },
  { dc: 30, label: 'Почти невозможно' },
];

interface GroupResult {
  name: string;
  icon: string;
  kept: number;
  total: number;
  success: boolean;
  crit?: 'success' | 'fail';
}

export function ChecksPanel() {
  const characters = useStore((s) => s.characters);
  const pushRoll = useStore((s) => s.pushRoll);

  const [selected, setSelected] = useState<string[]>([]);
  const [kind, setKind] = useState<CheckKind>('skill');
  const [skillId, setSkillId] = useState<SkillId>('perception');
  const [ability, setAbility] = useState<Ability>('dex');
  const [dc, setDc] = useState(15);
  const [mode, setMode] = useState<RollMode>('normal');
  const [results, setResults] = useState<GroupResult[] | null>(null);

  const toggleChar = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const label = kind === 'skill'
    ? `Проверка: ${SKILLS.find((s) => s.id === skillId)?.name}`
    : kind === 'save'
      ? `Спасбросок: ${ABILITY_NAMES[ability]}`
      : `Проверка: ${ABILITY_NAMES[ability]}`;

  const modifierFor = (charId: string): number => {
    const char = characters.find((c) => c.id === charId);
    if (!char) {
      return 0;
    }
    const stats = derive(char);
    if (kind === 'skill') {
      return stats.skills.find((s) => s.id === skillId)?.bonus ?? 0;
    }
    if (kind === 'save') {
      return stats.saves.find((s) => s.ability === ability)?.bonus ?? 0;
    }
    return stats.mods[ability];
  };

  const run = () => {
    const ids = selected.length > 0 ? selected : characters.map((c) => c.id);
    if (ids.length === 0) {
      return;
    }
    if (ids.length === 1) {
      const char = characters.find((c) => c.id === ids[0])!;
      checkRoll({ label, modifier: modifierFor(char.id), mode, who: char.name, dc });
      setResults(null);
      return;
    }
    sfx.dice();
    const group: GroupResult[] = ids.map((id) => {
      const char = characters.find((c) => c.id === id)!;
      const modifier = modifierFor(id);
      const roll = d20Roll(modifier, mode);
      const success = roll.crit === 'success' ? true : roll.crit === 'fail' ? false : roll.total >= dc;
      pushRoll({
        who: char.name,
        label,
        rolls: [{ die: 20, results: roll.d20s, kept: [roll.kept] }],
        modifier,
        total: roll.total,
        crit: roll.crit,
        dc,
        success,
      });
      return {
        name: char.name,
        icon: char.portrait.icon,
        kept: roll.kept,
        total: roll.total,
        success,
        crit: roll.crit,
      };
    });
    setResults(group);
  };

  return (
    <div className="col" style={{ gap: 16 }}>
      <section className="panel">
        <div className="section-title">Мастер объявляет проверку</div>

        <div className="col" style={{ gap: 12 }}>
          <div className="row-wrap" style={{ gap: 7 }}>
            <span className="muted small">Кто проходит:</span>
            {characters.map((c) => (
              <button
                key={c.id}
                className={`chip chip-clickable${selected.includes(c.id) || selected.length === 0 ? ' chip-active' : ''}`}
                onClick={() => toggleChar(c.id)}
              >
                {c.portrait.icon} {c.name}
              </button>
            ))}
            {characters.length === 0 && <span className="muted small">Сначала создайте героев.</span>}
            {selected.length === 0 && characters.length > 0 && <span className="faint small">(все)</span>}
          </div>

          <div className="row-wrap" style={{ gap: 10 }}>
            <select value={kind} onChange={(e) => setKind(e.target.value as CheckKind)}>
              <option value="skill">Проверка навыка</option>
              <option value="ability">Проверка характеристики</option>
              <option value="save">Спасбросок</option>
            </select>
            {kind === 'skill' ? (
              <select value={skillId} onChange={(e) => setSkillId(e.target.value as SkillId)}>
                {SKILLS.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            ) : (
              <select value={ability} onChange={(e) => setAbility(e.target.value as Ability)}>
                {ABILITIES.map((a) => (
                  <option key={a} value={a}>{ABILITY_NAMES[a]}</option>
                ))}
              </select>
            )}
            <div className="row" style={{ gap: 6 }}>
              {(['normal', 'adv', 'dis'] as const).map((m) => (
                <button
                  key={m}
                  className={`chip chip-clickable${mode === m ? ' chip-active' : ''}`}
                  onClick={() => setMode(m)}
                >
                  {m === 'normal' ? 'Обычно' : m === 'adv' ? '⏫' : '⏬'}
                </button>
              ))}
            </div>
          </div>

          <div className="row-wrap" style={{ gap: 7 }}>
            <span className="muted small">Сложность (СЛ):</span>
            {DC_PRESETS.map((preset) => (
              <button
                key={preset.dc}
                className={`chip chip-clickable${dc === preset.dc ? ' chip-active' : ''}`}
                title={preset.label}
                onClick={() => setDc(preset.dc)}
              >
                {preset.dc} · {preset.label}
              </button>
            ))}
            <input
              className="num-input"
              type="number"
              min={1}
              max={40}
              value={dc}
              onChange={(e) => setDc(Math.max(1, Number(e.target.value) || 10))}
            />
          </div>

          <div>
            <button className="btn btn-primary btn-lg" onClick={run} disabled={characters.length === 0}>
              🎲 Провести проверку!
            </button>
          </div>
        </div>
      </section>

      {results && (
        <section className="panel panel-ornate">
          <div className="section-title">{label} · СЛ {dc}</div>
          <div className="col" style={{ gap: 8 }}>
            {results.map((r, i) => (
              <div key={i} className={`row spread float-in float-in-${Math.min(4, i + 1)}`} style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.2)' }}>
                <span>{r.icon} <b>{r.name}</b></span>
                <span className="row" style={{ gap: 10 }}>
                  <span className="small muted">d20: {r.kept}</span>
                  <b style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: r.crit === 'success' ? 'var(--gold-bright)' : r.crit === 'fail' ? 'var(--danger)' : 'var(--parchment)' }}>
                    {r.total}
                  </b>
                  <b style={{ color: r.success ? 'var(--success)' : 'var(--danger)', minWidth: 74, textAlign: 'right' }}>
                    {r.success ? '✓ успех' : '✗ провал'}
                  </b>
                </span>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div className="center" style={{ fontFamily: 'var(--font-display)', fontSize: 19 }}>
            Справились {results.filter((r) => r.success).length} из {results.length}
          </div>
        </section>
      )}
    </div>
  );
}
