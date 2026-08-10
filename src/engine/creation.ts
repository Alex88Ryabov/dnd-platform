import type {
  Ability, Character, ClassId, Portrait, SkillId, SpeciesId,
} from '../model/types';
import { CLASSES_BY_ID } from '../data/classes';
import { BACKGROUNDS_BY_ID } from '../data/backgrounds';
import { FULL_CASTER_SLOTS, HALF_CASTER_SLOTS, PACT_SLOTS, XP_FOR_LEVEL } from '../data/core';
import { derive } from './derive';
import { dieAverage, uid } from './dice';

export interface CreationInput {
  name: string;
  playerName: string;
  portrait: Portrait;
  classId: ClassId;
  speciesId: SpeciesId;
  backgroundId: string;
  // своя предыстория: название, черта и инструмент задаются игроком
  customBackground?: string;
  backgroundFeatId?: string;
  customBackgroundTool?: string;
  // финальные значения характеристик (бонусы предыстории уже учтены)
  abilities: Record<Ability, number>;
  skills: SkillId[];
  expertise?: SkillId[];
  fightingStyleId?: string;
  extraFeatId?: string;
  cantrips: string[];
  prepared: string[];
  alignment: string;
  backstory: string;
  // для переноса уже существующего героя: стартовый уровень и подкласс
  level?: number;
  subclassId?: string;
}

export function buildNewCharacter(input: CreationInput): Character {
  const char = assembleCharacter(input);
  char.hpCurrent = derive(char).hpMax;
  return char;
}

function assembleCharacter(input: CreationInput): Character {
  const classDef = CLASSES_BY_ID[input.classId];
  const background = BACKGROUNDS_BY_ID[input.backgroundId];
  const level = Math.max(1, Math.min(20, input.level ?? 1));
  const now = new Date().toISOString();

  const skillSet = new Set<SkillId>(input.skills);
  if (background) {
    background.skills.forEach((s) => skillSet.add(s));
  }

  const featIds: string[] = [];
  const backgroundFeat = background?.featId ?? input.backgroundFeatId;
  if (backgroundFeat) {
    featIds.push(backgroundFeat);
  }
  if (input.extraFeatId && !featIds.includes(input.extraFeatId)) {
    featIds.push(input.extraFeatId);
  }

  const inventory = classDef.startingEquipment.map((entry) => ({
    uid: uid(),
    itemId: entry.itemId,
    qty: entry.qty,
    equipped: true,
  }));

  // 1-й уровень — максимум кости хитов, каждый следующий — среднее
  const hpRolls = [classDef.hitDie, ...Array.from({ length: level - 1 }, () => dieAverage(classDef.hitDie))];

  return {
    id: uid(),
    name: input.name.trim() || 'Безымянный герой',
    playerName: input.playerName.trim(),
    portrait: input.portrait,
    classId: input.classId,
    subclassId: input.subclassId,
    speciesId: input.speciesId,
    backgroundId: input.backgroundId,
    customBackground: input.customBackground,
    level,
    xp: XP_FOR_LEVEL[level] ?? 0,
    abilities: { ...input.abilities },
    hpRolls,
    hpMaxBonus: 0,
    hpCurrent: 0,
    hpTemp: 0,
    hitDiceSpent: 0,
    deathSaves: { successes: 0, failures: 0 },
    proficientSkills: [...skillSet],
    expertiseSkills: [...(input.expertise ?? [])],
    languages: 'Общий',
    toolProficiencies: [classDef.toolProficiencies, background?.toolProficiency, input.customBackgroundTool]
      .filter(Boolean)
      .join(', '),
    featIds,
    customFeats: [],
    fightingStyleId: input.fightingStyleId,
    inventory,
    money: { pp: 0, gp: classDef.startingGold, ep: 0, sp: 0, cp: 0 },
    spells: {
      cantrips: [...input.cantrips],
      prepared: [...input.prepared],
      slotsUsed: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      pactUsed: 0,
      customSpells: [],
    },
    resources: [],
    customResources: [],
    conditions: [],
    exhaustion: 0,
    heroicInspiration: input.speciesId === 'human',
    alignment: input.alignment,
    appearance: '',
    backstory: input.backstory,
    notes: '',
    levelLog: [
      {
        level,
        date: now,
        hpGained: hpRolls.reduce((a, b) => a + b, 0),
        notes: level > 1 ? [`Герой присоединился сразу на ${level}-м уровне`] : ['Начало пути!'],
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
}

// максимальный доступный круг заклинаний для класса на уровне (по таблицам ячеек)
export function maxSpellCircle(classId: ClassId, level: number): number {
  const caster = CLASSES_BY_ID[classId].caster;
  if (!caster) {
    return 0;
  }
  if (caster.kind === 'pact') {
    return PACT_SLOTS[level][1];
  }
  const table = caster.kind === 'half' ? HALF_CASTER_SLOTS[level] : FULL_CASTER_SLOTS[level];
  let max = 0;
  table.forEach((slots, i) => {
    if (slots > 0) {
      max = i + 1;
    }
  });
  return max;
}
