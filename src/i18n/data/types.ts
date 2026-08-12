import type { ClassId, SpeciesId } from '../../model/types';

// Формы словарей перевода каталогов. Ключи — id сущностей из src/data.
// Массивы (features, traits, actions…) идут строго в порядке исходного каталога.
// Отсутствующая запись или поле — показывается русский оригинал.

export interface NamedTextL10n {
  name: string;
  description: string;
}

export interface SubclassL10n {
  name: string;
  description: string;
  features: NamedTextL10n[];
}

export interface ClassL10n {
  name: string;
  tagline: string;
  description: string;
  weaponProficiencies: string;
  armorTraining: string;
  toolProficiencies?: string;
  subclassLabel: string;
  features: NamedTextL10n[];
  subclasses: Record<string, SubclassL10n>;
  // key ресурса класса -> название
  resources: Record<string, string>;
}

export interface SpeciesL10n {
  name: string;
  description: string;
  sizeNote?: string;
  traits: NamedTextL10n[];
}

export interface BackgroundL10n {
  name: string;
  description: string;
  toolProficiency: string;
  equipmentNote: string;
}

export interface FeatL10n {
  name: string;
  description: string;
}

export interface SpellL10n {
  name: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  higherLevels?: string;
}

export interface ItemL10n {
  name: string;
  description: string;
  // для оружия: свойства по порядку weapon.properties
  properties?: string[];
}

export interface MonsterL10n {
  name: string;
  type: string;
  alignment: string;
  speed: string;
  saves?: string;
  skills?: string;
  resistances?: string;
  immunities?: string;
  vulnerabilities?: string;
  senses: string;
  languages: string;
  description: string;
  traits?: NamedTextL10n[];
  actions: NamedTextL10n[];
  bonusActions?: NamedTextL10n[];
  reactions?: NamedTextL10n[];
  legendary?: NamedTextL10n[];
}

export type ClassesL10n = Partial<Record<ClassId, ClassL10n>>;
export type SpeciesL10nMap = Partial<Record<SpeciesId, SpeciesL10n>>;
export type BackgroundsL10n = Record<string, BackgroundL10n>;
export type FeatsL10n = Record<string, FeatL10n>;
export type SpellsL10n = Record<string, SpellL10n>;
export type ItemsL10n = Record<string, ItemL10n>;
export type MonstersL10n = Record<string, MonsterL10n>;
