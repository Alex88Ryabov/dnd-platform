import { useState } from 'react';
import type { Ability, SkillId } from '../../model/types';
import { useStore } from '../../store/store';
import { ABILITIES, SKILLS } from '../../data/core';
import { useRules } from '../../i18n/rules';
import { useT } from '../../i18n/tr';
import type { Tri } from '../../i18n/tr';
import { T_MASTER } from '../../i18n/ui/master';
import { T_SHEET } from '../../i18n/ui/sheet';
import { T_DICE } from '../../i18n/ui/dice';
import { derive } from '../../engine/derive';
import { d20Roll } from '../../engine/dice';
import type { RollMode } from '../../engine/dice';
import { checkRoll } from '../../engine/rolling';
import { NumberField } from '../../components/NumberField';
import { sfx } from '../../audio/sound';

type CheckKind = 'skill' | 'save' | 'ability';

const DC_PRESETS: { dc: number; label: Tri }[] = [
  { dc: 5, label: T_MASTER.dc5 },
  { dc: 10, label: T_MASTER.dc10 },
  { dc: 15, label: T_MASTER.dc15 },
  { dc: 20, label: T_MASTER.dc20 },
  { dc: 25, label: T_MASTER.dc25 },
  { dc: 30, label: T_MASTER.dc30 },
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
  const t = useT();
  const { abilityNames, skillNames } = useRules();

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
    ? t(T_SHEET.checkLabel, { name: skillNames[skillId] })
    : kind === 'save'
      ? t(T_SHEET.saveLabel, { name: abilityNames[ability] })
      : t(T_SHEET.checkLabel, { name: abilityNames[ability] });

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
        <div className="section-title">{t(T_MASTER.checksTitle)}</div>

        <div className="col" style={{ gap: 12 }}>
          <div className="row-wrap" style={{ gap: 7 }}>
            <span className="muted small">{t(T_MASTER.whoRolls)}</span>
            {characters.map((c) => (
              <button
                key={c.id}
                className={`chip chip-clickable${selected.includes(c.id) || selected.length === 0 ? ' chip-active' : ''}`}
                onClick={() => toggleChar(c.id)}
              >
                {c.portrait.icon} {c.name}
              </button>
            ))}
            {characters.length === 0 && <span className="muted small">{t(T_MASTER.createFirst)}</span>}
            {selected.length === 0 && characters.length > 0 && <span className="faint small">{t(T_MASTER.allMark)}</span>}
          </div>

          <div className="row-wrap" style={{ gap: 10 }}>
            <select value={kind} onChange={(e) => setKind(e.target.value as CheckKind)}>
              <option value="skill">{t(T_MASTER.kindSkill)}</option>
              <option value="ability">{t(T_MASTER.kindAbility)}</option>
              <option value="save">{t(T_MASTER.kindSave)}</option>
            </select>
            {kind === 'skill' ? (
              <select value={skillId} onChange={(e) => setSkillId(e.target.value as SkillId)}>
                {SKILLS.map((s) => (
                  <option key={s.id} value={s.id}>{skillNames[s.id]}</option>
                ))}
              </select>
            ) : (
              <select value={ability} onChange={(e) => setAbility(e.target.value as Ability)}>
                {ABILITIES.map((a) => (
                  <option key={a} value={a}>{abilityNames[a]}</option>
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
                  {m === 'normal' ? t(T_MASTER.normal) : m === 'adv' ? '⏫' : '⏬'}
                </button>
              ))}
            </div>
          </div>

          <div className="row-wrap" style={{ gap: 7 }}>
            <span className="muted small">{t(T_MASTER.dcLabel)}</span>
            {DC_PRESETS.map((preset) => (
              <button
                key={preset.dc}
                className={`chip chip-clickable${dc === preset.dc ? ' chip-active' : ''}`}
                title={t(preset.label)}
                onClick={() => setDc(preset.dc)}
              >
                {preset.dc} · {t(preset.label)}
              </button>
            ))}
            <NumberField value={dc} onChange={setDc} min={1} max={40} width={52} />
          </div>

          <div>
            <button className="btn btn-primary btn-lg" onClick={run} disabled={characters.length === 0}>
              {t(T_MASTER.runCheck)}
            </button>
          </div>
        </div>
      </section>

      {results && (
        <section className="panel panel-ornate">
          <div className="section-title">{label} · {t(T_DICE.dc, { dc })}</div>
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
                    {r.success ? t(T_MASTER.passed) : t(T_MASTER.failed)}
                  </b>
                </span>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div className="center" style={{ fontFamily: 'var(--font-display)', fontSize: 19 }}>
            {t(T_MASTER.passedCount, { a: results.filter((r) => r.success).length, b: results.length })}
          </div>
        </section>
      )}
    </div>
  );
}
