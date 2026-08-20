import { useMemo, useState } from 'react';
import type { Ability, ClassId, SkillId, SpeciesId } from '../../model/types';
import { ABILITIES, ALIGNMENTS, PORTRAIT_ICONS, SKILLS } from '../../data/core';
import { SCHOOL_ICONS } from '../../data/core';
import { useCatalog } from '../../i18n/catalog';
import { useLang } from '../../i18n/lang';
import { useRules } from '../../i18n/rules';
import { useT } from '../../i18n/tr';
import type { Tri } from '../../i18n/tr';
import { fmtDistance } from '../../i18n/units';
import { T_WIZARD } from '../../i18n/ui/wizard';
import { T_COMMON } from '../../i18n/ui/common';
import { T_FEATURES } from '../../i18n/ui/features';
import { T_SHEET } from '../../i18n/ui/sheet';
import { STANDARD_ARRAY, rollAbilityScore } from '../../engine/dice';
import { abilityMod } from '../../engine/derive';
import { formatModifier } from '../../engine/dice';
import { buildNewCharacter, maxSpellCircle } from '../../engine/creation';
import { skillPool } from '../../engine/skills';
import { SkillPicker } from './SkillPicker';
import { PortraitBadge } from '../../components/PortraitBadge';
import { fileToPortraitImage } from '../../components/portraitUtil';
import { useStore } from '../../store/store';
import { ClassEmblem } from '../../svg/icons';
import { Modal } from '../../components/Modal';
import { NumberField } from '../../components/NumberField';
import { fireConfetti } from '../../components/Confetti';
import { toast } from '../../components/Toasts';
import { sfx } from '../../audio/sound';

interface Props {
  onClose: () => void;
}

type BonusMode = 'two-one' | 'all-one';

const STEPS: Tri[] = [
  T_WIZARD.stepName, T_WIZARD.stepClass, T_WIZARD.stepSpecies, T_WIZARD.stepBackground,
  T_WIZARD.stepAbilities, T_WIZARD.stepSkills, T_WIZARD.stepSpells, T_WIZARD.stepFinal,
];
const SPELLS_STEP = 6;

export function CreationWizard({ onClose }: Props) {
  const addCharacter = useStore((s) => s.addCharacter);
  const lang = useLang();
  const t = useT();
  const { classes, classesById, species: speciesList, speciesById, backgrounds, backgroundsById, featsById, originFeats, fightingStyles, spells } = useCatalog();
  const { abilityNames, abilityShort, skillNames, sizeNames, alignments } = useRules();

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
  const [speciesSkills, setSpeciesSkills] = useState<SkillId[]>([]);
  const [skills, setSkills] = useState<SkillId[]>([]);
  const [expertise, setExpertise] = useState<SkillId[]>([]);
  const [fightingStyleId, setFightingStyleId] = useState<string>('');
  const [cantrips, setCantrips] = useState<string[]>([]);
  const [prepared, setPrepared] = useState<string[]>([]);
  const [alignment, setAlignment] = useState('Нейтрально-добрый');
  const [backstory, setBackstory] = useState('');

  const classDef = classId ? classesById[classId] : null;
  const background = backgroundId ? backgroundsById[backgroundId] : null;
  const isCustomBg = backgroundId === 'custom';
  const isCaster = Boolean(classDef?.caster
    && ((classDef.caster.cantripsByLevel[startLevel] ?? 0) > 0 || (classDef.caster.preparedByLevel[startLevel] ?? 0) > 0));
  const needsStyle = classId === 'fighter'
    || ((classId === 'paladin' || classId === 'ranger') && startLevel >= 2);
  const needsSubclass = Boolean(classDef && startLevel >= classDef.subclassLevel);
  // для своей предыстории бонусы можно класть в любые характеристики
  const bonusSource: Ability[] = background ? background.abilities : ABILITIES;
  const bgSkills: SkillId[] = background ? background.skills : (isCustomBg ? customBgSkills : []);
  const speciesDef = speciesId ? speciesById[speciesId] : null;
  const speciesChoice = speciesDef?.skillChoices;
  // навыки, которые раса и предыстория дают без выбора
  const grantedSkills: SkillId[] = [...new Set([...(speciesDef?.skills ?? []), ...bgSkills])];
  // выбранное сверяем с выданным: смена предыстории не должна оставлять невидимый выбор
  const chosenSpeciesSkills = speciesSkills.filter((s) => !grantedSkills.includes(s));
  const chosenClassSkills = skills.filter((s) => !grantedSkills.includes(s) && !chosenSpeciesSkills.includes(s));
  const allSkills: SkillId[] = [...grantedSkills, ...chosenSpeciesSkills, ...chosenClassSkills];
  const chosenExpertise = expertise.filter((s) => allSkills.includes(s));

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
        const okSpecies = !speciesChoice || speciesChoice.optional
          || chosenSpeciesSkills.length === speciesChoice.count;
        const okSkills = chosenClassSkills.length === classDef.skillChoices.count;
        const okExpertise = classId !== 'rogue' || chosenExpertise.length === 2;
        const okStyle = !needsStyle || fightingStyleId !== '';
        return okSpecies && okSkills && okExpertise && okStyle;
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

  const toggleSkill = (chosen: SkillId[], setChosen: (next: SkillId[]) => void, limit: number, skillId: SkillId) => {
    if (chosen.includes(skillId)) {
      setChosen(chosen.filter((s) => s !== skillId));
      setExpertise(expertise.filter((s) => s !== skillId));
    } else if (chosen.length < limit) {
      setChosen([...chosen, skillId]);
    }
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
      skills: allSkills,
      expertise: classId === 'rogue' ? chosenExpertise : undefined,
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
    toast(t(T_WIZARD.heroCreated), t(T_WIZARD.joinsParty, { name: char.name }), '🎉');
    onClose();
  };

  const spellChoices = useMemo(() => {
    if (!classId) {
      return { cantripList: [], leveledList: [], maxCircle: 0 };
    }
    const maxCircle = Math.max(1, maxSpellCircle(classId, startLevel));
    return {
      cantripList: spells.filter((s) => s.level === 0 && s.classes.includes(classId)),
      leveledList: spells
        .filter((s) => s.level > 0 && s.level <= maxCircle && s.classes.includes(classId))
        .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name, lang)),
      maxCircle,
    };
  }, [classId, startLevel, spells, lang]);

  // шаг «Заклинания» пропускаем для немагических классов
  const visibleStepIndexes = STEPS.map((_, i) => i).filter((i) => isCaster || i !== SPELLS_STEP);
  const goNext = () => {
    let next = step + 1;
    if (next === SPELLS_STEP && !isCaster) {
      next = SPELLS_STEP + 1;
    }
    setStep(next);
    sfx.click();
  };
  const goBack = () => {
    let prev = step - 1;
    if (prev === SPELLS_STEP && !isCaster) {
      prev = SPELLS_STEP - 1;
    }
    setStep(prev);
  };

  return (
    <Modal title={t(T_WIZARD.title, { step: t(STEPS[step]) })} onClose={onClose} xl>
      <div className="row-wrap" style={{ gap: 6, marginBottom: 18 }}>
        {visibleStepIndexes.map((stepIndex) => (
          <span
            key={stepIndex}
            className={`chip${stepIndex === step ? ' chip-active' : ''}`}
            style={stepIndex < step ? { color: 'var(--success)', borderColor: 'rgba(111,191,99,0.4)' } : undefined}
          >
            {stepIndex < step ? '✓ ' : ''}{t(STEPS[stepIndex])}
          </span>
        ))}
      </div>

      {step === 0 && (
        <div className="col" style={{ gap: 16 }}>
          <div className="grid-2">
            <label className="col" style={{ gap: 6 }}>
              <span className="muted small">{t(T_WIZARD.heroName)}</span>
              <input
                autoFocus
                value={name}
                placeholder={t(T_WIZARD.heroNamePh)}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="col" style={{ gap: 6 }}>
              <span className="muted small">{t(T_WIZARD.playerName)}</span>
              <input
                value={playerName}
                placeholder={t(T_WIZARD.playerNamePh)}
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </label>
          </div>
          <div>
            <div className="muted small" style={{ marginBottom: 8 }}>{t(T_WIZARD.heroSign)}</div>
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
            <span className="muted small">{t(T_WIZARD.crestColor)}</span>
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
              {t(T_WIZARD.uploadImage)}
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
                      toast(t(T_WIZARD.imageFail), t(T_WIZARD.imageFailText), '⚠️');
                    }
                  }
                  e.target.value = '';
                }}
              />
            </label>
            {image && (
              <button className="btn btn-ghost btn-sm" onClick={() => setImage(undefined)}>
                {t(T_WIZARD.removeImage)}
              </button>
            )}
          </div>
          <div className="row" style={{ gap: 12 }}>
            <PortraitBadge portrait={{ icon, hue, image }} size={64} radius={16} />
            <div className="script gold" style={{ fontSize: 26 }}>{name || t(T_WIZARD.futureLegend)}</div>
          </div>
          <div className="panel" style={{ padding: 14, maxWidth: 480 }}>
            <div className="row-wrap" style={{ gap: 10, alignItems: 'center' }}>
              <span className="muted small">{t(T_WIZARD.startLevel)}</span>
              <select value={startLevel} onChange={(e) => setStartLevel(Number(e.target.value))}>
                {Array.from({ length: 20 }, (_, i) => i + 1).map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="small faint" style={{ marginTop: 6 }}>
              {t(T_WIZARD.startLevelHint)}
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 215px), 1fr))' }}>
          {classes.map((c) => (
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
                <span className="chip">{t(T_WIZARD.hitDieChip, { n: c.hitDie })}</span>
                <span className="chip">{c.primaryAbilities.map((a) => abilityShort[a]).join(' / ')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {step === 2 && (() => {
        const query = speciesSearch.trim().toLowerCase();
        const list = speciesList
          .filter((s) => (query.length > 0
            ? s.name.toLowerCase().includes(query) || s.nameEn.toLowerCase().includes(query)
            : speciesFilter === 'core' ? s.core : true))
          .sort((a, b) => Number(Boolean(b.core)) - Number(Boolean(a.core)) || a.name.localeCompare(b.name, lang));
        const selected = speciesId ? speciesList.find((s) => s.id === speciesId) : null;
        return (
          <div className="col" style={{ gap: 12 }}>
            <div className="row-wrap" style={{ gap: 10 }}>
              <input
                style={{ flex: 1, minWidth: 200 }}
                placeholder={t(T_WIZARD.searchSpecies)}
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
                  {t(T_WIZARD.coreSpecies)}
                </button>
                <button
                  className={`chip chip-clickable${speciesFilter === 'all' && !query ? ' chip-active' : ''}`}
                  onClick={() => {
                    setSpeciesFilter('all');
                    setSpeciesSearch('');
                  }}
                >
                  {t(T_WIZARD.allSpecies, { n: speciesList.length })}
                </button>
              </div>
            </div>

            <div
              className="grid-cards"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 150px), 1fr))', gap: 8, maxHeight: 300, overflowY: 'auto', paddingRight: 4 }}
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
                  onClick={() => {
                    setSpeciesId(s.id);
                    setSpeciesSkills([]);
                    setExpertise([]);
                  }}
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
              {list.length === 0 && <div className="muted small">{t(T_WIZARD.nothingFound)}</div>}
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
                      <span className="chip">{selected.sizeNote ?? sizeNames[selected.size]}</span>
                      <span className="chip">👟 {fmtDistance(selected.speed, lang)}</span>
                      {selected.darkvision && <span className="chip">{t(T_WIZARD.darkvisionChip, { dist: fmtDistance(selected.darkvision, lang) })}</span>}
                    </div>
                  </div>
                </div>
                <p className="muted small" style={{ margin: '10px 0' }}>{selected.description}</p>
                <div className="col" style={{ gap: 6 }}>
                  {selected.traits.map((trait) => (
                    <div key={trait.name} className="small">
                      <span className="gold">◆ {trait.name}.</span> <span className="muted">{trait.description}</span>
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
          <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 230px), 1fr))' }}>
            {backgrounds.map((b) => (
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
                  <span className="gold">{t(T_WIZARD.bgSkillsLabel)}</span> <span className="muted">{b.skills.map((sk) => skillNames[sk]).join(', ')}</span>
                </div>
                <div className="small">
                  <span className="gold">{t(T_WIZARD.bgFeatLabel)}</span> <span className="muted">{featsById[b.featId]?.name}</span>
                </div>
                <div className="small">
                  <span className="gold">{t(T_WIZARD.bgAbilitiesLabel)}</span> <span className="muted">{b.abilities.map((a) => abilityNames[a]).join(', ')}</span>
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
                {t(T_WIZARD.customBg)}
              </div>
              <div className="small muted" style={{ margin: '5px 0' }}>
                {t(T_WIZARD.customBgHint)}
              </div>
            </div>
          </div>

          {isCustomBg && (
            <div className="panel" style={{ padding: 14 }}>
              <div className="section-title">{t(T_WIZARD.yourBg)}</div>
              <div className="col" style={{ gap: 10 }}>
                <input
                  placeholder={t(T_WIZARD.customBgNamePh)}
                  value={customBgName}
                  onChange={(e) => setCustomBgName(e.target.value)}
                  style={{ maxWidth: 420 }}
                />
                <div>
                  <div className="muted small" style={{ marginBottom: 6 }}>
                    {t(T_WIZARD.twoBgSkills, { n: customBgSkills.length })}
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
                          {skillNames[skill.id]}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="row-wrap" style={{ gap: 10 }}>
                  <span className="muted small">{t(T_WIZARD.originFeat)}</span>
                  <select value={customBgFeatId} onChange={(e) => setCustomBgFeatId(e.target.value)}>
                    {originFeats.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div className="small muted">{featsById[customBgFeatId]?.description}</div>
                <input
                  placeholder={t(T_WIZARD.toolOptional)}
                  value={customBgTool}
                  onChange={(e) => setCustomBgTool(e.target.value)}
                  style={{ maxWidth: 420 }}
                />
              </div>
            </div>
          )}

          {(background || isCustomBg) && (
            <div className="panel" style={{ padding: 14 }}>
              <div className="section-title">{t(T_WIZARD.bgBonuses)}</div>
              <div className="row-wrap" style={{ gap: 14 }}>
                <label className="row" style={{ gap: 6 }}>
                  <input
                    type="radio"
                    checked={bonusMode === 'two-one' || isCustomBg}
                    onChange={() => setBonusMode('two-one')}
                  />
                  {t(T_WIZARD.plusTwoOne)}
                </label>
                {!isCustomBg && (
                  <label className="row" style={{ gap: 6 }}>
                    <input
                      type="radio"
                      checked={bonusMode === 'all-one'}
                      onChange={() => setBonusMode('all-one')}
                    />
                    {t(T_WIZARD.plusOneAll)}
                  </label>
                )}
              </div>
              {(bonusMode === 'two-one' || isCustomBg) && (
                <div className="row-wrap" style={{ marginTop: 10, gap: 12 }}>
                  <label className="row" style={{ gap: 8 }}>
                    <span className="muted small">{t(T_WIZARD.plusTwoTo)}</span>
                    <select value={bonusTwo ?? ''} onChange={(e) => setBonusTwo((e.target.value || null) as Ability | null)}>
                      <option value="">—</option>
                      {bonusSource.map((a) => (
                        <option key={a} value={a}>{abilityNames[a]}</option>
                      ))}
                    </select>
                  </label>
                  <label className="row" style={{ gap: 8 }}>
                    <span className="muted small">{t(T_WIZARD.plusOneTo)}</span>
                    <select value={bonusOne ?? ''} onChange={(e) => setBonusOne((e.target.value || null) as Ability | null)}>
                      <option value="">—</option>
                      {bonusSource.filter((a) => a !== bonusTwo).map((a) => (
                        <option key={a} value={a}>{abilityNames[a]}</option>
                      ))}
                    </select>
                  </label>
                </div>
              )}
            </div>
          )}

          {speciesId === 'human' && (
            <div className="panel" style={{ padding: 14 }}>
              <div className="section-title">{t(T_WIZARD.humanFeat)}</div>
              <select value={extraFeatId} onChange={(e) => setExtraFeatId(e.target.value)}>
                {originFeats.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
              <div className="small muted" style={{ marginTop: 8 }}>
                {featsById[extraFeatId]?.description}
              </div>
            </div>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="col" style={{ gap: 14 }}>
          <div className="row-wrap spread">
            <div className="muted small">
              {abilityMode === 'manual' ? t(T_WIZARD.abilitiesHintManual) : t(T_WIZARD.abilitiesHintPool)}
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
                {t(T_WIZARD.standardArray)}
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setAbilityMode('pool');
                  rollPool();
                }}
              >
                {t(T_WIZARD.roll4d6)}
              </button>
              <button
                className={`btn btn-sm ${abilityMode === 'manual' ? 'btn-primary' : 'btn-ghost'}`}
                title={t(T_WIZARD.manualHint)}
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
                {t(T_WIZARD.manualBtn)}
              </button>
            </div>
          </div>
          {abilityMode === 'pool' && (
            <div className="row-wrap" style={{ gap: 8 }}>
              <span className="muted small">{t(T_WIZARD.poolLabel)}</span>
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
          {abilityMode === 'pool' && rolledInfo && <div className="small faint">{t(T_WIZARD.rollsLabel, { s: rolledInfo })}</div>}
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
                  <div className="small gold" style={{ fontWeight: 700, letterSpacing: '0.1em' }}>{abilityShort[a]}</div>
                  {abilityMode === 'manual' ? (
                    <div style={{ marginTop: 6, display: 'flex', justifyContent: 'center' }}>
                      <NumberField
                        value={assigned[a] ?? 10}
                        onChange={(v) => setAssigned({ ...assigned, [a]: Math.max(1, Math.min(30, v)) })}
                        min={1}
                        max={30}
                        width={52}
                        ariaLabel={abilityNames[a]}
                      />
                    </div>
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
                  {bonuses[a] > 0 && <div className="small" style={{ color: 'var(--success)' }}>{t(T_WIZARD.bonusFromBg, { n: bonuses[a] })}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {step === 5 && classDef && (
        <div className="col" style={{ gap: 12 }}>
          {speciesDef && (speciesDef.skills || speciesChoice) && (
            <SkillPicker
              title={`${t(T_WIZARD.stepSpecies)}: ${speciesDef.name}`}
              granted={speciesDef.skills}
              options={speciesChoice
                ? skillPool(speciesChoice.from, [...grantedSkills, ...chosenClassSkills], speciesChoice.count)
                : []}
              count={speciesChoice?.count}
              optional={speciesChoice?.optional}
              chosen={chosenSpeciesSkills}
              onToggle={(id) => toggleSkill(chosenSpeciesSkills, setSpeciesSkills, speciesChoice?.count ?? 0, id)}
            />
          )}

          {bgSkills.length > 0 && (
            <SkillPicker
              title={`${t(T_WIZARD.stepBackground)}: ${background?.name ?? customBgName}`}
              granted={bgSkills}
            />
          )}

          <SkillPicker
            title={`${t(T_WIZARD.stepClass)}: ${classDef.name}`}
            options={skillPool(classDef.skillChoices.from, [...grantedSkills, ...chosenSpeciesSkills], classDef.skillChoices.count)}
            count={classDef.skillChoices.count}
            chosen={chosenClassSkills}
            onToggle={(id) => toggleSkill(chosenClassSkills, setSkills, classDef.skillChoices.count, id)}
          />

          <div className="small gold">{t(T_WIZARD.skillsTotal, { n: allSkills.length })}</div>

          {classId === 'rogue' && (
            <div className="panel" style={{ padding: 14 }}>
              <div className="section-title">{t(T_WIZARD.expertiseTitle)}</div>
              <div className="row-wrap" style={{ gap: 8 }}>
                {allSkills.map((skillId) => {
                  const active = chosenExpertise.includes(skillId);
                  return (
                    <button
                      key={skillId}
                      className={`chip chip-clickable${active ? ' chip-active' : ''}`}
                      onClick={() => {
                        if (active) {
                          setExpertise(chosenExpertise.filter((s) => s !== skillId));
                        } else if (chosenExpertise.length < 2) {
                          setExpertise([...chosenExpertise, skillId]);
                        }
                      }}
                    >
                      ★ {skillNames[skillId]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {needsStyle && (
            <div className="panel" style={{ padding: 14 }}>
              <div className="section-title">{t(T_FEATURES.fightingStyle)}</div>
              <div className="col" style={{ gap: 8 }}>
                {fightingStyles.map((f) => (
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
                {t(T_WIZARD.cantripsChosen, { a: cantrips.length, b: classDef.caster.cantripsByLevel[startLevel] })}
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
              {t(T_WIZARD.spellsChosen, {
                range: spellChoices.maxCircle > 1 ? `1–${spellChoices.maxCircle}` : '1',
                a: prepared.length,
                b: classDef.caster.preparedByLevel[startLevel] ?? 0,
              })}
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
                {t(T_WIZARD.subclassPick, { label: classDef.subclassLabel, n: classDef.subclassLevel })}
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
              <span className="muted small">{t(T_SHEET.alignment)}</span>
              <select value={alignment} onChange={(e) => setAlignment(e.target.value)}>
                {ALIGNMENTS.map((a, i) => (
                  <option key={a} value={a}>{alignments[i]}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="col" style={{ gap: 6 }}>
            <span className="muted small">{t(T_WIZARD.bioLabel)}</span>
            <textarea
              rows={4}
              value={backstory}
              placeholder={t(T_WIZARD.bioPh)}
              onChange={(e) => setBackstory(e.target.value)}
            />
          </label>
          <div className="panel panel-ornate" style={{ padding: 16 }}>
            <div className="row" style={{ gap: 14 }}>
              <PortraitBadge portrait={{ icon, hue, image }} size={60} radius={15} />
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--parchment)' }}>{name}</div>
                <div className="muted small">
                  {speciesList.find((s) => s.id === speciesId)?.name} · {classDef.name} {t(T_COMMON.levelOf, { n: startLevel })} · {background?.name ?? customBgName}
                </div>
              </div>
            </div>
            <div className="row-wrap" style={{ marginTop: 12, gap: 6 }}>
              {ABILITIES.map((a) => (
                <span key={a} className="chip">
                  {abilityShort[a]} {finalAbilities[a]} ({formatModifier(abilityMod(finalAbilities[a]))})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="row spread" style={{ marginTop: 20 }}>
        <button className="btn btn-ghost" onClick={goBack} disabled={step === 0}>
          {t(T_COMMON.back)}
        </button>
        {step < 7 ? (
          <button className="btn btn-primary" onClick={goNext} disabled={!canNext()}>
            {t(T_WIZARD.nextBtn)}
          </button>
        ) : (
          <button className="btn btn-primary btn-lg pulse-ready" onClick={create} disabled={!canNext()}>
            {t(T_WIZARD.createHeroBtn)}
          </button>
        )}
      </div>
    </Modal>
  );
}
