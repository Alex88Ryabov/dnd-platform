import { useState } from 'react';
import type { Character, ConditionId } from '../../model/types';
import type { DerivedStats } from '../../engine/derive';
import { useStore } from '../../store/store';
import { checkRoll, formulaRoll } from '../../engine/rolling';
import { parseFormula } from '../../engine/dice';
import { CONDITIONS, DAMAGE_TYPE_NAMES, MASTERY_INFO, RECHARGE_NAMES } from '../../data/core';
import { Modal } from '../../components/Modal';
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
    const result = checkRoll({ label: 'Спасбросок от смерти', modifier: 0, who: character.name, dc: 10 });
    updateCharacter(character.id, (c) => {
      let { successes, failures } = c.deathSaves;
      let hp = c.hpCurrent;
      if (result.kept === 20) {
        hp = 1;
        successes = 0;
        failures = 0;
        toast('Чудо!', 'Чистая 20 — герой очнулся с 1 хитом!', '✨');
      } else if (result.kept === 1) {
        failures += 2;
      } else if (result.total >= 10) {
        successes += 1;
      } else {
        failures += 1;
      }
      if (successes >= 3) {
        toast('Стабилен', 'Три успеха — герой вне опасности', '💚');
      }
      if (failures >= 3) {
        toast('Герой пал…', 'Три провала. Но, может, чудо ещё случится', '🖤');
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
          <div className="section-title">Хиты и состояние</div>
          <div className="row-wrap" style={{ gap: 8 }}>
            <input
              className="num-input"
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Math.max(1, Number(e.target.value) || 1))}
            />
            <button className="btn btn-danger btn-sm" onClick={applyDamage}>⚔️ Урон</button>
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--success)', borderColor: 'rgba(111,191,99,0.4)' }} onClick={applyHeal}>💚 Лечение</button>
            <button className="btn btn-ghost btn-sm" style={{ color: '#9fd7f2', borderColor: 'rgba(90,167,214,0.4)' }} onClick={applyTemp}>🌀 Врем. хиты</button>
          </div>

          {dying && (
            <div className="panel" style={{ marginTop: 12, padding: 14, borderColor: 'rgba(226,84,67,0.5)', background: 'rgba(226,84,67,0.07)' }}>
              <div className="row spread">
                <b style={{ color: 'var(--danger)' }}>💀 При смерти!</b>
                <button className="btn btn-primary btn-sm" onClick={rollDeathSave}>Спасбросок от смерти</button>
              </div>
              <div className="row" style={{ gap: 18, marginTop: 10 }}>
                <div className="row" style={{ gap: 5 }}>
                  <span className="small muted">Успехи</span>
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{ fontSize: 18 }}>{i < character.deathSaves.successes ? '💚' : '⚪'}</span>
                  ))}
                </div>
                <div className="row" style={{ gap: 5 }}>
                  <span className="small muted">Провалы</span>
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{ fontSize: 18 }}>{i < character.deathSaves.failures ? '💔' : '⚪'}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="divider" />

          <div className="row-wrap" style={{ gap: 8 }}>
            <span className="small muted">Кости хитов: {stats.hitDiceAvailable}/{stats.hitDiceTotal} (d{stats.hitDie})</span>
            <span className="small muted">·</span>
            <span className="small muted">Истощение:</span>
            <div className="row" style={{ gap: 4 }}>
              <button className="icon-btn" style={{ width: 26, height: 26 }} onClick={() => updateCharacter(character.id, (c) => ({ ...c, exhaustion: Math.max(0, c.exhaustion - 1) }))}>−</button>
              <b style={{ color: character.exhaustion > 0 ? 'var(--danger)' : 'var(--ink-muted)' }}>{character.exhaustion}</b>
              <button className="icon-btn" style={{ width: 26, height: 26 }} onClick={() => updateCharacter(character.id, (c) => ({ ...c, exhaustion: Math.min(6, c.exhaustion + 1) }))}>+</button>
            </div>
            {character.exhaustion > 0 && (
              <span className="small" style={{ color: 'var(--danger)' }}>
                −{character.exhaustion * 2} ко всем d20, −{character.exhaustion * 1.5} м скорости
              </span>
            )}
          </div>

          <div className="divider" />

          <div className="row-wrap" style={{ gap: 6 }}>
            {character.conditions.map((id) => (
              <button
                key={id}
                className="chip chip-active chip-clickable"
                title={CONDITIONS[id].description}
                onClick={() => toggleCondition(id)}
              >
                {CONDITIONS[id].icon} {CONDITIONS[id].name} ✕
              </button>
            ))}
            <button className="chip chip-clickable" onClick={() => setPickingConditions(true)}>
              + Состояние
            </button>
            {character.concentratingOn && (
              <button
                className="chip chip-active chip-clickable"
                style={{ borderColor: 'var(--magic)', color: '#cdb5f5' }}
                title="Нажмите, чтобы сбросить концентрацию"
                onClick={() => updateCharacter(character.id, (c) => ({ ...c, concentratingOn: undefined }))}
              >
                🧠 Концентрация: {character.concentratingOn} ✕
              </button>
            )}
          </div>
        </section>

        <section className="panel">
          <div className="section-title">Ресурсы</div>
          {stats.resources.length === 0 ? (
            <div className="muted small">У этого класса нет отслеживаемых ресурсов на текущем уровне.</div>
          ) : (
            <div className="col" style={{ gap: 12 }}>
              {stats.resources.map((res) => (
                <div key={res.key}>
                  <div className="row spread">
                    <b>{res.name}</b>
                    <span className="small faint">{res.max - res.used} из {res.max} · {RECHARGE_NAMES[res.recharge]}</span>
                  </div>
                  <div className="row-wrap" style={{ gap: 7, marginTop: 7 }}>
                    {res.max <= 20 ? (
                      Array.from({ length: res.max }, (_, i) => (
                        <div
                          key={i}
                          className={`res-pip${i < res.used ? ' spent' : ''}`}
                          title={i < res.used ? 'Вернуть' : 'Потратить'}
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
        <div className="section-title">Атаки</div>
        <div className="table-wrap">
          <table className="nice">
            <thead>
              <tr>
                <th>Оружие</th>
                <th>Попадание</th>
                <th>Урон</th>
                <th>Особое</th>
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
                        title="Бросок атаки"
                        onClick={() => checkRoll({ label: `Атака: ${atk.name}`, modifier: atk.bonus, who: character.name })}
                      >
                        🎲 +{atk.bonus}
                      </button>
                      <button
                        className="icon-btn"
                        title="С преимуществом"
                        onClick={() => checkRoll({ label: `Атака: ${atk.name} (преим.)`, modifier: atk.bonus, mode: 'adv', who: character.name })}
                      >
                        ⏫
                      </button>
                      <button
                        className="icon-btn"
                        title="С помехой"
                        onClick={() => checkRoll({ label: `Атака: ${atk.name} (помеха)`, modifier: atk.bonus, mode: 'dis', who: character.name })}
                      >
                        ⏬
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="row" style={{ gap: 4 }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        title="Бросок урона"
                        onClick={() => formulaRoll({ label: `Урон: ${atk.name}`, formula: atk.damage, who: character.name })}
                      >
                        {atk.damage}
                      </button>
                      <button
                        className="icon-btn"
                        title="Критический урон (кости ×2)"
                        onClick={() => {
                          const parsed = parseFormula(atk.damage);
                          if (!parsed) {
                            return;
                          }
                          const critFormula = parsed.specs.map((s) => `${s.count * 2}d${s.die}`).join('+')
                            + (parsed.modifier !== 0 ? (parsed.modifier > 0 ? `+${parsed.modifier}` : `${parsed.modifier}`) : '');
                          formulaRoll({ label: `КРИТ! ${atk.name}`, formula: critFormula, who: character.name });
                        }}
                      >
                        💥
                      </button>
                    </div>
                  </td>
                  <td className="small muted">
                    {DAMAGE_TYPE_NAMES[atk.damageType as keyof typeof DAMAGE_TYPE_NAMES] ?? atk.damageType}
                    {atk.masteryNote && (
                      <span title={MASTERY_INFO[atk.masteryNote as keyof typeof MASTERY_INFO]?.description}>
                        {' '}· {MASTERY_INFO[atk.masteryNote as keyof typeof MASTERY_INFO]?.name}
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
          Экипируйте оружие на вкладке «Снаряжение», чтобы оно появилось здесь.
        </div>
      </section>

      {pickingConditions && (
        <Modal title="Состояния" onClose={() => setPickingConditions(false)}>
          <div className="col" style={{ gap: 8 }}>
            {(Object.keys(CONDITIONS) as ConditionId[]).map((id) => {
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
                  <span style={{ fontSize: 20 }}>{CONDITIONS[id].icon}</span>
                  <span>
                    <b style={{ color: active ? 'var(--gold-bright)' : 'var(--parchment)' }}>{CONDITIONS[id].name}</b>
                    <span className="small muted" style={{ display: 'block' }}>{CONDITIONS[id].description}</span>
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
