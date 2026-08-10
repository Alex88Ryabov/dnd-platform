import type { Character } from '../model/types';
import { buildNewCharacter } from '../engine/creation';
import { uid } from '../engine/dice';

// Готовая партия-пример: четыре героя 1-го уровня, которых можно изучать и менять
export function buildSampleParty(): Character[] {
  const torin = buildNewCharacter({
    name: 'Торин Каменное Сердце',
    playerName: 'Пример',
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
    backstory: 'Ветеран горной стражи. Ищет легендарный молот своего прадеда, украденный гоблинами.',
  });
  torin.inventory.push({ uid: uid(), itemId: 'potion-of-healing', qty: 2, equipped: false });

  const lirael = buildNewCharacter({
    name: 'Лираэль Звёздный Шёпот',
    playerName: 'Пример',
    portrait: { icon: '🌙', hue: 230 },
    classId: 'wizard',
    speciesId: 'elf',
    backgroundId: 'sage',
    abilities: { str: 8, dex: 14, con: 13, int: 17, wis: 12, cha: 10 },
    skills: ['arcana', 'investigation'],
    cantrips: ['fire-bolt', 'mage-hand', 'light'],
    prepared: ['magic-missile', 'mage-armor', 'shield', 'sleep'],
    alignment: 'Нейтрально-добрый',
    backstory: 'Юная волшебница из башни Семи Звёзд. Читает быстрее, чем дышит, и мечтает увидеть настоящего дракона.',
  });

  const brenna = buildNewCharacter({
    name: 'Бренна Светлый Щит',
    playerName: 'Пример',
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
    backstory: 'Служительница храма Рассвета. Верит, что каждого можно спасти — а кого нельзя, того утихомирит булава.',
  });

  const pip = buildNewCharacter({
    name: 'Пип Лёгкая Лапка',
    playerName: 'Пример',
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
    backstory: 'Бывший карманник из порта Синей Чайки. Клянётся, что завязал. Пальцы, правда, об этом не знают.',
  });

  return [torin, lirael, brenna, pip];
}
