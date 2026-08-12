import { useMemo, useState } from 'react';
import type { ClassId, ConditionId, WeaponMastery } from '../../model/types';
import { SCHOOL_ICONS } from '../../data/core';
import { useCatalog } from '../../i18n/catalog';
import { useLang } from '../../i18n/lang';
import { useRules } from '../../i18n/rules';
import { useT } from '../../i18n/tr';
import { fmtDistance } from '../../i18n/units';
import { T_LIBRARY } from '../../i18n/ui/library';
import { T_SPELLS } from '../../i18n/ui/spells';
import { T_GEAR, KIND_LABELS } from '../../i18n/ui/gear';
import { GuideTab } from './GuideTab';

type LibraryTab = 'guide' | 'races' | 'spells' | 'items' | 'rules';

export function LibraryView() {
  const [tab, setTab] = useState<LibraryTab>('guide');
  const t = useT();

  return (
    <div className="col" style={{ gap: 16 }}>
      <h1 style={{ fontSize: 'clamp(26px, 6.5vw, 34px)' }}>{t(T_LIBRARY.title)}</h1>
      <div className="tab-row">
        <button className={`tab-btn${tab === 'guide' ? ' active' : ''}`} onClick={() => setTab('guide')}>{t(T_LIBRARY.tabGuide)}</button>
        <button className={`tab-btn${tab === 'races' ? ' active' : ''}`} onClick={() => setTab('races')}>{t(T_LIBRARY.tabRaces)}</button>
        <button className={`tab-btn${tab === 'spells' ? ' active' : ''}`} onClick={() => setTab('spells')}>{t(T_LIBRARY.tabSpells)}</button>
        <button className={`tab-btn${tab === 'items' ? ' active' : ''}`} onClick={() => setTab('items')}>{t(T_LIBRARY.tabItems)}</button>
        <button className={`tab-btn${tab === 'rules' ? ' active' : ''}`} onClick={() => setTab('rules')}>{t(T_LIBRARY.tabRules)}</button>
      </div>
      {tab === 'guide' && <GuideTab />}
      {tab === 'races' && <RacesTab />}
      {tab === 'spells' && <SpellsTab />}
      {tab === 'items' && <ItemsTab />}
      {tab === 'rules' && <RulesTab />}
    </div>
  );
}

function RacesTab() {
  const [search, setSearch] = useState('');
  const lang = useLang();
  const t = useT();
  const { species } = useCatalog();
  const { sizeNames } = useRules();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return species
      .filter((s) => q.length < 2 || s.name.toLowerCase().includes(q) || s.nameEn.toLowerCase().includes(q))
      .sort((a, b) => Number(Boolean(b.core)) - Number(Boolean(a.core)) || a.name.localeCompare(b.name, lang));
  }, [search, species, lang]);

  return (
    <div className="col" style={{ gap: 12 }}>
      <div className="row-wrap" style={{ gap: 10 }}>
        <input
          style={{ flex: 1, minWidth: 220 }}
          placeholder={t(T_LIBRARY.raceSearchPh)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="muted small">{t(T_LIBRARY.racesCount, { n: filtered.length })}</span>
      </div>
      <section className="panel">
        <div className="col" style={{ gap: 4 }}>
          {filtered.map((sp) => (
            <details key={sp.id} style={{ borderBottom: '1px solid rgba(212,169,78,0.08)', padding: '7px 2px' }}>
              <summary className="row" style={{ gap: 10, cursor: 'pointer', listStyle: 'none' }}>
                <span style={{ fontSize: 22 }}>{sp.icon}</span>
                <b style={{ color: 'var(--parchment)', fontFamily: 'var(--font-display)', fontSize: 17 }}>{sp.name}</b>
                <span className="small faint grow">{sp.nameEn}</span>
                {sp.core && <span className="chip chip-active" style={{ fontSize: 11 }}>PHB 2024</span>}
              </summary>
              <div className="small" style={{ padding: '8px 4px 6px 36px' }}>
                <div className="row-wrap" style={{ gap: 6, marginBottom: 8 }}>
                  <span className="chip">{sp.sizeNote ?? sizeNames[sp.size]}</span>
                  <span className="chip">👟 {fmtDistance(sp.speed, lang)}</span>
                  {sp.darkvision && <span className="chip">{t(T_LIBRARY.darkvisionChip, { dist: fmtDistance(sp.darkvision, lang) })}</span>}
                </div>
                <div className="muted" style={{ marginBottom: 8 }}>{sp.description}</div>
                <div className="col" style={{ gap: 5 }}>
                  {sp.traits.map((trait) => (
                    <div key={trait.name}>
                      <span className="gold">◆ {trait.name}.</span> <span className="muted">{trait.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function SpellsTab() {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState<number | 'all'>('all');
  const [classId, setClassId] = useState<ClassId | 'all'>('all');
  const lang = useLang();
  const t = useT();
  const { classes, spells } = useCatalog();
  const { schoolNames } = useRules();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return spells
      .filter((s) => level === 'all' || s.level === level)
      .filter((s) => classId === 'all' || s.classes.includes(classId))
      .filter((s) => q.length < 2 || s.name.toLowerCase().includes(q) || s.nameEn.toLowerCase().includes(q))
      .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name, lang));
  }, [search, level, classId, spells, lang]);

  return (
    <div className="col" style={{ gap: 12 }}>
      <div className="row-wrap" style={{ gap: 10 }}>
        <input
          style={{ flex: 1, minWidth: 200 }}
          placeholder={t(T_LIBRARY.spellSearchPh)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={level} onChange={(e) => setLevel(e.target.value === 'all' ? 'all' : Number(e.target.value))}>
          <option value="all">{t(T_LIBRARY.allCircles)}</option>
          <option value={0}>{t(T_LIBRARY.cantripsOpt)}</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((l) => (
            <option key={l} value={l}>{t(T_SPELLS.circleOpt, { n: l })}</option>
          ))}
        </select>
        <select value={classId} onChange={(e) => setClassId(e.target.value as ClassId | 'all')}>
          <option value="all">{t(T_LIBRARY.allClasses)}</option>
          {classes.filter((c) => c.caster).map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <span className="muted small">{t(T_LIBRARY.spellsCount, { n: filtered.length })}</span>
      </div>

      <section className="panel">
        <div className="col" style={{ gap: 4 }}>
          {filtered.slice(0, 120).map((spell) => (
            <details key={spell.id} style={{ borderBottom: '1px solid rgba(212,169,78,0.08)', padding: '6px 2px' }}>
              <summary className="row" style={{ gap: 10, cursor: 'pointer', listStyle: 'none' }}>
                <span className="chip" style={{ minWidth: 30, justifyContent: 'center' }}>
                  {spell.level === 0 ? '0' : spell.level}
                </span>
                <span style={{ fontSize: 16 }}>{SCHOOL_ICONS[spell.school]}</span>
                <b style={{ color: 'var(--parchment)' }}>{spell.name}</b>
                <span className="small faint grow">{spell.nameEn}</span>
                {spell.concentration && <span className="chip" style={{ fontSize: 11 }}>{t(T_SPELLS.conc)}</span>}
                {spell.ritual && <span className="chip" style={{ fontSize: 11 }}>{t(T_SPELLS.ritual)}</span>}
              </summary>
              <div className="small muted" style={{ padding: '8px 4px 4px 44px' }}>
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
                <div style={{ marginTop: 5 }}>
                  <span className="gold">{t(T_LIBRARY.classesLabel)}</span>{' '}
                  {spell.classes.map((c) => classes.find((x) => x.id === c)?.name).filter(Boolean).join(', ')}
                </div>
              </div>
            </details>
          ))}
          {filtered.length > 120 && <div className="small faint center">{t(T_LIBRARY.first120)}</div>}
        </div>
      </section>
    </div>
  );
}

function ItemsTab() {
  const [search, setSearch] = useState('');
  const [kind, setKind] = useState<string>('all');
  const lang = useLang();
  const t = useT();
  const { items } = useCatalog();
  const { masteryInfo, rarityInfo } = useRules();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items
      .filter((i) => kind === 'all' || i.kind === kind)
      .filter((i) => q.length < 2 || i.name.toLowerCase().includes(q) || i.nameEn.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name, lang));
  }, [search, kind, items, lang]);

  return (
    <div className="col" style={{ gap: 12 }}>
      <div className="row-wrap" style={{ gap: 10 }}>
        <input
          style={{ flex: 1, minWidth: 200 }}
          placeholder={t(T_LIBRARY.itemSearchPh)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={kind} onChange={(e) => setKind(e.target.value)}>
          <option value="all">{t(T_LIBRARY.allKinds)}</option>
          {(['weapon', 'armor', 'shield', 'gear', 'tool', 'consumable', 'magic', 'treasure'] as const).map((k) => (
            <option key={k} value={k}>{t(KIND_LABELS[k])}</option>
          ))}
        </select>
        <span className="muted small">{t(T_LIBRARY.itemsCount, { n: filtered.length })}</span>
      </div>

      <section className="panel">
        <div className="col" style={{ gap: 4 }}>
          {filtered.map((item) => (
            <details key={item.id} style={{ borderBottom: '1px solid rgba(212,169,78,0.08)', padding: '6px 2px' }}>
              <summary className="row" style={{ gap: 10, cursor: 'pointer', listStyle: 'none' }}>
                <b style={{ color: item.magic ? rarityInfo[item.magic.rarity].color : 'var(--parchment)' }}>{item.name}</b>
                <span className="small faint grow">{item.nameEn}</span>
                {item.magic && <span className="chip" style={{ fontSize: 11, color: rarityInfo[item.magic.rarity].color }}>{rarityInfo[item.magic.rarity].name}</span>}
                <span className="small muted">{item.costGp > 0 ? t(T_GEAR.costGp, { n: item.costGp }) : ''}</span>
              </summary>
              <div className="small muted" style={{ padding: '8px 4px 4px 12px' }}>
                {item.description}
                {item.weapon && (
                  <div style={{ marginTop: 5 }}>
                    <span className="gold">{t(T_LIBRARY.damageLabel)}</span> {item.weapon.damage} ·{' '}
                    <span className="gold">{t(T_LIBRARY.masteryLabel)}</span> {masteryInfo[item.weapon.mastery].name}
                    {item.weapon.properties.length > 0 && (
                      <> · <span className="gold">{t(T_LIBRARY.propsLabel)}</span> {item.weapon.properties.join(', ')}</>
                    )}
                  </div>
                )}
                {item.armor && (
                  <div style={{ marginTop: 5 }}>
                    <span className="gold">{t(T_LIBRARY.acLabel)}</span> {item.armor.baseAC}
                    {item.armor.dexCap === null ? t(T_GEAR.plusDex) : item.armor.dexCap > 0 ? t(T_GEAR.plusDexCap, { cap: item.armor.dexCap }) : ''}
                    {item.armor.stealthDisadvantage ? ` · ${t(T_LIBRARY.stealthDis)}` : ''}
                    {item.armor.strRequirement ? ` · ${t(T_LIBRARY.strReq, { n: item.armor.strRequirement })}` : ''}
                  </div>
                )}
                {item.magic?.attunement && <div style={{ marginTop: 4 }} className="gold">{t(T_LIBRARY.attunementReq)}</div>}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function RulesTab() {
  const t = useT();
  const { conditions, masteryInfo } = useRules();
  return (
    <div className="col" style={{ gap: 16 }}>
      <section className="panel">
        <div className="section-title">{t(T_LIBRARY.combatTurnTitle)}</div>
        <div className="col small" style={{ gap: 6 }}>
          <div><span className="gold">{t(T_LIBRARY.actionLabel)}</span> <span className="muted">{t(T_LIBRARY.actionText)}</span></div>
          <div><span className="gold">{t(T_LIBRARY.bonusActionLabel)}</span> <span className="muted">{t(T_LIBRARY.bonusActionText)}</span></div>
          <div><span className="gold">{t(T_LIBRARY.movementLabel)}</span> <span className="muted">{t(T_LIBRARY.movementText)}</span></div>
          <div><span className="gold">{t(T_LIBRARY.reactionLabel)}</span> <span className="muted">{t(T_LIBRARY.reactionText)}</span></div>
        </div>
      </section>

      <section className="panel">
        <div className="section-title">{t(T_LIBRARY.checksTitle)}</div>
        <div className="col small" style={{ gap: 6 }}>
          <div className="muted">{t(T_LIBRARY.checksFormula)}</div>
          <div><span className="gold">{t(T_LIBRARY.dcShort)}</span> <span className="muted">{t(T_LIBRARY.dcText)}</span></div>
          <div><span className="gold">{t(T_LIBRARY.advLabel)}</span> <span className="muted">{t(T_LIBRARY.advText)}</span></div>
          <div><span className="gold">{t(T_LIBRARY.nat20Label)}</span> <span className="muted">{t(T_LIBRARY.nat20Text)}</span></div>
        </div>
      </section>

      <section className="panel">
        <div className="section-title">{t(T_LIBRARY.restTitle)}</div>
        <div className="col small" style={{ gap: 6 }}>
          <div><span className="gold">{t(T_LIBRARY.shortRestLabel)}</span> <span className="muted">{t(T_LIBRARY.shortRestText)}</span></div>
          <div><span className="gold">{t(T_LIBRARY.longRestLabel)}</span> <span className="muted">{t(T_LIBRARY.longRestText)}</span></div>
          <div><span className="gold">{t(T_LIBRARY.deathLabel)}</span> <span className="muted">{t(T_LIBRARY.deathText)}</span></div>
        </div>
      </section>

      <section className="panel">
        <div className="section-title">{t(T_LIBRARY.masteryTitle)}</div>
        <div className="col small" style={{ gap: 6 }}>
          {(Object.keys(masteryInfo) as WeaponMastery[]).map((m) => (
            <div key={m}><span className="gold">{masteryInfo[m].name}:</span> <span className="muted">{masteryInfo[m].description}</span></div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-title">{t(T_LIBRARY.conditionsTitle)}</div>
        <div className="col small" style={{ gap: 6 }}>
          {(Object.keys(conditions) as ConditionId[]).map((c) => (
            <div key={c}>
              <span className="gold">{conditions[c].icon} {conditions[c].name}:</span>{' '}
              <span className="muted">{conditions[c].description}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
