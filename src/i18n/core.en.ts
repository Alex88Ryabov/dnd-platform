import type {
  Ability, ConditionId, DamageType, Rarity, Recharge, Size, SkillId, SpellSchool, WeaponMastery,
} from '../model/types';

// English rules terminology (SRD 5.2) — the reference for all data translations.

export const ABILITY_NAMES_EN: Record<Ability, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

export const ABILITY_SHORT_EN: Record<Ability, string> = {
  str: 'STR',
  dex: 'DEX',
  con: 'CON',
  int: 'INT',
  wis: 'WIS',
  cha: 'CHA',
};

export const SKILL_NAMES_EN: Record<SkillId, string> = {
  athletics: 'Athletics',
  acrobatics: 'Acrobatics',
  sleightOfHand: 'Sleight of Hand',
  stealth: 'Stealth',
  arcana: 'Arcana',
  history: 'History',
  investigation: 'Investigation',
  nature: 'Nature',
  religion: 'Religion',
  animalHandling: 'Animal Handling',
  insight: 'Insight',
  medicine: 'Medicine',
  perception: 'Perception',
  survival: 'Survival',
  deception: 'Deception',
  intimidation: 'Intimidation',
  performance: 'Performance',
  persuasion: 'Persuasion',
};

export const CONDITIONS_EN: Record<ConditionId, { name: string; description: string }> = {
  blinded: { name: 'Blinded', description: 'Can’t see; automatically fails any check that requires sight. Attack rolls against it have advantage, its attacks have disadvantage.' },
  charmed: { name: 'Charmed', description: 'Can’t attack the charmer or target them with harmful abilities. The charmer has advantage on social checks against it.' },
  deafened: { name: 'Deafened', description: 'Can’t hear; automatically fails any check that requires hearing.' },
  frightened: { name: 'Frightened', description: 'Disadvantage on checks and attacks while the source of fear is in sight. Can’t willingly move closer to the source of fear.' },
  grappled: { name: 'Grappled', description: 'Speed is 0. Disadvantage on attacks against anyone but the grappler. The grappler can drag it along.' },
  incapacitated: { name: 'Incapacitated', description: 'Can’t take actions, bonus actions, or reactions. Loses concentration.' },
  invisible: { name: 'Invisible', description: 'Can’t be seen without special senses. Attacks against it have disadvantage, its attacks have advantage.' },
  paralyzed: { name: 'Paralyzed', description: 'Incapacitated, can’t move or speak. Fails Strength and Dexterity saves. Attacks against it have advantage; a hit from within 5 feet is a critical hit.' },
  petrified: { name: 'Petrified', description: 'Turned to stone: incapacitated, can’t move, has resistance to all damage, and is immune to poison.' },
  poisoned: { name: 'Poisoned', description: 'Disadvantage on attack rolls and ability checks.' },
  prone: { name: 'Prone', description: 'Can only crawl. Its attacks have disadvantage. Attacks against it have advantage from within 5 feet, disadvantage from farther away.' },
  restrained: { name: 'Restrained', description: 'Speed is 0. Attacks against it have advantage, its attacks have disadvantage. Disadvantage on Dexterity saves.' },
  stunned: { name: 'Stunned', description: 'Incapacitated, can’t move, and can speak only falteringly. Fails Strength and Dexterity saves. Attacks against it have advantage.' },
  unconscious: { name: 'Unconscious', description: 'Incapacitated, falls prone, drops everything. Fails Strength and Dexterity saves. A hit from within 5 feet is a critical hit.' },
};

export const DAMAGE_TYPE_NAMES_EN: Record<DamageType, string> = {
  slashing: 'slashing',
  piercing: 'piercing',
  bludgeoning: 'bludgeoning',
  fire: 'fire',
  cold: 'cold',
  lightning: 'lightning',
  thunder: 'thunder',
  acid: 'acid',
  poison: 'poison',
  radiant: 'radiant',
  necrotic: 'necrotic',
  force: 'force',
  psychic: 'psychic',
};

export const SCHOOL_NAMES_EN: Record<SpellSchool, string> = {
  abjuration: 'Abjuration',
  conjuration: 'Conjuration',
  divination: 'Divination',
  enchantment: 'Enchantment',
  evocation: 'Evocation',
  illusion: 'Illusion',
  necromancy: 'Necromancy',
  transmutation: 'Transmutation',
};

export const MASTERY_INFO_EN: Record<WeaponMastery, { name: string; description: string }> = {
  cleave: { name: 'Cleave', description: 'On a hit, you can attack a second creature within 5 feet of the first (damage without the ability modifier).' },
  graze: { name: 'Graze', description: 'On a miss, the target still takes damage equal to your ability modifier.' },
  nick: { name: 'Nick', description: 'The extra attack with a second Light weapon is made as part of the same attack, keeping your bonus action free.' },
  push: { name: 'Push', description: 'On a hit, you can push the target (Large or smaller) up to 10 feet away from you.' },
  sap: { name: 'Sap', description: 'On a hit, the target has disadvantage on its next attack roll before the start of your next turn.' },
  slow: { name: 'Slow', description: 'On a hit, the target’s speed is reduced by 10 feet until the start of your next turn.' },
  topple: { name: 'Topple', description: 'On a hit, the target makes a Constitution saving throw or falls prone.' },
  vex: { name: 'Vex', description: 'On a hit, you have advantage on your next attack roll against that target before the end of your next turn.' },
};

export const SIZE_NAMES_EN: Record<Size, string> = {
  tiny: 'Tiny',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  huge: 'Huge',
  gargantuan: 'Gargantuan',
};

export const RARITY_NAMES_EN: Record<Rarity, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  veryRare: 'Very Rare',
  legendary: 'Legendary',
  artifact: 'Artifact',
};

export const RECHARGE_NAMES_EN: Record<Recharge, string> = {
  short: 'short rest',
  long: 'long rest',
  none: 'doesn’t recover on a rest',
};

export const ALIGNMENTS_EN: string[] = [
  'Lawful Good', 'Neutral Good', 'Chaotic Good',
  'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
  'Lawful Evil', 'Neutral Evil', 'Chaotic Evil',
];
