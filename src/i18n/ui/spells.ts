import type { Tri } from '../tr';

// Вкладка «Заклинания» и короткий отдых

export const T_SPELLS = {
  dcChip: { ru: 'СЛ заклинаний {n}', uk: 'СЛ заклинань {n}', en: 'Spell save DC {n}' },
  attackChip: { ru: '🎲 Атака +{n}', uk: '🎲 Атака +{n}', en: '🎲 Attack +{n}' },
  attackHint: { ru: 'Бросок атаки заклинанием', uk: 'Кидок атаки заклинанням', en: 'Spell attack roll' },
  attackLabel: { ru: 'Атака заклинанием', uk: 'Атака заклинанням', en: 'Spell attack' },
  editList: { ru: '✎ Изменить список', uk: '✎ Змінити список', en: '✎ Edit list' },
  circleN: { ru: 'Круг {n}', uk: 'Круг {n}', en: 'Level {n}' },
  pactSlots: { ru: 'Пакт ({n} кр.)', uk: 'Пакт ({n} кр.)', en: 'Pact (lvl {n})' },
  restoreSlot: { ru: 'Вернуть ячейку', uk: 'Повернути комірку', en: 'Restore the slot' },
  spendSlot: { ru: 'Потратить ячейку', uk: 'Витратити комірку', en: 'Spend the slot' },
  cantripsTitle: { ru: 'Заговоры', uk: 'Замовляння', en: 'Cantrips' },
  cast: { ru: 'Наложить', uk: 'Накласти', en: 'Cast' },
  preparedTitle: {
    ru: 'Подготовленные заклинания ({a} из {b})',
    uk: 'Підготовлені заклинання ({a} з {b})',
    en: 'Prepared spells ({a} of {b})',
  },
  noPrepared: {
    ru: 'Нажмите «Изменить список», чтобы подготовить заклинания.',
    uk: 'Натисніть «Змінити список», щоб підготувати заклинання.',
    en: 'Click “Edit list” to prepare spells.',
  },
  castWith: { ru: '{name} — какой ячейкой?', uk: '{name} — якою коміркою?', en: '{name} — which slot?' },
  circleBtn: { ru: 'Круг {n} ({m} ост.)', uk: 'Круг {n} ({m} зал.)', en: 'Level {n} ({m} left)' },
  pactBtn: { ru: 'Ячейка пакта ({n} ост.)', uk: 'Комірка пакту ({n} зал.)', en: 'Pact slot ({n} left)' },
  ritualBtn: {
    ru: '📿 Ритуалом (без ячейки, +10 минут)',
    uk: '📿 Ритуалом (без комірки, +10 хвилин)',
    en: '📿 As a ritual (no slot, +10 minutes)',
  },
  noSlots: {
    ru: 'Свободных ячеек нет — нужен отдых.',
    uk: 'Вільних комірок немає — потрібен відпочинок.',
    en: 'No slots left — you need a rest.',
  },
  saveVs: {
    ru: 'Цель: спасбросок {ability} против СЛ {dc}',
    uk: 'Ціль: рятівний кидок {ability} проти СЛ {dc}',
    en: 'Target: {ability} saving throw vs DC {dc}',
  },
  cantrip: { ru: 'заговор', uk: 'замовляння', en: 'cantrip' },
  circleShort: { ru: '{n} круг', uk: '{n} круг', en: 'level {n}' },
  conc: { ru: 'конц.', uk: 'конц.', en: 'conc.' },
  ritual: { ru: 'ритуал', uk: 'ритуал', en: 'ritual' },
  higher: { ru: 'Усиление:', uk: 'Підсилення:', en: 'At higher levels:' },
  listTitle: { ru: 'Список заклинаний', uk: 'Список заклинань', en: 'Spell list' },
  cantripsCount: { ru: 'Заговоры — {a} из {b}', uk: 'Замовляння — {a} з {b}', en: 'Cantrips — {a} of {b}' },
  preparedCount: { ru: 'Подготовленные — {a} из {b}', uk: 'Підготовлені — {a} з {b}', en: 'Prepared — {a} of {b}' },
  customSpell: {
    ru: 'Своё заклинание (домашние правила)',
    uk: 'Власне заклинання (домашні правила)',
    en: 'Custom spell (house rules)',
  },
  cantripOpt: { ru: 'Заговор', uk: 'Замовляння', en: 'Cantrip' },
  circleOpt: { ru: '{n} круг', uk: '{n} круг', en: 'Level {n}' },
  shortDescPh: { ru: 'Краткое описание', uk: 'Короткий опис', en: 'Short description' },
  addBtn: { ru: '+ Добавить', uk: '+ Додати', en: '+ Add' },
  spellAdded: { ru: 'Заклинание добавлено', uk: 'Заклинання додано', en: 'Spell added' },
  homebrewSpell: { ru: 'Домашнее заклинание.', uk: 'Домашнє заклинання.', en: 'A homebrew spell.' },

  shortRestHint: {
    ru: 'Час у костра. Можно потратить кости хитов, чтобы подлечиться: бросаете d{die}, прибавляете Телосложение ({mod}) — столько хитов вернётся.',
    uk: 'Година біля вогнища. Можна витратити кістки хітів, щоб підлікуватися: кидаєте d{die}, додаєте Статуру ({mod}) — стільки хітів повернеться.',
    en: 'An hour by the campfire. Spend Hit Dice to heal: roll a d{die} and add your Constitution ({mod}) — that many Hit Points return.',
  },
  rollHitDie: {
    ru: '🎲 Бросить кость хитов (осталось {n})',
    uk: '🎲 Кинути кістку хітів (залишилось {n})',
    en: '🎲 Roll a Hit Die ({n} left)',
  },
  totalHealing: { ru: 'Всего лечения: {n} хитов', uk: 'Усього лікування: {n} хітів', en: 'Total healing: {n} HP' },
  endRest: { ru: 'Закончить отдых', uk: 'Завершити відпочинок', en: 'Finish the rest' },
  shortRestDone: { ru: 'Короткий отдых окончен', uk: 'Короткий відпочинок завершено', en: 'Short Rest finished' },
  shortRestHealed: {
    ru: 'Восстановлено {n} хитов, ресурсы короткого отдыха обновлены',
    uk: 'Відновлено {n} хітів, ресурси короткого відпочинку оновлено',
    en: 'Recovered {n} HP; short-rest resources refreshed',
  },
  shortRestNoHeal: {
    ru: 'Ресурсы короткого отдыха обновлены',
    uk: 'Ресурси короткого відпочинку оновлено',
    en: 'Short-rest resources refreshed',
  },
} satisfies Record<string, Tri>;
