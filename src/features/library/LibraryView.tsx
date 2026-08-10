import { useMemo, useState } from 'react';
import type { ClassId } from '../../model/types';
import { SPELLS } from '../../data/spells';
import { ITEMS } from '../../data/equipment';
import { CLASSES } from '../../data/classes';
import { SPECIES } from '../../data/species';
import { CONDITIONS, MASTERY_INFO, RARITY_INFO, SCHOOL_ICONS, SCHOOL_NAMES, SIZE_NAMES } from '../../data/core';
import type { ConditionId, WeaponMastery } from '../../model/types';
import { GuideTab } from './GuideTab';

type LibraryTab = 'guide' | 'races' | 'spells' | 'items' | 'rules';

export function LibraryView() {
  const [tab, setTab] = useState<LibraryTab>('guide');

  return (
    <div className="col" style={{ gap: 16 }}>
      <h1 style={{ fontSize: 34 }}>Справочник</h1>
      <div className="tab-row">
        <button className={`tab-btn${tab === 'guide' ? ' active' : ''}`} onClick={() => setTab('guide')}>🎓 Как играть</button>
        <button className={`tab-btn${tab === 'races' ? ' active' : ''}`} onClick={() => setTab('races')}>🧝 Расы</button>
        <button className={`tab-btn${tab === 'spells' ? ' active' : ''}`} onClick={() => setTab('spells')}>✨ Заклинания</button>
        <button className={`tab-btn${tab === 'items' ? ' active' : ''}`} onClick={() => setTab('items')}>🎒 Предметы</button>
        <button className={`tab-btn${tab === 'rules' ? ' active' : ''}`} onClick={() => setTab('rules')}>📖 Шпаргалка</button>
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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SPECIES
      .filter((s) => q.length < 2 || s.name.toLowerCase().includes(q) || s.nameEn.toLowerCase().includes(q))
      .sort((a, b) => Number(Boolean(b.core)) - Number(Boolean(a.core)) || a.name.localeCompare(b.name, 'ru'));
  }, [search]);

  return (
    <div className="col" style={{ gap: 12 }}>
      <div className="row-wrap" style={{ gap: 10 }}>
        <input
          style={{ flex: 1, minWidth: 220 }}
          placeholder="🔍 Название расы…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="muted small">{filtered.length} рас</span>
      </div>
      <section className="panel">
        <div className="col" style={{ gap: 4 }}>
          {filtered.map((species) => (
            <details key={species.id} style={{ borderBottom: '1px solid rgba(212,169,78,0.08)', padding: '7px 2px' }}>
              <summary className="row" style={{ gap: 10, cursor: 'pointer', listStyle: 'none' }}>
                <span style={{ fontSize: 22 }}>{species.icon}</span>
                <b style={{ color: 'var(--parchment)', fontFamily: 'var(--font-display)', fontSize: 17 }}>{species.name}</b>
                <span className="small faint grow">{species.nameEn}</span>
                {species.core && <span className="chip chip-active" style={{ fontSize: 11 }}>PHB 2024</span>}
              </summary>
              <div className="small" style={{ padding: '8px 4px 6px 36px' }}>
                <div className="row-wrap" style={{ gap: 6, marginBottom: 8 }}>
                  <span className="chip">{species.sizeNote ?? SIZE_NAMES[species.size]}</span>
                  <span className="chip">👟 {(species.speed * 0.3).toFixed(species.speed % 10 === 5 ? 1 : 0)} м</span>
                  {species.darkvision && <span className="chip">👁️ Тёмное зрение {species.darkvision * 0.3} м</span>}
                </div>
                <div className="muted" style={{ marginBottom: 8 }}>{species.description}</div>
                <div className="col" style={{ gap: 5 }}>
                  {species.traits.map((t) => (
                    <div key={t.name}>
                      <span className="gold">◆ {t.name}.</span> <span className="muted">{t.description}</span>
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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SPELLS
      .filter((s) => level === 'all' || s.level === level)
      .filter((s) => classId === 'all' || s.classes.includes(classId))
      .filter((s) => q.length < 2 || s.name.toLowerCase().includes(q) || s.nameEn.toLowerCase().includes(q))
      .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name, 'ru'));
  }, [search, level, classId]);

  return (
    <div className="col" style={{ gap: 12 }}>
      <div className="row-wrap" style={{ gap: 10 }}>
        <input
          style={{ flex: 1, minWidth: 200 }}
          placeholder="🔍 Название заклинания…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={level} onChange={(e) => setLevel(e.target.value === 'all' ? 'all' : Number(e.target.value))}>
          <option value="all">Все круги</option>
          <option value={0}>Заговоры</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((l) => (
            <option key={l} value={l}>{l} круг</option>
          ))}
        </select>
        <select value={classId} onChange={(e) => setClassId(e.target.value as ClassId | 'all')}>
          <option value="all">Все классы</option>
          {CLASSES.filter((c) => c.caster).map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <span className="muted small">{filtered.length} закл.</span>
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
                {spell.concentration && <span className="chip" style={{ fontSize: 11 }}>конц.</span>}
                {spell.ritual && <span className="chip" style={{ fontSize: 11 }}>ритуал</span>}
              </summary>
              <div className="small muted" style={{ padding: '8px 4px 4px 44px' }}>
                <div className="row-wrap" style={{ gap: 6, marginBottom: 6 }}>
                  <span className="chip">{SCHOOL_NAMES[spell.school]}</span>
                  <span className="chip">{spell.castingTime}</span>
                  <span className="chip">{spell.range}</span>
                  <span className="chip">{spell.duration}</span>
                  <span className="chip">{spell.components}</span>
                </div>
                {spell.description}
                {spell.higherLevels && (
                  <div style={{ marginTop: 5 }}><span className="gold">Усиление:</span> {spell.higherLevels}</div>
                )}
                <div style={{ marginTop: 5 }}>
                  <span className="gold">Классы:</span>{' '}
                  {spell.classes.map((c) => CLASSES.find((x) => x.id === c)?.name).filter(Boolean).join(', ')}
                </div>
              </div>
            </details>
          ))}
          {filtered.length > 120 && <div className="small faint center">Показаны первые 120 — уточните поиск.</div>}
        </div>
      </section>
    </div>
  );
}

function ItemsTab() {
  const [search, setSearch] = useState('');
  const [kind, setKind] = useState<string>('all');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ITEMS
      .filter((i) => kind === 'all' || i.kind === kind)
      .filter((i) => q.length < 2 || i.name.toLowerCase().includes(q) || i.nameEn.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }, [search, kind]);

  return (
    <div className="col" style={{ gap: 12 }}>
      <div className="row-wrap" style={{ gap: 10 }}>
        <input
          style={{ flex: 1, minWidth: 200 }}
          placeholder="🔍 Название предмета…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={kind} onChange={(e) => setKind(e.target.value)}>
          <option value="all">Всё</option>
          <option value="weapon">Оружие</option>
          <option value="armor">Доспехи</option>
          <option value="shield">Щиты</option>
          <option value="gear">Снаряжение</option>
          <option value="tool">Инструменты</option>
          <option value="consumable">Расходники</option>
          <option value="magic">Магические</option>
          <option value="treasure">Сокровища</option>
        </select>
        <span className="muted small">{filtered.length} предм.</span>
      </div>

      <section className="panel">
        <div className="col" style={{ gap: 4 }}>
          {filtered.map((item) => (
            <details key={item.id} style={{ borderBottom: '1px solid rgba(212,169,78,0.08)', padding: '6px 2px' }}>
              <summary className="row" style={{ gap: 10, cursor: 'pointer', listStyle: 'none' }}>
                <b style={{ color: item.magic ? RARITY_INFO[item.magic.rarity].color : 'var(--parchment)' }}>{item.name}</b>
                <span className="small faint grow">{item.nameEn}</span>
                {item.magic && <span className="chip" style={{ fontSize: 11, color: RARITY_INFO[item.magic.rarity].color }}>{RARITY_INFO[item.magic.rarity].name}</span>}
                <span className="small muted">{item.costGp > 0 ? `${item.costGp} зм` : ''}</span>
              </summary>
              <div className="small muted" style={{ padding: '8px 4px 4px 12px' }}>
                {item.description}
                {item.weapon && (
                  <div style={{ marginTop: 5 }}>
                    <span className="gold">Урон:</span> {item.weapon.damage} ·{' '}
                    <span className="gold">Мастерство:</span> {MASTERY_INFO[item.weapon.mastery].name}
                    {item.weapon.properties.length > 0 && (
                      <> · <span className="gold">Свойства:</span> {item.weapon.properties.join(', ')}</>
                    )}
                  </div>
                )}
                {item.armor && (
                  <div style={{ marginTop: 5 }}>
                    <span className="gold">КБ:</span> {item.armor.baseAC}
                    {item.armor.dexCap === null ? ' + Лов' : item.armor.dexCap > 0 ? ` + Лов (макс. +${item.armor.dexCap})` : ''}
                    {item.armor.stealthDisadvantage ? ' · помеха скрытности' : ''}
                    {item.armor.strRequirement ? ` · нужна Сила ${item.armor.strRequirement}` : ''}
                  </div>
                )}
                {item.magic?.attunement && <div style={{ marginTop: 4 }} className="gold">Требуется настройка</div>}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function RulesTab() {
  return (
    <div className="col" style={{ gap: 16 }}>
      <section className="panel">
        <div className="section-title">Ход в бою — что можно сделать</div>
        <div className="col small" style={{ gap: 6 }}>
          <div><span className="gold">Действие:</span> <span className="muted">Атака, Заклинание, Рывок (двойное движение), Отход (без провоцированных атак), Уклонение (атаки по вам с помехой), Засада (спрятаться), Помощь союзнику, Использование предмета, Захват или Толчок (проверка Атлетики).</span></div>
          <div><span className="gold">Бонусное действие:</span> <span className="muted">только если умение или заклинание его разрешает (Второе дыхание, Ярость, Скрытая атака ловкача через Хитрое действие…).</span></div>
          <div><span className="gold">Движение:</span> <span className="muted">до вашей скорости, можно разбивать между атаками.</span></div>
          <div><span className="gold">Реакция:</span> <span className="muted">1 за раунд, вне вашего хода (провоцированная атака, Щит, Отражение атак…).</span></div>
        </div>
      </section>

      <section className="panel">
        <div className="section-title">Проверки и спасброски</div>
        <div className="col small" style={{ gap: 6 }}>
          <div className="muted">d20 + модификатор характеристики + бонус мастерства (если владеете навыком). Результат сравнивается со Сложностью (СЛ).</div>
          <div><span className="gold">СЛ:</span> <span className="muted">5 — очень легко · 10 — легко · 15 — средне · 20 — сложно · 25 — очень сложно · 30 — почти невозможно.</span></div>
          <div><span className="gold">Преимущество/помеха:</span> <span className="muted">бросьте два d20 и возьмите больший/меньший. Несколько источников не складываются.</span></div>
          <div><span className="gold">Чистая 20:</span> <span className="muted">всегда успех (в атаке — крит: кости урона удваиваются). Чистая 1 — всегда провал.</span></div>
        </div>
      </section>

      <section className="panel">
        <div className="section-title">Отдых</div>
        <div className="col small" style={{ gap: 6 }}>
          <div><span className="gold">Короткий (1 час):</span> <span className="muted">можно тратить кости хитов на лечение; восстанавливаются некоторые умения и ячейки колдуна.</span></div>
          <div><span className="gold">Долгий (8 часов):</span> <span className="muted">все хиты, все кости хитов, все ячейки заклинаний, умения; истощение −1. Один долгий отдых в сутки.</span></div>
          <div><span className="gold">Смерть и спасение:</span> <span className="muted">на 0 хитов герой без сознания: бросайте d20 — 10+ успех. Три успеха — стабилен, три провала — гибель. Чистая 20 — очнулся с 1 хитом!</span></div>
        </div>
      </section>

      <section className="panel">
        <div className="section-title">Мастерство оружия (новинка 2024)</div>
        <div className="col small" style={{ gap: 6 }}>
          {(Object.keys(MASTERY_INFO) as WeaponMastery[]).map((m) => (
            <div key={m}><span className="gold">{MASTERY_INFO[m].name}:</span> <span className="muted">{MASTERY_INFO[m].description}</span></div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-title">Состояния</div>
        <div className="col small" style={{ gap: 6 }}>
          {(Object.keys(CONDITIONS) as ConditionId[]).map((c) => (
            <div key={c}>
              <span className="gold">{CONDITIONS[c].icon} {CONDITIONS[c].name}:</span>{' '}
              <span className="muted">{CONDITIONS[c].description}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
