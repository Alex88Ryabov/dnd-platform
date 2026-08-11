import { Fragment, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { MonsterDef } from '../../model/types';
import { MONSTERS } from '../../data/monsters';
import { ABILITIES, ABILITY_SHORT, SIZE_NAMES, crLabel } from '../../data/core';
import { abilityMod } from '../../engine/derive';
import { checkRoll, formulaRoll } from '../../engine/rolling';
import { formatModifier } from '../../engine/dice';
import { Modal } from '../../components/Modal';

// делает кликабельными «+5 к попаданию» и «7 (2d6+2)» в действиях монстра
function enhance(text: string, who: string, action: string): ReactNode {
  const parts: ReactNode[] = [];
  const regex = /([+-]\d+)\s+к попаданию|(\d+)\s*\((\d+[dк]\d+(?:\s*[+-]\s*\d+)?)\)/gi;
  let last = 0;
  let match = regex.exec(text);
  let key = 0;
  while (match) {
    parts.push(<Fragment key={key++}>{text.slice(last, match.index)}</Fragment>);
    if (match[1]) {
      const bonus = parseInt(match[1], 10);
      parts.push(
        <button
          key={key++}
          className="chip chip-clickable chip-active"
          style={{ margin: '0 2px' }}
          onClick={() => checkRoll({ label: `${action}`, modifier: bonus, who })}
        >
          🎲 {formatModifier(bonus)}
        </button>,
      );
    } else {
      const avg = match[2];
      const formula = match[3].replace(/\s+/g, '').replace(/к/gi, 'd');
      parts.push(
        <button
          key={key++}
          className="chip chip-clickable"
          style={{ margin: '0 2px' }}
          title="Бросить урон"
          onClick={() => formulaRoll({ label: `${action} — урон`, formula, who })}
        >
          {avg} ({formula})
        </button>,
      );
    }
    last = match.index + match[0].length;
    match = regex.exec(text);
  }
  parts.push(<Fragment key={key++}>{text.slice(last)}</Fragment>);
  return <>{parts}</>;
}

const CR_OPTIONS = [0, 0.125, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 10, 17];

interface BestiaryPanelProps {
  onAdd?: (monsterId: string) => void;
}

export function BestiaryPanel({ onAdd }: BestiaryPanelProps) {
  const [search, setSearch] = useState('');
  const [maxCr, setMaxCr] = useState<number>(17);
  const [open, setOpen] = useState<MonsterDef | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MONSTERS
      .filter((m) => m.cr <= maxCr)
      .filter((m) => q.length < 2 || m.name.toLowerCase().includes(q) || m.nameEn.toLowerCase().includes(q) || m.type.toLowerCase().includes(q))
      .sort((a, b) => a.cr - b.cr || a.name.localeCompare(b.name, 'ru'));
  }, [search, maxCr]);

  return (
    <div className="col" style={{ gap: 14 }}>
      <div className="row-wrap" style={{ gap: 10 }}>
        <input
          style={{ flex: 1, minWidth: 220 }}
          placeholder="🔍 Найти монстра по имени или типу…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label className="row" style={{ gap: 6 }}>
          <span className="muted small">ПО до</span>
          <select value={maxCr} onChange={(e) => setMaxCr(Number(e.target.value))}>
            {CR_OPTIONS.map((cr) => (
              <option key={cr} value={cr}>{crLabel(cr)}</option>
            ))}
          </select>
        </label>
        <span className="muted small">{filtered.length} существ</span>
      </div>

      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 210px), 1fr))' }}>
        {filtered.map((monster) => (
          <div
            key={monster.id}
            className="panel card-clickable"
            style={{ padding: 14 }}
            onClick={() => setOpen(monster)}
          >
            <div className="row" style={{ gap: 10 }}>
              <span style={{ fontSize: 30 }}>{monster.icon}</span>
              <div className="grow">
                <b style={{ fontFamily: 'var(--font-display)', fontSize: 16.5, color: 'var(--parchment)' }}>{monster.name}</b>
                <div className="small faint">{monster.type}</div>
              </div>
              <span className="chip chip-active">ПО {crLabel(monster.cr)}</span>
            </div>
            <div className="row-wrap small muted" style={{ gap: 8, marginTop: 8 }}>
              <span>🛡️ {monster.ac}</span>
              <span>❤️ {monster.hp}</span>
              <span>⭐ {monster.xp} XP</span>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <Modal title={undefined} onClose={() => setOpen(null)} wide>
          <StatBlock monster={open} onAdd={onAdd} />
        </Modal>
      )}
    </div>
  );
}

export function StatBlock({ monster, onAdd }: { monster: MonsterDef; onAdd?: (id: string) => void }) {
  return (
    <div className="col" style={{ gap: 12 }}>
      <div className="row" style={{ gap: 14 }}>
        <span style={{ fontSize: 44 }}>{monster.icon}</span>
        <div className="grow">
          <h3 style={{ fontSize: 26 }}>{monster.name}</h3>
          <div className="muted small">
            {SIZE_NAMES[monster.size]} · {monster.type} · {monster.alignment}
          </div>
        </div>
        <span className="chip chip-active" style={{ fontSize: 15 }}>ПО {crLabel(monster.cr)} · {monster.xp} XP</span>
      </div>

      <p className="muted small script" style={{ fontSize: 17 }}>{monster.description}</p>

      <div className="row-wrap" style={{ gap: 8 }}>
        <span className="chip">🛡️ КБ {monster.ac}</span>
        <span className="chip">
          ❤️ {monster.hp} хитов
          <button
            className="chip chip-clickable"
            style={{ marginLeft: 6, padding: '1px 8px' }}
            title="Бросить хиты по формуле"
            onClick={() => formulaRoll({ label: `Хиты: ${monster.name}`, formula: monster.hpFormula.replace(/\s/g, ''), who: monster.name })}
          >
            {monster.hpFormula}
          </button>
        </span>
        <span className="chip">👟 {monster.speed}</span>
      </div>

      <div className="row-wrap" style={{ gap: 6 }}>
        {ABILITIES.map((a) => {
          const score = monster.abilities[a];
          const mod = abilityMod(score);
          return (
            <button
              key={a}
              className="chip chip-clickable"
              title={`Проверка ${ABILITY_SHORT[a]} за монстра`}
              onClick={() => checkRoll({ label: `Проверка ${ABILITY_SHORT[a]}`, modifier: mod, who: monster.name })}
            >
              {ABILITY_SHORT[a]} {score} ({formatModifier(mod)})
            </button>
          );
        })}
      </div>

      <div className="col small" style={{ gap: 4 }}>
        {monster.saves && <div><span className="gold">Спасброски:</span> <span className="muted">{monster.saves}</span></div>}
        {monster.skills && <div><span className="gold">Навыки:</span> <span className="muted">{monster.skills}</span></div>}
        {monster.resistances && <div><span className="gold">Сопротивления:</span> <span className="muted">{monster.resistances}</span></div>}
        {monster.immunities && <div><span className="gold">Иммунитеты:</span> <span className="muted">{monster.immunities}</span></div>}
        {monster.vulnerabilities && <div><span className="gold">Уязвимости:</span> <span className="muted">{monster.vulnerabilities}</span></div>}
        <div><span className="gold">Чувства:</span> <span className="muted">{monster.senses}</span></div>
        <div><span className="gold">Языки:</span> <span className="muted">{monster.languages}</span></div>
      </div>

      {monster.traits && monster.traits.length > 0 && (
        <div>
          <div className="section-title">Особенности</div>
          <div className="col small" style={{ gap: 6 }}>
            {monster.traits.map((t) => (
              <div key={t.name}><b className="gold">{t.name}.</b> <span className="muted">{t.description}</span></div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="section-title">Действия</div>
        <div className="col small" style={{ gap: 8 }}>
          {monster.actions.map((a) => (
            <div key={a.name} style={{ lineHeight: 1.9 }}>
              <b className="gold">{a.name}.</b>{' '}
              <span className="muted">{enhance(a.description, monster.name, a.name)}</span>
            </div>
          ))}
        </div>
      </div>

      {monster.bonusActions && monster.bonusActions.length > 0 && (
        <div>
          <div className="section-title">Бонусные действия</div>
          <div className="col small" style={{ gap: 6 }}>
            {monster.bonusActions.map((a) => (
              <div key={a.name}><b className="gold">{a.name}.</b> <span className="muted">{enhance(a.description, monster.name, a.name)}</span></div>
            ))}
          </div>
        </div>
      )}

      {monster.reactions && monster.reactions.length > 0 && (
        <div>
          <div className="section-title">Реакции</div>
          <div className="col small" style={{ gap: 6 }}>
            {monster.reactions.map((a) => (
              <div key={a.name}><b className="gold">{a.name}.</b> <span className="muted">{enhance(a.description, monster.name, a.name)}</span></div>
            ))}
          </div>
        </div>
      )}

      {monster.legendary && monster.legendary.length > 0 && (
        <div>
          <div className="section-title">Легендарные действия</div>
          <div className="col small" style={{ gap: 6 }}>
            {monster.legendary.map((a) => (
              <div key={a.name}><b className="gold">{a.name}.</b> <span className="muted">{enhance(a.description, monster.name, a.name)}</span></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
