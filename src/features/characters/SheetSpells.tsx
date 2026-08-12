import { useMemo, useState } from 'react';
import type { Character, SpellDef } from '../../model/types';
import type { DerivedStats } from '../../engine/derive';
import { useStore } from '../../store/store';
import { SCHOOL_ICONS } from '../../data/core';
import { useCatalog } from '../../i18n/catalog';
import { useLang } from '../../i18n/lang';
import { useRules } from '../../i18n/rules';
import { useT } from '../../i18n/tr';
import { T_SPELLS } from '../../i18n/ui/spells';
import { T_COMMON } from '../../i18n/ui/common';
import { checkRoll, formulaRoll } from '../../engine/rolling';
import { parseFormula } from '../../engine/dice';
import { Modal } from '../../components/Modal';
import { toast } from '../../components/Toasts';
import { sfx } from '../../audio/sound';

interface Props {
  character: Character;
  stats: DerivedStats;
}

// заговоры усиливаются на 5, 11 и 17 уровнях
function cantripMultiplier(level: number): number {
  if (level >= 17) {
    return 4;
  }
  if (level >= 11) {
    return 3;
  }
  if (level >= 5) {
    return 2;
  }
  return 1;
}

export function SheetSpells({ character, stats }: Props) {
  const updateCharacter = useStore((s) => s.updateCharacter);
  const [editingList, setEditingList] = useState(false);
  const [casting, setCasting] = useState<SpellDef | null>(null);
  const t = useT();
  const { spellsById } = useCatalog();
  const { abilityNames } = useRules();
  const spellcasting = stats.spellcasting!;

  const resolveSpell = (id: string): SpellDef | undefined => (
    spellsById[id] ?? character.spells.customSpells.find((s) => s.id === id)
  );

  const lang = useLang();
  const cantrips = character.spells.cantrips
    .map((id) => resolveSpell(id))
    .filter((s): s is SpellDef => Boolean(s));
  const prepared = character.spells.prepared
    .map((id) => resolveSpell(id))
    .filter((s): s is SpellDef => Boolean(s))
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name, lang));

  const spendSlot = (circle: number) => {
    updateCharacter(character.id, (c) => {
      const slotsUsed = [...c.spells.slotsUsed];
      slotsUsed[circle - 1] = Math.min(spellcasting.slotsMax[circle - 1], slotsUsed[circle - 1] + 1);
      return { ...c, spells: { ...c.spells, slotsUsed } };
    });
  };

  const doCast = (spell: SpellDef, circle: number | 'pact' | 'cantrip') => {
    if (circle === 'pact') {
      updateCharacter(character.id, (c) => ({
        ...c,
        spells: { ...c.spells, pactUsed: Math.min(spellcasting.pactSlots, c.spells.pactUsed + 1) },
      }));
    } else if (circle !== 'cantrip') {
      spendSlot(circle);
    }
    if (spell.concentration) {
      updateCharacter(character.id, (c) => ({ ...c, concentratingOn: spell.name }));
    }
    const effCircle = circle === 'pact' ? spellcasting.pactLevel : circle === 'cantrip' ? 0 : circle;
    if (spell.damage) {
      const parsed = parseFormula(spell.damage.dice);
      let formula = spell.damage.dice;
      if (parsed && circle === 'cantrip') {
        formula = parsed.specs.map((s) => `${s.count * cantripMultiplier(character.level)}d${s.die}`).join('+');
      } else if (parsed && typeof effCircle === 'number' && effCircle > spell.level && spell.level > 0) {
        // грубое усиление: +1 кость за круг выше базового (для большинства боевых заклинаний верно)
        const extra = effCircle - spell.level;
        formula = parsed.specs.map((s, i) => `${s.count + (i === 0 ? extra : 0)}d${s.die}`).join('+')
          + (parsed.modifier ? `+${parsed.modifier}` : '');
      }
      formulaRoll({ label: `${spell.name}`, formula, who: character.name });
    } else {
      sfx.click();
      toast(`✨ ${spell.name}`, spell.save
        ? t(T_SPELLS.saveVs, { ability: abilityNames[spell.save], dc: spellcasting.dc })
        : spell.description.slice(0, 120), SCHOOL_ICONS[spell.school]);
    }
    setCasting(null);
  };

  const circlesWithSlots = spellcasting.slotsMax
    .map((max, i) => ({ circle: i + 1, max, used: character.spells.slotsUsed[i] ?? 0 }))
    .filter((c) => c.max > 0);

  return (
    <div className="col" style={{ gap: 16 }}>
      <section className="panel">
        <div className="row-wrap spread">
          <div className="row-wrap" style={{ gap: 8 }}>
            <span className="chip chip-active">{t(T_SPELLS.dcChip, { n: spellcasting.dc })}</span>
            <button
              className="chip chip-clickable"
              title={t(T_SPELLS.attackHint)}
              onClick={() => checkRoll({ label: t(T_SPELLS.attackLabel), modifier: spellcasting.attackBonus, who: character.name })}
            >
              {t(T_SPELLS.attackChip, { n: spellcasting.attackBonus })}
            </button>
            <span className="chip">{abilityNames[spellcasting.ability]}</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setEditingList(true)}>
            {t(T_SPELLS.editList)}
          </button>
        </div>

        {(circlesWithSlots.length > 0 || spellcasting.pactSlots > 0) && <div className="divider" />}

        <div className="col" style={{ gap: 10 }}>
          {circlesWithSlots.map(({ circle, max, used }) => (
            <div key={circle} className="row" style={{ gap: 12 }}>
              <span className="small muted" style={{ width: 64 }}>{t(T_SPELLS.circleN, { n: circle })}</span>
              <div className="row-wrap" style={{ gap: 7 }}>
                {Array.from({ length: max }, (_, i) => (
                  <div
                    key={i}
                    className={`slot-orb${i < used ? ' spent' : ''}`}
                    title={i < used ? t(T_SPELLS.restoreSlot) : t(T_SPELLS.spendSlot)}
                    onClick={() => {
                      updateCharacter(character.id, (c) => {
                        const slotsUsed = [...c.spells.slotsUsed];
                        slotsUsed[circle - 1] = i < used ? used - 1 : used + 1;
                        return { ...c, spells: { ...c.spells, slotsUsed } };
                      });
                      sfx.click();
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
          {spellcasting.pactSlots > 0 && (
            <div className="row" style={{ gap: 12 }}>
              <span className="small muted" style={{ width: 64 }}>{t(T_SPELLS.pactSlots, { n: spellcasting.pactLevel })}</span>
              <div className="row-wrap" style={{ gap: 7 }}>
                {Array.from({ length: spellcasting.pactSlots }, (_, i) => (
                  <div
                    key={i}
                    className={`slot-orb${i < character.spells.pactUsed ? ' spent' : ''}`}
                    style={{ borderColor: 'var(--danger)', background: i < character.spells.pactUsed ? 'rgba(226,84,67,0.1)' : 'radial-gradient(circle at 32% 30%, #f2b0a5, var(--danger) 55%, #7c241a)' }}
                    onClick={() => {
                      updateCharacter(character.id, (c) => ({
                        ...c,
                        spells: { ...c.spells, pactUsed: i < c.spells.pactUsed ? c.spells.pactUsed - 1 : c.spells.pactUsed + 1 },
                      }));
                      sfx.click();
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {cantrips.length > 0 && (
        <section className="panel">
          <div className="section-title">{t(T_SPELLS.cantripsTitle)}</div>
          <SpellList spells={cantrips} onCast={(s) => doCast(s, 'cantrip')} />
        </section>
      )}

      <section className="panel">
        <div className="section-title">
          {t(T_SPELLS.preparedTitle, { a: prepared.length, b: spellcasting.preparedMax })}
        </div>
        {prepared.length === 0 ? (
          <div className="muted small">{t(T_SPELLS.noPrepared)}</div>
        ) : (
          <SpellList spells={prepared} onCast={(s) => setCasting(s)} />
        )}
      </section>

      {casting && (
        <Modal title={t(T_SPELLS.castWith, { name: casting.name })} onClose={() => setCasting(null)}>
          <div className="small muted" style={{ marginBottom: 12 }}>{casting.description}</div>
          <div className="row-wrap" style={{ gap: 8 }}>
            {circlesWithSlots
              .filter((c) => c.circle >= casting.level && c.used < c.max)
              .map((c) => (
                <button key={c.circle} className="btn btn-primary" onClick={() => doCast(casting, c.circle)}>
                  {t(T_SPELLS.circleBtn, { n: c.circle, m: c.max - c.used })}
                </button>
              ))}
            {spellcasting.pactSlots > 0 && character.spells.pactUsed < spellcasting.pactSlots && spellcasting.pactLevel >= casting.level && (
              <button className="btn btn-primary" onClick={() => doCast(casting, 'pact')}>
                {t(T_SPELLS.pactBtn, { n: spellcasting.pactSlots - character.spells.pactUsed })}
              </button>
            )}
            {casting.ritual && (
              <button className="btn btn-ghost" onClick={() => doCast(casting, 'cantrip')}>
                {t(T_SPELLS.ritualBtn)}
              </button>
            )}
          </div>
          {circlesWithSlots.every((c) => c.circle < casting.level || c.used >= c.max)
            && !(spellcasting.pactSlots > 0 && character.spells.pactUsed < spellcasting.pactSlots) && !casting.ritual && (
            <div className="small" style={{ color: 'var(--danger)', marginTop: 10 }}>
              {t(T_SPELLS.noSlots)}
            </div>
          )}
        </Modal>
      )}

      {editingList && (
        <EditSpellsModal character={character} stats={stats} onClose={() => setEditingList(false)} />
      )}
    </div>
  );
}

function SpellList({ spells, onCast }: { spells: SpellDef[]; onCast: (s: SpellDef) => void }) {
  const t = useT();
  const { schoolNames } = useRules();
  return (
    <div className="col" style={{ gap: 4 }}>
      {spells.map((spell) => (
        <details key={spell.id} style={{ borderBottom: '1px solid rgba(212,169,78,0.08)', padding: '6px 2px' }}>
          <summary className="row" style={{ gap: 10, cursor: 'pointer', listStyle: 'none' }}>
            <span style={{ fontSize: 17 }}>{SCHOOL_ICONS[spell.school]}</span>
            <span className="grow">
              <b style={{ color: 'var(--parchment)' }}>{spell.name}</b>
              <span className="small faint">
                {' '}· {spell.level === 0 ? t(T_SPELLS.cantrip) : t(T_SPELLS.circleShort, { n: spell.level })}
                {spell.concentration ? ` · ${t(T_SPELLS.conc)}` : ''}{spell.ritual ? ` · ${t(T_SPELLS.ritual)}` : ''}
              </span>
            </span>
            <button
              className="btn btn-ghost btn-sm"
              onClick={(e) => {
                e.preventDefault();
                onCast(spell);
              }}
            >
              ✨ {t(T_SPELLS.cast)}
            </button>
          </summary>
          <div className="small muted" style={{ padding: '8px 4px 4px 30px' }}>
            <div className="row-wrap" style={{ gap: 6, marginBottom: 6 }}>
              <span className="chip">{schoolNames[spell.school]}</span>
              <span className="chip">{spell.castingTime}</span>
              <span className="chip">{spell.range}</span>
              <span className="chip">{spell.duration}</span>
              <span className="chip">{spell.components}</span>
            </div>
            {spell.description}
            {spell.higherLevels && (
              <div style={{ marginTop: 5 }}><span className="gold">{t(T_SPELLS.higher)}</span> {spell.higherLevels}</div>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}

function EditSpellsModal({ character, stats, onClose }: { character: Character; stats: DerivedStats; onClose: () => void }) {
  const updateCharacter = useStore((s) => s.updateCharacter);
  const spellcasting = stats.spellcasting!;
  const [customName, setCustomName] = useState('');
  const [customLevel, setCustomLevel] = useState(1);
  const [customDesc, setCustomDesc] = useState('');
  const lang = useLang();
  const t = useT();
  const { spells } = useCatalog();

  const available = useMemo(() => {
    const list = spells.filter((s) => s.classes.includes(character.classId));
    const custom = character.spells.customSpells;
    return {
      cantripList: [...list.filter((s) => s.level === 0), ...custom.filter((s) => s.level === 0)],
      leveled: [...list.filter((s) => s.level > 0), ...custom.filter((s) => s.level > 0)]
        .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name, lang)),
    };
  }, [character.classId, character.spells.customSpells, spells, lang]);

  const maxCircle = Math.max(
    spellcasting.pactLevel,
    ...spellcasting.slotsMax.map((m, i) => (m > 0 ? i + 1 : 0)),
  );

  const toggle = (listKey: 'cantrips' | 'prepared', id: string, limit: number) => {
    updateCharacter(character.id, (c) => {
      const list = c.spells[listKey];
      const has = list.includes(id);
      if (!has && list.length >= limit) {
        return c;
      }
      return {
        ...c,
        spells: {
          ...c.spells,
          [listKey]: has ? list.filter((x) => x !== id) : [...list, id],
        },
      };
    });
  };

  const addCustom = () => {
    if (!customName.trim()) {
      return;
    }
    const spell: SpellDef = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      nameEn: '',
      level: customLevel as SpellDef['level'],
      school: 'evocation',
      castingTime: 'Действие',
      range: '—',
      components: '—',
      duration: '—',
      classes: [character.classId],
      description: customDesc.trim() || t(T_SPELLS.homebrewSpell),
    };
    updateCharacter(character.id, (c) => ({
      ...c,
      spells: {
        ...c.spells,
        customSpells: [...c.spells.customSpells, spell],
        ...(customLevel === 0
          ? { cantrips: [...c.spells.cantrips, spell.id] }
          : { prepared: [...c.spells.prepared, spell.id] }),
      },
    }));
    setCustomName('');
    setCustomDesc('');
    toast(t(T_SPELLS.spellAdded), spell.name, '📜');
  };

  return (
    <Modal title={t(T_SPELLS.listTitle)} onClose={onClose} wide>
      {spellcasting.cantripsMax > 0 && (
        <>
          <div className="section-title">
            {t(T_SPELLS.cantripsCount, { a: character.spells.cantrips.length, b: spellcasting.cantripsMax })}
          </div>
          <div className="col" style={{ gap: 5, maxHeight: 200, overflowY: 'auto', marginBottom: 16, paddingRight: 6 }}>
            {available.cantripList.map((spell) => (
              <label key={spell.id} className="row" style={{ gap: 8, cursor: 'pointer', alignItems: 'flex-start' }}>
                <input
                  type="checkbox"
                  checked={character.spells.cantrips.includes(spell.id)}
                  style={{ marginTop: 4 }}
                  onChange={() => toggle('cantrips', spell.id, spellcasting.cantripsMax)}
                />
                <span>
                  {SCHOOL_ICONS[spell.school]} <b>{spell.name}</b>{' '}
                  <span className="small muted">{spell.description}</span>
                </span>
              </label>
            ))}
          </div>
        </>
      )}

      <div className="section-title">
        {t(T_SPELLS.preparedCount, { a: character.spells.prepared.length, b: spellcasting.preparedMax })}
      </div>
      <div className="col" style={{ gap: 5, maxHeight: 300, overflowY: 'auto', paddingRight: 6 }}>
        {available.leveled.filter((s) => s.level <= Math.max(1, maxCircle)).map((spell) => (
          <label key={spell.id} className="row" style={{ gap: 8, cursor: 'pointer', alignItems: 'flex-start' }}>
            <input
              type="checkbox"
              checked={character.spells.prepared.includes(spell.id)}
              style={{ marginTop: 4 }}
              onChange={() => toggle('prepared', spell.id, spellcasting.preparedMax)}
            />
            <span>
              <span className="chip" style={{ marginRight: 6 }}>{spell.level}</span>
              {SCHOOL_ICONS[spell.school]} <b>{spell.name}</b>{' '}
              <span className="small muted">{spell.description.slice(0, 110)}{spell.description.length > 110 ? '…' : ''}</span>
            </span>
          </label>
        ))}
      </div>

      <div className="divider" />
      <div className="section-title">{t(T_SPELLS.customSpell)}</div>
      <div className="row-wrap" style={{ gap: 8 }}>
        <input placeholder={t(T_COMMON.name)} value={customName} onChange={(e) => setCustomName(e.target.value)} style={{ width: 200 }} />
        <select value={customLevel} onChange={(e) => setCustomLevel(Number(e.target.value))}>
          <option value={0}>{t(T_SPELLS.cantripOpt)}</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((l) => (
            <option key={l} value={l}>{t(T_SPELLS.circleOpt, { n: l })}</option>
          ))}
        </select>
        <input placeholder={t(T_SPELLS.shortDescPh)} value={customDesc} onChange={(e) => setCustomDesc(e.target.value)} className="grow" style={{ minWidth: 180 }} />
        <button className="btn btn-ghost btn-sm" onClick={addCustom}>{t(T_SPELLS.addBtn)}</button>
      </div>
    </Modal>
  );
}
