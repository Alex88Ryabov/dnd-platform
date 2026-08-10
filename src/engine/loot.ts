import type { Money, Rarity } from '../model/types';
import { ITEMS } from '../data/equipment';
import { rollDice } from './dice';

export type LootTier = 1 | 2 | 3 | 4;
export type LootRichness = 'pocket' | 'chest' | 'hoard';

export interface LootResult {
  money: Money;
  items: { itemId: string; qty: number }[];
  flavor: string;
}

const FLAVORS = [
  'Среди пыли и паутины блестит добыча…',
  'Сундук со скрипом открывается…',
  'Под грудой костей что-то мерцает…',
  'Карманы поверженного врага не пусты…',
  'В тайнике, спрятанном за камнем, вы находите…',
  'Драконья бережливость вам на руку…',
];

function sum(dice: number[]): number {
  return dice.reduce((a, b) => a + b, 0);
}

function pick<T>(list: T[]): T | undefined {
  if (list.length === 0) {
    return undefined;
  }
  return list[Math.floor(Math.random() * list.length)];
}

function magicByRarity(rarities: Rarity[]): string | undefined {
  const pool = ITEMS.filter((i) => i.kind === 'magic' && i.magic && rarities.includes(i.magic.rarity));
  return pick(pool)?.id;
}

function gemsByTier(tier: LootTier): string[] {
  const byTier: Record<LootTier, string[]> = {
    1: ['gem-azurite', 'gem-carnelian', 'silver-goblet'],
    2: ['gem-carnelian', 'gem-garnet', 'pearl', 'silver-goblet'],
    3: ['gem-garnet', 'gem-topaz', 'pearl', 'gold-statuette'],
    4: ['gem-topaz', 'gem-necklace', 'gold-statuette'],
  };
  return byTier[tier];
}

// Щедрость сокровищ по уровню партии (tier: 1 = уровни 1–4, 2 = 5–10, 3 = 11–16, 4 = 17–20)
export function generateLoot(tier: LootTier, richness: LootRichness): LootResult {
  const money: Money = { pp: 0, gp: 0, ep: 0, sp: 0, cp: 0 };
  const items: { itemId: string; qty: number }[] = [];
  const addItem = (itemId: string | undefined, qty = 1) => {
    if (!itemId) {
      return;
    }
    const existing = items.find((i) => i.itemId === itemId);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ itemId, qty });
    }
  };

  if (richness === 'pocket') {
    if (tier === 1) {
      money.gp = sum(rollDice(2, 6));
      money.sp = sum(rollDice(3, 6));
    } else if (tier === 2) {
      money.gp = sum(rollDice(4, 6)) * 2;
    } else if (tier === 3) {
      money.gp = sum(rollDice(6, 6)) * 5;
    } else {
      money.gp = sum(rollDice(8, 6)) * 10;
      money.pp = sum(rollDice(1, 6));
    }
    if (Math.random() < 0.25) {
      addItem('potion-of-healing');
    }
  } else if (richness === 'chest') {
    if (tier === 1) {
      money.gp = sum(rollDice(4, 6)) * 5;
      if (Math.random() < 0.5) {
        addItem(pick(gemsByTier(tier)));
      }
      if (Math.random() < 0.6) {
        addItem(magicByRarity(['common']));
      }
    } else if (tier === 2) {
      money.gp = sum(rollDice(8, 6)) * 10;
      addItem(pick(gemsByTier(tier)));
      if (Math.random() < 0.7) {
        addItem(magicByRarity(['common', 'uncommon']));
      }
    } else if (tier === 3) {
      money.gp = sum(rollDice(8, 6)) * 25;
      addItem(pick(gemsByTier(tier)));
      addItem(magicByRarity(['uncommon', 'rare']));
    } else {
      money.gp = sum(rollDice(10, 6)) * 50;
      money.pp = sum(rollDice(2, 6)) * 5;
      addItem(pick(gemsByTier(tier)));
      addItem(magicByRarity(['rare', 'veryRare']));
    }
  } else {
    if (tier === 1) {
      money.gp = sum(rollDice(6, 6)) * 10;
      addItem(pick(gemsByTier(tier)), rollDice(1, 4)[0]);
      addItem(magicByRarity(['common', 'uncommon']));
      if (Math.random() < 0.5) {
        addItem(magicByRarity(['common', 'uncommon']));
      }
    } else if (tier === 2) {
      money.gp = sum(rollDice(5, 6)) * 100;
      addItem(pick(gemsByTier(tier)), rollDice(1, 4)[0]);
      addItem(magicByRarity(['uncommon']));
      addItem(magicByRarity(['uncommon', 'rare']));
    } else if (tier === 3) {
      money.gp = sum(rollDice(8, 6)) * 100;
      money.pp = sum(rollDice(3, 6)) * 10;
      addItem(pick(gemsByTier(tier)), rollDice(2, 4)[0]);
      addItem(magicByRarity(['rare']));
      addItem(magicByRarity(['rare', 'veryRare']));
    } else {
      money.gp = sum(rollDice(12, 6)) * 100;
      money.pp = sum(rollDice(8, 6)) * 10;
      addItem(pick(gemsByTier(tier)), rollDice(2, 4)[0]);
      addItem(magicByRarity(['veryRare']));
      addItem(magicByRarity(['veryRare', 'legendary']));
    }
  }

  return {
    money,
    items,
    flavor: FLAVORS[Math.floor(Math.random() * FLAVORS.length)],
  };
}
