import type {
  Ability, Character, ClassDef, ClassResourceDef, InventoryItem, ItemDef, Recharge, SkillId,
} from '../model/types';
import { FULL_CASTER_SLOTS, HALF_CASTER_SLOTS, PACT_SLOTS, PB_FOR_LEVEL, SKILLS } from '../data/core';
import { getCatalog } from '../i18n/catalog';
import { rules } from '../i18n/rules';
import { tr } from '../i18n/tr';
import { T_ENGINE } from '../i18n/ui/engine';
import { fmtDistance } from '../i18n/units';
import { formatModifier } from './dice';

export interface SkillRow {
  id: SkillId;
  name: string;
  ability: Ability;
  bonus: number;
  proficient: boolean;
  expertise: boolean;
}

export interface SaveRow {
  ability: Ability;
  bonus: number;
  proficient: boolean;
}

export interface AttackRow {
  name: string;
  bonus: number;
  damage: string;
  damageType: string;
  masteryNote?: string;
  rangeNote?: string;
}

export interface SpellcastingInfo {
  ability: Ability;
  dc: number;
  attackBonus: number;
  slotsMax: number[];
  pactSlots: number;
  pactLevel: number;
  preparedMax: number;
  cantripsMax: number;
}

export interface ResourceRow {
  key: string;
  name: string;
  max: number;
  used: number;
  recharge: Recharge;
  custom?: boolean;
}

export interface DerivedStats {
  mods: Record<Ability, number>;
  pb: number;
  ac: number;
  acNote: string;
  initiative: number;
  speedFt: number;
  hpMax: number;
  skills: SkillRow[];
  saves: SaveRow[];
  attacks: AttackRow[];
  spellcasting?: SpellcastingInfo;
  resources: ResourceRow[];
  passivePerception: number;
  hitDie: number;
  hitDiceTotal: number;
  hitDiceAvailable: number;
  classDef: ClassDef;
}

export function abilityMod(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function resolveItem(entry: InventoryItem): ItemDef | undefined {
  return entry.itemId ? getCatalog().itemsById[entry.itemId] : undefined;
}

export function itemName(entry: InventoryItem): string {
  return resolveItem(entry)?.name ?? entry.custom?.name ?? tr(T_ENGINE.itemFallback);
}

function resourceMax(def: ClassResourceDef, level: number, mods: Record<Ability, number>, pb: number): number {
  if (def.minLevel && level < def.minLevel) {
    return 0;
  }
  if (def.maxByLevel) {
    return def.maxByLevel[level] ?? 0;
  }
  const multiplier = def.multiplier ?? 1;
  if (def.maxFormula === 'level') {
    return level * multiplier;
  }
  if (def.maxFormula === 'pb') {
    return pb * multiplier;
  }
  if (def.maxFormula === 'ability' && def.formulaAbility) {
    return Math.max(1, mods[def.formulaAbility]) * multiplier;
  }
  return 0;
}

function monkMartialArtsDie(level: number): number {
  if (level >= 17) {
    return 12;
  }
  if (level >= 11) {
    return 10;
  }
  if (level >= 5) {
    return 8;
  }
  return 6;
}

export function sneakAttackDice(level: number): number {
  return Math.ceil(level / 2);
}

export function derive(char: Character): DerivedStats {
  const { classesById, speciesById } = getCatalog();
  const classDef = classesById[char.classId];
  const species = speciesById[char.speciesId];
  const level = char.level;
  const pb = PB_FOR_LEVEL[level];

  const mods = {
    str: abilityMod(char.abilities.str),
    dex: abilityMod(char.abilities.dex),
    con: abilityMod(char.abilities.con),
    int: abilityMod(char.abilities.int),
    wis: abilityMod(char.abilities.wis),
    cha: abilityMod(char.abilities.cha),
  };

  // --- Хиты ---
  let hpMax = char.hpRolls.reduce((a, b) => a + b, 0) + mods.con * level + char.hpMaxBonus;
  if (char.speciesId === 'dwarf') {
    hpMax += level;
  }
  if (char.featIds.includes('tough')) {
    hpMax += 2 * level;
  }
  if (char.subclassId === 'draconic') {
    hpMax += 3 + level;
  }
  hpMax = Math.max(1, hpMax);

  // --- Доспехи и КБ ---
  const equipped = char.inventory.filter((entry) => entry.equipped);
  const armorEntry = equipped.find((entry) => resolveItem(entry)?.armor);
  const armorDef = armorEntry ? resolveItem(armorEntry) : undefined;
  const hasShield = equipped.some((entry) => resolveItem(entry)?.kind === 'shield');
  const shieldBonus = equipped.reduce((sum, entry) => {
    const item = resolveItem(entry);
    if (item?.shieldBonus) {
      return sum + item.shieldBonus + (item.id === 'shield-plus-1' ? 0 : 0);
    }
    return sum;
  }, 0);

  const acCandidates: { value: number; note: string }[] = [
    { value: 10 + mods.dex, note: tr(T_ENGINE.acUnarmored) },
  ];
  if (armorDef?.armor) {
    const dexPart = armorDef.armor.dexCap === null
      ? mods.dex
      : Math.min(mods.dex, armorDef.armor.dexCap);
    acCandidates.push({ value: armorDef.armor.baseAC + dexPart, note: armorDef.name });
  }
  if (char.classId === 'barbarian' && !armorDef) {
    acCandidates.push({ value: 10 + mods.dex + mods.con, note: tr(T_ENGINE.acUnarmoredDefense) });
  }
  if (char.classId === 'monk' && !armorDef && !hasShield) {
    acCandidates.push({ value: 10 + mods.dex + mods.wis, note: tr(T_ENGINE.acUnarmoredDefense) });
  }
  if (char.subclassId === 'draconic' && !armorDef) {
    acCandidates.push({ value: 10 + mods.dex + mods.cha, note: tr(T_ENGINE.acDraconic) });
  }
  if (char.speciesId === 'tortle') {
    acCandidates.push({ value: 17, note: tr(T_ENGINE.acShell) });
  }
  if (char.speciesId === 'lizardfolk' && !armorDef) {
    acCandidates.push({ value: 13 + mods.dex, note: tr(T_ENGINE.acNatural) });
  }
  const best = acCandidates.reduce((a, b) => (b.value > a.value ? b : a));
  let ac = best.value + shieldBonus;
  if (char.speciesId === 'warforged') {
    ac += 1;
  }
  let acNote = best.note + (shieldBonus > 0 ? tr(T_ENGINE.acShield) : '');
  if (char.fightingStyleId === 'fs-defense' && armorDef) {
    ac += 1;
  }
  const protectionBonus = equipped.filter(
    (entry) => entry.itemId === 'ring-of-protection' || entry.itemId === 'cloak-of-protection',
  ).length;
  ac += protectionBonus;
  const armorPlus = equipped.some((entry) => entry.itemId === 'armor-plus-1') ? 1 : 0;
  ac += armorPlus;
  if (char.acOverride !== undefined) {
    ac = char.acOverride;
    acNote = tr(T_ENGINE.acManual);
  }

  // --- Скорость ---
  let speedFt = species.speed;
  const heavyArmor = armorDef?.armor?.category === 'heavy';
  if (char.classId === 'barbarian' && level >= 5 && !heavyArmor) {
    speedFt += 10;
  }
  if (char.classId === 'monk' && !armorDef && !hasShield && level >= 2) {
    speedFt += level >= 18 ? 30 : level >= 14 ? 25 : level >= 10 ? 20 : level >= 6 ? 15 : 10;
  }
  if (char.classId === 'ranger' && level >= 6) {
    speedFt += 10;
  }
  if (armorDef?.armor?.strRequirement && char.abilities.str < armorDef.armor.strRequirement) {
    speedFt -= 10;
  }
  if (char.speedOverride !== undefined) {
    speedFt = char.speedOverride;
  }

  // --- Навыки и спасброски ---
  const skillNames = rules().skillNames;
  const jack = char.classId === 'bard' && level >= 2 ? Math.floor(pb / 2) : 0;
  const skills: SkillRow[] = SKILLS.map((skill) => {
    const proficient = char.proficientSkills.includes(skill.id);
    const expertise = char.expertiseSkills.includes(skill.id);
    const profPart = expertise ? pb * 2 : proficient ? pb : jack;
    return {
      id: skill.id,
      name: skillNames[skill.id],
      ability: skill.ability,
      bonus: mods[skill.ability] + profPart,
      proficient,
      expertise,
    };
  });

  const saveProfs = new Set(classDef.saveProficiencies);
  if (char.classId === 'monk' && level >= 14) {
    (['str', 'dex', 'con', 'int', 'wis', 'cha'] as Ability[]).forEach((a) => saveProfs.add(a));
  }
  if (char.classId === 'rogue' && level >= 15) {
    saveProfs.add('wis');
    saveProfs.add('cha');
  }
  const saveItemBonus = protectionBonus;
  const saves: SaveRow[] = (['str', 'dex', 'con', 'int', 'wis', 'cha'] as Ability[]).map((a) => ({
    ability: a,
    bonus: mods[a] + (saveProfs.has(a) ? pb : 0) + saveItemBonus,
    proficient: saveProfs.has(a),
  }));

  // --- Инициатива ---
  let initiative = mods.dex + jack;
  if (char.featIds.includes('alert')) {
    initiative += pb;
  }

  // --- Атаки ---
  const attacks: AttackRow[] = [];
  const masteryCount = classDef.weaponMasteryByLevel?.[level] ?? 0;
  for (const entry of equipped) {
    const item = resolveItem(entry);
    if (!item?.weapon) {
      continue;
    }
    const w = item.weapon;
    const useDex = w.ranged || (w.finesse && mods.dex > mods.str);
    const mod = useDex ? mods.dex : mods.str;
    const styleBonus = char.fightingStyleId === 'fs-archery' && w.ranged ? 2 : 0;
    const damageMod = mod + (char.fightingStyleId === 'fs-dueling' && !w.twoHanded && !w.ranged ? 2 : 0);
    const damageDie = char.classId === 'monk' && !w.ranged
      ? (() => {
        const monkDie = monkMartialArtsDie(level);
        const own = parseInt(w.damage.split('d')[1] ?? '0', 10);
        return own < monkDie ? `1d${monkDie}` : w.damage;
      })()
      : w.damage;
    attacks.push({
      name: item.name,
      bonus: pb + mod + styleBonus,
      damage: `${damageDie}${damageMod !== 0 ? formatModifier(damageMod) : ''}`,
      damageType: w.damageType,
      masteryNote: masteryCount > 0 ? w.mastery : undefined,
      rangeNote: w.range
        ? `${fmtDistance(w.range[0])} / ${fmtDistance(w.range[1])}`
        : w.versatile ? tr(T_ENGINE.twoHandedGrip, { dice: w.versatile }) : undefined,
    });
  }
  if (char.classId === 'monk') {
    const die = monkMartialArtsDie(level);
    const mod = Math.max(mods.str, mods.dex);
    attacks.push({
      name: tr(T_ENGINE.unarmedStrikeMartial),
      bonus: pb + mod,
      damage: `1d${die}${mod !== 0 ? formatModifier(mod) : ''}`,
      damageType: 'bludgeoning',
    });
  } else {
    attacks.push({
      name: tr(T_ENGINE.unarmedStrike),
      bonus: pb + mods.str,
      damage: `${Math.max(1, 1 + mods.str)}`,
      damageType: 'bludgeoning',
    });
  }

  // --- Заклинания ---
  let spellcasting: SpellcastingInfo | undefined;
  if (classDef.caster) {
    const caster = classDef.caster;
    const castMod = mods[caster.ability];
    const slotsMax = caster.kind === 'full'
      ? FULL_CASTER_SLOTS[level]
      : caster.kind === 'half'
        ? HALF_CASTER_SLOTS[level]
        : [0, 0, 0, 0, 0, 0, 0, 0, 0];
    const [pactCount, pactLevel] = caster.kind === 'pact' ? PACT_SLOTS[level] : [0, 0];
    spellcasting = {
      ability: caster.ability,
      dc: 8 + pb + castMod,
      attackBonus: pb + castMod,
      slotsMax,
      pactSlots: pactCount,
      pactLevel,
      preparedMax: caster.preparedByLevel[level] ?? 0,
      cantripsMax: caster.cantripsByLevel[level] ?? 0,
    };
  }

  // --- Ресурсы ---
  const resources: ResourceRow[] = [];
  for (const def of classDef.resources) {
    const max = resourceMax(def, level, mods, pb);
    if (max <= 0) {
      continue;
    }
    const state = char.resources.find((r) => r.key === def.key);
    resources.push({
      key: def.key,
      name: def.name,
      max,
      used: Math.min(state?.used ?? 0, max),
      recharge: def.recharge,
    });
  }
  for (const custom of char.customResources) {
    resources.push({
      key: custom.key,
      name: custom.name,
      max: custom.max,
      used: Math.min(custom.used, custom.max),
      recharge: custom.recharge,
      custom: true,
    });
  }

  const perceptionRow = skills.find((s) => s.id === 'perception');

  return {
    mods,
    pb,
    ac,
    acNote,
    initiative,
    speedFt,
    hpMax,
    skills,
    saves,
    attacks,
    spellcasting,
    resources,
    passivePerception: 10 + (perceptionRow?.bonus ?? 0),
    hitDie: classDef.hitDie,
    hitDiceTotal: level,
    hitDiceAvailable: Math.max(0, level - char.hitDiceSpent),
    classDef,
  };
}
