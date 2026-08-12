import type {
  Ability, ConditionId, DamageType, Rarity, Recharge, Size, SkillId, SpellSchool, WeaponMastery,
} from '../model/types';

// Українська термінологія правил — еталон для всіх перекладів даних.

export const ABILITY_NAMES_UK: Record<Ability, string> = {
  str: 'Сила',
  dex: 'Спритність',
  con: 'Статура',
  int: 'Інтелект',
  wis: 'Мудрість',
  cha: 'Харизма',
};

export const ABILITY_SHORT_UK: Record<Ability, string> = {
  str: 'СИЛ',
  dex: 'СПР',
  con: 'СТА',
  int: 'ІНТ',
  wis: 'МДР',
  cha: 'ХАР',
};

export const SKILL_NAMES_UK: Record<SkillId, string> = {
  athletics: 'Атлетика',
  acrobatics: 'Акробатика',
  sleightOfHand: 'Спритність рук',
  stealth: 'Непомітність',
  arcana: 'Магія',
  history: 'Історія',
  investigation: 'Розслідування',
  nature: 'Природа',
  religion: 'Релігія',
  animalHandling: 'Поводження з тваринами',
  insight: 'Проникливість',
  medicine: 'Медицина',
  perception: 'Сприйняття',
  survival: 'Виживання',
  deception: 'Обман',
  intimidation: 'Залякування',
  performance: 'Виступ',
  persuasion: 'Переконання',
};

export const CONDITIONS_UK: Record<ConditionId, { name: string; description: string }> = {
  blinded: { name: 'Осліплений', description: 'Не бачить; перевірки, що потребують зору, автоматично провалюються. Атаки по ньому — з перевагою, його атаки — з перешкодою.' },
  charmed: { name: 'Зачарований', description: 'Не може атакувати того, хто його зачарував, і робити його ціллю шкідливих здібностей. Той, хто зачарував, має перевагу на соціальні перевірки.' },
  deafened: { name: 'Оглухлий', description: 'Не чує; автоматично провалює перевірки, що потребують слуху.' },
  frightened: { name: 'Наляканий', description: 'Перешкода на перевірки й атаки, поки джерело страху в полі зору. Не можна наближатися до джерела страху.' },
  grappled: { name: 'Схоплений', description: 'Швидкість 0. Перешкода на атаки по всіх, крім того, хто схопив. Той, хто схопив, може переміщувати його із собою.' },
  incapacitated: { name: 'Недієздатний', description: 'Не може виконувати дії, бонусні дії та реакції. Втрачає концентрацію.' },
  invisible: { name: 'Невидимий', description: 'Його не видно без особливих чуттів. Атаки по ньому — з перешкодою, його атаки — з перевагою.' },
  paralyzed: { name: 'Паралізований', description: 'Недієздатний, не може рухатися й говорити. Провалює рятівні кидки Сили та Спритності. Атаки по ньому — з перевагою; влучання з 1,5 м — критичне.' },
  petrified: { name: 'Скам’янілий', description: 'Перетворений на камінь: недієздатний, не рухається, опір будь-якій шкоді, імунітет до отрути.' },
  poisoned: { name: 'Отруєний', description: 'Перешкода на кидки атаки та перевірки характеристик.' },
  prone: { name: 'Збитий з ніг', description: 'Може лише повзти. Його атаки — з перешкодою. Атаки по ньому з 1,5 м — з перевагою, здалеку — з перешкодою.' },
  restrained: { name: 'Обплутаний', description: 'Швидкість 0. Атаки по ньому — з перевагою, його атаки — з перешкодою. Перешкода на рятівні кидки Спритності.' },
  stunned: { name: 'Приголомшений', description: 'Недієздатний, не може рухатися, говорить насилу. Провалює рятівні кидки Сили та Спритності. Атаки по ньому — з перевагою.' },
  unconscious: { name: 'Непритомний', description: 'Недієздатний, падає ниць, упускає все з рук. Провалює рятівні кидки Сили та Спритності. Влучання з 1,5 м — критичне.' },
};

export const DAMAGE_TYPE_NAMES_UK: Record<DamageType, string> = {
  slashing: 'рубляча',
  piercing: 'колюча',
  bludgeoning: 'дробляча',
  fire: 'вогонь',
  cold: 'холод',
  lightning: 'блискавка',
  thunder: 'грім',
  acid: 'кислота',
  poison: 'отрута',
  radiant: 'промениста',
  necrotic: 'некротична',
  force: 'силове поле',
  psychic: 'психічна',
};

export const SCHOOL_NAMES_UK: Record<SpellSchool, string> = {
  abjuration: 'Огородження',
  conjuration: 'Виклик',
  divination: 'Віщування',
  enchantment: 'Зачарування',
  evocation: 'Втілення',
  illusion: 'Ілюзія',
  necromancy: 'Некромантія',
  transmutation: 'Перетворення',
};

export const MASTERY_INFO_UK: Record<WeaponMastery, { name: string; description: string }> = {
  cleave: { name: 'Розсічення', description: 'Після влучання можна атакувати другу істоту в межах 1,5 м від першої (шкода без модифікатора характеристики).' },
  graze: { name: 'Зачеплення', description: 'При промаху ціль усе одно отримує шкоду, що дорівнює модифікатору характеристики.' },
  nick: { name: 'Насічка', description: 'Додаткова атака другою легкою зброєю відбувається в межах тієї самої атаки — бонусна дія залишається вільною.' },
  push: { name: 'Поштовх', description: 'Після влучання можна відштовхнути ціль (не більшу за Велику) на 3 м від себе.' },
  sap: { name: 'Виснаження', description: 'Після влучання ціль отримує перешкоду на наступний кидок атаки до початку вашого наступного ходу.' },
  slow: { name: 'Сповільнення', description: 'Після влучання швидкість цілі знижується на 3 м до початку вашого наступного ходу.' },
  topple: { name: 'Перекидання', description: 'Після влучання ціль робить рятівний кидок Статури або падає ниць.' },
  vex: { name: 'Дошкуляння', description: 'Після влучання ви отримуєте перевагу на наступний кидок атаки по цій цілі до кінця наступного ходу.' },
};

export const SIZE_NAMES_UK: Record<Size, string> = {
  tiny: 'Крихітний',
  small: 'Маленький',
  medium: 'Середній',
  large: 'Великий',
  huge: 'Величезний',
  gargantuan: 'Колосальний',
};

export const RARITY_NAMES_UK: Record<Rarity, string> = {
  common: 'Звичайний',
  uncommon: 'Незвичайний',
  rare: 'Рідкісний',
  veryRare: 'Дуже рідкісний',
  legendary: 'Легендарний',
  artifact: 'Артефакт',
};

export const RECHARGE_NAMES_UK: Record<Recharge, string> = {
  short: 'короткий відпочинок',
  long: 'тривалий відпочинок',
  none: 'не відновлюється відпочинком',
};

export const ALIGNMENTS_UK: string[] = [
  'Законно-добрий', 'Нейтрально-добрий', 'Хаотично-добрий',
  'Законно-нейтральний', 'Істинно нейтральний', 'Хаотично-нейтральний',
  'Законно-злий', 'Нейтрально-злий', 'Хаотично-злий',
];
