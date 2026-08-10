import type {
  Ability, Character, ClassId, Portrait, SkillId, SpeciesId,
} from '../model/types';
import { CLASSES_BY_ID } from '../data/classes';
import { BACKGROUNDS_BY_ID } from '../data/backgrounds';
import { derive } from './derive';
import { uid } from './dice';

export interface CreationInput {
  name: string;
  playerName: string;
  portrait: Portrait;
  classId: ClassId;
  speciesId: SpeciesId;
  backgroundId: string;
  customBackground?: string;
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
}

export function buildNewCharacter(input: CreationInput): Character {
  const char = assembleCharacter(input);
  char.hpCurrent = derive(char).hpMax;
  return char;
}

function assembleCharacter(input: CreationInput): Character {
  const classDef = CLASSES_BY_ID[input.classId];
  const background = BACKGROUNDS_BY_ID[input.backgroundId];
  const now = new Date().toISOString();

  const skillSet = new Set<SkillId>(input.skills);
  if (background) {
    background.skills.forEach((s) => skillSet.add(s));
  }

  const featIds: string[] = [];
  if (background) {
    featIds.push(background.featId);
  }
  if (input.extraFeatId) {
    featIds.push(input.extraFeatId);
  }

  const inventory = classDef.startingEquipment.map((entry) => ({
    uid: uid(),
    itemId: entry.itemId,
    qty: entry.qty,
    equipped: true,
  }));

  return {
    id: uid(),
    name: input.name.trim() || 'Безымянный герой',
    playerName: input.playerName.trim(),
    portrait: input.portrait,
    classId: input.classId,
    speciesId: input.speciesId,
    backgroundId: input.backgroundId,
    customBackground: input.customBackground,
    level: 1,
    xp: 0,
    abilities: { ...input.abilities },
    hpRolls: [classDef.hitDie],
    hpMaxBonus: 0,
    hpCurrent: 0,
    hpTemp: 0,
    hitDiceSpent: 0,
    deathSaves: { successes: 0, failures: 0 },
    proficientSkills: [...skillSet],
    expertiseSkills: [...(input.expertise ?? [])],
    languages: 'Общий',
    toolProficiencies: [classDef.toolProficiencies, background?.toolProficiency]
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
        level: 1,
        date: now,
        hpGained: classDef.hitDie,
        notes: ['Начало пути!'],
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
}
