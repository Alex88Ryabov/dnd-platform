import type { Tri } from '../tr';

// Общие строки: навигация, повторяющиеся кнопки и подписи

export const T_COMMON = {
  brand: { ru: 'Летопись Героев', uk: 'Літопис Героїв', en: 'Chronicle of Heroes' },

  navHome: { ru: 'Главная', uk: 'Головна', en: 'Home' },
  navCharacters: { ru: 'Герои', uk: 'Герої', en: 'Heroes' },
  navDice: { ru: 'Кубики', uk: 'Кубики', en: 'Dice' },
  navMaster: { ru: 'Мастер', uk: 'Майстер', en: 'Master' },
  navJournal: { ru: 'Журнал', uk: 'Журнал', en: 'Journal' },
  navLibrary: { ru: 'Справочник', uk: 'Довідник', en: 'Library' },

  soundOn: { ru: 'Звук вкл.', uk: 'Звук увімк.', en: 'Sound on' },
  soundOff: { ru: 'Звук выкл.', uk: 'Звук вимк.', en: 'Sound off' },
  soundHint: {
    ru: 'Звуки включаются и выключаются здесь',
    uk: 'Звуки вмикаються і вимикаються тут',
    en: 'Toggle sound effects here',
  },
  saveBackup: { ru: 'Сохранить копию', uk: 'Зберегти копію', en: 'Save backup' },
  saveBackupHint: {
    ru: 'Скачать резервную копию всех данных',
    uk: 'Завантажити резервну копію всіх даних',
    en: 'Download a backup of all data',
  },
  loadBackup: { ru: 'Загрузить копию', uk: 'Завантажити копію', en: 'Load backup' },
  loadBackupHint: {
    ru: 'Загрузить данные из файла резервной копии',
    uk: 'Відновити дані з файлу резервної копії',
    en: 'Restore data from a backup file',
  },
  language: { ru: 'Язык', uk: 'Мова', en: 'Language' },

  save: { ru: 'Сохранить', uk: 'Зберегти', en: 'Save' },
  cancel: { ru: 'Отмена', uk: 'Скасувати', en: 'Cancel' },
  delete: { ru: 'Удалить', uk: 'Видалити', en: 'Delete' },
  close: { ru: 'Закрыть', uk: 'Закрити', en: 'Close' },
  add: { ru: 'Добавить', uk: 'Додати', en: 'Add' },
  back: { ru: '← Назад', uk: '← Назад', en: '← Back' },
  next: { ru: 'Далее →', uk: 'Далі →', en: 'Next →' },
  done: { ru: 'Готово', uk: 'Готово', en: 'Done' },
  edit: { ru: 'Править', uk: 'Редагувати', en: 'Edit' },
  search: { ru: 'Поиск…', uk: 'Пошук…', en: 'Search…' },
  name: { ru: 'Название', uk: 'Назва', en: 'Name' },
  description: { ru: 'Описание', uk: 'Опис', en: 'Description' },
  level: { ru: 'Уровень', uk: 'Рівень', en: 'Level' },
  levelShort: { ru: 'ур.', uk: 'рів.', en: 'lvl' },
  levelOf: { ru: '{n} ур.', uk: '{n} рів.', en: 'lvl {n}' },
  all: { ru: 'Все', uk: 'Усі', en: 'All' },

  backupSaved: { ru: 'Копия сохранена', uk: 'Копію збережено', en: 'Backup saved' },
  backupSavedText: {
    ru: 'Файл с героями и журналом скачан',
    uk: 'Файл із героями та журналом завантажено',
    en: 'A file with your heroes and journal has been downloaded',
  },
  backupLoaded: { ru: 'Данные загружены', uk: 'Дані завантажено', en: 'Data restored' },
  backupLoadedText: {
    ru: 'Герои и журнал восстановлены из файла',
    uk: 'Герої та журнал відновлені з файлу',
    en: 'Heroes and journal restored from the file',
  },
  backupFailed: { ru: 'Не получилось', uk: 'Не вийшло', en: 'That didn’t work' },
  backupFailedText: {
    ru: 'Файл не похож на резервную копию платформы',
    uk: 'Файл не схожий на резервну копію платформи',
    en: 'The file doesn’t look like a platform backup',
  },
} satisfies Record<string, Tri>;
