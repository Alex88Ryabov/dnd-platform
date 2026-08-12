import type { Tri } from '../tr';

// Кубики: оверлей броска и вкладка «Кубики»

export const T_DICE = {
  success: { ru: 'УСПЕХ!', uk: 'УСПІХ!', en: 'SUCCESS!' },
  fail: { ru: 'ПРОВАЛ', uk: 'ПРОВАЛ', en: 'FAIL' },
  critSuccess: { ru: '✨ Критический успех! ✨', uk: '✨ Критичний успіх! ✨', en: '✨ Critical success! ✨' },
  critFail: { ru: 'Критический провал…', uk: 'Критичний провал…', en: 'Critical fail…' },
  dc: { ru: 'СЛ {dc}', uk: 'СЛ {dc}', en: 'DC {dc}' },
  diceKept: { ru: 'кости: {list} → взято {kept}', uk: 'кубики: {list} → узято {kept}', en: 'dice: {list} → kept {kept}' },
  and: { ru: ' и ', uk: ' і ', en: ' and ' },

  title: { ru: 'Броски кубиков', uk: 'Кидки кубиків', en: 'Dice Rolls' },
  choose: { ru: 'Выберите кости', uk: 'Оберіть кубики', en: 'Pick your dice' },
  addDieHint: {
    ru: 'Добавить d{die} (правый клик — убрать)',
    uk: 'Додати d{die} (правий клік — прибрати)',
    en: 'Add a d{die} (right-click removes)',
  },
  modifier: { ru: 'Модификатор', uk: 'Модифікатор', en: 'Modifier' },
  normal: { ru: 'Обычный', uk: 'Звичайний', en: 'Normal' },
  advantage: { ru: '⏫ Преимущество', uk: '⏫ Перевага', en: '⏫ Advantage' },
  disadvantage: { ru: '⏬ Помеха', uk: '⏬ Перешкода', en: '⏬ Disadvantage' },
  rollBig: { ru: '🎲 БРОСИТЬ!', uk: '🎲 КИНУТИ!', en: '🎲 ROLL!' },
  clearPool: { ru: 'Сбросить набор', uk: 'Скинути набір', en: 'Clear the pool' },
  quickRolls: { ru: 'Быстрые броски', uk: 'Швидкі кидки', en: 'Quick rolls' },
  d20Roll: { ru: 'Бросок d20', uk: 'Кидок d20', en: 'd20 roll' },
  d20Adv: { ru: 'd20 с преимуществом', uk: 'd20 з перевагою', en: 'd20 with advantage' },
  d20Dis: { ru: 'd20 с помехой', uk: 'd20 з перешкодою', en: 'd20 with disadvantage' },
  damage: { ru: 'Урон', uk: 'Шкода', en: 'Damage' },
  roll: { ru: 'Бросок', uk: 'Кидок', en: 'Roll' },
  statRollLabel: {
    ru: 'Характеристика: 4d6, без меньшей ({rolls} → убрана {dropped})',
    uk: 'Характеристика: 4d6, без меншого ({rolls} → прибрано {dropped})',
    en: 'Ability score: 4d6 drop lowest ({rolls} → dropped {dropped})',
  },
  statRollShort: {
    ru: '4d6 без меньшей [{rolls}]',
    uk: '4d6 без меншого [{rolls}]',
    en: '4d6 drop lowest [{rolls}]',
  },
  statBtn: { ru: '4d6 без меньшей', uk: '4d6 без меншого', en: '4d6 drop lowest' },
  customFormula: { ru: 'Своя формула', uk: 'Власна формула', en: 'Custom formula' },
  customPlaceholder: {
    ru: 'Своя формула: 3d6+2, 1d20+5, 8d6…',
    uk: 'Власна формула: 3d6+2, 1d20+5, 8d6…',
    en: 'Custom formula: 3d6+2, 1d20+5, 8d6…',
  },
  rollBtn: { ru: 'Бросить', uk: 'Кинути', en: 'Roll' },
  history: { ru: 'История бросков', uk: 'Історія кидків', en: 'Roll history' },
  clear: { ru: 'Очистить', uk: 'Очистити', en: 'Clear' },
  quiet: { ru: 'Пока тихо. Бросьте что-нибудь!', uk: 'Поки тихо. Киньте щось!', en: 'All quiet. Roll something!' },
} satisfies Record<string, Tri>;
