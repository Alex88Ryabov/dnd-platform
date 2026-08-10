import type {
  Ability, ConditionId, DamageType, Rarity, Recharge, Size, SkillDef, SpellSchool, WeaponMastery,
} from '../model/types';

export const ABILITIES: Ability[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

export const ABILITY_NAMES: Record<Ability, string> = {
  str: 'Сила',
  dex: 'Ловкость',
  con: 'Телосложение',
  int: 'Интеллект',
  wis: 'Мудрость',
  cha: 'Харизма',
};

export const ABILITY_SHORT: Record<Ability, string> = {
  str: 'СИЛ',
  dex: 'ЛОВ',
  con: 'ТЕЛ',
  int: 'ИНТ',
  wis: 'МДР',
  cha: 'ХАР',
};

export const SKILLS: SkillDef[] = [
  { id: 'athletics', name: 'Атлетика', ability: 'str' },
  { id: 'acrobatics', name: 'Акробатика', ability: 'dex' },
  { id: 'sleightOfHand', name: 'Ловкость рук', ability: 'dex' },
  { id: 'stealth', name: 'Скрытность', ability: 'dex' },
  { id: 'arcana', name: 'Магия', ability: 'int' },
  { id: 'history', name: 'История', ability: 'int' },
  { id: 'investigation', name: 'Расследование', ability: 'int' },
  { id: 'nature', name: 'Природа', ability: 'int' },
  { id: 'religion', name: 'Религия', ability: 'int' },
  { id: 'animalHandling', name: 'Обращение с животными', ability: 'wis' },
  { id: 'insight', name: 'Проницательность', ability: 'wis' },
  { id: 'medicine', name: 'Медицина', ability: 'wis' },
  { id: 'perception', name: 'Восприятие', ability: 'wis' },
  { id: 'survival', name: 'Выживание', ability: 'wis' },
  { id: 'deception', name: 'Обман', ability: 'cha' },
  { id: 'intimidation', name: 'Запугивание', ability: 'cha' },
  { id: 'performance', name: 'Выступление', ability: 'cha' },
  { id: 'persuasion', name: 'Убеждение', ability: 'cha' },
];

export const CONDITIONS: Record<ConditionId, { name: string; icon: string; description: string }> = {
  blinded: { name: 'Ослеплён', icon: '🙈', description: 'Не видит; проверки, требующие зрения, автоматически проваливаются. Атаки по нему — с преимуществом, его атаки — с помехой.' },
  charmed: { name: 'Очарован', icon: '💘', description: 'Не может атаковать очаровавшего и делать его целью вредных способностей. Очаровавший имеет преимущество на социальные проверки.' },
  deafened: { name: 'Оглушён (слух)', icon: '🙉', description: 'Не слышит; автоматически проваливает проверки, требующие слуха.' },
  frightened: { name: 'Испуган', icon: '😱', description: 'Помеха на проверки и атаки, пока источник страха в поле зрения. Нельзя приближаться к источнику страха.' },
  grappled: { name: 'Схвачен', icon: '🤝', description: 'Скорость 0. Помеха на атаки по всем, кроме схватившего. Схвативший может перемещать его с собой.' },
  incapacitated: { name: 'Недееспособен', icon: '💫', description: 'Не может совершать действия, бонусные действия и реакции. Теряет концентрацию.' },
  invisible: { name: 'Невидим', icon: '👻', description: 'Его не видно без особых чувств. Атаки по нему — с помехой, его атаки — с преимуществом.' },
  paralyzed: { name: 'Парализован', icon: '🧊', description: 'Недееспособен, не может двигаться и говорить. Проваливает спасброски Силы и Ловкости. Атаки по нему — с преимуществом; попадание с 1,5 м — критическое.' },
  petrified: { name: 'Окаменел', icon: '🗿', description: 'Превращён в камень: недееспособен, не двигается, сопротивление всему урону, иммунитет к яду.' },
  poisoned: { name: 'Отравлен', icon: '🤢', description: 'Помеха на броски атаки и проверки характеристик.' },
  prone: { name: 'Сбит с ног', icon: '🛌', description: 'Может только ползти. Его атаки — с помехой. Атаки по нему с 1,5 м — с преимуществом, издалека — с помехой.' },
  restrained: { name: 'Опутан', icon: '🕸️', description: 'Скорость 0. Атаки по нему — с преимуществом, его атаки — с помехой. Помеха на спасброски Ловкости.' },
  stunned: { name: 'Ошеломлён', icon: '😵', description: 'Недееспособен, не может двигаться, говорит с трудом. Проваливает спасброски Силы и Ловкости. Атаки по нему — с преимуществом.' },
  unconscious: { name: 'Без сознания', icon: '💤', description: 'Недееспособен, падает ничком, роняет всё. Проваливает спасброски Силы и Ловкости. Попадание с 1,5 м — критическое.' },
};

// Опыт, необходимый для достижения уровня (индекс = уровень)
export const XP_FOR_LEVEL: number[] = [
  0, 0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
  85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000,
];

// Бонус мастерства по уровню (индекс = уровень)
export const PB_FOR_LEVEL: number[] = [
  0, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6,
];

// Ячейки полного заклинателя: индекс = уровень персонажа, значение = ячейки кругов 1..9
export const FULL_CASTER_SLOTS: number[][] = [
  [],
  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  [4, 3, 0, 0, 0, 0, 0, 0, 0],
  [4, 3, 2, 0, 0, 0, 0, 0, 0],
  [4, 3, 3, 0, 0, 0, 0, 0, 0],
  [4, 3, 3, 1, 0, 0, 0, 0, 0],
  [4, 3, 3, 2, 0, 0, 0, 0, 0],
  [4, 3, 3, 3, 1, 0, 0, 0, 0],
  [4, 3, 3, 3, 2, 0, 0, 0, 0],
  [4, 3, 3, 3, 2, 1, 0, 0, 0],
  [4, 3, 3, 3, 2, 1, 0, 0, 0],
  [4, 3, 3, 3, 2, 1, 1, 0, 0],
  [4, 3, 3, 3, 2, 1, 1, 0, 0],
  [4, 3, 3, 3, 2, 1, 1, 1, 0],
  [4, 3, 3, 3, 2, 1, 1, 1, 0],
  [4, 3, 3, 3, 2, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 2, 1, 1],
];

// Ячейки полузаклинателя (паладин, следопыт, правила 2024 — ячейки с 1-го уровня)
export const HALF_CASTER_SLOTS: number[][] = [
  [],
  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  [4, 3, 0, 0, 0, 0, 0, 0, 0],
  [4, 3, 0, 0, 0, 0, 0, 0, 0],
  [4, 3, 2, 0, 0, 0, 0, 0, 0],
  [4, 3, 2, 0, 0, 0, 0, 0, 0],
  [4, 3, 3, 0, 0, 0, 0, 0, 0],
  [4, 3, 3, 0, 0, 0, 0, 0, 0],
  [4, 3, 3, 1, 0, 0, 0, 0, 0],
  [4, 3, 3, 1, 0, 0, 0, 0, 0],
  [4, 3, 3, 2, 0, 0, 0, 0, 0],
  [4, 3, 3, 2, 0, 0, 0, 0, 0],
  [4, 3, 3, 3, 1, 0, 0, 0, 0],
  [4, 3, 3, 3, 1, 0, 0, 0, 0],
  [4, 3, 3, 3, 2, 0, 0, 0, 0],
  [4, 3, 3, 3, 2, 0, 0, 0, 0],
];

// Пакт колдуна: [количество ячеек, круг ячеек] по уровню
export const PACT_SLOTS: [number, number][] = [
  [0, 0],
  [1, 1], [2, 1], [2, 2], [2, 2], [2, 3], [2, 3], [2, 4], [2, 4], [2, 5], [2, 5],
  [3, 5], [3, 5], [3, 5], [3, 5], [3, 5], [3, 5], [4, 5], [4, 5], [4, 5], [4, 5],
];

export const DAMAGE_TYPE_NAMES: Record<DamageType, string> = {
  slashing: 'рубящий',
  piercing: 'колющий',
  bludgeoning: 'дробящий',
  fire: 'огонь',
  cold: 'холод',
  lightning: 'молния',
  thunder: 'звук',
  acid: 'кислота',
  poison: 'яд',
  radiant: 'излучение',
  necrotic: 'некротический',
  force: 'силовое поле',
  psychic: 'психический',
};

export const DAMAGE_TYPE_ICONS: Record<DamageType, string> = {
  slashing: '🗡️',
  piercing: '🏹',
  bludgeoning: '🔨',
  fire: '🔥',
  cold: '❄️',
  lightning: '⚡',
  thunder: '💥',
  acid: '🧪',
  poison: '☠️',
  radiant: '✨',
  necrotic: '💀',
  force: '🌀',
  psychic: '🧠',
};

export const SCHOOL_NAMES: Record<SpellSchool, string> = {
  abjuration: 'Ограждение',
  conjuration: 'Призыв',
  divination: 'Прорицание',
  enchantment: 'Очарование',
  evocation: 'Воплощение',
  illusion: 'Иллюзия',
  necromancy: 'Некромантия',
  transmutation: 'Преобразование',
};

export const SCHOOL_ICONS: Record<SpellSchool, string> = {
  abjuration: '🛡️',
  conjuration: '🌀',
  divination: '👁️',
  enchantment: '💫',
  evocation: '🔥',
  illusion: '🎭',
  necromancy: '💀',
  transmutation: '🦋',
};

export const MASTERY_INFO: Record<WeaponMastery, { name: string; description: string }> = {
  cleave: { name: 'Рассечение', description: 'При попадании можно атаковать второе существо в пределах 1,5 м от первого (урон без модификатора характеристики).' },
  graze: { name: 'Задевание', description: 'При промахе цель всё равно получает урон, равный модификатору характеристики.' },
  nick: { name: 'Насечка', description: 'Дополнительная атака вторым лёгким оружием происходит в рамках той же атаки, бонусное действие остаётся свободным.' },
  push: { name: 'Толчок', description: 'При попадании можно оттолкнуть цель (не больше Большой) на 3 м от себя.' },
  sap: { name: 'Изматывание', description: 'При попадании цель получает помеху на следующий бросок атаки до начала вашего следующего хода.' },
  slow: { name: 'Замедление', description: 'При попадании скорость цели снижается на 3 м до начала вашего следующего хода.' },
  topple: { name: 'Опрокидывание', description: 'При попадании цель делает спасбросок Телосложения или падает ничком.' },
  vex: { name: 'Досаждение', description: 'При попадании вы получаете преимущество на следующий бросок атаки по этой цели до конца следующего хода.' },
};

export const SIZE_NAMES: Record<Size, string> = {
  tiny: 'Крошечный',
  small: 'Маленький',
  medium: 'Средний',
  large: 'Большой',
  huge: 'Огромный',
  gargantuan: 'Громадный',
};

export const RARITY_INFO: Record<Rarity, { name: string; color: string }> = {
  common: { name: 'Обычный', color: '#a8a29e' },
  uncommon: { name: 'Необычный', color: '#4ade80' },
  rare: { name: 'Редкий', color: '#60a5fa' },
  veryRare: { name: 'Очень редкий', color: '#c084fc' },
  legendary: { name: 'Легендарный', color: '#fbbf24' },
  artifact: { name: 'Артефакт', color: '#f87171' },
};

export const RECHARGE_NAMES: Record<Recharge, string> = {
  short: 'короткий отдых',
  long: 'долгий отдых',
  none: 'не восстанавливается отдыхом',
};

export const ALIGNMENTS: string[] = [
  'Законно-добрый', 'Нейтрально-добрый', 'Хаотично-добрый',
  'Законно-нейтральный', 'Истинно нейтральный', 'Хаотично-нейтральный',
  'Законно-злой', 'Нейтрально-злой', 'Хаотично-злой',
];

// Иконки для портретов персонажей и НИП
export const PORTRAIT_ICONS: string[] = [
  '🦁', '🐺', '🦅', '🐉', '🦊', '🐻', '🦉', '🐍', '🦌', '🐗',
  '⚔️', '🛡️', '🏹', '🪄', '📖', '🎻', '🔥', '❄️', '⚡', '🌿',
  '🌙', '☀️', '⭐', '💎', '🗝️', '👑', '🎭', '⚗️', '🕯️', '🍀',
];

export const CR_LABELS: Record<string, string> = {
  '0': '0', '0.125': '1/8', '0.25': '1/4', '0.5': '1/2',
};

export function crLabel(cr: number): string {
  return CR_LABELS[String(cr)] ?? String(cr);
}
