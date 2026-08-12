import { useMemo, useState } from 'react';
import type { ConditionId } from '../../model/types';
import { useStore } from '../../store/store';
import { useCatalog } from '../../i18n/catalog';
import { useRules } from '../../i18n/rules';
import { useT } from '../../i18n/tr';
import { T_MASTER } from '../../i18n/ui/master';
import { T_SHEET } from '../../i18n/ui/sheet';
import { T_SPELLS } from '../../i18n/ui/spells';
import { T_CHARS } from '../../i18n/ui/characters';
import { T_COMMON } from '../../i18n/ui/common';
import { crLabel } from '../../data/core';
import { derive, abilityMod } from '../../engine/derive';
import { rollDie } from '../../engine/dice';
import { HpBadge } from '../characters/HpBadge';
import { Modal } from '../../components/Modal';
import { NumberField } from '../../components/NumberField';
import { toast } from '../../components/Toasts';
import { sfx } from '../../audio/sound';

export function CombatTracker() {
  const characters = useStore((s) => s.characters);
  const combat = useStore((s) => s.combat);
  const startCombat = useStore((s) => s.startCombat);
  const endCombat = useStore((s) => s.endCombat);
  const addCombatant = useStore((s) => s.addCombatant);
  const removeCombatant = useStore((s) => s.removeCombatant);
  const updateCombatant = useStore((s) => s.updateCombatant);
  const damageCombatant = useStore((s) => s.damageCombatant);
  const healCombatant = useStore((s) => s.healCombatant);
  const toggleCombatantCondition = useStore((s) => s.toggleCombatantCondition);
  const sortByInitiative = useStore((s) => s.sortByInitiative);
  const nextTurn = useStore((s) => s.nextTurn);
  const awardXp = useStore((s) => s.awardXp);
  const settings = useStore((s) => s.settings);
  const t = useT();
  const { monsters } = useCatalog();
  const { conditions } = useRules();

  const [monsterSearch, setMonsterSearch] = useState('');
  const [monsterQty, setMonsterQty] = useState(1);
  const [customName, setCustomName] = useState('');
  const [customHp, setCustomHp] = useState(10);
  const [conditionsFor, setConditionsFor] = useState<string | null>(null);
  const [amounts, setAmounts] = useState<Record<string, number>>({});
  const [ending, setEnding] = useState(false);

  const monsterResults = useMemo(() => {
    const q = monsterSearch.trim().toLowerCase();
    if (q.length < 2) {
      return [];
    }
    return monsters.filter((m) => m.name.toLowerCase().includes(q) || m.nameEn.toLowerCase().includes(q)).slice(0, 8);
  }, [monsterSearch, monsters]);

  const pcsNotInCombat = characters.filter(
    (c) => !combat.combatants.some((cb) => cb.kind === 'pc' && cb.refId === c.id),
  );

  const addPc = (charId: string) => {
    const char = characters.find((c) => c.id === charId);
    if (!char) {
      return;
    }
    const stats = derive(char);
    addCombatant({
      kind: 'pc',
      refId: char.id,
      name: char.name,
      initiative: rollDie(20) + stats.initiative,
      hp: char.hpCurrent,
      hpMax: stats.hpMax,
      ac: stats.ac,
      conditions: [],
      icon: char.portrait.icon,
    });
    sfx.click();
  };

  const addMonster = (monsterId: string) => {
    const monster = monsters.find((m) => m.id === monsterId);
    if (!monster) {
      return;
    }
    const already = combat.combatants.filter((c) => c.refId === monsterId).length;
    for (let i = 0; i < monsterQty; i++) {
      addCombatant({
        kind: 'monster',
        refId: monster.id,
        name: monsterQty + already > 1 ? `${monster.name} ${already + i + 1}` : monster.name,
        initiative: rollDie(20) + abilityMod(monster.abilities.dex),
        hp: monster.hp,
        hpMax: monster.hp,
        ac: monster.ac,
        conditions: [],
        icon: monster.icon,
      });
    }
    setMonsterSearch('');
    setMonsterQty(1);
    sfx.dice();
  };

  const addCustom = () => {
    if (!customName.trim()) {
      return;
    }
    addCombatant({
      kind: 'custom',
      name: customName.trim(),
      initiative: rollDie(20),
      hp: customHp,
      hpMax: customHp,
      ac: 10,
      conditions: [],
      icon: '❔',
    });
    setCustomName('');
  };

  const defeatedXp = combat.combatants
    .filter((c) => c.kind === 'monster' && (c.defeated || c.hp === 0))
    .reduce((sum, c) => {
      const monster = monsters.find((m) => m.id === c.refId);
      return sum + (monster?.xp ?? 0);
    }, 0);

  const finishCombat = (withXp: boolean) => {
    if (withXp && defeatedXp > 0 && characters.length > 0) {
      const share = Math.floor(defeatedXp / characters.length);
      awardXp(characters.map((c) => c.id), share);
      toast(t(T_MASTER.combatXp), t(T_MASTER.combatXpText, { share, total: defeatedXp }), '⭐');
    }
    endCombat();
    setEnding(false);
    sfx.levelUp();
  };

  const getAmount = (uid: string) => amounts[uid] ?? 1;

  return (
    <div className="col" style={{ gap: 16 }}>
      <section className="panel">
        <div className="section-title">{t(T_MASTER.gatherCombat)}</div>
        <div className="col" style={{ gap: 12 }}>
          {pcsNotInCombat.length > 0 && (
            <div className="row-wrap" style={{ gap: 8 }}>
              <span className="muted small">{t(T_MASTER.heroesLabel)}</span>
              {pcsNotInCombat.map((c) => (
                <button key={c.id} className="chip chip-clickable" onClick={() => addPc(c.id)}>
                  {c.portrait.icon} {c.name}
                </button>
              ))}
              {pcsNotInCombat.length > 1 && (
                <button className="btn btn-ghost btn-sm" onClick={() => pcsNotInCombat.forEach((c) => addPc(c.id))}>
                  {t(T_MASTER.allHeroesBtn)}
                </button>
              )}
            </div>
          )}
          <div className="row-wrap" style={{ gap: 8, position: 'relative' }}>
            <span className="muted small">{t(T_MASTER.monsterLabel)}</span>
            <div style={{ position: 'relative', minWidth: 240, flex: 1, maxWidth: 380 }}>
              <input
                style={{ width: '100%' }}
                placeholder={t(T_MASTER.monsterSearchPh)}
                value={monsterSearch}
                onChange={(e) => setMonsterSearch(e.target.value)}
              />
              {monsterResults.length > 0 && (
                <div className="panel" style={{ position: 'absolute', top: '105%', left: 0, right: 0, zIndex: 30, padding: 8, maxHeight: 260, overflowY: 'auto' }}>
                  {monsterResults.map((m) => (
                    <button
                      key={m.id}
                      className="row spread"
                      style={{ width: '100%', padding: '7px 8px', borderRadius: 7, textAlign: 'left' }}
                      onMouseDown={() => addMonster(m.id)}
                    >
                      <span>{m.icon} <b>{m.name}</b></span>
                      <span className="small muted">{t(T_MASTER.crHp, { cr: crLabel(m.cr), hp: m.hp })}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <label className="row" style={{ gap: 5 }}>
              <span className="muted small">×</span>
              <NumberField value={monsterQty} onChange={setMonsterQty} min={1} max={10} width={44} />
            </label>
          </div>
          <div className="row-wrap" style={{ gap: 8 }}>
            <span className="muted small">{t(T_MASTER.customCombatant)}</span>
            <input placeholder={t(T_MASTER.namePh)} value={customName} onChange={(e) => setCustomName(e.target.value)} style={{ width: 180 }} />
            <label className="row" style={{ gap: 5 }}>
              <span className="muted small">{t(T_MASTER.hpLabel)}</span>
              <NumberField value={customHp} onChange={setCustomHp} min={1} width={52} />
            </label>
            <button className="btn btn-ghost btn-sm" onClick={addCustom}>{t(T_SPELLS.addBtn)}</button>
          </div>
        </div>
      </section>

      {combat.combatants.length > 0 && (
        <section className="panel panel-ornate">
          <div className="row-wrap spread" style={{ marginBottom: 12 }}>
            <div className="row" style={{ gap: 10 }}>
              {combat.active ? (
                <span className="chip chip-active" style={{ fontSize: 15 }}>{t(T_MASTER.roundChip, { n: combat.round })}</span>
              ) : (
                <button className="btn btn-primary btn-sm pulse-ready" onClick={() => { sortByInitiative(); startCombat(); sfx.crit(); }}>
                  {t(T_MASTER.startCombat)}
                </button>
              )}
              <button className="btn btn-ghost btn-sm" onClick={sortByInitiative}>{t(T_MASTER.byInitiative)}</button>
              {combat.active && (
                <button className="btn btn-primary btn-sm" onClick={() => { nextTurn(); sfx.click(); }}>
                  {t(T_MASTER.nextTurn)}
                </button>
              )}
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => setEnding(true)}>{t(T_MASTER.endCombat)}</button>
          </div>

          <div className="col" style={{ gap: 8 }}>
            {combat.combatants.map((combatant, index) => {
              const isActive = combat.active && index === combat.turnIndex;
              const pc = combatant.kind === 'pc' ? characters.find((c) => c.id === combatant.refId) : undefined;
              const pcStats = pc ? derive(pc) : undefined;
              const hp = pc ? pc.hpCurrent : combatant.hp;
              const hpMax = pcStats ? pcStats.hpMax : combatant.hpMax;
              const down = hp === 0;
              return (
                <div
                  key={combatant.uid}
                  className="panel"
                  style={{
                    padding: '10px 14px',
                    opacity: down && combatant.kind !== 'pc' ? 0.45 : 1,
                    border: isActive ? '1px solid var(--gold)' : undefined,
                    boxShadow: isActive ? '0 0 22px rgba(212,169,78,0.25)' : undefined,
                    background: isActive ? 'linear-gradient(160deg, rgba(212,169,78,0.10), var(--bg-panel))' : undefined,
                  }}
                >
                  <div className="row-wrap" style={{ gap: 10, alignItems: 'center' }}>
                    {isActive && <span style={{ fontSize: 18 }}>👉</span>}
                    <input
                      className="num-input"
                      style={{ width: 54 }}
                      title={t(T_MASTER.initiativeHint)}
                      type="number"
                      value={combatant.initiative}
                      onChange={(e) => updateCombatant(combatant.uid, { initiative: Number(e.target.value) || 0 })}
                    />
                    <span style={{ fontSize: 22 }}>{combatant.icon}</span>
                    <div className="grow" style={{ minWidth: 140 }}>
                      <b style={{ color: down ? 'var(--danger)' : 'var(--parchment)', textDecoration: down && combatant.kind !== 'pc' ? 'line-through' : 'none' }}>
                        {combatant.name}
                      </b>
                      <span className="small faint"> · {t(T_CHARS.acChip, { n: pc && pcStats ? pcStats.ac : combatant.ac })}</span>
                      {down && combatant.kind === 'pc' && <span className="small" style={{ color: 'var(--danger)' }}> · {t(T_MASTER.dyingMark)}</span>}
                      <div style={{ maxWidth: 260, marginTop: 4 }}>
                        <HpBadge current={hp} max={hpMax} temp={pc?.hpTemp ?? 0} />
                      </div>
                    </div>
                    <div className="row" style={{ gap: 5 }}>
                      <NumberField
                        value={getAmount(combatant.uid)}
                        onChange={(v) => setAmounts({ ...amounts, [combatant.uid]: Math.max(1, v) })}
                        min={1}
                        width={48}
                      />
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          damageCombatant(combatant.uid, getAmount(combatant.uid));
                          sfx.damage();
                        }}
                      >
                        ⚔️
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--success)' }}
                        onClick={() => {
                          healCombatant(combatant.uid, getAmount(combatant.uid));
                          sfx.heal();
                        }}
                      >
                        💚
                      </button>
                      <button className="icon-btn" title={t(T_SHEET.conditionsTitle)} onClick={() => setConditionsFor(combatant.uid)}>😵</button>
                      <button className="icon-btn" title={t(T_MASTER.removeFromCombat)} onClick={() => removeCombatant(combatant.uid)}>✕</button>
                    </div>
                  </div>
                  {combatant.conditions.length > 0 && (
                    <div className="row-wrap" style={{ gap: 5, marginTop: 6, paddingLeft: 66 }}>
                      {combatant.conditions.map((condition) => (
                        <span key={condition} className="chip" title={conditions[condition].description} style={{ fontSize: 12 }}>
                          {conditions[condition].icon} {conditions[condition].name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {defeatedXp > 0 && (
            <div className="row spread" style={{ marginTop: 12 }}>
              <span className="small gold">{t(T_MASTER.defeatedXpLabel, { n: defeatedXp })}</span>
            </div>
          )}
        </section>
      )}

      {combat.combatants.length === 0 && (
        <div className="empty-state panel">
          <span className="big-icon">⚔️</span>
          {t(T_MASTER.emptyCombat)}
        </div>
      )}

      {conditionsFor && (
        <Modal title={t(T_SHEET.conditionsTitle)} onClose={() => setConditionsFor(null)}>
          <div className="row-wrap" style={{ gap: 7 }}>
            {(Object.keys(conditions) as ConditionId[]).map((condition) => {
              const combatant = combat.combatants.find((c) => c.uid === conditionsFor);
              const active = combatant?.conditions.includes(condition);
              return (
                <button
                  key={condition}
                  className={`chip chip-clickable${active ? ' chip-active' : ''}`}
                  title={conditions[condition].description}
                  onClick={() => toggleCombatantCondition(conditionsFor, condition)}
                >
                  {conditions[condition].icon} {conditions[condition].name}
                </button>
              );
            })}
          </div>
        </Modal>
      )}

      {ending && (
        <Modal title={t(T_MASTER.endCombatTitle)} onClose={() => setEnding(false)}>
          {settings.xpMode === 'xp' && defeatedXp > 0 ? (
            <p className="muted" style={{ marginBottom: 16 }}>
              {t(T_MASTER.endXp1)} <b className="gold">{defeatedXp} XP</b>.{' '}
              {t(T_MASTER.endXp2, { n: characters.length, share: Math.floor(defeatedXp / Math.max(1, characters.length)) })}
            </p>
          ) : (
            <p className="muted" style={{ marginBottom: 16 }}>{t(T_MASTER.endCombatPlainText)}</p>
          )}
          <div className="row" style={{ justifyContent: 'flex-end', gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => setEnding(false)}>{t(T_COMMON.cancel)}</button>
            {settings.xpMode === 'xp' && defeatedXp > 0 && (
              <button className="btn btn-primary" onClick={() => finishCombat(true)}>{t(T_MASTER.endAndAward)}</button>
            )}
            <button className="btn btn-danger" onClick={() => finishCombat(false)}>{t(T_MASTER.justEnd)}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
