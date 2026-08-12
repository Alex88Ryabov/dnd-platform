import type { Tri } from '../tr';

// Вкладка «Умения»

export const T_FEATURES = {
  fightingStyle: { ru: 'Боевой стиль', uk: 'Бойовий стиль', en: 'Fighting Style' },
  notChosen: { ru: '— не выбран —', uk: '— не обрано —', en: '— not chosen —' },
  styleHint: {
    ru: 'Стиль влияет на атаки и КБ автоматически.',
    uk: 'Стиль впливає на атаки та КБ автоматично.',
    en: 'The style affects attacks and AC automatically.',
  },
  classFeatures: { ru: 'Умения класса ({cls})', uk: 'Уміння класу ({cls})', en: 'Class features ({cls})' },
  speciesTraits: { ru: 'Черты расы: {name}', uk: 'Риси раси: {name}', en: 'Species traits: {name}' },
  heroFeats: { ru: 'Черты героя', uk: 'Риси героя', en: 'Hero feats' },
  addCustomFeat: { ru: '+ Своя черта', uk: '+ Власна риса', en: '+ Custom feat' },
  noFeats: { ru: 'Пока нет черт.', uk: 'Поки немає рис.', en: 'No feats yet.' },
  customResources: {
    ru: 'Свои ресурсы (домашние правила)',
    uk: 'Власні ресурси (домашні правила)',
    en: 'Custom resources (house rules)',
  },
  addResource: { ru: '+ Ресурс', uk: '+ Ресурс', en: '+ Resource' },
  usesShort: { ru: '{name} — {n} исп.', uk: '{name} — {n} вик.', en: '{name} — {n} uses' },
  trackHint: {
    ru: 'Отмечать использования можно на вкладке «Бой».',
    uk: 'Відмічати використання можна на вкладці «Бій».',
    en: 'Track uses on the Combat tab.',
  },
  proficiencies: { ru: 'Владения', uk: 'Володіння', en: 'Proficiencies' },
  weapons: { ru: 'Оружие:', uk: 'Зброя:', en: 'Weapons:' },
  armor: { ru: 'Доспехи:', uk: 'Обладунки:', en: 'Armor:' },
  tools: { ru: 'Инструменты:', uk: 'Інструменти:', en: 'Tools:' },
  languages: { ru: 'Языки:', uk: 'Мови:', en: 'Languages:' },
  featAdded: { ru: 'Черта добавлена', uk: 'Рису додано', en: 'Feat added' },
  resourceAdded: { ru: 'Ресурс добавлен', uk: 'Ресурс додано', en: 'Resource added' },
  customFeatTitle: { ru: 'Своя черта', uk: 'Власна риса', en: 'Custom feat' },
  featNamePh: { ru: 'Название черты', uk: 'Назва риси', en: 'Feat name' },
  featDescPh: { ru: 'Что она делает', uk: 'Що вона робить', en: 'What it does' },
  customResourceTitle: { ru: 'Свой ресурс', uk: 'Власний ресурс', en: 'Custom resource' },
  resourceNamePh: {
    ru: 'Название (например: Дыхание дракона)',
    uk: 'Назва (наприклад: Подих дракона)',
    en: 'Name (e.g. Dragon’s Breath)',
  },
  uses: { ru: 'Использований:', uk: 'Використань:', en: 'Uses:' },
  recovery: { ru: 'Восстановление:', uk: 'Відновлення:', en: 'Recovery:' },
  manual: { ru: 'вручную', uk: 'вручну', en: 'manually' },
} satisfies Record<string, Tri>;
