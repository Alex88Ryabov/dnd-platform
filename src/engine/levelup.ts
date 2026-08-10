import type { Ability, Character, ClassFeature } from '../model/types';
import { CLASSES_BY_ID } from '../data/classes';
import { FEATS_BY_ID } from '../data/feats';
import { ABILITY_NAMES } from '../data/core';
import { dieAverage } from './dice';
import { derive } from './derive';

export interface LevelUpPreview {
  newLevel: number;
  hitDie: number;
  avgHp: number;
  features: ClassFeature[];
  subclassFeatures: ClassFeature[];
  needsSubclass: boolean;
  isAsi: boolean;
  spellNotes: string[];
}

export type AsiDecision =
  | { kind: 'asi'; first: Ability; second: Ability }
  | { kind: 'asi2'; first: Ability }
  | { kind: 'feat'; featId: string }
  | { kind: 'customFeat'; name: string; description: string };

export interface LevelUpDecisions {
  hpGain: number;
  hpMode: 'roll' | 'avg';
  subclassId?: string;
  asi?: AsiDecision;
}

export function previewLevelUp(char: Character): LevelUpPreview | null {
  if (char.level >= 20) {
    return null;
  }
  const classDef = CLASSES_BY_ID[char.classId];
  const newLevel = char.level + 1;
  const features = classDef.features.filter((f) => f.level === newLevel);
  const needsSubclass = newLevel === classDef.subclassLevel && !char.subclassId;
  const subclass = classDef.subclasses.find((s) => s.id === char.subclassId)
    ?? (needsSubclass ? undefined : undefined);
  const subclassFeatures = (char.subclassId
    ? classDef.subclasses.find((s) => s.id === char.subclassId)?.features ?? []
    : classDef.subclasses[0]?.features ?? []
  ).filter((f) => f.level === newLevel);

  const spellNotes: string[] = [];
  if (classDef.caster) {
    const prevPrepared = classDef.caster.preparedByLevel[char.level] ?? 0;
    const nextPrepared = classDef.caster.preparedByLevel[newLevel] ?? 0;
    if (nextPrepared > prevPrepared) {
      spellNotes.push(`Подготовленных заклинаний: ${nextPrepared} (было ${prevPrepared}).`);
    }
    const prevCantrips = classDef.caster.cantripsByLevel[char.level] ?? 0;
    const nextCantrips = classDef.caster.cantripsByLevel[newLevel] ?? 0;
    if (nextCantrips > prevCantrips) {
      spellNotes.push(`Новый заговор! Всего заговоров: ${nextCantrips}.`);
    }
  }

  void subclass;
  return {
    newLevel,
    hitDie: classDef.hitDie,
    avgHp: dieAverage(classDef.hitDie),
    features,
    subclassFeatures,
    needsSubclass,
    isAsi: classDef.asiLevels.includes(newLevel),
    spellNotes,
  };
}

export function applyLevelUp(char: Character, decisions: LevelUpDecisions): Character {
  const classDef = CLASSES_BY_ID[char.classId];
  const newLevel = char.level + 1;
  const notes: string[] = [];

  const next: Character = {
    ...char,
    level: newLevel,
    hpRolls: [...char.hpRolls, decisions.hpGain],
    abilities: { ...char.abilities },
    featIds: [...char.featIds],
    customFeats: [...char.customFeats],
    levelLog: [...char.levelLog],
    updatedAt: new Date().toISOString(),
  };

  notes.push(decisions.hpMode === 'roll'
    ? `Кость хитов: выпало ${decisions.hpGain}`
    : `Хиты по среднему: ${decisions.hpGain}`);

  if (decisions.subclassId) {
    next.subclassId = decisions.subclassId;
    const sub = classDef.subclasses.find((s) => s.id === decisions.subclassId);
    if (sub) {
      notes.push(`${classDef.subclassLabel}: ${sub.name}`);
    }
  }

  if (decisions.asi) {
    const asi = decisions.asi;
    if (asi.kind === 'asi') {
      next.abilities[asi.first] = Math.min(20, next.abilities[asi.first] + 1);
      next.abilities[asi.second] = Math.min(20, next.abilities[asi.second] + 1);
      notes.push(`+1 ${ABILITY_NAMES[asi.first]}, +1 ${ABILITY_NAMES[asi.second]}`);
    } else if (asi.kind === 'asi2') {
      next.abilities[asi.first] = Math.min(20, next.abilities[asi.first] + 2);
      notes.push(`+2 ${ABILITY_NAMES[asi.first]}`);
    } else if (asi.kind === 'feat') {
      next.featIds.push(asi.featId);
      notes.push(`Черта: ${FEATS_BY_ID[asi.featId]?.name ?? asi.featId}`);
    } else {
      next.customFeats.push({ name: asi.name, description: asi.description });
      notes.push(`Черта: ${asi.name}`);
    }
  }

  const gainedFeatures = classDef.features.filter((f) => f.level === newLevel);
  const subFeatures = next.subclassId
    ? (classDef.subclasses.find((s) => s.id === next.subclassId)?.features ?? []).filter((f) => f.level === newLevel)
    : [];
  for (const feature of [...gainedFeatures, ...subFeatures]) {
    notes.push(`Умение: ${feature.name}`);
  }

  // прибавка к текущим хитам = рост максимума (включая Телосложение и бонусы)
  const hpBefore = derive(char).hpMax;
  const hpAfter = derive(next).hpMax;
  next.hpCurrent = char.hpCurrent + Math.max(0, hpAfter - hpBefore);

  next.levelLog.push({
    level: newLevel,
    date: new Date().toISOString(),
    hpGained: Math.max(0, hpAfter - hpBefore),
    notes,
  });

  return next;
}
