import type { ItemsL10n } from './types';

// English translation of the item catalog (src/data/equipment.ts).
export const ITEMS_EN: ItemsL10n = {
  // ---------- Weapons: simple melee ----------
  'club': {
    name: 'Club',
    description: 'A simple, sturdy stick — every adventurer’s first weapon. Cheap and cheerful.',
    properties: ['Light'],
  },
  'dagger': {
    name: 'Dagger',
    description: 'A small blade that’s easy to hide and easy to throw. A rogue’s best friend.',
    properties: ['Finesse', 'Light', 'Thrown (range 20/60 ft)'],
  },
  'greatclub': {
    name: 'Greatclub',
    description: 'A huge, heavy cudgel swung with both hands. Strength over elegance.',
    properties: ['Two-Handed'],
  },
  'handaxe': {
    name: 'Handaxe',
    description: 'A small axe: chop away in melee, or send it spinning at a foe.',
    properties: ['Light', 'Thrown (range 20/60 ft)'],
  },
  'javelin': {
    name: 'Javelin',
    description: 'A light spear made for throwing. It flies far and true.',
    properties: ['Thrown (range 30/120 ft)'],
  },
  'light-hammer': {
    name: 'Light Hammer',
    description: 'A small war hammer, handy in the grip and in the air.',
    properties: ['Light', 'Thrown (range 20/60 ft)'],
  },
  'mace': {
    name: 'Mace',
    description: 'A heavy head on a stout haft. It doesn’t cut — it crushes.',
    properties: [],
  },
  'quarterstaff': {
    name: 'Quarterstaff',
    description: 'A long wooden staff, the weapon of monks and wanderers. A deft strike sweeps foes off their feet.',
    properties: ['Versatile (1d8)'],
  },
  'sickle': {
    name: 'Sickle',
    description: 'A curved farmer’s blade that becomes a weapon in skilled hands.',
    properties: ['Light'],
  },
  'spear': {
    name: 'Spear',
    description: 'A shaft with a sharp point: keeps enemies at bay, and flies at the target when needed.',
    properties: ['Thrown (range 20/60 ft)', 'Versatile (1d8)'],
  },

  // ---------- Weapons: simple ranged ----------
  'light-crossbow': {
    name: 'Light Crossbow',
    description: 'A mechanical bow with a simple trigger: crank, aim, loose.',
    properties: ['Ammunition (range 80/320 ft)', 'Loading', 'Two-Handed'],
  },
  'dart': {
    name: 'Dart',
    description: 'A small fletched missile. Accuracy matters more than muscle here.',
    properties: ['Finesse', 'Thrown (range 20/60 ft)'],
  },
  'shortbow': {
    name: 'Shortbow',
    description: 'A compact bow — the trusty companion of hunters and scouts.',
    properties: ['Ammunition (range 80/320 ft)', 'Two-Handed'],
  },
  'sling': {
    name: 'Sling',
    description: 'A strap for hurling stones. Simple as dirt, dangerous as a rockslide.',
    properties: ['Ammunition (range 30/120 ft)'],
  },

  // ---------- Weapons: martial melee ----------
  'battleaxe': {
    name: 'Battleaxe',
    description: 'An axe with a broad war blade: one hand or two, your foe won’t enjoy it either way.',
    properties: ['Versatile (1d10)'],
  },
  'flail': {
    name: 'Flail',
    description: 'A spiked weight on a chain. Unpredictable for the enemy, nimble in trained hands.',
    properties: [],
  },
  'glaive': {
    name: 'Glaive',
    description: 'A blade on a long pole: reaches foes where no sword can.',
    properties: ['Heavy', 'Reach', 'Two-Handed'],
  },
  'greataxe': {
    name: 'Greataxe',
    description: 'An enormous two-handed axe, beloved by barbarians. One swing settles a lot.',
    properties: ['Heavy', 'Two-Handed'],
  },
  'greatsword': {
    name: 'Greatsword',
    description: 'A blade as tall as a youth. Heavy, but unstoppable.',
    properties: ['Heavy', 'Two-Handed'],
  },
  'halberd': {
    name: 'Halberd',
    description: 'Axe, hook, and pike on a single shaft. The all-purpose guardian of castle gates.',
    properties: ['Heavy', 'Reach', 'Two-Handed'],
  },
  'lance': {
    name: 'Lance',
    description: 'A knight’s spear for mounted combat, most fearsome at full gallop. One hand is enough while mounted.',
    properties: ['Heavy', 'Reach', 'Two-Handed (unless mounted)'],
  },
  'longsword': {
    name: 'Longsword',
    description: 'The classic blade of heroes: reliable in one hand, deadly in two.',
    properties: ['Versatile (1d10)'],
  },
  'maul': {
    name: 'Maul',
    description: 'A massive two-handed hammer: where it lands, shields and armor crack.',
    properties: ['Heavy', 'Two-Handed'],
  },
  'morningstar': {
    name: 'Morningstar',
    description: 'A spiked mace: the weight of a hammer joined with piercing points.',
    properties: [],
  },
  'pike': {
    name: 'Pike',
    description: 'A very long polearm: the enemy is still far away, but the point is already close.',
    properties: ['Heavy', 'Reach', 'Two-Handed'],
  },
  'rapier': {
    name: 'Rapier',
    description: 'A slim, flexible blade for precise thrusts. The duelist’s weapon.',
    properties: ['Finesse'],
  },
  'scimitar': {
    name: 'Scimitar',
    description: 'A light curved saber: a dance of steel in swift hands.',
    properties: ['Finesse', 'Light'],
  },
  'shortsword': {
    name: 'Shortsword',
    description: 'A short blade for the quick and nimble. Pairs beautifully with a second one.',
    properties: ['Finesse', 'Light'],
  },
  'trident': {
    name: 'Trident',
    description: 'The three-pronged spear of fishers and gladiators: throw it, or hold the line.',
    properties: ['Thrown (range 20/60 ft)', 'Versatile (1d10)'],
  },
  'war-pick': {
    name: 'War Pick',
    description: 'A pick with a sharp steel beak that punches through even solid armor.',
    properties: ['Versatile (1d10)'],
  },
  'warhammer': {
    name: 'Warhammer',
    description: 'The hammer of knights and dwarves: dependable against armor and shields.',
    properties: ['Versatile (1d10)'],
  },
  'whip': {
    name: 'Whip',
    description: 'A long, supple whip: it cracks from afar and won’t let enemies slip away.',
    properties: ['Finesse', 'Reach'],
  },

  // ---------- Weapons: martial ranged ----------
  'blowgun': {
    name: 'Blowgun',
    description: 'A tube for silent needle shots. The weapon of tricksters and jungle trackers.',
    properties: ['Ammunition (range 25/100 ft)', 'Loading'],
  },
  'hand-crossbow': {
    name: 'Hand Crossbow',
    description: 'A tiny crossbow fired with one hand. Compact and cunning.',
    properties: ['Ammunition (range 30/120 ft)', 'Light', 'Loading'],
  },
  'heavy-crossbow': {
    name: 'Heavy Crossbow',
    description: 'A mighty crossbow: slow to load, but it hits like a battering ram.',
    properties: ['Ammunition (range 100/400 ft)', 'Heavy', 'Loading', 'Two-Handed'],
  },
  'longbow': {
    name: 'Longbow',
    description: 'A tall bow the height of its archer. The arrow flies farther than a shout carries.',
    properties: ['Ammunition (range 150/600 ft)', 'Heavy', 'Two-Handed'],
  },
  'musket': {
    name: 'Musket',
    description: 'A thunder-pipe running on black powder: roar, smoke, and a heavy bullet.',
    properties: ['Ammunition (range 40/120 ft)', 'Loading', 'Two-Handed'],
  },
  'pistol': {
    name: 'Pistol',
    description: 'A compact firearm: one well-aimed shot, then a long reload.',
    properties: ['Ammunition (range 30/90 ft)', 'Loading'],
  },

  // ---------- Armor and shield ----------
  'padded-armor': {
    name: 'Padded Armor',
    description: 'A jacket of quilted cloth. Better than nothing, but it rustles with every step.',
  },
  'leather-armor': {
    name: 'Leather Armor',
    description: 'A jacket of tanned leather: light, quiet, and beloved by scouts.',
  },
  'studded-leather': {
    name: 'Studded Leather Armor',
    description: 'Leather armor reinforced with metal rivets. A bit heavier — noticeably tougher.',
  },
  'hide-armor': {
    name: 'Hide Armor',
    description: 'Armor of thick pelts. Simple, rugged, hunter-style.',
  },
  'chain-shirt': {
    name: 'Chain Shirt',
    description: 'A shirt of mail worn under clothing: protection that draws no attention.',
  },
  'scale-mail': {
    name: 'Scale Mail',
    description: 'Armor of metal scales, like a dragon’s. It jingles with every move.',
  },
  'breastplate': {
    name: 'Breastplate',
    description: 'A metal cuirass over leather: guards what matters most without cramping your moves.',
  },
  'half-plate': {
    name: 'Half Plate Armor',
    description: 'Plate over all the vital spots. Almost full plate, only lighter.',
  },
  'ring-mail': {
    name: 'Ring Mail',
    description: 'Leather with iron rings sewn on. Cheap and a bit heavy, but it works.',
  },
  'chain-mail': {
    name: 'Chain Mail',
    description: 'Full mail with a coif: thousands of steel rings against blades.',
  },
  'splint-armor': {
    name: 'Splint Armor',
    description: 'Strips of metal over a sturdy backing. The trusted defense of heavy infantry.',
  },
  'plate-armor': {
    name: 'Plate Armor',
    description: 'A full suit of plate — every knight’s dream. A fortress you wear.',
  },
  'shield': {
    name: 'Shield',
    description: 'A sturdy shield of wood and steel: +2 to your Armor Class while it’s in hand.',
  },

  // ---------- Adventuring gear ----------
  'backpack': {
    name: 'Backpack',
    description: 'A sturdy pack that holds an adventurer’s entire kit.',
  },
  'bedroll': {
    name: 'Bedroll',
    description: 'A camp mattress and blanket in one roll: sleeping under the stars gets cozier.',
  },
  'rope-hempen': {
    name: 'Rope (50 feet)',
    description: 'Fifty feet of stout hempen rope. Saves the day more often than a sword.',
  },
  'torch': {
    name: 'Torch',
    description: 'Burns for about an hour, shedding bright light within 20 feet.',
  },
  'lantern-hooded': {
    name: 'Hooded Lantern',
    description: 'An oil lantern with shutters: dim the light with a single motion.',
  },
  'oil-flask': {
    name: 'Oil (flask)',
    description: 'A flask of oil: six hours of lantern fuel — or a slippery puddle for your enemies.',
  },
  'tinderbox': {
    name: 'Tinderbox',
    description: 'Flint, steel, and tinder: fire in mere moments.',
  },
  'rations': {
    name: 'Rations (1 day)',
    description: 'Hardtack, jerky, nuts, and dried fruit — food for one day on the road.',
  },
  'waterskin': {
    name: 'Waterskin',
    description: 'A leather bag for water: on a long road, thirst is scarier than many monsters.',
  },
  'tent': {
    name: 'Tent',
    description: 'A two-person field tent: shelter from rain, wind, and prying eyes.',
  },
  'blanket': {
    name: 'Blanket',
    description: 'A warm wool blanket for cold nights by the campfire.',
  },
  'rope-ladder': {
    name: 'Rope Ladder',
    description: 'A rope ladder with wooden rungs: far easier to climb than bare rope.',
  },
  'grappling-hook': {
    name: 'Grappling Hook',
    description: 'A metal hook for your rope: catch a ledge and head up the wall.',
  },
  'crowbar': {
    name: 'Crowbar',
    description: 'An iron lever: grants advantage on Strength checks where leverage counts.',
  },
  'hammer': {
    name: 'Hammer',
    description: 'An ordinary hammer: drive a peg, set a hook, mend a cart.',
  },
  'iron-spikes': {
    name: 'Iron Spikes (10)',
    description: 'Ten iron spikes: wedge a door shut or anchor a rope.',
  },
  'pitons': {
    name: 'Pitons (10)',
    description: 'Metal peg-hooks for scaling cliffs and staking down tents.',
  },
  'steel-mirror': {
    name: 'Steel Mirror',
    description: 'A polished steel mirror: peek around corners or flash sunlight as a signal.',
  },
  'soap': {
    name: 'Soap',
    description: 'A bar of soap. Even heroes need a wash after the dungeon.',
  },
  'signal-whistle': {
    name: 'Signal Whistle',
    description: 'A loud whistle: a prearranged signal your friends can hear from afar.',
  },
  'bell': {
    name: 'Bell',
    description: 'A tiny bell: a chiming sentry for a door or a bag.',
  },
  'candle': {
    name: 'Candle',
    description: 'Burns for an hour, shedding dim light a few steps around.',
  },
  'sack': {
    name: 'Sack',
    description: 'A plain canvas sack for loot and supplies.',
  },
  'belt-pouch': {
    name: 'Pouch',
    description: 'A small belt pouch for coins and useful odds and ends.',
  },
  'flask': {
    name: 'Flask',
    description: 'A metal flask for water or herbal brew.',
  },
  'iron-pot': {
    name: 'Iron Pot',
    description: 'A cast-iron pot: a hot supper is half the battle on the road.',
  },
  'mess-kit': {
    name: 'Mess Kit',
    description: 'A tin box hiding a bowl, a cup, and a spoon.',
  },
  'silk-rope': {
    name: 'Silk Rope (50 feet)',
    description: 'Fifty feet of silk rope: thinner and lighter than hemp, and holds just as well.',
  },
  'chain': {
    name: 'Chain (10 feet)',
    description: 'Ten feet of strong iron chain with heavy links.',
  },
  'lock': {
    name: 'Lock',
    description: 'A padlock with a key. Thieves’ tools can pick it, but not without effort.',
  },
  'manacles': {
    name: 'Manacles',
    description: 'Iron restraints for the wrists: a captured villain isn’t going anywhere.',
  },
  'spyglass': {
    name: 'Spyglass',
    description: 'A precious optical instrument: the distant becomes twice as near.',
  },
  'hourglass': {
    name: 'Hourglass',
    description: 'Glass bulbs filled with sand: they measure exactly one hour, grain by grain.',
  },
  'ink-and-pen': {
    name: 'Ink and Pen',
    description: 'A vial of ink and a writing pen: record a map, a letter, or a spell.',
  },
  'parchment': {
    name: 'Parchment (one sheet)',
    description: 'A sheet of parchment for maps, letters, and secret notes.',
  },
  'book': {
    name: 'Book',
    description: 'A thick book: lore, learning, or blank pages for an adventuring journal.',
  },
  'vial': {
    name: 'Vial',
    description: 'A small glass vial for potions and mysterious samples.',
  },
  'glass-bottle': {
    name: 'Glass Bottle',
    description: 'A corked glass bottle that holds about a liter of liquid.',
  },
  'holy-symbol': {
    name: 'Holy Symbol',
    description: 'The emblem of a deity — a focus for the spells of clerics and paladins.',
  },
  'holy-water': {
    name: 'Holy Water (flask)',
    description: 'Consecrated water: splash it on undead or fiends and it sears them like fire.',
  },
  'component-pouch': {
    name: 'Component Pouch',
    description: 'A belt pouch holding all the small components a spellcaster needs.',
  },
  'arcane-focus': {
    name: 'Arcane Focus',
    description: 'A crystal or rod that channels magical power in place of components.',
  },
  'healers-kit': {
    name: "Healer's Kit",
    description: 'Bandages, salves, and splints, ten uses in all: stabilizes the wounded without a check.',
  },
  'antitoxin': {
    name: 'Antitoxin',
    description: 'A vial of murky liquid: advantage on saving throws against poison for one hour.',
  },
  'common-clothes': {
    name: 'Common Clothes',
    description: 'Plain, sturdy clothes for everyday wear.',
  },
  'travelers-clothes': {
    name: "Traveler's Clothes",
    description: 'Rugged clothes for long roads: boots, a cloak, and a hood against the rain.',
  },
  'arrows': {
    name: 'Arrows (20)',
    description: 'A quiver of twenty arrows for a shortbow or longbow.',
  },
  'crossbow-bolts': {
    name: 'Crossbow Bolts (20)',
    description: 'Twenty short, heavy bolts that fit any crossbow.',
  },
  'sling-bullets': {
    name: 'Sling Bullets (20)',
    description: 'Twenty lead bullets. Plain stones will do, but these fly truer.',
  },
  'blowgun-needles': {
    name: 'Blowgun Needles (50)',
    description: 'Fifty light needles for a blowgun.',
  },
  'firearm-bullets': {
    name: 'Firearm Bullets (10)',
    description: 'Ten lead bullets and a supply of powder for a musket or pistol.',
  },

  // ---------- Tools ----------
  'thieves-tools': {
    name: "Thieves' Tools",
    description: 'Picks, a file, and probes: they open locks and disarm traps.',
  },
  'artisans-tools': {
    name: "Artisan's Tools",
    description: 'The tools of a single trade: smith, carpenter, cook, or another craft.',
  },
  'gaming-set': {
    name: 'Gaming Set',
    description: 'Dice and cards for games by the campfire. Just don’t play a rogue for money!',
  },
  'lute': {
    name: 'Lute',
    description: 'A stringed lute — the bard’s voice, inspiring friends to great deeds.',
  },
  'flute': {
    name: 'Flute',
    description: 'A simple wooden flute with a soft, clear voice.',
  },

  // ---------- Magic items ----------
  'potion-of-healing': {
    name: 'Potion of Healing',
    description: 'A shimmering red liquid. The drinker regains 2d4+2 Hit Points (a Bonus Action in the 2024 rules).',
  },
  'potion-of-healing-greater': {
    name: 'Potion of Healing (Greater)',
    description: 'A bubbling bright-red liquid. Restores 4d4+4 Hit Points.',
  },
  'potion-of-healing-superior': {
    name: 'Potion of Healing (Superior)',
    description: 'A radiant scarlet potion. Restores 8d4+8 Hit Points.',
  },
  'potion-of-healing-supreme': {
    name: 'Potion of Healing (Supreme)',
    description: 'A thick, ruby-colored potion. Restores 10d4+20 Hit Points.',
  },
  'potion-of-invisibility': {
    name: 'Potion of Invisibility',
    description: 'The vial looks empty. The drinker turns invisible for an hour — until they attack or cast a spell.',
  },
  'potion-of-fire-breath': {
    name: 'Potion of Fire Breath',
    description: 'A fiery liquid trailing smoke: for a full hour you can exhale flame three times (4d6 fire damage).',
  },
  'potion-of-resistance': {
    name: 'Potion of Resistance',
    description: 'Grants resistance to one damage type for an hour — the brewer decided which one.',
  },
  'potion-of-heroism': {
    name: 'Potion of Heroism',
    description: 'Courage in a bottle: for an hour you gain 10 Temporary Hit Points and the effect of the Bless spell.',
  },
  'potion-of-flying': {
    name: 'Potion of Flying',
    description: 'For an hour you gain a Fly Speed equal to your walking speed. The sky is calling!',
  },
  'weapon-plus-1': {
    name: 'Weapon, +1',
    description: 'A weapon traced with glowing runes: +1 to attack and damage rolls. It can be any kind of weapon.',
  },
  'weapon-plus-2': {
    name: 'Weapon, +2',
    description: 'The work of a true master enchanter: +2 to attack and damage rolls.',
  },
  'armor-plus-1': {
    name: 'Armor, +1',
    description: 'Enchanted armor: +1 to Armor Class. It can be any kind of armor.',
  },
  'shield-plus-1': {
    name: 'Shield, +1',
    description: 'An enchanted shield: +3 to AC in total (the usual +2 plus a magical +1).',
  },
  'ring-of-protection': {
    name: 'Ring of Protection',
    description: 'A slender ring carved with warding runes: +1 to AC and all saving throws.',
  },
  'cloak-of-protection': {
    name: 'Cloak of Protection',
    description: 'A light cloak that turns blows aside: +1 to AC and all saving throws.',
  },
  'cloak-of-elvenkind': {
    name: 'Cloak of Elvenkind',
    description: 'A cloak that shifts color to match its surroundings: with the hood up it grants advantage on Stealth, and the wearer is harder to spot.',
  },
  'boots-of-elvenkind': {
    name: 'Boots of Elvenkind',
    description: 'Steps in these boots make no sound at all: advantage on checks to move silently.',
  },
  'bag-of-holding': {
    name: 'Bag of Holding',
    description: 'The bag is bigger inside than out: it holds up to 500 pounds yet always weighs 15.',
  },
  'rope-of-climbing': {
    name: 'Rope of Climbing',
    description: 'On command the rope snakes upward, ties itself in knots, and bears tremendous weight.',
  },
  'wand-of-magic-missiles': {
    name: 'Wand of Magic Missiles',
    description: 'A wand with 7 charges: it looses magic missiles that never miss.',
  },
  'wand-of-lightning-bolts': {
    name: 'Wand of Lightning Bolts',
    description: 'A wand with 7 charges: it hurls lightning bolts as the 3rd-level spell.',
  },
  'staff-of-healing': {
    name: 'Staff of Healing',
    description: 'A carved staff stocked with healing spells — for bards, druids, and clerics.',
  },
  'amulet-of-health': {
    name: 'Amulet of Health',
    description: 'While the amulet hangs at your neck, your Constitution becomes 19.',
  },
  'gauntlets-of-ogre-power': {
    name: 'Gauntlets of Ogre Power',
    description: 'In these gauntlets the wearer’s Strength becomes 19 — an ogre’s might.',
  },
  'belt-of-hill-giant-strength': {
    name: 'Belt of Hill Giant Strength',
    description: 'A broad belt of hide: the wearer’s Strength becomes 21 — like a hill giant’s.',
  },
  'headband-of-intellect': {
    name: 'Headband of Intellect',
    description: 'An elegant circlet: the wearer’s Intelligence becomes 19. Clever thoughts included.',
  },
  'boots-of-speed': {
    name: 'Boots of Speed',
    description: 'Click the heels together and your Speed doubles (up to 10 minutes a day in total).',
  },
  'winged-boots': {
    name: 'Winged Boots',
    description: 'Boots with tiny wings at the heels: up to 4 hours of flight a day at your walking speed.',
  },
  'stone-of-good-luck': {
    name: 'Stone of Good Luck',
    description: 'A smooth polished agate: +1 to ability checks and saving throws.',
  },
  'broom-of-flying': {
    name: 'Broom of Flying',
    description: 'A flying broom: it carries its rider at a speed of 50 feet and comes when called.',
  },
  'carpet-of-flying': {
    name: 'Carpet of Flying',
    description: 'A patterned carpet that soars on command, carrying its riders across the sky at up to 80 feet.',
  },
  'figurine-silver-raven': {
    name: 'Figurine of Wondrous Power (Silver Raven)',
    description: 'A silver statuette that springs to life on command: the raven serves for 12 hours and carries letters.',
  },
  'spell-scroll-1': {
    name: 'Spell Scroll (1st level)',
    description: 'A scroll bearing a 1st-level spell: read it, the spell takes effect, and the scroll crumbles to dust.',
  },
  'spell-scroll-2': {
    name: 'Spell Scroll (2nd level)',
    description: 'A scroll bearing a 2nd-level spell: one reading, one miracle.',
  },
  'spell-scroll-3': {
    name: 'Spell Scroll (3rd level)',
    description: 'A scroll bearing a mighty 3rd-level spell. Save it for the moment that matters most!',
  },
  'dust-of-disappearance': {
    name: 'Dust of Disappearance',
    description: 'A pinch of glittering dust: toss it into the air and everyone nearby turns invisible for 2d4 minutes.',
  },

  // ---------- Treasure ----------
  'gem-azurite': {
    name: 'Azurite',
    description: 'An opaque, mottled deep-blue stone. Worth about 10 gp.',
  },
  'gem-carnelian': {
    name: 'Carnelian',
    description: 'An orange translucent gem. Worth about 50 gp.',
  },
  'gem-garnet': {
    name: 'Garnet',
    description: 'A gleaming deep-red gem. Worth about 100 gp.',
  },
  'gem-topaz': {
    name: 'Topaz',
    description: 'A golden-yellow gemstone. Worth about 500 gp.',
  },
  'pearl': {
    name: 'Pearl',
    description: 'A large white pearl from the southern seas. Worth about 100 gp.',
  },
  'gold-statuette': {
    name: 'Golden Statuette',
    description: 'A finely wrought gold figurine of an ancient hero. Worth about 250 gp.',
  },
  'silver-goblet': {
    name: 'Silver Goblet',
    description: 'A silver goblet with a chased design. Worth about 25 gp.',
  },
  'gem-necklace': {
    name: 'Gem-Studded Necklace',
    description: 'A necklace strewn with sparkling gems. Worth about 750 gp.',
  },
};
