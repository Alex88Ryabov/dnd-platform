import type { Tri } from '../tr';

export const T_HOME = {
  tagline: {
    ru: 'Ваша платформа для приключений по правилам D&D 2024: герои, кубы, бой и журнал кампании — всё в одном месте, и ничего не надо переписывать руками.',
    uk: 'Ваша платформа для пригод за правилами D&D 2024: герої, кубики, бій і журнал кампанії — усе в одному місці, і нічого не треба переписувати руками.',
    en: 'Your platform for adventures under the D&D 2024 rules: heroes, dice, combat, and the campaign journal — all in one place, with nothing to copy out by hand.',
  },
  renameHint: {
    ru: 'Нажми, чтобы переименовать кампанию',
    uk: 'Натисни, щоб перейменувати кампанію',
    en: 'Click to rename the campaign',
  },
  defaultCampaign: { ru: 'Летопись героев', uk: 'Літопис героїв', en: 'Chronicle of Heroes' },
  startGame: { ru: '▶️ Начать игру', uk: '▶️ Почати гру', en: '▶️ Start playing' },
  heroesBtn: { ru: '⚔️ Герои', uk: '⚔️ Герої', en: '⚔️ Heroes' },
  diceBtn: { ru: '🎲 Кубики', uk: '🎲 Кубики', en: '🎲 Dice' },
  howToPlay: { ru: '🎓 Как играть?', uk: '🎓 Як грати?', en: '🎓 How to play?' },
  startAdventure: { ru: 'Начнём приключение?', uk: 'Почнемо пригоду?', en: 'Shall we begin the adventure?' },
  firstHeroHint: {
    ru: 'Создайте своего первого героя — мастер создания проведёт по шагам: класс, вид, предыстория, характеристики и снаряжение.',
    uk: 'Створіть свого першого героя — майстер створення проведе покроково: клас, раса, передісторія, характеристики та спорядження.',
    en: 'Create your first hero — the creation wizard walks you through every step: class, species, background, ability scores, and equipment.',
  },
  createFirstHero: { ru: '✨ Создать первого героя', uk: '✨ Створити першого героя', en: '✨ Create your first hero' },
  addSampleParty: { ru: '🎁 Добавить партию-пример', uk: '🎁 Додати приклад загону', en: '🎁 Add a sample party' },
  partyArrived: { ru: 'Партия прибыла!', uk: 'Загін прибув!', en: 'The party has arrived!' },
  partyArrivedText: {
    ru: 'Четыре героя-примера ждут на экране «Герои»',
    uk: 'Четверо героїв-прикладів чекають на екрані «Герої»',
    en: 'Four sample heroes await on the Heroes screen',
  },
  party: { ru: 'Отряд ({n})', uk: 'Загін ({n})', en: 'Party ({n})' },
  quests: { ru: 'Задания', uk: 'Завдання', en: 'Quests' },
  noQuests: {
    ru: 'Активных заданий нет — мастер может добавить их в Журнале.',
    uk: 'Активних завдань немає — майстер може додати їх у Журналі.',
    en: 'No active quests — the Master can add them in the Journal.',
  },
  reward: { ru: 'Награда: {r}', uk: 'Нагорода: {r}', en: 'Reward: {r}' },
  recentEntries: { ru: 'Последние записи', uk: 'Останні записи', en: 'Recent entries' },
  emptyJournal: {
    ru: 'Журнал пока пуст. Всё важное из приключений — на вкладке «Журнал».',
    uk: 'Журнал поки порожній. Усе важливе з пригод — на вкладці «Журнал».',
    en: 'The journal is empty so far. Everything important from your adventures lives on the Journal tab.',
  },
  recentRolls: { ru: 'Свежие броски', uk: 'Свіжі кидки', en: 'Recent rolls' },
  noRolls: {
    ru: 'Кости ещё не гремели. Загляните на вкладку «Кубики»!',
    uk: 'Кубики ще не гриміли. Зазирніть на вкладку «Кубики»!',
    en: 'The dice haven’t rattled yet. Check out the Dice tab!',
  },
} satisfies Record<string, Tri>;
