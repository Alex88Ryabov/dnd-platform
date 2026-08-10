import { useMemo, useState } from 'react';
import type { Ability, ClassId, SkillId, SpeciesId } from '../../model/types';
import { ABILITIES, ABILITY_NAMES, ABILITY_SHORT, ALIGNMENTS, PORTRAIT_ICONS, SIZE_NAMES, SKILLS } from '../../data/core';
import { CLASSES } from '../../data/classes';
import { CLASSES_BY_ID } from '../../data/classes';
import { SPECIES } from '../../data/species';
import { BACKGROUNDS, BACKGROUNDS_BY_ID } from '../../data/backgrounds';
import { FEATS_BY_ID, FIGHTING_STYLES, ORIGIN_FEATS } from '../../data/feats';
import { SPELLS } from '../../data/spells';
import { SCHOOL_ICONS } from '../../data/core';
import { STANDARD_ARRAY, rollAbilityScore } from '../../engine/dice';
import { abilityMod } from '../../engine/derive';
import { formatModifier } from '../../engine/dice';
import { buildNewCharacter, maxSpellCircle } from '../../engine/creation';
import { PortraitBadge } from '../../components/PortraitBadge';
import { fileToPortraitImage } from '../../components/portraitUtil';
import { useStore } from '../../store/store';
import { ClassEmblem } from '../../svg/icons';
import { Modal } from '../../components/Modal';
import { fireConfetti } from '../../components/Confetti';
import { toast } from '../../components/Toasts';
import { sfx } from '../../audio/sound';

interface Props {
  onClose: () => void;
}

type BonusMode = 'two-one' | 'all-one';

const STEPS = ['Имя', 'Класс', 'Раса', 'Предыстория', 'Характеристики', 'Навыки', 'Заклинания', 'Финал'];

export function CreationWizard({ onClose }: Props) {
  const addCharacter = useStore((s) => s.addCharacter);

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [icon, setIcon] = useState('🦁');
  const [hue, setHue] = useState(35);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [startLevel, setStartLevel] = useState(1);
  const [classId, setClassId] = useState<ClassId | null>(null);
  const [speciesId, setSpeciesId] = useState<SpeciesId | null>(null);
  const [speciesSearch, setSpeciesSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<'core' | 'all'>('core');
  const [backgroundId, setBackgroundId] = useState<string | null>(null);
  const [bonusMode, setBonusMode] = useState<BonusMode>('two-one');
  const [bonusTwo, setBonusTwo] = useState<Ability | null>(null);
  const [bonusOne, setBonusOne] = useState<Ability | null>(null);
  const [extraFeatId, setExtraFeatId] = useState<string>('skilled');
  const [customBgName, setCustomBgName] = useState('');
  const [customBgSkills, setCustomBgSkills] = useState<SkillId[]>([]);
  const [customBgFeatId, setCustomBgFeatId] = useState('skilled');
  const [customBgTool, setCustomBgTool] = useState('');
  const [abilityMode, setAbilityMode] = useState<'pool' | 'manual'>('pool');
  const [subclassSel, setSubclassSel] = useState<string>('');
  const [pool, setPool] = useState<number[]>(STANDARD_ARRAY);
  const [rolledInfo, setRolledInfo] = useState<string | null>(null);
  const [assigned, setAssigned] = useState<Record<Ability, number | null>>({
    str: null, dex: null, con: null, int: null, wis: null, cha: null,
  });
  const [skills, setSkills] = useState<SkillId[]>([]);
  const [expertise, setExpertise] = useState<SkillId[]>([]);
  const [fightingStyleId, setFightingStyleId] = useState<string>('');
  const [cantrips, setCantrips] = useState<string[]>([]);
  const [prepared, setPrepared] = useState<string[]>([]);
  const [alignment, setAlignment] = useState('Нейтрально-добрый');
  const [backstory, setBackstory] = useState('');

  const classDef = classId ? CLASSES_BY_ID[classId] : null;
  const background = backgroundId ? BACKGROUNDS_BY_ID[backgroundId] : null;
  const isCustomBg = backgroundId === 'custom';
  const isCaster = Boolean(classDef?.caster
    && ((classDef.caster.cantripsByLevel[startLevel] ?? 0) > 0 || (classDef.caster.preparedByLevel[startLevel] ?? 0) > 0));
  const needsStyle = classId === 'fighter'
    || ((classId === 'paladin' || classId === 'ranger') && startLevel >= 2);
  const needsSubclass = Boolean(classDef && startLevel >= classDef.subclassLevel);
  // для своей предыстории бонусы можно класть в любые характеристики
  const bonusSource: Ability[] = background ? background.abilities : ABILITIES;
  const bgSkills: SkillId[] = background ? background.skills : (isCustomBg ? customBgSkills : []);

  const bonuses = useMemo(() => {
    const map: Record<Ability, number> = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
    if (!backgroundId) {
      return map;
    }
    if (bonusMode === 'all-one' && background) {
      background.abilities.forEach((a) => {
        map[a] += 1;
      });
    } else {
      if (bonusTwo) {
        map[bonusTwo] += 2;
      }
      if (bonusOne) {
        map[bonusOne] += 1;
      }
    }
    return map;
  }, [backgroundId, background, bonusMode, bonusTwo, bonusOne]);

  const finalAbilities = useMemo(() => {
    const result: Record<Ability, number> = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
    ABILITIES.forEach((a) => {
      result[a] = (assigned[a] ?? 10) + bonuses[a];
    });
    return result;
  }, [assigned, bonuses]);

  const canNext = (): boolean => {
    switch (step) {
      case 0:
        return name.trim().length > 0;
      case 1:
        return classId !== null;
      case 2:
        return speciesId !== null;
      case 3: {
        if (!backgroundId) {
          return false;
        }
        if (isCustomBg && (customBgName.trim() === '' || customBgSkills.length !== 2)) {
          return false;
        }
        if (bonusMode === 'two-one' || isCustomBg) {
          return Boolean(bonusTwo && bonusOne && bonusTwo !== bonusOne);
        }
        return true;
      }
      case 4:
        return ABILITIES.every((a) => assigned[a] !== null);
      case 5: {
        if (!classDef) {
          return false;
        }
        const okSkills = skills.length === classDef.skillChoices.count;
        const okExpertise = classId !== 'rogue' || expertise.length === 2;
        const okStyle = !needsStyle || fightingStyleId !== '';
        return okSkills && okExpertise && okStyle;
      }
      case 6: {
        if (!isCaster || !classDef?.caster) {
          return true;
        }
        return cantrips.length === (classDef.caster.cantripsByLevel[startLevel] ?? 0)
          && prepared.length === (classDef.caster.preparedByLevel[startLevel] ?? 0);
      }
      case 7:
        return !needsSubclass || subclassSel !== '';
      default:
        return true;
    }
  };

  const rollPool = () => {
    sfx.dice();
    const results = Array.from({ length: 6 }, () => rollAbilityScore());
    setPool(results.map((r) => r.total));
    setRolledInfo(results.map((r) => `${r.total} (${r.rolls.join(',')})`).join('  ·  '));
    setAssigned({ str: null, dex: null, con: null, int: null, wis: null, cha: null });
  };

  const create = () => {
    if (!classId || !speciesId || !backgroundId) {
      return;
    }
    const char = buildNewCharacter({
      name,
      playerName,
      portrait: { icon, hue, image },
      classId,
      speciesId,
      backgroundId,
      customBackground: isCustomBg ? customBgName.trim() : undefined,
      backgroundFeatId: isCustomBg ? customBgFeatId : undefined,
      customBackgroundTool: isCustomBg ? (customBgTool.trim() || undefined) : undefined,
      abilities: finalAbilities,
      skills: isCustomBg ? [...skills, ...customBgSkills] : skills,
      expertise: classId === 'rogue' ? expertise : undefined,
      fightingStyleId: fightingStyleId || undefined,
      extraFeatId: speciesId === 'human' ? extraFeatId : undefined,
      cantrips,
      prepared,
      alignment,
      backstory,
      level: startLevel,
      subclassId: needsSubclass ? subclassSel : undefined,
    });
    addCharacter(char);
    fireConfetti();
    sfx.levelUp();
    toast('Герой создан!', `${char.name} присоединяется к отряду`, '🎉');
    onClose();
  };

  const spellChoices = useMemo(() => {
    if (!classId) {
      return { cantripList: [], leveledList: [], maxCircle: 0 };
    }
    const maxCircle = Math.max(1, maxSpellCircle(classId, startLevel));
    return {
      cantripList: SPELLS.filter((s) => s.level === 0 && s.classes.includes(classId)),
      leveledList: SPELLS
        .filter((s) => s.level > 0 && s.level <= maxCircle && s.classes.includes(classId))
        .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name, 'ru')),
      maxCircle,
    };
  }, [classId, startLevel]);

  // шаг «Заклинания» пропускаем для немагических классов
  const visibleSteps = isCaster ? STEPS : STEPS.filter((s) => s !== 'Заклинания');
  const currentTitle = STEPS[step];
  const goNext = () => {
    let next = step + 1;
    if (next === 6 && !isCaster) {
      next = 7;
    }
    setStep(next);
    sfx.click();
  };
  const goBack = () => {
    let prev = step - 1;
    if (prev === 6 && !isCaster) {
      prev = 5;
    }
    setStep(prev);
  };

  return (
    <Modal title={`Новый герой — ${currentTitle}`} onClose={onClose} xl>
      <div className="row-wrap" style={{ gap: 6, marginBottom: 18 }}>
        {visibleSteps.map((s) => {
          const stepIndex = STEPS.indexOf(s);
          return (
            <span
              key={s}
              className={`chip${stepIndex === step ? ' chip-active' : ''}`}
              style={stepIndex < step ? { color: 'var(--success)', borderColor: 'rgba(111,191,99,0.4)' } : undefined}
            >
              {stepIndex < step ? '✓ ' : ''}{s}
            </span>
          );
        })}
      </div>

      {step === 0 && (
        <div className="col" style={{ gap: 16 }}>
          <div className="grid-2">
            <label className="col" style={{ gap: 6 }}>
              <span className="muted small">Имя героя</span>
              <input
                autoFocus
                value={name}
                placeholder="Например: Ария Огненное Сердце"
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="col" style={{ gap: 6 }}>
              <span className="muted small">Имя игрока (кто играет этим героем)</span>
              <input
                value={playerName}
                placeholder="Например: Маша"
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </label>
          </div>
          <div>
            <div className="muted small" style={{ marginBottom: 8 }}>Знак героя</div>
            <div className="row-wrap" style={{ gap: 6 }}>
              {PORTRAIT_ICONS.map((p) => (
                <button
                  key={p}
                  onClick={() => setIcon(p)}
                  style={{
                    fontSize: 24,
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    border: `2px solid ${icon === p ? 'var(--gold)' : 'transparent'}`,
                    background: icon === p ? `hsl(${hue} 45% 24%)` : 'rgba(0,0,0,0.25)',
                    transition: 'all .15s',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <label className="col" style={{ gap: 6, maxWidth: 420 }}>
            <span className="muted small">Цвет герба</span>
            <input
              type="range"
              min={0}
              max={360}
              value={hue}
              onChange={(e) => setHue(Number(e.target.value))}
              style={{
                appearance: 'none',
                height: 14,
                borderRadius: 7,
                background: 'linear-gradient(90deg, hsl(0 50% 45%), hsl(60 50% 45%), hsl(120 50% 45%), hsl(180 50% 45%), hsl(240 50% 45%), hsl(300 50% 45%), hsl(360 50% 45%))',
                padding: 0,
                border: 'none',
              }}
            />
          </label>
          <div className="row-wrap" style={{ gap: 10 }}>
            <label className="btn btn-ghost btn-sm" style={{ cursor: 'pointer' }}>
              📷 Загрузить свою картинку
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      setImage(await fileToPortraitImage(file));
                    } catch {
                      toast('Не получилось', 'Не удалось прочитать картинку', '⚠️');
                    }
                  }
                  e.target.value = '';
                }}
              />
            </label>
            {image && (
              <button className="btn btn-ghost btn-sm" onClick={() => setImage(undefined)}>
                ✕ Убрать картинку
              </button>
            )}
          </div>
          <div className="row" style={{ gap: 12 }}>
            <PortraitBadge portrait={{ icon, hue, image }} size={64} radius={16} />
            <div className="script gold" style={{ fontSize: 26 }}>{name || 'Будущая легенда'}</div>
          </div>
          <div className="panel" style={{ padding: 14, maxWidth: 480 }}>
            <div className="row-wrap" style={{ gap: 10, alignItems: 'center' }}>
              <span className="muted small">Стартовый уровень:</span>
              <select value={startLevel} onChange={(e) => setStartLevel(Number(e.target.value))}>
                {Array.from({ length: 20 }, (_, i) => i + 1).map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="small faint" style={{ marginTop: 6 }}>
              1 — для нового героя. Выше — чтобы перенести уже существующего персонажа:
              платформа даст нужные хиты, заклинания и выбор подкласса.
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(215px, 1fr))' }}>
          {CLASSES.map((c) => (
            <div
              key={c.id}
              className={`panel card-clickable${classId === c.id ? ' panel-ornate' : ''}`}
              style={{
                borderTop: `3px solid ${c.color}`,
                outline: classId === c.id ? '2px solid var(--gold)' : 'none',
                padding: 14,
              }}
              onClick={() => {
                setClassId(c.id);
                setSkills([]);
                setExpertise([]);
                setCantrips([]);
                setPrepared([]);
                setFightingStyleId('');
              }}
            >
              <div className="row" style={{ gap: 10 }}>
                <ClassEmblem classId={c.id} size={38} color={c.color} />
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--parchment)' }}>{c.name}</div>
                  <div className="small faint">{c.tagline}</div>
                </div>
              </div>
              <div className="small muted" style={{ marginTop: 8 }}>{c.description}</div>
              <div className="row-wrap" style={{ marginTop: 8, gap: 5 }}>
                <span className="chip">к. хитов d{c.hitDie}</span>
                <span className="chip">{c.primaryAbilities.map((a) => ABILITY_SHORT[a]).join(' / ')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {step === 2 && (() => {
        const query = speciesSearch.trim().toLowerCase();
        const list = SPECIES
          .filter((s) => (query.length > 0
            ? s.name.toLowerCase().includes(query) || s.nameEn.toLowerCase().includes(query)
            : speciesFilter === 'core' ? s.core : true))
          .sort((a, b) => Number(Boolean(b.core)) - Number(Boolean(a.core)) || a.name.localeCompare(b.name, 'ru'));
        const selected = speciesId ? SPECIES.find((s) => s.id === speciesId) : null;
        return (
          <div className="col" style={{ gap: 12 }}>
            <div className="row-wrap" style={{ gap: 10 }}>
              <input
                style={{ flex: 1, minWidth: 200 }}
                placeholder="🔍 Найти расу (например: табакси, дракон, фея)…"
                value={speciesSearch}
                onChange={(e) => setSpeciesSearch(e.target.value)}
              />
              <div className="row" style={{ gap: 6 }}>
                <button
                  className={`chip chip-clickable${speciesFilter === 'core' && !query ? ' chip-active' : ''}`}
                  onClick={() => {
                    setSpeciesFilter('core');
                    setSpeciesSearch('');
                  }}
                >
                  Основные (10)
                </button>
                <button
                  className={`chip chip-clickable${speciesFilter === 'all' && !query ? ' chip-active' : ''}`}
                  onClick={() => {
                    setSpeciesFilter('all');
                    setSpeciesSearch('');
                  }}
                >
                  Все расы ({SPECIES.length})
                </button>
              </div>
            </div>

            <div
              className="grid-cards"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8, maxHeight: 300, overflowY: 'auto', paddingRight: 4 }}
            >
              {list.map((s) => (
                <button
                  key={s.id}
                  className="panel card-clickable"
                  style={{
                    padding: '10px 12px',
                    textAlign: 'left',
                    outline: speciesId === s.id ? '2px solid var(--gold)' : 'none',
                  }}
                  onClick={() => setSpeciesId(s.id)}
                >
                  <div className="row" style={{ gap: 8 }}>
                    <span style={{ fontSize: 24 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15.5, color: 'var(--parchment)', lineHeight: 1.15 }}>
                        {s.name}
                      </div>
                      <div className="small faint" style={{ fontSize: 12 }}>{s.nameEn}</div>
                    </div>
                  </div>
                </button>
              ))}
              {list.length === 0 && <div className="muted small">Ничего не нашлось — попробуйте иначе.</div>}
            </div>

            {selected && (
              <div className="panel panel-ornate" style={{ padding: 16 }}>
                <div className="row" style={{ gap: 12 }}>
                  <span style={{ fontSize: 40 }}>{selected.icon}</span>
                  <div className="grow">
                    <b style={{ fontFamily: 'var(--font-display)', fontSize: 21, color: 'var(--parchment)' }}>
                      {selected.name}
                    </b>
                    <span className="faint small"> ({selected.nameEn})</span>
                    <div className="row-wrap" style={{ gap: 6, marginTop: 6 }}>
                      <span className="chip">{selected.sizeNote ?? SIZE_NAMES[selected.size]}</span>
                      <span className="chip">👟 {(selected.speed * 0.3).toFixed(selected.speed % 10 === 5 ? 1 : 0)} м</span>
                      {selected.darkvision && <span className="chip">👁️ Тёмное зрение {selected.darkvision * 0.3} м</span>}
                    </div>
                  </div>
                </div>
                <p className="muted small" style={{ margin: '10px 0' }}>{selected.description}</p>
                <div className="col" style={{ gap: 6 }}>
                  {selected.traits.map((t) => (
                    <div key={t.name} className="small">
                      <span className="gold">◆ {t.name}.</span> <span className="muted">{t.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {step === 3 && (
        <div className="col" style={{ gap: 16 }}>
          <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))' }}>
            {BACKGROUNDS.map((b) => (
              <div
                key={b.id}
                className="panel card-clickable"
                style={{ outline: backgroundId === b.id ? '2px solid var(--gold)' : 'none', padding: 14 }}
                onClick={() => {
                  setBackgroundId(b.id);
                  setBonusTwo(null);
                  setBonusOne(null);
                }}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--parchment)' }}>{b.name}</div>
                <div className="small muted" style={{ margin: '5px 0' }}>{b.description}</div>
                <div className="small">
                  <span className="gold">Навыки:</span> <span className="muted">{b.skills.map((sk) => SKILLS.find((x) => x.id === sk)?.name).join(', ')}</span>
                </div>
                <div className="small">
                  <span className="gold">Черта:</span> <span className="muted">{FEATS_BY_ID[b.featId]?.name}</span>
                </div>
                <div className="small">
                  <span className="gold">Характеристики:</span> <span className="muted">{b.abilities.map((a) => ABILITY_NAMES[a]).join(', ')}</span>
                </div>
              </div>
            ))}
            <div
              className="panel card-clickable"
              style={{
                outline: isCustomBg ? '2px solid var(--gold)' : 'none',
                padding: 14,
                borderStyle: 'dashed',
              }}
              onClick={() => {
                setBackgroundId('custom');
                setBonusMode('two-one');
                setBonusTwo(null);
                setBonusOne(null);
              }}
            >
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--gold-bright)' }}>
                ✍️ Своя предыстория
              </div>
              <div className="small muted" style={{ margin: '5px 0' }}>
                Придумайте собственную: любое название, любые два навыка, черта на выбор
                и бонусы +2/+1 к любым характеристикам.
              </div>
            </div>
          </div>

          {isCustomBg && (
            <div className="panel" style={{ padding: 14 }}>
              <div className="section-title">Ваша предыстория</div>
              <div className="col" style={{ gap: 10 }}>
                <input
                  placeholder="Название (например: Юный драконоборец, Ученица ведьмы...)"
                  value={customBgName}
                  onChange={(e) => setCustomBgName(e.target.value)}
                  style={{ maxWidth: 420 }}
                />
                <div>
                  <div className="muted small" style={{ marginBottom: 6 }}>
                    Два навыка предыстории (выбрано {customBgSkills.length} из 2):
                  </div>
                  <div className="row-wrap" style={{ gap: 6 }}>
                    {SKILLS.map((skill) => {
                      const active = customBgSkills.includes(skill.id);
                      return (
                        <button
                          key={skill.id}
                          className={`chip chip-clickable${active ? ' chip-active' : ''}`}
                          onClick={() => {
                            if (active) {
                              setCustomBgSkills(customBgSkills.filter((s) => s !== skill.id));
                            } else if (customBgSkills.length < 2) {
                              setCustomBgSkills([...customBgSkills, skill.id]);
                            }
                          }}
                        >
                          {skill.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="row-wrap" style={{ gap: 10 }}>
                  <span className="muted small">Черта происхождения:</span>
                  <select value={customBgFeatId} onChange={(e) => setCustomBgFeatId(e.target.value)}>
                    {ORIGIN_FEATS.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div className="small muted">{FEATS_BY_ID[customBgFeatId]?.description}</div>
                <input
                  placeholder="Инструмент (необязательно, например: Столярные инструменты)"
                  value={customBgTool}
                  onChange={(e) => setCustomBgTool(e.target.value)}
                  style={{ maxWidth: 420 }}
                />
              </div>
            </div>
          )}

          {(background || isCustomBg) && (
            <div className="panel" style={{ padding: 14 }}>
              <div className="section-title">Бонусы характеристик предыстории</div>
              <div className="row-wrap" style={{ gap: 14 }}>
                <label className="row" style={{ gap: 6 }}>
                  <input
                    type="radio"
                    checked={bonusMode === 'two-one' || isCustomBg}
                    onChange={() => setBonusMode('two-one')}
                  />
                  +2 и +1
                </label>
                {!isCustomBg && (
                  <label className="row" style={{ gap: 6 }}>
                    <input
                      type="radio"
                      checked={bonusMode === 'all-one'}
                      onChange={() => setBonusMode('all-one')}
                    />
                    +1 ко всем трём
                  </label>
                )}
              </div>
              {(bonusMode === 'two-one' || isCustomBg) && (
                <div className="row-wrap" style={{ marginTop: 10, gap: 12 }}>
                  <label className="row" style={{ gap: 8 }}>
                    <span className="muted small">+2 к</span>
                    <select value={bonusTwo ?? ''} onChange={(e) => setBonusTwo((e.target.value || null) as Ability | null)}>
                      <option value="">—</option>
                      {bonusSource.map((a) => (
                        <option key={a} value={a}>{ABILITY_NAMES[a]}</option>
                      ))}
                    </select>
                  </label>
                  <label className="row" style={{ gap: 8 }}>
                    <span className="muted small">+1 к</span>
                    <select value={bonusOne ?? ''} onChange={(e) => setBonusOne((e.target.value || null) as Ability | null)}>
                      <option value="">—</option>
                      {bonusSource.filter((a) => a !== bonusTwo).map((a) => (
                        <option key={a} value={a}>{ABILITY_NAMES[a]}</option>
                      ))}
                    </select>
                  </label>
                </div>
              )}
            </div>
          )}

          {speciesId === 'human' && (
            <div className="panel" style={{ padding: 14 }}>
              <div className="section-title">Человек: дополнительная черта происхождения</div>
              <select value={extraFeatId} onChange={(e) => setExtraFeatId(e.target.value)}>
                {ORIGIN_FEATS.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
              <div className="small muted" style={{ marginTop: 8 }}>
                {FEATS_BY_ID[extraFeatId]?.description}
              </div>
            </div>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="col" style={{ gap: 14 }}>
          <div className="row-wrap spread">
            <div className="muted small">
              {abilityMode === 'manual'
                ? 'Впишите значения характеристик как есть (например, у переносимого героя). Бонусы предыстории добавятся сверху.'
                : 'Раздайте значения из набора по характеристикам. Бонусы предыстории добавятся сверху.'}
            </div>
            <div className="row-wrap" style={{ gap: 8 }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setAbilityMode('pool');
                  setPool(STANDARD_ARRAY);
                  setRolledInfo(null);
                  setAssigned({ str: null, dex: null, con: null, int: null, wis: null, cha: null });
                }}
              >
                Стандартный набор
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setAbilityMode('pool');
                  rollPool();
                }}
              >
                🎲 Бросить 4d6
              </button>
              <button
                className={`btn btn-sm ${abilityMode === 'manual' ? 'btn-primary' : 'btn-ghost'}`}
                title="Ввести любые числа — удобно для переноса готового героя"
                onClick={() => {
                  setAbilityMode('manual');
                  setAssigned({
                    str: assigned.str ?? 10,
                    dex: assigned.dex ?? 10,
                    con: assigned.con ?? 10,
                    int: assigned.int ?? 10,
                    wis: assigned.wis ?? 10,
                    cha: assigned.cha ?? 10,
                  });
                }}
              >
                ✏️ Вручную
              </button>
            </div>
          </div>
          {abilityMode === 'pool' && (
            <div className="row-wrap" style={{ gap: 8 }}>
              <span className="muted small">Набор:</span>
              {pool.map((v, i) => {
                const usedCount = ABILITIES.filter((a) => assigned[a] === v).length;
                const poolCount = pool.filter((x) => x === v).length;
                const exhausted = usedCount >= poolCount && pool.indexOf(v) === i;
                return (
                  <span key={i} className="chip" style={{ opacity: exhausted ? 0.4 : 1, fontSize: 15 }}>
                    {v}
                  </span>
                );
              })}
            </div>
          )}
          {abilityMode === 'pool' && rolledInfo && <div className="small faint">Броски: {rolledInfo}</div>}
          <div className="ability-grid">
            {ABILITIES.map((a) => {
              const taken = ABILITIES.filter((x) => x !== a && assigned[x] !== null).map((x) => assigned[x]) as number[];
              const remaining = [...pool];
              taken.forEach((v) => {
                const idx = remaining.indexOf(v);
                if (idx !== -1) {
                  remaining.splice(idx, 1);
                }
              });
              const options = Array.from(new Set(remaining)).sort((x, y) => y - x);
              const finalValue = finalAbilities[a];
              return (
                <div key={a} className="panel" style={{ padding: 12, textAlign: 'center' }}>
                  <div className="small gold" style={{ fontWeight: 700, letterSpacing: '0.1em' }}>{ABILITY_SHORT[a]}</div>
                  {abilityMode === 'manual' ? (
                    <input
                      type="number"
                      min={1}
                      max={30}
                      style={{ width: '100%', marginTop: 6, textAlign: 'center', fontSize: 17 }}
                      value={assigned[a] ?? 10}
                      onChange={(e) => setAssigned({ ...assigned, [a]: Math.max(1, Math.min(30, Number(e.target.value) || 10)) })}
                    />
                  ) : (
                    <select
                      style={{ width: '100%', marginTop: 6, textAlign: 'center', fontSize: 17 }}
                      value={assigned[a] ?? ''}
                      onChange={(e) => setAssigned({ ...assigned, [a]: e.target.value === '' ? null : Number(e.target.value) })}
                    >
                      <option value="">—</option>
                      {options.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  )}
                  <div style={{ marginTop: 6, fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--parchment)' }}>
                    {assigned[a] !== null ? finalValue : '·'}
                    {assigned[a] !== null && (
                      <span className="muted" style={{ fontSize: 14, marginLeft: 5 }}>
                        ({formatModifier(abilityMod(finalValue))})
                      </span>
                    )}
                  </div>
                  {bonuses[a] > 0 && <div className="small" style={{ color: 'var(--success)' }}>+{bonuses[a]} предыстория</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {step === 5 && classDef && (
        <div className="col" style={{ gap: 14 }}>
          <div className="muted small">
            Выберите {classDef.skillChoices.count} навыка класса.
            {bgSkills.length > 0 && (
              <>
                {' '}Предыстория уже даёт: <span className="gold">
                  {bgSkills.map((sk) => SKILLS.find((x) => x.id === sk)?.name).join(', ')}
                </span>.
              </>
            )}
          </div>
          <div className="row-wrap" style={{ gap: 8 }}>
            {classDef.skillChoices.from.map((skillId) => {
              const def = SKILLS.find((s) => s.id === skillId)!;
              const fromBg = bgSkills.includes(skillId);
              const active = skills.includes(skillId);
              return (
                <button
                  key={skillId}
                  className={`chip chip-clickable${active ? ' chip-active' : ''}`}
                  style={fromBg ? { opacity: 0.5, textDecoration: 'line-through' } : { fontSize: 14.5, padding: '7px 14px' }}
                  disabled={fromBg}
                  onClick={() => {
                    if (active) {
                      setSkills(skills.filter((s) => s !== skillId));
                      setExpertise(expertise.filter((s) => s !== skillId));
                    } else if (skills.length < classDef.skillChoices.count) {
                      setSkills([...skills, skillId]);
                    }
                  }}
                >
                  {def.name} <span className="faint">({ABILITY_SHORT[def.ability]})</span>
                </button>
              );
            })}
          </div>
          <div className="small faint">Выбрано {skills.length} из {classDef.skillChoices.count}</div>

          {classId === 'rogue' && (
            <div className="panel" style={{ padding: 14 }}>
              <div className="section-title">Компетентность (два навыка с двойным бонусом)</div>
              <div className="row-wrap" style={{ gap: 8 }}>
                {[...new Set([...skills, ...bgSkills])].map((skillId) => {
                  const def = SKILLS.find((s) => s.id === skillId)!;
                  const active = expertise.includes(skillId);
                  return (
                    <button
                      key={skillId}
                      className={`chip chip-clickable${active ? ' chip-active' : ''}`}
                      onClick={() => {
                        if (active) {
                          setExpertise(expertise.filter((s) => s !== skillId));
                        } else if (expertise.length < 2) {
                          setExpertise([...expertise, skillId]);
                        }
                      }}
                    >
                      ★ {def.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {needsStyle && (
            <div className="panel" style={{ padding: 14 }}>
              <div className="section-title">Боевой стиль</div>
              <div className="col" style={{ gap: 8 }}>
                {FIGHTING_STYLES.map((f) => (
                  <label key={f.id} className="row" style={{ gap: 8, alignItems: 'flex-start' }}>
                    <input
                      type="radio"
                      checked={fightingStyleId === f.id}
                      onChange={() => setFightingStyleId(f.id)}
                      style={{ marginTop: 4 }}
                    />
                    <span><b>{f.name}.</b> <span className="muted small">{f.description}</span></span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {step === 6 && isCaster && classDef?.caster && (
        <div className="col" style={{ gap: 16 }}>
          {(classDef.caster.cantripsByLevel[startLevel] ?? 0) > 0 && (
            <div>
              <div className="section-title">
                Заговоры — выбрано {cantrips.length} из {classDef.caster.cantripsByLevel[startLevel]}
              </div>
              <div className="col" style={{ gap: 6, maxHeight: 220, overflowY: 'auto', paddingRight: 6 }}>
                {spellChoices.cantripList.map((spell) => {
                  const active = cantrips.includes(spell.id);
                  return (
                    <label key={spell.id} className="row" style={{ gap: 8, alignItems: 'flex-start', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={active}
                        style={{ marginTop: 4 }}
                        onChange={() => {
                          if (active) {
                            setCantrips(cantrips.filter((s) => s !== spell.id));
                          } else if (cantrips.length < (classDef.caster!.cantripsByLevel[startLevel] ?? 0)) {
                            setCantrips([...cantrips, spell.id]);
                          }
                        }}
                      />
                      <span>
                        {SCHOOL_ICONS[spell.school]} <b>{spell.name}</b>{' '}
                        <span className="small muted">{spell.description}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
          <div>
            <div className="section-title">
              Заклинания {spellChoices.maxCircle > 1 ? `1–${spellChoices.maxCircle} круга` : '1 круга'} —
              выбрано {prepared.length} из {classDef.caster.preparedByLevel[startLevel]}
            </div>
            <div className="col" style={{ gap: 6, maxHeight: 260, overflowY: 'auto', paddingRight: 6 }}>
              {spellChoices.leveledList.map((spell) => {
                const active = prepared.includes(spell.id);
                return (
                  <label key={spell.id} className="row" style={{ gap: 8, alignItems: 'flex-start', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={active}
                      style={{ marginTop: 4 }}
                      onChange={() => {
                        if (active) {
                          setPrepared(prepared.filter((s) => s !== spell.id));
                        } else if (prepared.length < (classDef.caster!.preparedByLevel[startLevel] ?? 0)) {
                          setPrepared([...prepared, spell.id]);
                        }
                      }}
                    />
                    <span>
                      {spellChoices.maxCircle > 1 && (
                        <span className="chip" style={{ marginRight: 6 }}>{spell.level}</span>
                      )}
                      {SCHOOL_ICONS[spell.school]} <b>{spell.name}</b>{' '}
                      <span className="small muted">{spell.description}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {step === 7 && classDef && speciesId && (background || isCustomBg) && (
        <div className="col" style={{ gap: 14 }}>
          {needsSubclass && (
            <div className="panel" style={{ padding: 14 }}>
              <div className="section-title">
                {classDef.subclassLabel} (с {classDef.subclassLevel}-го уровня — выберите)
              </div>
              <div className="col" style={{ gap: 8 }}>
                {classDef.subclasses.map((sub) => (
                  <label key={sub.id} className="row" style={{ gap: 8, alignItems: 'flex-start' }}>
                    <input
                      type="radio"
                      checked={subclassSel === sub.id}
                      onChange={() => setSubclassSel(sub.id)}
                      style={{ marginTop: 4 }}
                    />
                    <span>
                      <b>{sub.name}.</b> <span className="muted small">{sub.description}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <div className="grid-2">
            <label className="col" style={{ gap: 6 }}>
              <span className="muted small">Мировоззрение</span>
              <select value={alignment} onChange={(e) => setAlignment(e.target.value)}>
                {ALIGNMENTS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="col" style={{ gap: 6 }}>
            <span className="muted small">История героя (кто он и о чём мечтает)</span>
            <textarea
              rows={4}
              value={backstory}
              placeholder="Например: выросла в кузнице у подножия вулкана, мечтает выковать меч для короля…"
              onChange={(e) => setBackstory(e.target.value)}
            />
          </label>
          <div className="panel panel-ornate" style={{ padding: 16 }}>
            <div className="row" style={{ gap: 14 }}>
              <PortraitBadge portrait={{ icon, hue, image }} size={60} radius={15} />
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--parchment)' }}>{name}</div>
                <div className="muted small">
                  {SPECIES.find((s) => s.id === speciesId)?.name} · {classDef.name} {startLevel} ур. · {background?.name ?? customBgName}
                </div>
              </div>
            </div>
            <div className="row-wrap" style={{ marginTop: 12, gap: 6 }}>
              {ABILITIES.map((a) => (
                <span key={a} className="chip">
                  {ABILITY_SHORT[a]} {finalAbilities[a]} ({formatModifier(abilityMod(finalAbilities[a]))})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="row spread" style={{ marginTop: 20 }}>
        <button className="btn btn-ghost" onClick={goBack} disabled={step === 0}>
          ← Назад
        </button>
        {step < 7 ? (
          <button className="btn btn-primary" onClick={goNext} disabled={!canNext()}>
            Дальше →
          </button>
        ) : (
          <button className="btn btn-primary btn-lg pulse-ready" onClick={create} disabled={!canNext()}>
            🎉 Создать героя!
          </button>
        )}
      </div>
    </Modal>
  );
}
