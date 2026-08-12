import type { Tri } from '../tr';

// Справочник: расы, заклинания, предметы, шпаргалка правил

export const T_LIBRARY = {
  title: { ru: 'Справочник', uk: 'Довідник', en: 'Library' },
  tabGuide: { ru: '🎓 Как играть', uk: '🎓 Як грати', en: '🎓 How to play' },
  tabRaces: { ru: '🧝 Расы', uk: '🧝 Раси', en: '🧝 Species' },
  tabSpells: { ru: '✨ Заклинания', uk: '✨ Заклинання', en: '✨ Spells' },
  tabItems: { ru: '🎒 Предметы', uk: '🎒 Предмети', en: '🎒 Items' },
  tabRules: { ru: '📖 Шпаргалка', uk: '📖 Шпаргалка', en: '📖 Cheat sheet' },

  raceSearchPh: { ru: '🔍 Название расы…', uk: '🔍 Назва раси…', en: '🔍 Species name…' },
  racesCount: { ru: '{n} рас', uk: '{n} рас', en: '{n} species' },
  darkvisionChip: { ru: '👁️ Тёмное зрение {dist}', uk: '👁️ Темний зір {dist}', en: '👁️ Darkvision {dist}' },

  spellSearchPh: { ru: '🔍 Название заклинания…', uk: '🔍 Назва заклинання…', en: '🔍 Spell name…' },
  allCircles: { ru: 'Все круги', uk: 'Усі круги', en: 'All levels' },
  cantripsOpt: { ru: 'Заговоры', uk: 'Замовляння', en: 'Cantrips' },
  allClasses: { ru: 'Все классы', uk: 'Усі класи', en: 'All classes' },
  spellsCount: { ru: '{n} закл.', uk: '{n} закл.', en: '{n} spells' },
  classesLabel: { ru: 'Классы:', uk: 'Класи:', en: 'Classes:' },
  first120: {
    ru: 'Показаны первые 120 — уточните поиск.',
    uk: 'Показано перші 120 — уточніть пошук.',
    en: 'Showing the first 120 — refine your search.',
  },

  itemSearchPh: { ru: '🔍 Название предмета…', uk: '🔍 Назва предмета…', en: '🔍 Item name…' },
  allKinds: { ru: 'Всё', uk: 'Усе', en: 'All' },
  itemsCount: { ru: '{n} предм.', uk: '{n} предм.', en: '{n} items' },
  damageLabel: { ru: 'Урон:', uk: 'Шкода:', en: 'Damage:' },
  masteryLabel: { ru: 'Мастерство:', uk: 'Майстерність:', en: 'Mastery:' },
  propsLabel: { ru: 'Свойства:', uk: 'Властивості:', en: 'Properties:' },
  acLabel: { ru: 'КБ:', uk: 'КБ:', en: 'AC:' },
  stealthDis: { ru: 'помеха скрытности', uk: 'перешкода на Непомітність', en: 'disadvantage on Stealth' },
  strReq: { ru: 'нужна Сила {n}', uk: 'потрібна Сила {n}', en: 'requires Strength {n}' },
  attunementReq: { ru: 'Требуется настройка', uk: 'Потрібне налаштування', en: 'Requires attunement' },

  combatTurnTitle: { ru: 'Ход в бою — что можно сделать', uk: 'Хід у бою — що можна зробити', en: 'Your turn in combat — what you can do' },
  actionLabel: { ru: 'Действие:', uk: 'Дія:', en: 'Action:' },
  actionText: {
    ru: 'Атака, Заклинание, Рывок (двойное движение), Отход (без провоцированных атак), Уклонение (атаки по вам с помехой), Засада (спрятаться), Помощь союзнику, Использование предмета, Захват или Толчок (проверка Атлетики).',
    uk: 'Атака, Заклинання, Ривок (подвійний рух), Відхід (без провокованих атак), Ухилення (атаки по вас із перешкодою), Засідка (сховатися), Допомога союзнику, Використання предмета, Захоплення або Поштовх (перевірка Атлетики).',
    en: 'Attack, Cast a Spell, Dash (double movement), Disengage (no opportunity attacks), Dodge (attacks against you have disadvantage), Hide, Help an ally, Use an Object, Grapple or Shove (Athletics check).',
  },
  bonusActionLabel: { ru: 'Бонусное действие:', uk: 'Бонусна дія:', en: 'Bonus Action:' },
  bonusActionText: {
    ru: 'только если умение или заклинание его разрешает (Второе дыхание, Ярость, Скрытая атака ловкача через Хитрое действие…).',
    uk: 'лише якщо вміння або заклинання це дозволяє (Друге дихання, Лють, Хитра дія пройдисвіта…).',
    en: 'only when a feature or spell grants one (Second Wind, Rage, a rogue’s Cunning Action…).',
  },
  movementLabel: { ru: 'Движение:', uk: 'Рух:', en: 'Movement:' },
  movementText: {
    ru: 'до вашей скорости, можно разбивать между атаками.',
    uk: 'до вашої швидкості, можна розбивати між атаками.',
    en: 'up to your Speed; you can split it between attacks.',
  },
  reactionLabel: { ru: 'Реакция:', uk: 'Реакція:', en: 'Reaction:' },
  reactionText: {
    ru: '1 за раунд, вне вашего хода (провоцированная атака, Щит, Отражение атак…).',
    uk: '1 за раунд, поза вашим ходом (провокована атака, Щит, Відбиття атак…).',
    en: '1 per round, outside your turn (opportunity attack, Shield, Deflect Attacks…).',
  },

  checksTitle: { ru: 'Проверки и спасброски', uk: 'Перевірки та рятівні кидки', en: 'Checks and saving throws' },
  checksFormula: {
    ru: 'd20 + модификатор характеристики + бонус мастерства (если владеете навыком). Результат сравнивается со Сложностью (СЛ).',
    uk: 'd20 + модифікатор характеристики + бонус майстерності (якщо володієте навичкою). Результат порівнюється зі Складністю (СЛ).',
    en: 'd20 + ability modifier + Proficiency Bonus (if you’re proficient). Compare the result to the Difficulty Class (DC).',
  },
  dcShort: { ru: 'СЛ:', uk: 'СЛ:', en: 'DC:' },
  dcText: {
    ru: '5 — очень легко · 10 — легко · 15 — средне · 20 — сложно · 25 — очень сложно · 30 — почти невозможно.',
    uk: '5 — дуже легко · 10 — легко · 15 — середньо · 20 — складно · 25 — дуже складно · 30 — майже неможливо.',
    en: '5 — very easy · 10 — easy · 15 — medium · 20 — hard · 25 — very hard · 30 — nearly impossible.',
  },
  advLabel: { ru: 'Преимущество/помеха:', uk: 'Перевага/перешкода:', en: 'Advantage/disadvantage:' },
  advText: {
    ru: 'бросьте два d20 и возьмите больший/меньший. Несколько источников не складываются.',
    uk: 'киньте два d20 і візьміть більший/менший. Кілька джерел не складаються.',
    en: 'roll two d20s and take the higher/lower. Multiple sources don’t stack.',
  },
  nat20Label: { ru: 'Чистая 20:', uk: 'Чиста 20:', en: 'Natural 20:' },
  nat20Text: {
    ru: 'всегда успех (в атаке — крит: кости урона удваиваются). Чистая 1 — всегда провал.',
    uk: 'завжди успіх (в атаці — крит: кубики шкоди подвоюються). Чиста 1 — завжди провал.',
    en: 'always a success (on an attack it’s a crit: damage dice are doubled). A natural 1 always fails.',
  },

  restTitle: { ru: 'Отдых', uk: 'Відпочинок', en: 'Resting' },
  shortRestLabel: { ru: 'Короткий (1 час):', uk: 'Короткий (1 година):', en: 'Short Rest (1 hour):' },
  shortRestText: {
    ru: 'можно тратить кости хитов на лечение; восстанавливаются некоторые умения и ячейки колдуна.',
    uk: 'можна витрачати кістки хітів на лікування; відновлюються деякі вміння та комірки чаклуна.',
    en: 'spend Hit Dice to heal; some features and warlock spell slots recharge.',
  },
  longRestLabel: { ru: 'Долгий (8 часов):', uk: 'Тривалий (8 годин):', en: 'Long Rest (8 hours):' },
  longRestText: {
    ru: 'все хиты, все кости хитов, все ячейки заклинаний, умения; истощение −1. Один долгий отдых в сутки.',
    uk: 'усі хіти, усі кістки хітів, усі комірки заклинань, уміння; виснаження −1. Один тривалий відпочинок на добу.',
    en: 'all Hit Points, all Hit Dice, all spell slots and features; exhaustion −1. One Long Rest per day.',
  },
  deathLabel: { ru: 'Смерть и спасение:', uk: 'Смерть і порятунок:', en: 'Death and rescue:' },
  deathText: {
    ru: 'на 0 хитов герой без сознания: бросайте d20 — 10+ успех. Три успеха — стабилен, три провала — гибель. Чистая 20 — очнулся с 1 хитом!',
    uk: 'на 0 хітів герой непритомний: кидайте d20 — 10+ успіх. Три успіхи — стабільний, три провали — загибель. Чиста 20 — отямився з 1 хітом!',
    en: 'at 0 HP the hero is Unconscious: roll a d20 — 10+ succeeds. Three successes — stable; three failures — death. A natural 20 — wake up with 1 HP!',
  },
  masteryTitle: {
    ru: 'Мастерство оружия (новинка 2024)',
    uk: 'Майстерність зброї (новинка 2024)',
    en: 'Weapon Mastery (new in 2024)',
  },
  conditionsTitle: { ru: 'Состояния', uk: 'Стани', en: 'Conditions' },
} satisfies Record<string, Tri>;
