import type { Tri } from '../tr';

// Строки, которые генерирует движок (derive/creation/levelup/loot)

export const T_ENGINE = {
  acUnarmored: { ru: 'без доспехов', uk: 'без обладунків', en: 'unarmored' },
  acUnarmoredDefense: { ru: 'защита без доспехов', uk: 'захист без обладунків', en: 'Unarmored Defense' },
  acDraconic: { ru: 'драконья устойчивость', uk: 'драконяча стійкість', en: 'Draconic Resilience' },
  acShell: { ru: 'панцирь', uk: 'панцир', en: 'shell' },
  acNatural: { ru: 'природная броня', uk: 'природна броня', en: 'natural armor' },
  acShield: { ru: ' + щит', uk: ' + щит', en: ' + shield' },
  acManual: { ru: 'задано вручную', uk: 'задано вручну', en: 'set manually' },
  unarmedStrike: { ru: 'Безоружный удар', uk: 'Беззбройний удар', en: 'Unarmed Strike' },
  unarmedStrikeMartial: {
    ru: 'Безоружный удар (боевые искусства)',
    uk: 'Беззбройний удар (бойові мистецтва)',
    en: 'Unarmed Strike (Martial Arts)',
  },
  twoHandedGrip: { ru: 'двуручный хват: {dice}', uk: 'дворучний хват: {dice}', en: 'two-handed: {dice}' },
  itemFallback: { ru: 'Предмет', uk: 'Предмет', en: 'Item' },
  namelessHero: { ru: 'Безымянный герой', uk: 'Безіменний герой', en: 'Nameless Hero' },
  commonLanguage: { ru: 'Общий', uk: 'Загальна', en: 'Common' },
  journeyBegins: { ru: 'Начало пути!', uk: 'Початок шляху!', en: 'The journey begins!' },
  joinedAtLevel: {
    ru: 'Герой присоединился сразу на {n}-м уровне',
    uk: 'Герой приєднався одразу на {n}-му рівні',
    en: 'The hero joined at level {n}',
  },
  hitDieRolled: { ru: 'Кость хитов: выпало {n}', uk: 'Кістка хітів: випало {n}', en: 'Hit Die roll: {n}' },
  hpAverage: { ru: 'Хиты по среднему: {n}', uk: 'Хіти за середнім: {n}', en: 'Average HP: {n}' },
  featGained: { ru: 'Черта: {name}', uk: 'Риса: {name}', en: 'Feat: {name}' },
  featureGained: { ru: 'Умение: {name}', uk: 'Уміння: {name}', en: 'Feature: {name}' },
  preparedSpells: {
    ru: 'Подготовленных заклинаний: {n} (было {m}).',
    uk: 'Підготовлених заклинань: {n} (було {m}).',
    en: 'Prepared spells: {n} (was {m}).',
  },
  newCantrip: {
    ru: 'Новый заговор! Всего заговоров: {n}.',
    uk: 'Нове замовляння! Усього замовлянь: {n}.',
    en: 'New cantrip! Cantrips known: {n}.',
  },
} satisfies Record<string, Tri>;

export const LOOT_FLAVORS: Tri[] = [
  { ru: 'Среди пыли и паутины блестит добыча…', uk: 'Серед пилу й павутиння виблискує здобич…', en: 'Something glitters among the dust and cobwebs…' },
  { ru: 'Сундук со скрипом открывается…', uk: 'Скриня зі скрипом відчиняється…', en: 'The chest creaks open…' },
  { ru: 'Под грудой костей что-то мерцает…', uk: 'Під купою кісток щось мерехтить…', en: 'Something shimmers beneath a pile of bones…' },
  { ru: 'Карманы поверженного врага не пусты…', uk: 'Кишені переможеного ворога не порожні…', en: 'The fallen foe’s pockets are not empty…' },
  { ru: 'В тайнике, спрятанном за камнем, вы находите…', uk: 'У схованці за каменем ви знаходите…', en: 'In a cache hidden behind a stone, you find…' },
  { ru: 'Драконья бережливость вам на руку…', uk: 'Драконяча ощадливість вам на руку…', en: 'A dragon’s thrift works in your favor…' },
];
