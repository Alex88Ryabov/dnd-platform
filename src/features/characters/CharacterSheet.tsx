import { useMemo, useState } from 'react';
import type { Character } from '../../model/types';
import { useStore } from '../../store/store';
import { derive } from '../../engine/derive';
import { xpForNextLevel, xpProgress } from '../../engine/xp';
import { applyLongRest } from '../../engine/rest';
import { CLASSES_BY_ID } from '../../data/classes';
import { SPECIES_BY_ID } from '../../data/species';
import { BACKGROUNDS_BY_ID } from '../../data/backgrounds';
import { ClassEmblem } from '../../svg/icons';
import { HpBadge } from './HpBadge';
import { SheetCombat } from './SheetCombat';
import { SheetAbilities } from './SheetAbilities';
import { SheetSpells } from './SheetSpells';
import { SheetInventory } from './SheetInventory';
import { SheetFeatures } from './SheetFeatures';
import { SheetBio } from './SheetBio';
import { LevelUpWizard } from './LevelUpWizard';
import { EditCharacterModal } from './EditCharacterModal';
import { ShortRestModal } from './ShortRestModal';
import { toast } from '../../components/Toasts';
import { sfx } from '../../audio/sound';

interface Props {
  character: Character;
  onBack: () => void;
}

type SheetTab = 'combat' | 'abilities' | 'spells' | 'inventory' | 'features' | 'bio';

export function CharacterSheet({ character, onBack }: Props) {
  const updateCharacter = useStore((s) => s.updateCharacter);
  const settings = useStore((s) => s.settings);
  const [tab, setTab] = useState<SheetTab>('combat');
  const [levelingUp, setLevelingUp] = useState(false);
  const [editing, setEditing] = useState(false);
  const [shortResting, setShortResting] = useState(false);
  const [hpFlash, setHpFlash] = useState<'damage' | 'heal' | null>(null);

  const stats = useMemo(() => derive(character), [character]);
  const classDef = CLASSES_BY_ID[character.classId];
  const species = SPECIES_BY_ID[character.speciesId];
  const background = BACKGROUNDS_BY_ID[character.backgroundId];
  const subclass = classDef.subclasses.find((s) => s.id === character.subclassId);

  const nextXp = xpForNextLevel(character.level);
  const xpReady = settings.xpMode === 'xp' && nextXp !== null && character.xp >= nextXp;

  const flashHp = (kind: 'damage' | 'heal') => {
    setHpFlash(kind);
    setTimeout(() => setHpFlash(null), 550);
  };

  const doLongRest = () => {
    updateCharacter(character.id, (c) => applyLongRest(c));
    sfx.heal();
    toast('Долгий отдых', 'Хиты, ячейки и силы полностью восстановлены', '🌙');
  };

  const tabs: { id: SheetTab; label: string }[] = [
    { id: 'combat', label: '⚔️ Бой' },
    { id: 'abilities', label: '🎯 Навыки' },
    ...(stats.spellcasting ? [{ id: 'spells' as SheetTab, label: '✨ Заклинания' }] : []),
    { id: 'inventory', label: '🎒 Снаряжение' },
    { id: 'features', label: '📜 Умения' },
    { id: 'bio', label: '🪶 История' },
  ];

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="row spread">
        <button className="btn btn-ghost btn-sm" onClick={onBack}>← Все герои</button>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setShortResting(true)}>🔥 Короткий отдых</button>
          <button className="btn btn-ghost btn-sm" onClick={doLongRest}>🌙 Долгий отдых</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>✎ Править</button>
        </div>
      </div>

      <div className="panel panel-ornate">
        <div className="row-wrap" style={{ gap: 16, alignItems: 'flex-start' }}>
          <div
            style={{
              width: 86,
              height: 86,
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 48,
              background: `linear-gradient(150deg, hsl(${character.portrait.hue} 45% 30%), hsl(${character.portrait.hue} 55% 14%))`,
              border: '1px solid var(--border-strong)',
              boxShadow: '0 8px 22px rgba(0,0,0,0.4)',
              flexShrink: 0,
            }}
          >
            {character.portrait.icon}
          </div>

          <div className="grow" style={{ minWidth: 240 }}>
            <h1 style={{ fontSize: 'clamp(24px, 3vw, 34px)' }}>{character.name}</h1>
            <div className="row-wrap small muted" style={{ gap: 8, marginTop: 4 }}>
              <span className="row" style={{ gap: 5 }}>
                <ClassEmblem classId={character.classId} size={17} color={classDef.color} />
                {classDef.name}{subclass ? ` (${subclass.name})` : ''}
              </span>
              <span>·</span>
              <span>{species.name}</span>
              <span>·</span>
              <span>{background?.name ?? character.customBackground ?? 'Своя предыстория'}</span>
              {character.playerName && (
                <>
                  <span>·</span>
                  <span className="script" style={{ fontSize: 16 }}>Игрок: {character.playerName}</span>
                </>
              )}
            </div>

            <div style={{ marginTop: 12, maxWidth: 560 }}>
              <HpBadge current={character.hpCurrent} max={stats.hpMax} temp={character.hpTemp} flash={hpFlash} />
            </div>

            <div className="row-wrap" style={{ gap: 6, marginTop: 10 }}>
              <span className="chip" title={`КБ: ${stats.acNote}`}>🛡️ КБ {stats.ac}</span>
              <span className="chip">⚡ Иниц. {stats.initiative >= 0 ? `+${stats.initiative}` : stats.initiative}</span>
              <span className="chip">👟 {(stats.speedFt * 0.3).toFixed(stats.speedFt % 10 === 5 ? 1 : 0)} м</span>
              <span className="chip">🎓 Маст. +{stats.pb}</span>
              <span className="chip">👁️ Восприятие {stats.passivePerception}</span>
              <button
                className={`chip chip-clickable${character.heroicInspiration ? ' chip-active' : ''}`}
                title="Героическое вдохновение: потратьте, чтобы перебросить любой d20"
                onClick={() => updateCharacter(character.id, (c) => ({ ...c, heroicInspiration: !c.heroicInspiration }))}
              >
                {character.heroicInspiration ? '⭐ Вдохновение!' : '☆ Вдохновение'}
              </button>
            </div>
          </div>

          <div className="center" style={{ minWidth: 150 }}>
            <div className="faint small" style={{ letterSpacing: '0.14em', textTransform: 'uppercase' }}>Уровень</div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 58,
                fontWeight: 700,
                lineHeight: 1,
                color: 'var(--gold-bright)',
                textShadow: '0 0 24px rgba(240,201,108,0.4)',
              }}
            >
              {character.level}
            </div>
            {settings.xpMode === 'xp' && (
              <div style={{ marginTop: 6 }}>
                <div className="small muted">
                  {character.xp} XP{nextXp !== null ? ` / ${nextXp}` : ''}
                </div>
                <div style={{ height: 7, borderRadius: 4, background: 'rgba(0,0,0,0.4)', overflow: 'hidden', marginTop: 4 }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${xpProgress(character.level, character.xp) * 100}%`,
                      background: 'linear-gradient(90deg, var(--gold-dim), var(--gold-bright))',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
              </div>
            )}
            {character.level < 20 && (
              <button
                className={`btn btn-primary btn-sm${xpReady || settings.xpMode === 'milestone' ? ' pulse-ready' : ''}`}
                style={{ marginTop: 10 }}
                onClick={() => setLevelingUp(true)}
              >
                ⬆ Новый уровень
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="tab-row no-print">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`tab-btn${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'combat' && <SheetCombat character={character} stats={stats} onHpFlash={flashHp} />}
      {tab === 'abilities' && <SheetAbilities character={character} stats={stats} />}
      {tab === 'spells' && stats.spellcasting && <SheetSpells character={character} stats={stats} />}
      {tab === 'inventory' && <SheetInventory character={character} stats={stats} />}
      {tab === 'features' && <SheetFeatures character={character} stats={stats} />}
      {tab === 'bio' && <SheetBio character={character} />}

      {levelingUp && (
        <LevelUpWizard
          character={character}
          onClose={() => setLevelingUp(false)}
        />
      )}
      {editing && (
        <EditCharacterModal character={character} onClose={() => setEditing(false)} />
      )}
      {shortResting && (
        <ShortRestModal character={character} stats={stats} onClose={() => setShortResting(false)} />
      )}
    </div>
  );
}
