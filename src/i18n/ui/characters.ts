import type { Tri } from '../tr';

// Список героев, карточки и общие подписи листа персонажа

export const T_CHARS = {
  title: { ru: 'Герои отряда', uk: 'Герої загону', en: 'Party Heroes' },
  createHero: { ru: '✨ Создать героя', uk: '✨ Створити героя', en: '✨ Create a hero' },
  nobodyYet: { ru: 'Пока никого нет', uk: 'Поки нікого немає', en: 'Nobody here yet' },
  emptyHint: {
    ru: 'Создайте героя с нуля или добавьте готовую партию-пример, чтобы посмотреть, как всё устроено.',
    uk: 'Створіть героя з нуля або додайте готовий приклад загону, щоб побачити, як усе влаштовано.',
    en: 'Create a hero from scratch, or add a ready-made sample party to see how everything works.',
  },
  sampleParty: { ru: '🎁 Партия-пример', uk: '🎁 Приклад загону', en: '🎁 Sample party' },
  partyArrived: { ru: 'Партия прибыла!', uk: 'Загін прибув!', en: 'The party has arrived!' },
  partyAddedText: {
    ru: 'Четыре героя-примера добавлены',
    uk: 'Четверо героїв-прикладів додано',
    en: 'Four sample heroes added',
  },
  player: { ru: 'Игрок: {name}', uk: 'Гравець: {name}', en: 'Player: {name}' },
  acChip: { ru: 'КБ {n}', uk: 'КБ {n}', en: 'AC {n}' },
  pbChip: { ru: 'Мастерство +{n}', uk: 'Майстерність +{n}', en: 'Proficiency +{n}' },
  deleteHero: { ru: 'Удалить героя', uk: 'Видалити героя', en: 'Delete hero' },
  heroRetired: { ru: 'Герой ушёл на покой', uk: 'Герой пішов на спочинок', en: 'The hero has retired' },
  deleteQuestion: { ru: 'Удалить героя?', uk: 'Видалити героя?', en: 'Delete this hero?' },
  deleteWarning: {
    ru: '{name} исчезнет из летописи навсегда. Отменить это будет нельзя.',
    uk: '{name} зникне з літопису назавжди. Скасувати це буде неможливо.',
    en: '{name} will vanish from the chronicle forever. This cannot be undone.',
  },
  keep: { ru: 'Оставить', uk: 'Залишити', en: 'Keep' },
  tempHp: { ru: '+{n} врем.', uk: '+{n} тимч.', en: '+{n} temp' },
} satisfies Record<string, Tri>;
