import type { Character } from '../model/types';
import { buildNewCharacter } from '../engine/creation';
import { uid } from '../engine/dice';
import { tr } from '../i18n/tr';
import type { Tri } from '../i18n/tr';

const SAMPLE_PLAYER: Tri = { ru: 'Пример', uk: 'Приклад', en: 'Sample' };

const TORIN: Record<'name' | 'backstory', Tri> = {
  name: { ru: 'Торин Каменное Сердце', uk: 'Торін Кам’яне Серце', en: 'Torin Stoneheart' },
  backstory: {
    ru: 'Ветеран горной стражи. Ищет легендарный молот своего прадеда, украденный гоблинами.',
    uk: 'Ветеран гірської варти. Шукає легендарний молот свого прадіда, украдений гоблінами.',
    en: 'A veteran of the mountain guard. Seeks his great-grandfather’s legendary hammer, stolen by goblins.',
  },
};

const LIRAEL: Record<'name' | 'backstory', Tri> = {
  name: { ru: 'Лираэль Звёздный Шёпот', uk: 'Ліраель Зоряний Шепіт', en: 'Lirael Starwhisper' },
  backstory: {
    ru: 'Юная волшебница из башни Семи Звёзд. Читает быстрее, чем дышит, и мечтает увидеть настоящего дракона.',
    uk: 'Юна чарівниця з вежі Семи Зірок. Читає швидше, ніж дихає, і мріє побачити справжнього дракона.',
    en: 'A young wizard from the Tower of Seven Stars. Reads faster than she breathes and dreams of seeing a real dragon.',
  },
};

const BRENNA: Record<'name' | 'backstory', Tri> = {
  name: { ru: 'Бренна Светлый Щит', uk: 'Бренна Світлий Щит', en: 'Brenna Brightshield' },
  backstory: {
    ru: 'Служительница храма Рассвета. Верит, что каждого можно спасти — а кого нельзя, того утихомирит булава.',
    uk: 'Служителька храму Світанку. Вірить, що кожного можна врятувати — а кого не можна, того вгамує булава.',
    en: 'An acolyte of the Temple of Dawn. Believes anyone can be saved — and those who can’t will be calmed by her mace.',
  },
};

const PIP: Record<'name' | 'backstory', Tri> = {
  name: { ru: 'Пип Лёгкая Лапка', uk: 'Піп Легка Лапка', en: 'Pip Lightpaw' },
  backstory: {
    ru: 'Бывший карманник из порта Синей Чайки. Клянётся, что завязал. Пальцы, правда, об этом не знают.',
    uk: 'Колишній кишеньковий злодій із порту Синьої Чайки. Присягається, що зав’язав. Пальці, щоправда, про це не знають.',
    en: 'A former pickpocket from Blue Gull Harbor. Swears he’s gone straight. His fingers, however, haven’t heard.',
  },
};

// Готовая партия-пример: четыре героя 1-го уровня, которых можно изучать и менять
export function buildSampleParty(): Character[] {
  const torin = buildNewCharacter({
    name: tr(TORIN.name),
    playerName: tr(SAMPLE_PLAYER),
    portrait: { icon: '🛡️', hue: 10 },
    classId: 'fighter',
    speciesId: 'dwarf',
    backgroundId: 'soldier',
    abilities: { str: 17, dex: 12, con: 16, int: 8, wis: 13, cha: 10 },
    skills: ['athletics', 'perception'],
    fightingStyleId: 'fs-defense',
    cantrips: [],
    prepared: [],
    alignment: 'Законно-добрый',
    backstory: tr(TORIN.backstory),
  });
  torin.inventory.push({ uid: uid(), itemId: 'potion-of-healing', qty: 2, equipped: false });

  const lirael = buildNewCharacter({
    name: tr(LIRAEL.name),
    playerName: tr(SAMPLE_PLAYER),
    portrait: { icon: '🌙', hue: 230 },
    classId: 'wizard',
    speciesId: 'elf',
    backgroundId: 'sage',
    abilities: { str: 8, dex: 14, con: 13, int: 17, wis: 12, cha: 10 },
    skills: ['arcana', 'investigation'],
    cantrips: ['fire-bolt', 'mage-hand', 'light'],
    prepared: ['magic-missile', 'mage-armor', 'shield', 'sleep'],
    alignment: 'Нейтрально-добрый',
    backstory: tr(LIRAEL.backstory),
  });

  const brenna = buildNewCharacter({
    name: tr(BRENNA.name),
    playerName: tr(SAMPLE_PLAYER),
    portrait: { icon: '☀️', hue: 45 },
    classId: 'cleric',
    speciesId: 'human',
    backgroundId: 'acolyte',
    abilities: { str: 14, dex: 10, con: 14, int: 10, wis: 16, cha: 12 },
    skills: ['medicine', 'religion'],
    extraFeatId: 'tough',
    cantrips: ['sacred-flame', 'guidance', 'light'],
    prepared: ['cure-wounds', 'bless', 'guiding-bolt', 'shield-of-faith'],
    alignment: 'Законно-добрый',
    backstory: tr(BRENNA.backstory),
  });

  const pip = buildNewCharacter({
    name: tr(PIP.name),
    playerName: tr(SAMPLE_PLAYER),
    portrait: { icon: '🍀', hue: 120 },
    classId: 'rogue',
    speciesId: 'halfling',
    backgroundId: 'criminal',
    abilities: { str: 8, dex: 17, con: 12, int: 13, wis: 12, cha: 14 },
    skills: ['acrobatics', 'perception', 'deception', 'insight'],
    expertise: ['stealth', 'sleightOfHand'],
    cantrips: [],
    prepared: [],
    alignment: 'Хаотично-добрый',
    backstory: tr(PIP.backstory),
  });

  return [torin, lirael, brenna, pip];
}
