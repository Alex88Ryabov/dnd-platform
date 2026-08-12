import { useState } from 'react';
import type { Character, ConditionId, DamageType, WeaponMastery } from '../../model/types';
import type { DerivedStats } from '../../engine/derive';
import { useStore } from '../../store/store';
import { checkRoll, formulaRoll } from '../../engine/rolling';
import { parseFormula } from '../../engine/dice';
import { useLang } from '../../i18n/lang';
import { useRules } from '../../i18n/rules';
import { useT } from '../../i18n/tr';
import { fmtDistance } from '../../i18n/units';
import { T_SHEET } from '../../i18n/ui/sheet';
import { Modal } from '../../components/Modal';
import { NumberField } from '../../components/NumberField';
import { toast } from '../../components/Toasts';
import { sfx } from '../../audio/sound';

interface Props {
  character: Character;
  stats: DerivedStats;
  onHpFlash: (kind: 'damage' | 'heal') => void;
}

export function SheetCombat({ character, stats, onHpFlash }: Props) {
  const updateCharacter = useStore((s) => s.updateCharacter);
  const [amount, setAmount] = useState(1);
  const [pickingConditions, setPickingConditions] = useState(false);
  const lang = useLang();
  const t = useT();
  const { conditions, damageTypes, masteryInfo, rechargeNames } = useRules();

  const applyDamage = () => {
    updateCharacter(character.id, (c) => {
      const fromTemp = Math.min(c.hpTemp, amount);
      const rest = amount - fromTemp;
      return { ...c, hpTemp: c.hpTemp - fromTemp, hpCurrent: Math.max(0, c.hpCurrent - rest) };
    });
    sfx.damage();
    onHpFlash('damage');
  };

  const applyHeal = () => {
    updateCharacter(character.id, (c) => ({
      ...c,
      hpCurrent: Math.min(stats.hpMax, c.hpCurrent + amount),
      deathSaves: { successes: 0, failures: 0 },
    }));
    sfx.heal();
    onHpFlash('heal');
  };

  const applyTemp = () => {
    updateCharacter(character.id, (c) => ({ ...c, hpTemp: Math.max(c.hpTemp, amount) }));
    sfx.heal();
  };

  const rollDeathSave = () => {
    const result = checkRoll({ label: t(T_SHEET.deathSaveLabel), modifier: 0, who: character.name, dc: 10 });
    updateCharacter(character.id, (c) => {
      let { successes, failures } = c.deathSaves;
      let hp = c.hpCurrent;
      if (result.kept === 20) {
        hp = 1;
        successes = 0;
        failures = 0;
        toast(t(T_SHEET.miracle), t(T_SHEET.miracleText), '✨');
      } else if (result.kept === 1) {
        failures += 2;
      } else if (result.total >= 10) {
        successes += 1;
      } else {
        failures += 1;
      }
      if (successes >= 3) {
        toast(t(T_SHEET.stable), t(T_SHEET.stableText), '💚');
      }
      if (failures >= 3) {
        toast(t(T_SHEET.heroFell), t(T_SHEET.heroFellText), '🖤');
      }
      return { ...c, hpCurrent: hp, deathSaves: { successes: Math.min(3, successes), failures: Math.min(3, failures) } };
    });
  };

  const toggleCondition = (id: ConditionId) => {
    updateCharacter(character.id, (c) => ({
      ...c,
      conditions: c.conditions.includes(id)
        ? c.conditions.filter((x) => x !== id)
        : [...c.conditions, id],
    }));
  };

  const spendResource = (key: string, used: number) => {
    updateCharacter(character.id, (c) => {
      const isCustom = c.customResources.some((r) => r.key === key);
      if (isCustom) {
        return {
          ...c,
          customResources: c.customResources.map((r) => (r.key === key ? { ...r, used } : r)),
        };
      }
      const existing = c.resources.find((r) => r.key === key);
      return {
        ...c,
        resources: existing
          ? c.resources.map((r) => (r.key === key ? { ...r, used } : r))
          : [...c.resources, { key, used }],
      };
    });
  };

  const dying = character.hpCurrent === 0;

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="grid-2">
        <section className="panel">
          <div className="section-title">{t(T_SHEET.hpTitle)}</div>
          <div className="row-wrap" style={{ gap: 8 }}>
            <NumberField value={amount} onChange={setAmount} min={1} />
            <button className="btn btn-danger btn-sm" onClick={applyDamage}>{t(T_SHEET.damageBtn)}</button>
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--success)', borderColor: 'rgba(111,191,99,0.4)' }} onClick={applyHeal}>{t(T_SHEET.healBtn)}</button>
            <button className="btn btn-ghost btn-sm" style={{ color: '#9fd7f2', borderColor: 'rgba(90,167,214,0.4)' }} onClick={applyTemp}>{t(T_SHEET.tempBtn)}</button>
          </div>

          {dying && (
            <div className="panel" style={{ marginTop: 12, padding: 14, borderColor: 'rgba(226,84,67,0.5)', background: 'rgba(226,84,67,0.07)' }}>
              <div className="row-wrap spread" style={{ gap: 8 }}>
                <b style={{ color: 'var(--danger)' }}>{t(T_SHEET.dying)}</b>
                <button className="btn btn-primary btn-sm" onClick={rollDeathSave}>{t(T_SHEET.deathSaveLabel)}</button>
              </div>
              <div className="row" style={{ gap: 18, marginTop: 10 }}>
                <div className="row" style={{ gap: 5 }}>
                  <span className="small muted">{t(T_SHEET.successes)}</span>
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{ fontSize: 18 }}>{i < character.deathSaves.successes ? '💚' : '⚪'}</span>
                  ))}
                </div>
                <div className="row" style={{ gap: 5 }}>
                  <span className="small muted">{t(T_SHEET.failures)}</span>
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{ fontSize: 18 }}>{i < character.deathSaves.failures ? '💔' : '⚪'}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="divider" />

          <div className="row-wrap" style={{ gap: 8 }}>
            <span className="small muted">{t(T_SHEET.hitDice, { a: stats.hitDiceAvailable, b: stats.hitDiceTotal, die: stats.hitDie })}</span>
            <span className="small muted">·</span>
            <span className="small muted">{t(T_SHEET.exhaustion)}</span>
            <div className="row" style={{ gap: 4 }}>
              <button className="icon-btn" style={{ width: 26, height: 26 }} onClick={() => updateCharacter(character.id, (c) => ({ ...c, exhaustion: Math.max(0, c.exhaustion - 1) }))}>−</button>
              <b style={{ color: character.exhaustion > 0 ? 'var(--danger)' : 'var(--ink-muted)' }}>{character.exhaustion}</b>
              <button className="icon-btn" style={{ width: 26, height: 26 }} onClick={() => updateCharacter(character.id, (c) => ({ ...c, exhaustion: Math.min(6, c.exhaustion + 1) }))}>+</button>
            </div>
            {character.exhaustion > 0 && (
              <span className="small" style={{ color: 'var(--danger)' }}>
                {t(T_SHEET.exhaustionPenalty, { n: character.exhaustion * 2, dist: fmtDistance(character.exhaustion * 5, lang) })}
              </span>
            )}
          </div>

          <div className="divider" />

          <div className="row-wrap" style={{ gap: 6 }}>
            {character.conditions.map((id) => (
              <button
                key={id}
                className="chip chip-active chip-clickable"
                title={conditions[id].description}
                onClick={() => toggleCondition(id)}
              >
                {conditions[id].icon} {conditions[id].name} ✕
              </button>
            ))}
            <button className="chip chip-clickable" onClick={() => setPickingConditions(true)}>
              {t(T_SHEET.addCondition)}
            </button>
            {character.concentratingOn && (
              <button
                className="chip chip-active chip-clickable"
                style={{ borderColor: 'var(--magic)', color: '#cdb5f5' }}
                title={t(T_SHEET.concentrationHint)}
                onClick={() => updateCharacter(character.id, (c) => ({ ...c, concentratingOn: undefined }))}
              >
                {t(T_SHEET.concentration, { s: character.concentratingOn })} ✕
              </button>
            )}
          </div>
        </section>

        <section className="panel">
          <div className="section-title">{t(T_SHEET.resources)}</div>
          {stats.resources.length === 0 ? (
            <div className="muted small">{t(T_SHEET.noResources)}</div>
          ) : (
            <div className="col" style={{ gap: 12 }}>
              {stats.resources.map((res) => (
                <div key={res.key}>
                  <div className="row spread">
                    <b>{res.name}</b>
                    <span className="small faint">{t(T_SHEET.ofMax, { a: res.max - res.used, b: res.max })} · {rechargeNames[res.recharge]}</span>
                  </div>
                  <div className="row-wrap" style={{ gap: 7, marginTop: 7 }}>
                    {res.max <= 20 ? (
                      Array.from({ length: res.max }, (_, i) => (
                        <div
                          key={i}
                          className={`res-pip${i < res.used ? ' spent' : ''}`}
                          title={i < res.used ? t(T_SHEET.restorePip) : t(T_SHEET.spendPip)}
                          onClick={() => {
                            const nextUsed = i < res.used ? res.used - 1 : res.used + 1;
                            spendResource(res.key, Math.max(0, Math.min(res.max, nextUsed)));
                            sfx.click();
                          }}
                        />
                      ))
                    ) : (
                      <div className="row" style={{ gap: 8 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => spendResource(res.key, Math.min(res.max, res.used + 1))}>−1</button>
                        <b>{res.max - res.used}</b>
                        <button className="btn btn-ghost btn-sm" onClick={() => spendResource(res.key, Math.max(0, res.used - 1))}>+1</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="panel">
        <div className="section-title">{t(T_SHEET.attacks)}</div>
        <div className="table-wrap">
          <table className="nice">
            <thead>
              <tr>
                <th>{t(T_SHEET.thWeapon)}</th>
                <th>{t(T_SHEET.thHit)}</th>
                <th>{t(T_SHEET.thDamage)}</th>
                <th>{t(T_SHEET.thSpecial)}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {stats.attacks.map((atk, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 700, color: 'var(--parchment)' }}>{atk.name}</td>
                  <td>
                    <div className="row" style={{ gap: 4 }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        title={t(T_SHEET.attackRollHint)}
                        onClick={() => checkRoll({ label: t(T_SHEET.attackLabel, { name: atk.name }), modifier: atk.bonus, who: character.name })}
                      >
                        🎲 +{atk.bonus}
                      </button>
                      <button
                        className="icon-btn"
                        title={t(T_SHEET.advHint)}
                        onClick={() => checkRoll({ label: t(T_SHEET.attackAdvLabel, { name: atk.name }), modifier: atk.bonus, mode: 'adv', who: character.name })}
                      >
                        ⏫
                      </button>
                      <button
                        className="icon-btn"
                        title={t(T_SHEET.disHint)}
                        onClick={() => checkRoll({ label: t(T_SHEET.attackDisLabel, { name: atk.name }), modifier: atk.bonus, mode: 'dis', who: character.name })}
                      >
                        ⏬
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="row" style={{ gap: 4 }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        title={t(T_SHEET.damageRollHint)}
                        onClick={() => formulaRoll({ label: t(T_SHEET.damageLabel, { name: atk.name }), formula: atk.damage, who: character.name })}
                      >
                        {atk.damage}
                      </button>
                      <button
                        className="icon-btn"
                        title={t(T_SHEET.critHint)}
                        onClick={() => {
                          const parsed = parseFormula(atk.damage);
                          if (!parsed) {
                            return;
                          }
                          const critFormula = parsed.specs.map((s) => `${s.count * 2}d${s.die}`).join('+')
                            + (parsed.modifier !== 0 ? (parsed.modifier > 0 ? `+${parsed.modifier}` : `${parsed.modifier}`) : '');
                          formulaRoll({ label: t(T_SHEET.critLabel, { name: atk.name }), formula: critFormula, who: character.name });
                        }}
                      >
                        💥
                      </button>
                    </div>
                  </td>
                  <td className="small muted">
                    {damageTypes[atk.damageType as DamageType] ?? atk.damageType}
                    {atk.masteryNote && (
                      <span title={masteryInfo[atk.masteryNote as WeaponMastery]?.description}>
                        {' '}· {masteryInfo[atk.masteryNote as WeaponMastery]?.name}
                      </span>
                    )}
                    {atk.rangeNote && <span> · {atk.rangeNote}</span>}
                  </td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="small faint" style={{ marginTop: 8 }}>
          {t(T_SHEET.equipHint)}
        </div>
      </section>

      {pickingConditions && (
        <Modal title={t(T_SHEET.conditionsTitle)} onClose={() => setPickingConditions(false)}>
          <div className="col" style={{ gap: 8 }}>
            {(Object.keys(conditions) as ConditionId[]).map((id) => {
              const active = character.conditions.includes(id);
              return (
                <button
                  key={id}
                  className="row"
                  style={{
                    gap: 10,
                    textAlign: 'left',
                    alignItems: 'flex-start',
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: active ? 'rgba(212,169,78,0.12)' : 'transparent',
                    border: `1px solid ${active ? 'var(--border-strong)' : 'transparent'}`,
                  }}
                  onClick={() => toggleCondition(id)}
                >
                  <span style={{ fontSize: 20 }}>{conditions[id].icon}</span>
                  <span>
                    <b style={{ color: active ? 'var(--gold-bright)' : 'var(--parchment)' }}>{conditions[id].name}</b>
                    <span className="small muted" style={{ display: 'block' }}>{conditions[id].description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </Modal>
      )}
    </div>
  );
}
