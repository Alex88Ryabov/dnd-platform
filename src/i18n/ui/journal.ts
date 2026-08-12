import type { Tri } from '../tr';

// Журнал кампании

export const T_JOURNAL = {
  title: { ru: 'Журнал кампании', uk: 'Журнал кампанії', en: 'Campaign Journal' },
  tabEntries: { ru: '📖 Записи', uk: '📖 Записи', en: '📖 Entries' },
  tabQuests: { ru: '🗺️ Задания', uk: '🗺️ Завдання', en: '🗺️ Quests' },
  tabNpcs: { ru: '🧙 Персонажи мира', uk: '🧙 Персонажі світу', en: '🧙 World characters' },
  tabPlaces: { ru: '🏰 Места', uk: '🏰 Місця', en: '🏰 Places' },
  tabReviews: { ru: '⭐ Отзывы игроков', uk: '⭐ Відгуки гравців', en: '⭐ Player reviews' },

  kindSession: { ru: 'Игровая встреча', uk: 'Ігрова зустріч', en: 'Game session' },
  kindEvent: { ru: 'Событие', uk: 'Подія', en: 'Event' },
  kindNote: { ru: 'Заметка', uk: 'Нотатка', en: 'Note' },
  attFriend: { ru: 'Друг', uk: 'Друг', en: 'Friend' },
  attNeutral: { ru: 'Нейтрален', uk: 'Нейтральний', en: 'Neutral' },
  attEnemy: { ru: 'Враг', uk: 'Ворог', en: 'Enemy' },

  howWasGame: { ru: 'Как прошла игра?', uk: 'Як минула гра?', en: 'How was the game?' },
  reviewAuthorPh: {
    ru: 'Кто оставляет отзыв (имя игрока)',
    uk: 'Хто залишає відгук (ім’я гравця)',
    en: 'Who’s leaving the review (player name)',
  },
  reviewTextPh: {
    ru: 'Что понравилось больше всего? Что было самым смешным или страшным?',
    uk: 'Що сподобалося найбільше? Що було найсмішнішим або найстрашнішим?',
    en: 'What did you like most? What was the funniest or scariest moment?',
  },
  playerFallback: { ru: 'Игрок', uk: 'Гравець', en: 'Player' },
  reviewSaved: { ru: 'Отзыв записан!', uk: 'Відгук записано!', en: 'Review saved!' },
  reviewThanks: { ru: 'Спасибо за впечатления', uk: 'Дякуємо за враження', en: 'Thanks for sharing' },
  leaveReview: { ru: '⭐ Оставить отзыв', uk: '⭐ Залишити відгук', en: '⭐ Leave a review' },
  avgRating: {
    ru: 'Средняя оценка кампании: {avg} ⭐ · отзывов: {n}',
    uk: 'Середня оцінка кампанії: {avg} ⭐ · відгуків: {n}',
    en: 'Average campaign rating: {avg} ⭐ · reviews: {n}',
  },
  reviewsEmpty: {
    ru: 'После игры каждый может оставить отзыв — а через год будет интересно перечитать!',
    uk: 'Після гри кожен може залишити відгук — а за рік буде цікаво перечитати!',
    en: 'After the game everyone can leave a review — a year from now it’ll be fun to reread!',
  },

  newEntry: { ru: 'Новая запись', uk: 'Новий запис', en: 'New entry' },
  entryTitlePh: {
    ru: 'Заголовок (например: Победа над гоблинами моста)',
    uk: 'Заголовок (наприклад: Перемога над гоблінами мосту)',
    en: 'Title (e.g. Victory over the bridge goblins)',
  },
  entryTextPh: {
    ru: 'Что случилось в этот раз? Кого встретили, что нашли, над чем смеялись…',
    uk: 'Що сталося цього разу? Кого зустріли, що знайшли, з чого сміялися…',
    en: 'What happened this time? Whom you met, what you found, what made you laugh…',
  },
  writeBtn: { ru: '🪶 Записать', uk: '🪶 Записати', en: '🪶 Write it down' },
  untitled: { ru: 'Без названия', uk: 'Без назви', en: 'Untitled' },
  writtenToChronicle: { ru: 'Записано в летопись', uk: 'Записано до літопису', en: 'Written into the chronicle' },
  chronicleEmpty: {
    ru: 'Летопись пуста — самое время вписать первую главу!',
    uk: 'Літопис порожній — саме час вписати перший розділ!',
    en: 'The chronicle is empty — time to write the first chapter!',
  },

  newQuest: { ru: 'Новое задание', uk: 'Нове завдання', en: 'New quest' },
  questTitlePh: {
    ru: 'Название (например: Найти пропавшего кота старосты)',
    uk: 'Назва (наприклад: Знайти зниклого кота старости)',
    en: 'Name (e.g. Find the elder’s missing cat)',
  },
  questDescPh: { ru: 'Подробности задания', uk: 'Подробиці завдання', en: 'Quest details' },
  questRewardPh: {
    ru: 'Награда (например: 50 зм и пирог)',
    uk: 'Нагорода (наприклад: 50 зм і пиріг)',
    en: 'Reward (e.g. 50 gp and a pie)',
  },
  questAdded: { ru: 'Задание добавлено', uk: 'Завдання додано', en: 'Quest added' },
  statusActive: { ru: 'В работе', uk: 'У процесі', en: 'In progress' },
  statusDone: { ru: 'Выполнено', uk: 'Виконано', en: 'Done' },
  statusFailed: { ru: 'Провалено', uk: 'Провалено', en: 'Failed' },
  noQuests: { ru: 'Заданий пока нет.', uk: 'Завдань поки немає.', en: 'No quests yet.' },
  rewardLabel: { ru: 'Награда:', uk: 'Нагорода:', en: 'Reward:' },

  newNpc: { ru: 'Новый житель мира', uk: 'Новий мешканець світу', en: 'New world character' },
  npcNamePh: { ru: 'Имя (например: Трактирщик Борин)', uk: 'Ім’я (наприклад: Шинкар Борін)', en: 'Name (e.g. Borin the Innkeeper)' },
  npcDescPh: { ru: 'Кто это и чем запомнился', uk: 'Хто це і чим запам’ятався', en: 'Who they are and why they’re memorable' },
  npcsEmpty: {
    ru: 'Здесь будут жить все встреченные персонажи мира.',
    uk: 'Тут житимуть усі зустрінуті персонажі світу.',
    en: 'Every character you meet will live here.',
  },
  notesPh: { ru: 'Заметки…', uk: 'Нотатки…', en: 'Notes…' },

  newPlace: { ru: 'Новое место', uk: 'Нове місце', en: 'New place' },
  placeNamePh: {
    ru: 'Название (например: Деревня Тихие Холмы)',
    uk: 'Назва (наприклад: Село Тихі Пагорби)',
    en: 'Name (e.g. the village of Quiet Hills)',
  },
  placeDescPh: { ru: 'Чем известно это место', uk: 'Чим відоме це місце', en: 'What this place is known for' },
  placesEmpty: {
    ru: 'Карта мира ждёт первых открытий.',
    uk: 'Мапа світу чекає на перші відкриття.',
    en: 'The world map awaits its first discoveries.',
  },
} satisfies Record<string, Tri>;
