import type { Tri } from '../tr';
import type { ItemKind, Money } from '../../model/types';

// Вкладка «Снаряжение»

export const T_GEAR = {
  wallet: { ru: 'Кошелёк', uk: 'Гаманець', en: 'Purse' },
  backpack: { ru: 'Рюкзак и экипировка', uk: 'Наплічник і спорядження', en: 'Backpack & Equipment' },
  searchPh: {
    ru: '🔍 Найти предмет в каталоге (например: меч, зелье, верёвка)…',
    uk: '🔍 Знайти предмет у каталозі (наприклад: меч, зілля, мотузка)…',
    en: '🔍 Search the catalog (e.g. sword, potion, rope)…',
  },
  addCustomItem: { ru: '+ Свой предмет', uk: '+ Власний предмет', en: '+ Custom item' },
  emptyBackpack: {
    ru: 'Рюкзак пуст. Найдите что-нибудь в каталоге выше!',
    uk: 'Наплічник порожній. Знайдіть щось у каталозі вище!',
    en: 'The backpack is empty. Find something in the catalog above!',
  },
  thItem: { ru: 'Предмет', uk: 'Предмет', en: 'Item' },
  thQty: { ru: 'Кол-во', uk: 'К-сть', en: 'Qty' },
  thEquipped: { ru: 'Экип.', uk: 'Екіп.', en: 'Equip' },
  attunementHint: {
    ru: 'Настройка на магический предмет',
    uk: 'Налаштування на магічний предмет',
    en: 'Attunement to the magic item',
  },
  attuned: { ru: '🔗 настроен', uk: '🔗 налаштовано', en: '🔗 attuned' },
  attuneQ: { ru: 'настройка?', uk: 'налаштувати?', en: 'attune?' },
  noProps: { ru: 'без свойств', uk: 'без властивостей', en: 'no properties' },
  acBase: { ru: 'КБ {n}', uk: 'КБ {n}', en: 'AC {n}' },
  plusDex: { ru: ' + Лов', uk: ' + СПР', en: ' + Dex' },
  plusDexCap: { ru: ' + Лов (макс. {cap})', uk: ' + СПР (макс. {cap})', en: ' + Dex (max {cap})' },
  drink: { ru: '🧪 Выпить', uk: '🧪 Випити', en: '🧪 Drink' },
  drinkLabel: { ru: 'Выпито: {name}', uk: 'Випито: {name}', en: 'Drank: {name}' },
  throwAway: { ru: 'Выбросить', uk: 'Викинути', en: 'Discard' },
  addedToPack: { ru: 'Добавлено в рюкзак', uk: 'Додано до наплічника', en: 'Added to the backpack' },
  added: { ru: 'Добавлено', uk: 'Додано', en: 'Added' },
  equippedHint: {
    ru: 'Экипировано (в руках или надето)',
    uk: 'Екіпіровано (в руках або вдягнено)',
    en: 'Equipped (held or worn)',
  },
  customItemTitle: { ru: 'Свой предмет', uk: 'Власний предмет', en: 'Custom item' },
  itemNamePh: {
    ru: 'Название (например: Карта старого пирата)',
    uk: 'Назва (наприклад: Мапа старого пірата)',
    en: 'Name (e.g. an old pirate’s map)',
  },
  descOptional: { ru: 'Описание (необязательно)', uk: 'Опис (необов’язково)', en: 'Description (optional)' },
  costGp: { ru: '{n} зм', uk: '{n} зм', en: '{n} gp' },
} satisfies Record<string, Tri>;

export const COIN_LABELS: Record<keyof Money, Tri> = {
  pp: { ru: 'ПМ', uk: 'ПМ', en: 'PP' },
  gp: { ru: 'ЗМ', uk: 'ЗМ', en: 'GP' },
  ep: { ru: 'ЭМ', uk: 'ЕМ', en: 'EP' },
  sp: { ru: 'СМ', uk: 'СМ', en: 'SP' },
  cp: { ru: 'ММ', uk: 'ММ', en: 'CP' },
};

export const KIND_LABELS: Record<ItemKind, Tri> = {
  weapon: { ru: 'Оружие', uk: 'Зброя', en: 'Weapon' },
  armor: { ru: 'Доспех', uk: 'Обладунок', en: 'Armor' },
  shield: { ru: 'Щит', uk: 'Щит', en: 'Shield' },
  gear: { ru: 'Снаряжение', uk: 'Спорядження', en: 'Gear' },
  tool: { ru: 'Инструмент', uk: 'Інструмент', en: 'Tool' },
  consumable: { ru: 'Расходник', uk: 'Витратний', en: 'Consumable' },
  treasure: { ru: 'Сокровище', uk: 'Скарб', en: 'Treasure' },
  magic: { ru: 'Магический', uk: 'Магічний', en: 'Magic' },
};
