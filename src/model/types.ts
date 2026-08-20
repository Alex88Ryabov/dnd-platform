// Модель данных платформы. Правила — D&D 2024 (SRD 5.2).

export type Ability = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export type SkillId =
  | 'athletics'
  | 'acrobatics' | 'sleightOfHand' | 'stealth'
  | 'arcana' | 'history' | 'investigation' | 'nature' | 'religion'
  | 'animalHandling' | 'insight' | 'medicine' | 'perception' | 'survival'
  | 'deception' | 'intimidation' | 'performance' | 'persuasion';

export type ClassId =
  | 'barbarian' | 'bard' | 'cleric' | 'druid' | 'fighter' | 'monk'
  | 'paladin' | 'ranger' | 'rogue' | 'sorcerer' | 'warlock' | 'wizard';

export type SpeciesId =
  | 'human' | 'elf' | 'dwarf' | 'halfling' | 'dragonborn'
  | 'gnome' | 'goliath' | 'orc' | 'tiefling' | 'aasimar'
  | 'half-elf' | 'half-orc' | 'tabaxi' | 'kenku' | 'tortle'
  | 'firbolg' | 'genasi-air' | 'genasi-earth' | 'genasi-fire' | 'genasi-water'
  | 'triton' | 'lizardfolk' | 'harengon' | 'owlin' | 'fairy'
  | 'satyr' | 'centaur' | 'minotaur' | 'aarakocra' | 'goblin'
  | 'hobgoblin' | 'bugbear' | 'kobold' | 'yuan-ti' | 'changeling'
  | 'shifter' | 'warforged' | 'duergar' | 'deep-gnome' | 'eladrin'
  | 'sea-elf' | 'shadar-kai' | 'githyanki' | 'githzerai';

export type Size = 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan';

export type DamageType =
  | 'slashing' | 'piercing' | 'bludgeoning'
  | 'fire' | 'cold' | 'lightning' | 'thunder' | 'acid' | 'poison'
  | 'radiant' | 'necrotic' | 'force' | 'psychic';

export type SpellSchool =
  | 'abjuration' | 'conjuration' | 'divination' | 'enchantment'
  | 'evocation' | 'illusion' | 'necromancy' | 'transmutation';

export type ConditionId =
  | 'blinded' | 'charmed' | 'deafened' | 'frightened' | 'grappled'
  | 'incapacitated' | 'invisible' | 'paralyzed' | 'petrified' | 'poisoned'
  | 'prone' | 'restrained' | 'stunned' | 'unconscious';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'veryRare' | 'legendary' | 'artifact';

export type ItemKind = 'weapon' | 'armor' | 'shield' | 'gear' | 'tool' | 'consumable' | 'treasure' | 'magic';

export type WeaponMastery = 'cleave' | 'graze' | 'nick' | 'push' | 'sap' | 'slow' | 'topple' | 'vex';

export type Recharge = 'short' | 'long' | 'none';

// ---------- Справочники правил ----------

export interface SkillDef {
  id: SkillId;
  name: string;
  ability: Ability;
}

export interface SkillChoiceDef {
  count: number;
  from: SkillId[];
  // выбор необязателен: у кобольда навык — лишь один из вариантов черты
  optional?: boolean;
}

export interface ClassFeature {
  level: number;
  name: string;
  nameEn?: string;
  description: string;
}

export interface ClassResourceDef {
  key: string;
  name: string;
  recharge: Recharge;
  // индекс = уровень персонажа (1..20), значение = максимум использований; 0 = ещё нет
  maxByLevel?: number[];
  // либо вычисляемый максимум: модификатор характеристики / уровень / бонус мастерства
  maxFormula?: 'ability' | 'level' | 'pb';
  formulaAbility?: Ability;
  multiplier?: number;
  minLevel?: number;
}

export interface SubclassDef {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  features: ClassFeature[];
}

export interface CasterDef {
  kind: 'full' | 'half' | 'pact';
  ability: Ability;
  // индекс = уровень персонажа (1..20)
  preparedByLevel: number[];
  cantripsByLevel: number[];
  listId: ClassId;
}

export interface StartingItem {
  itemId: string;
  qty: number;
}

export interface ClassDef {
  id: ClassId;
  name: string;
  nameEn: string;
  color: string;
  tagline: string;
  description: string;
  hitDie: 6 | 8 | 10 | 12;
  primaryAbilities: Ability[];
  saveProficiencies: Ability[];
  skillChoices: SkillChoiceDef;
  weaponProficiencies: string;
  armorTraining: string;
  toolProficiencies?: string;
  startingEquipment: StartingItem[];
  startingGold: number;
  caster?: CasterDef;
  features: ClassFeature[];
  subclassLevel: number;
  subclassLabel: string;
  subclasses: SubclassDef[];
  resources: ClassResourceDef[];
  asiLevels: number[];
  weaponMasteryByLevel?: number[];
}

export interface SpeciesTrait {
  name: string;
  description: string;
}

export interface SpeciesDef {
  id: SpeciesId;
  name: string;
  nameEn: string;
  description: string;
  size: Size;
  sizeNote?: string;
  speed: number;
  darkvision?: number;
  // навыки от расы: выданные сразу и выбор из списка
  skills?: SkillId[];
  skillChoices?: SkillChoiceDef;
  traits: SpeciesTrait[];
  // раса из «основного набора» (PHB 2024) — показывается первой при создании героя
  core?: boolean;
  icon: string;
}

export interface BackgroundDef {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  abilities: [Ability, Ability, Ability];
  skills: [SkillId, SkillId];
  toolProficiency: string;
  featId: string;
  equipmentNote: string;
}

export interface FeatDef {
  id: string;
  name: string;
  nameEn: string;
  category: 'origin' | 'general' | 'fightingStyle';
  description: string;
}

// ---------- Заклинания ----------

export interface SpellDef {
  id: string;
  name: string;
  nameEn: string;
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  school: SpellSchool;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  concentration?: boolean;
  ritual?: boolean;
  classes: ClassId[];
  description: string;
  higherLevels?: string;
  damage?: { dice: string; type: DamageType };
  save?: Ability;
  attack?: boolean;
}

// ---------- Предметы ----------

export interface WeaponProps {
  category: 'simple' | 'martial';
  damage: string;
  damageType: DamageType;
  properties: string[];
  mastery: WeaponMastery;
  range?: [number, number];
  versatile?: string;
  finesse?: boolean;
  ranged?: boolean;
  thrown?: boolean;
  light?: boolean;
  twoHanded?: boolean;
}

export interface ArmorProps {
  category: 'light' | 'medium' | 'heavy';
  baseAC: number;
  // максимальный учитываемый модификатор Ловкости; null = без ограничений
  dexCap: number | null;
  stealthDisadvantage?: boolean;
  strRequirement?: number;
}

export interface ItemDef {
  id: string;
  name: string;
  nameEn: string;
  kind: ItemKind;
  costGp: number;
  weight: number;
  description: string;
  weapon?: WeaponProps;
  armor?: ArmorProps;
  shieldBonus?: number;
  magic?: { rarity: Rarity; attunement?: boolean };
  healing?: string;
}

// ---------- Монстры ----------

export interface MonsterAction {
  name: string;
  description: string;
}

export interface MonsterDef {
  id: string;
  name: string;
  nameEn: string;
  size: Size;
  type: string;
  alignment: string;
  cr: number;
  xp: number;
  ac: number;
  hp: number;
  hpFormula: string;
  speed: string;
  abilities: Record<Ability, number>;
  saves?: string;
  skills?: string;
  resistances?: string;
  immunities?: string;
  vulnerabilities?: string;
  senses: string;
  languages: string;
  traits?: MonsterAction[];
  actions: MonsterAction[];
  bonusActions?: MonsterAction[];
  reactions?: MonsterAction[];
  legendary?: MonsterAction[];
  description: string;
  icon: string;
}

// ---------- Персонаж (хранимое состояние) ----------

export interface InventoryItem {
  uid: string;
  itemId?: string;
  custom?: { name: string; kind: ItemKind; description?: string };
  qty: number;
  equipped?: boolean;
  attuned?: boolean;
  notes?: string;
}

export interface Money {
  pp: number;
  gp: number;
  ep: number;
  sp: number;
  cp: number;
}

export interface SpellState {
  cantrips: string[];
  prepared: string[];
  // индекс 0..8 = круг 1..9
  slotsUsed: number[];
  pactUsed: number;
  customSpells: SpellDef[];
}

export interface ResourceState {
  key: string;
  used: number;
}

export interface CustomResource {
  key: string;
  name: string;
  max: number;
  used: number;
  recharge: Recharge;
}

export interface LevelLogEntry {
  level: number;
  date: string;
  hpGained: number;
  notes: string[];
}

export interface DeathSaves {
  successes: number;
  failures: number;
}

export interface Portrait {
  icon: string;
  hue: number;
  // своя картинка (data-URL, сжатая до ~192px) — если задана, показывается вместо иконки
  image?: string;
}

export interface Character {
  id: string;
  name: string;
  playerName: string;
  portrait: Portrait;
  classId: ClassId;
  subclassId?: string;
  speciesId: SpeciesId;
  backgroundId: string;
  customBackground?: string;
  level: number;
  xp: number;
  abilities: Record<Ability, number>;
  // результат кости хитов за каждый уровень (индекс 0 = 1-й уровень, максимум кости);
  // итоговый максимум хитов выводится движком: сумма + Телосложение×уровень + бонусы черт/вида
  hpRolls: number[];
  hpMaxBonus: number;
  hpCurrent: number;
  hpTemp: number;
  hitDiceSpent: number;
  deathSaves: DeathSaves;
  proficientSkills: SkillId[];
  expertiseSkills: SkillId[];
  languages: string;
  toolProficiencies: string;
  featIds: string[];
  customFeats: { name: string; description: string }[];
  fightingStyleId?: string;
  inventory: InventoryItem[];
  money: Money;
  spells: SpellState;
  resources: ResourceState[];
  customResources: CustomResource[];
  conditions: ConditionId[];
  exhaustion: number;
  heroicInspiration: boolean;
  concentratingOn?: string;
  acOverride?: number;
  speedOverride?: number;
  alignment: string;
  appearance: string;
  backstory: string;
  notes: string;
  levelLog: LevelLogEntry[];
  createdAt: string;
  updatedAt: string;
}

// ---------- Журнал кампании ----------

export interface JournalEntry {
  id: string;
  ts: string;
  title: string;
  text: string;
  kind: 'session' | 'event' | 'note';
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'done' | 'failed';
  reward?: string;
}

export interface NpcNote {
  id: string;
  name: string;
  description: string;
  attitude: 'friend' | 'neutral' | 'enemy';
}

export interface PlaceNote {
  id: string;
  name: string;
  description: string;
}

// отзыв игрока о прошедшей игре
export interface PlayerReview {
  id: string;
  ts: string;
  author: string;
  rating: number;
  text: string;
}

// ---------- Бой ----------

export interface Combatant {
  uid: string;
  kind: 'pc' | 'monster' | 'custom';
  refId?: string;
  name: string;
  initiative: number;
  hp: number;
  hpMax: number;
  ac: number;
  conditions: ConditionId[];
  note?: string;
  icon: string;
  defeated?: boolean;
}

export interface CombatState {
  active: boolean;
  round: number;
  turnIndex: number;
  combatants: Combatant[];
}

// ---------- Броски ----------

export interface DieRoll {
  die: number;
  results: number[];
  kept?: number[];
}

export interface RollLogEntry {
  id: string;
  ts: string;
  who?: string;
  label: string;
  rolls: DieRoll[];
  modifier: number;
  total: number;
  crit?: 'success' | 'fail';
  dc?: number;
  success?: boolean;
}

// ---------- Настройки ----------

export type AppLang = 'ru' | 'uk' | 'en';

export interface Settings {
  campaignName: string;
  soundOn: boolean;
  xpMode: 'xp' | 'milestone';
  lang: AppLang;
}

// ---------- Слоты сохранений ----------

export interface SaveSlot {
  id: string;
  name: string;
  ts: string;
  charactersCount: number;
  // сериализованное состояние игры (JSON)
  payload: string;
}
