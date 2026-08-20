import type { SpeciesL10nMap } from './types';

export const SPECIES_EN: SpeciesL10nMap = {
  human: {
    name: 'Human',
    description: 'The most numerous and tenacious of folk. Humans get by not on ancestral magic but on resourcefulness, ambition, and the knack of getting back up after every defeat.',
    sizeNote: 'Medium or Small — your choice',
    traits: [
      { name: 'Resourceful', description: 'You gain Heroic Inspiration whenever you finish a Long Rest.' },
      { name: 'Skillful', description: 'You gain proficiency in one skill of your choice.' },
      { name: 'Versatile', description: 'You gain an additional Origin feat of your choice.' },
    ],
  },
  elf: {
    name: 'Elf',
    description: 'A graceful people with fey heritage who live for centuries. Elves see in the dark, never truly sleep, and carry a spark of ancient magic in their blood.',
    traits: [
      { name: 'Darkvision', description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.' },
      { name: 'Fey Ancestry', description: 'You have advantage on saving throws against the Charmed condition.' },
      { name: 'Keen Senses', description: 'You gain proficiency in one of these skills: Insight, Perception, or Survival.' },
      { name: 'Trance', description: 'You don’t sleep: 4 hours of semi-waking trance serve as a Long Rest.' },
      { name: 'Elven Lineage', description: 'Choose a lineage: high elf (a wizard cantrip, Misty Step at 3rd level, Fly at 5th), wood elf (Druidcraft, 35 ft Speed, Longstrider at 3rd level, Pass without Trace at 5th), or drow (120 ft Darkvision, Dancing Lights, Faerie Fire at 3rd level, Darkness at 5th).' },
    ],
  },
  dwarf: {
    name: 'Dwarf',
    description: 'A hardy mountain folk of smiths and warriors. Dwarves read stone the way fish read water, shrug off poisons, and take blows that would drop an ox.',
    traits: [
      { name: 'Darkvision', description: 'You can see in darkness within 120 feet.' },
      { name: 'Dwarven Resilience', description: 'You have Resistance to poison damage and advantage on saving throws against the Poisoned condition.' },
      { name: 'Dwarven Toughness', description: 'Your Hit Point maximum increases by 1 for every level you have.' },
      { name: 'Stonecunning', description: 'As a Bonus Action, you can sense vibrations in stone within 60 feet for 10 minutes (a number of times per day equal to your Proficiency Bonus).' },
    ],
  },
  halfling: {
    name: 'Halfling',
    description: 'A small, merry folk with oversized luck. Halflings are fearless, nimble, and skilled at vanishing behind someone a bit taller.',
    traits: [
      { name: 'Brave', description: 'You have advantage on saving throws against the Frightened condition.' },
      { name: 'Luck', description: 'When you roll a 1 on a d20, you can reroll it — and must use the new roll.' },
      { name: 'Halfling Nimbleness', description: 'You can move through the space of any creature that is larger than you.' },
      { name: 'Naturally Stealthy', description: 'You can hide behind a creature that is at least one size larger than you.' },
    ],
  },
  dragonborn: {
    name: 'Dragonborn',
    description: 'Descendants of the great dragons: scales, pride, and elemental breath in the chest. Your draconic ancestry determines your element.',
    traits: [
      { name: 'Draconic Ancestry', description: 'Choose your dragon ancestor: red/gold/brass — fire, blue/bronze — lightning, white/silver — cold, black/copper — acid, green — poison.' },
      { name: 'Breath Weapon', description: 'In place of one attack, you exhale your element in a 15-foot cone or a 30-foot line: 1d10 damage, Dexterity saving throw (2d10 at 5th level, 3d10 at 11th, 4d10 at 17th). Usable a number of times per day equal to your Proficiency Bonus.' },
      { name: 'Damage Resistance', description: 'You have Resistance to the damage type of your draconic element.' },
      { name: 'Draconic Flight', description: 'Starting at 5th level: as a Bonus Action, you sprout spectral wings for 10 minutes (Fly Speed equal to your Speed), once per Long Rest.' },
    ],
  },
  gnome: {
    name: 'Gnome',
    description: 'Little inventors and tricksters with a spark of illusion in their blood. A gnome’s mind is a fortress that neither siege nor spell can take.',
    traits: [
      { name: 'Gnomish Cunning', description: 'You have advantage on Intelligence, Wisdom, and Charisma saving throws.' },
      { name: 'Gnomish Lineage', description: 'Forest gnome: the Minor Illusion cantrip, plus Animal Friendship a number of times per day equal to your Proficiency Bonus. Rock gnome: the Mending and Prestidigitation cantrips, plus a knack for building Tiny clockwork devices.' },
    ],
  },
  goliath: {
    name: 'Goliath',
    description: 'Descendants of giants, born among the mountain peaks. Tall, mighty, and as unshakable as the rock they come from.',
    traits: [
      { name: 'Giant Ancestry', description: 'A boon from your giant ancestor (usable a number of times per day equal to your Proficiency Bonus), for example: Stone’s Endurance — as a Reaction, reduce damage you take by 1d12 + your Constitution modifier; Cloud’s Jaunt — as a Bonus Action, teleport up to 30 feet; Fire’s Burn — deal an extra 1d10 fire damage on a hit.' },
      { name: 'Powerful Build', description: 'You have advantage on Strength checks made to squeeze through, and your carrying capacity is that of a creature one size larger.' },
      { name: 'Large Form', description: 'Starting at 5th level: as a Bonus Action, become Large for 10 minutes (+10 feet Speed, advantage on Strength checks), once per Long Rest.' },
    ],
  },
  orc: {
    name: 'Orc',
    description: 'A strong and hardy folk of warriors. Adrenaline boils in orcish veins: they are first into the fray and the last left standing.',
    traits: [
      { name: 'Adrenaline Rush', description: 'As a Bonus Action, take the Dash action and gain Temporary Hit Points equal to your Proficiency Bonus (usable a number of times equal to your Proficiency Bonus, regained on a Short Rest).' },
      { name: 'Relentless Endurance', description: 'When your Hit Points would drop to 0 (unless you’re killed outright), you stay at 1 Hit Point instead. Once per Long Rest.' },
    ],
  },
  tiefling: {
    name: 'Tiefling',
    description: 'A people with a heritage of the Lower Planes: small horns, unusual eyes, and innate magic. A tiefling’s fate is decided by choices, not blood.',
    sizeNote: 'Medium or Small',
    traits: [
      { name: 'Otherworldly Presence', description: 'You know the Thaumaturgy cantrip.' },
      { name: 'Fiendish Legacy', description: 'Infernal legacy: Resistance to fire, the Fire Bolt cantrip, Hellish Rebuke at 3rd level, Darkness at 5th. Abyssal legacy: Resistance to poison, Poison Spray, Ray of Sickness at 3rd level, Poison Arrow at 5th. Chthonic legacy: Resistance to necrotic, Chill Touch, False Life at 3rd level, Ray of Enfeeblement at 5th.' },
    ],
  },
  aasimar: {
    name: 'Aasimar',
    description: 'Mortals with a spark of the Upper Planes: a warm light in the eyes, a kind heart, and wings waiting for their moment.',
    sizeNote: 'Medium or Small',
    traits: [
      { name: 'Celestial Resistance', description: 'You have Resistance to necrotic and radiant damage.' },
      { name: 'Healing Hands', description: 'As an action, touch a creature: it regains Hit Points equal to d4 × your Proficiency Bonus. Once per Long Rest.' },
      { name: 'Light Bearer', description: 'You know the Light cantrip.' },
      { name: 'Celestial Revelation', description: 'Starting at 3rd level, as a Bonus Action, transform for 1 minute (once per Long Rest): Heavenly Wings (Fly Speed equal to your Speed), Inner Radiance (light and radiant damage to enemies around you), or Necrotic Shroud (frightens those nearby). While transformed, once per turn, add your Proficiency Bonus as extra radiant or necrotic damage on a hit.' },
    ],
  },
  'half-elf': {
    name: 'Half-Elf',
    description: 'A child of two worlds: elven grace and human drive. Half-elves are born diplomats and the favorites of any company.',
    traits: [
      { name: 'Fey Ancestry', description: 'You have advantage on saving throws against the Charmed condition, and magic can’t put you to sleep.' },
      { name: 'Skill Versatility', description: 'You gain proficiency in two skills of your choice.' },
      { name: 'Dual Heritage', description: 'You count as both a human and an elf, and you know one extra language.' },
    ],
  },
  'half-orc': {
    name: 'Half-Orc',
    description: 'The strength of orcish blood and human stubbornness. Half-orcs hit hard enough to crack shields and stay standing when they shouldn’t.',
    traits: [
      { name: 'Menacing', description: 'You gain proficiency in the Intimidation skill.' },
      { name: 'Relentless Endurance', description: 'When your Hit Points would drop to 0 (unless you’re killed outright), you stay at 1 Hit Point instead. Once per Long Rest.' },
      { name: 'Savage Attacks', description: 'When you score a critical hit with a weapon, roll one of its damage dice three times instead of twice.' },
    ],
  },
  tabaxi: {
    name: 'Tabaxi',
    description: 'A feline folk of wanderers and story-collectors. A tabaxi’s curiosity is stronger than their caution, and their paws are faster than thought.',
    sizeNote: 'Medium or Small',
    traits: [
      { name: 'Feline Agility', description: 'You can double your Speed until the end of the turn; once used, it recharges when you spend a turn moving 0 feet.' },
      { name: 'Cat’s Claws', description: 'You have a Climb Speed of 20 feet, and your claws make unarmed strikes that deal 1d6 + your Strength modifier slashing damage.' },
      { name: 'Cat’s Talent', description: 'You gain proficiency in the Perception and Stealth skills.' },
    ],
  },
  kenku: {
    name: 'Kenku',
    description: 'A raven folk with no voice of their own: kenku flawlessly imitate any sound they hear and copy any handiwork.',
    sizeNote: 'Medium or Small',
    traits: [
      { name: 'Mimicry', description: 'You can reproduce any sounds and voices you have heard. Telling the imitation apart takes an Insight check against your Deception.' },
      { name: 'Expert Duplication', description: 'You can copy any handwriting or craftwork, provided you have seen a sample.' },
      { name: 'Kenku Recall', description: 'You gain proficiency in two skills of your choice; a number of times per day equal to your Proficiency Bonus, you can give yourself advantage on a check with one of those skills.' },
    ],
  },
  tortle: {
    name: 'Tortle',
    description: 'An unhurried turtle folk of the coasts. A tortle’s home is always along for the journey — a sturdy shell that knights in full plate envy.',
    sizeNote: 'Medium or Small',
    traits: [
      { name: 'Shell', description: 'Your AC is 17 (your Dexterity modifier doesn’t apply, and you don’t need armor).' },
      { name: 'Claws', description: 'Your unarmed strikes deal 1d6 + your Strength modifier slashing damage.' },
      { name: 'Hold Breath', description: 'You can hold your breath for up to 1 hour.' },
      { name: 'Shell Defense', description: 'As an action, withdraw into your shell: +4 AC and advantage on Strength and Constitution saving throws, but you are Prone, your Speed is 0, and you have disadvantage on Dexterity saving throws. Emerging takes a Bonus Action.' },
      { name: 'Survival Instinct', description: 'You gain proficiency in the Survival skill.' },
    ],
  },
  lizardfolk: {
    name: 'Lizardfolk',
    description: 'Cold-blooded children of the swamps. Lizardfolk are practical to the bone: an enemy is a danger — and also dinner and shield material.',
    traits: [
      { name: 'Natural Armor', description: 'While you wear no armor, your AC is 13 + your Dexterity modifier (a shield still works).' },
      { name: 'Bite', description: 'Your jaws make unarmed strikes that deal 1d6 + your Strength modifier piercing damage.' },
      { name: 'Hungry Jaws', description: 'As a Bonus Action, bite in a fury: on a hit, you also gain Temporary Hit Points equal to your Proficiency Bonus. Usable a number of times per day equal to your Proficiency Bonus.' },
      { name: 'Hold Breath', description: 'You can hold your breath for up to 15 minutes, and you have a Swim Speed of 30 feet.' },
      { name: 'Nature’s Knowledge', description: 'You gain proficiency in two of these skills: Animal Handling, Nature, Perception, Stealth, Survival.' },
    ],
  },
  harengon: {
    name: 'Harengon',
    description: 'A rabbit folk from the Feywild: long ears, quick feet, and luck that always hops alongside.',
    sizeNote: 'Medium or Small',
    traits: [
      { name: 'Hare-Trigger', description: 'You add your Proficiency Bonus to your initiative rolls.' },
      { name: 'Leporine Senses', description: 'You gain proficiency in the Perception skill.' },
      { name: 'Lucky Footwork', description: 'When you fail a Dexterity saving throw, you can use your Reaction to add 1d4 to it.' },
      { name: 'Rabbit Hop', description: 'As a Bonus Action, jump a distance of 5 feet × your Proficiency Bonus without provoking Opportunity Attacks. Usable a number of times per day equal to your Proficiency Bonus.' },
    ],
  },
  owlin: {
    name: 'Owlin',
    description: 'An owl folk of the night sky. Owlin fly as silently as falling snow and see things in the dark that others wouldn’t dream of.',
    sizeNote: 'Medium or Small',
    traits: [
      { name: 'Flight', description: 'You have a Fly Speed equal to your Speed. You can’t fly in medium or heavy armor.' },
      { name: 'Silent Feathers', description: 'You gain proficiency in the Stealth skill.' },
      { name: 'Darkvision', description: 'You can see in darkness within 120 feet.' },
    ],
  },
  aarakocra: {
    name: 'Aarakocra',
    description: 'A bird folk from the Plane of Air. To an aarakocra the sky is home, and the ground just a place for short layovers.',
    traits: [
      { name: 'Flight', description: 'You have a Fly Speed equal to your Speed. You can’t fly in medium or heavy armor.' },
      { name: 'Talons', description: 'Your talons make unarmed strikes that deal 1d6 + your Strength modifier slashing damage.' },
      { name: 'Wind Caller', description: 'Starting at 3rd level: you can cast Gust of Wind once per Long Rest without a spell slot (or with spell slots).' },
    ],
  },
  centaur: {
    name: 'Centaur',
    description: 'Half human, half horse, folk of the boundless plains: swift, proud, and bound to nature tighter than any roots.',
    traits: [
      { name: 'Charge', description: 'If you Dash at least 30 feet and then hit with a melee attack, you can strike with your hooves as a Bonus Action.' },
      { name: 'Hooves', description: 'Your hooves make unarmed strikes that deal 1d6 + your Strength modifier bludgeoning damage.' },
      { name: 'Equine Build', description: 'You count as one size larger for carrying capacity; climbing and jumping come hard to your unusual frame (ladders cost double movement).' },
      { name: 'Natural Affinity', description: 'You gain proficiency in one of these skills: Animal Handling, Medicine, Nature, or Survival.' },
    ],
  },
  minotaur: {
    name: 'Minotaur',
    description: 'A mighty horned folk who never lose their way. Labyrinths fear minotaurs, not the other way around.',
    traits: [
      { name: 'Horns', description: 'Your horns make unarmed strikes that deal 1d6 + your Strength modifier piercing damage.' },
      { name: 'Goring Rush', description: 'After you take the Dash action, you can strike with your horns as a Bonus Action.' },
      { name: 'Hammering Horns', description: 'When you hit with your horns, you can shove the target up to 10 feet away as a Bonus Action (Strength saving throw).' },
      { name: 'Labyrinthine Recall', description: 'You have perfect recall of any path you have traveled.' },
    ],
  },
  satyr: {
    name: 'Satyr',
    description: 'Goat-legged merrymakers of the Feywild. A satyr’s life is an endless festival — and dangers arrive without an invitation.',
    traits: [
      { name: 'Fey Creature', description: 'You are a Fey, not a Humanoid: spells like Hold Person don’t affect you.' },
      { name: 'Magic Resistance', description: 'You have advantage on saving throws against spells.' },
      { name: 'Ram', description: 'Your horns make unarmed strikes that deal 1d4 + your Strength modifier bludgeoning damage.' },
      { name: 'Mirthful Leaps', description: 'Add 1d8 feet to your long and high jumps.' },
      { name: 'Reveler', description: 'You gain proficiency in Performance and Persuasion, and with one musical instrument.' },
    ],
  },
  fairy: {
    name: 'Fairy',
    description: 'A tiny winged folk of pure magic. A fairy is big magic in a very small and very persistent package.',
    traits: [
      { name: 'Flight', description: 'You have a Fly Speed equal to your Speed. You can’t fly in medium or heavy armor.' },
      { name: 'Fey Creature', description: 'You are a Fey, not a Humanoid.' },
      { name: 'Fairy Magic', description: 'You know the Druidcraft cantrip; at 3rd level you gain Faerie Fire, and at 5th, Enlarge/Reduce — each once per Long Rest (or with spell slots).' },
    ],
  },
  'genasi-air': {
    name: 'Air Genasi',
    description: 'Descendants of the djinn of the wind: a light step, a voice like a breeze, and lightning in the blood.',
    sizeNote: 'Medium or Small',
    traits: [
      { name: 'Unending Breath', description: 'You can go without breathing — the air is always with you, though another’s magic can still suffocate you.' },
      { name: 'Lightning Resistance', description: 'You have Resistance to lightning damage.' },
      { name: 'Mingle with the Wind', description: 'You know the Shocking Grasp cantrip; at 3rd level you gain Feather Fall, and at 5th, Levitate — each once per Long Rest. Spellcasting ability of your choice: Intelligence, Wisdom, or Charisma.' },
    ],
  },
  'genasi-earth': {
    name: 'Earth Genasi',
    description: 'Descendants of the dao, the djinn of stone. Calm and unshakable, they walk across cliffs as if across a parquet floor.',
    sizeNote: 'Medium or Small',
    traits: [
      { name: 'Earth Walk', description: 'Rocky Difficult Terrain doesn’t slow you down.' },
      { name: 'Merge with Stone', description: 'You know the Blade Ward cantrip (castable as a Bonus Action a number of times equal to your Proficiency Bonus); starting at 5th level, Pass without Trace once per Long Rest.' },
    ],
  },
  'genasi-fire': {
    name: 'Fire Genasi',
    description: 'Descendants of the efreet: sparks in the hair, heat in the words, and flame at the fingertips.',
    sizeNote: 'Medium or Small',
    traits: [
      { name: 'Fiery Vision', description: 'You have Darkvision out to 60 feet; in darkness you see in shades of red.' },
      { name: 'Fire Resistance', description: 'You have Resistance to fire damage.' },
      { name: 'Reach to the Blaze', description: 'You know the Produce Flame cantrip; at 3rd level you gain Burning Hands, and at 5th, Flame Blade — each once per Long Rest.' },
    ],
  },
  'genasi-water': {
    name: 'Water Genasi',
    description: 'Descendants of the marids, masters of the waves. Water heeds them like an old friend, and the depths hold no fear for them at all.',
    sizeNote: 'Medium or Small',
    traits: [
      { name: 'Amphibious', description: 'You can breathe both air and water, and you have a Swim Speed of 30 feet.' },
      { name: 'Acid Resistance', description: 'You have Resistance to acid damage.' },
      { name: 'Call to the Wave', description: 'You know the Shape Water cantrip; at 3rd level you gain Create or Destroy Water, and at 5th, Water Walk — each once per Long Rest.' },
    ],
  },
  triton: {
    name: 'Triton',
    description: 'Guardians of the deep sea, noble to the point of primness. Tritons are sure the dry land would have been lost long ago without them.',
    traits: [
      { name: 'Amphibious', description: 'You can breathe air and water, and your Swim Speed equals your Speed.' },
      { name: 'Emissary of the Sea', description: 'You can communicate simple ideas with creatures of the sea.' },
      { name: 'Guardian of the Depths', description: 'You have Resistance to cold damage.' },
      { name: 'Control Air and Water', description: 'You can cast Fog Cloud; at 3rd level you gain Gust of Wind, and at 5th, Wall of Water — each once per Long Rest.' },
    ],
  },
  goblin: {
    name: 'Goblin',
    description: 'Small, quick, and far cleverer than they’re given credit for. A goblin adventurer is resourcefulness multiplied by sheer cheek.',
    traits: [
      { name: 'Fey Ancestry', description: 'You have advantage on saving throws against the Charmed condition.' },
      { name: 'Fury of the Small', description: 'When you hit a creature larger than you, you can add your Proficiency Bonus to the damage. Usable a number of times per day equal to your Proficiency Bonus.' },
      { name: 'Nimble Escape', description: 'You can take the Disengage or Hide action as a Bonus Action.' },
    ],
  },
  hobgoblin: {
    name: 'Hobgoblin',
    description: 'Discipline, formation, and mutual support: hobgoblins are strong not one by one but shoulder to shoulder.',
    traits: [
      { name: 'Fey Gift', description: 'You can take the Help action as a Bonus Action (a number of times per day equal to your Proficiency Bonus). Starting at 3rd level, your help also grants one of: Temporary Hit Points, movement without provoking Opportunity Attacks, or a shared leap back.' },
      { name: 'Fey Ancestry', description: 'You have advantage on saving throws against the Charmed condition.' },
      { name: 'Fortune from the Many', description: 'When you fail a D20 Test near allies, add +1 for each ally within 30 feet of you (max +3). Usable a number of times per day equal to your Proficiency Bonus.' },
    ],
  },
  bugbear: {
    name: 'Bugbear',
    description: 'Long-armed, shaggy, and quiet. A bugbear reaches an enemy right where they thought themselves safe.',
    traits: [
      { name: 'Long-Limbed', description: 'Your melee attacks have 5 feet of extra reach.' },
      { name: 'Powerful Build', description: 'You carry loads as if you were one size larger.' },
      { name: 'Surprise Attack', description: 'In the first round of combat, your hits against a creature that hasn’t taken its turn yet deal an extra 2d6 damage.' },
      { name: 'Sneaky', description: 'You gain proficiency in Stealth, and you can squeeze through passages made for Small creatures.' },
      { name: 'Fey Ancestry', description: 'You have advantage on saving throws against the Charmed condition.' },
    ],
  },
  kobold: {
    name: 'Kobold',
    description: 'A small draconic folk with a big heart and a loud squeak. Kobolds are strong in packs and in cunning.',
    traits: [
      { name: 'Draconic Cry', description: 'As a Bonus Action, until the start of your next turn: you and your allies have advantage on attacks against enemies within 10 feet of you. Usable a number of times per day equal to your Proficiency Bonus.' },
      { name: 'Kobold Legacy', description: 'Choose one: proficiency in one of Arcana, Investigation, Medicine, Sleight of Hand, or Survival; advantage on saving throws against the Frightened condition; or one sorcerer cantrip.' },
    ],
  },
  duergar: {
    name: 'Duergar',
    description: 'The gray dwarves of the Underdark: stern, silent, and born with psionics tempered by centuries of slavery under the illithids.',
    traits: [
      { name: 'Dwarven Resilience', description: 'You have Resistance to poison damage and advantage on saving throws against the Poisoned condition.' },
      { name: 'Psionic Fortitude', description: 'You have advantage on saving throws against the Charmed and Stunned conditions.' },
      { name: 'Duergar Magic', description: 'Starting at 3rd level you can cast Enlarge/Reduce on yourself (enlarge only), and at 5th, Invisibility on yourself — each once per Long Rest, no spell slots needed.' },
    ],
  },
  'deep-gnome': {
    name: 'Deep Gnome (Svirfneblin)',
    description: 'Svirfneblin are the gnomes of the Underdark: unseen gem-miners who know how to melt into the stone.',
    traits: [
      { name: 'Gnomish Cunning', description: 'You have advantage on Intelligence, Wisdom, and Charisma saving throws.' },
      { name: 'Svirfneblin Camouflage', description: 'You have advantage on Stealth checks in rocky terrain.' },
      { name: 'Gift of the Svirfneblin', description: 'Starting at 3rd level you can cast Disguise Self, and at 5th, Nondetection on yourself without components — each once per Long Rest.' },
    ],
  },
  eladrin: {
    name: 'Eladrin',
    description: 'Elves of the Feywild whose moods change like the seasons: spring laughs, summer blazes, autumn forgives, winter keeps silent.',
    traits: [
      { name: 'Fey Ancestry', description: 'You have advantage on saving throws against the Charmed condition, and you trance instead of sleeping (4 hours).' },
      { name: 'Keen Senses', description: 'You gain proficiency in the Perception skill.' },
      { name: 'Fey Step', description: 'As a Bonus Action, teleport up to 30 feet (a number of times per day equal to your Proficiency Bonus). Starting at 3rd level the step carries a season’s gift: spring — teleport a willing ally instead, summer — fire damage to those around you, autumn — charm, winter — fright.' },
    ],
  },
  'sea-elf': {
    name: 'Sea Elf',
    description: 'Elves of the coral cities. To them, waves are streets and a storm is just loud music.',
    traits: [
      { name: 'Child of the Sea', description: 'You can breathe air and water, you have a Swim Speed of 30 feet, and you have Resistance to cold damage.' },
      { name: 'Friend of the Sea', description: 'You can communicate simple ideas with beasts of the sea.' },
      { name: 'Fey Ancestry', description: 'You have advantage on saving throws against the Charmed condition, and you trance instead of sleeping.' },
      { name: 'Keen Senses', description: 'You gain proficiency in the Perception skill.' },
    ],
  },
  'shadar-kai': {
    name: 'Shadar-Kai',
    description: 'Elves of the Shadowfell, servants of the Raven Queen. Pale, fearless, and personally acquainted with death.',
    traits: [
      { name: 'Necrotic Resistance', description: 'You have Resistance to necrotic damage.' },
      { name: 'Blessing of the Raven Queen', description: 'As a Bonus Action, teleport up to 30 feet (a number of times per day equal to your Proficiency Bonus); starting at 3rd level, after the teleport you have Resistance to all damage until the start of your next turn.' },
      { name: 'Fey Ancestry', description: 'You have advantage on saving throws against the Charmed condition, and you trance instead of sleeping.' },
      { name: 'Keen Senses', description: 'You gain proficiency in the Perception skill.' },
    ],
  },
  firbolg: {
    name: 'Firbolg',
    description: 'Quiet giants of the deep forest. A firbolg has the strength of a bear and the softest heart in the woods.',
    traits: [
      { name: 'Hidden Step', description: 'As a Bonus Action, turn Invisible until the start of your next turn (or until you attack). Usable a number of times per day equal to your Proficiency Bonus.' },
      { name: 'Firbolg Magic', description: 'You can cast Detect Magic and Disguise Self — each once per Long Rest, no spell slots needed.' },
      { name: 'Powerful Build', description: 'You carry loads as if you were one size larger.' },
      { name: 'Speech of Beast and Leaf', description: 'Beasts and plants understand your speech, and you have advantage on Charisma checks to influence them.' },
    ],
  },
  'yuan-ti': {
    name: 'Yuan-ti',
    description: 'A serpent folk of ancient temples: a cool mind, smooth words, and scales that other people’s spells break against.',
    sizeNote: 'Medium or Small',
    traits: [
      { name: 'Magic Resistance', description: 'You have advantage on saving throws against spells.' },
      { name: 'Poison Resilience', description: 'You have Resistance to poison damage and advantage on saving throws against the Poisoned condition.' },
      { name: 'Serpentine Spellcasting', description: 'You know the Poison Spray cantrip; you can cast Animal Friendship (snakes only) without spell slots; starting at 3rd level, Suggestion once per Long Rest.' },
    ],
  },
  changeling: {
    name: 'Changeling',
    description: 'A folk of a thousand faces. A changeling can become anyone — the hard part is remembering who you really are.',
    sizeNote: 'Medium or Small',
    traits: [
      { name: 'Shapechanger', description: 'As an action, change your appearance and voice to any humanoid guise. Your equipment doesn’t change.' },
      { name: 'Changeling Instincts', description: 'You gain proficiency in two of these skills: Deception, Insight, Intimidation, Performance, Persuasion.' },
      { name: 'Fey Creature', description: 'You are a Fey, not a Humanoid.' },
    ],
  },
  shifter: {
    name: 'Shifter',
    description: 'Distant descendants of lycanthropes. In a moment of danger the beast within steps out: claws, fangs, and wild eyes.',
    traits: [
      { name: 'Shifting', description: 'As a Bonus Action, shift for 1 minute (a number of times per day equal to your Proficiency Bonus): you gain Temporary Hit Points equal to 2 × your Proficiency Bonus, plus your line’s gift: Beasthide — +1 AC and 1d6 extra Temporary Hit Points; Longtooth — a 1d6 bite and, once per shift, healing when you hit; Swiftstride — +10 feet Speed and Disengage as a Bonus Action; Wildhunt — advantage on Wisdom (Perception) checks.' },
      { name: 'Bestial Instincts', description: 'You gain proficiency in one of these skills: Acrobatics, Athletics, Intimidation, or Survival.' },
    ],
  },
  warforged: {
    name: 'Warforged',
    description: 'Living beings of steel and wood, born for war but choosing a path of their own. A warforged needs no sleep — only a purpose.',
    traits: [
      { name: 'Constructed Resilience', description: 'You have Resistance to poison damage and advantage on saving throws against the Poisoned condition; you are immune to disease; you don’t need to eat, drink, or sleep.' },
      { name: 'Integrated Protection', description: 'You gain a +1 bonus to AC.' },
      { name: 'Sentry’s Rest', description: 'A Long Rest for you is 6 hours spent motionless and conscious: you see and hear everything around you.' },
      { name: 'Specialized Design', description: 'You gain proficiency in one skill and one tool of your choice.' },
    ],
  },
  githyanki: {
    name: 'Githyanki',
    description: 'Warriors of the Astral Sea, riding red dragons and bearing silver swords. Githyanki psionics are a weapon to match any blade.',
    traits: [
      { name: 'Astral Knowledge', description: 'Whenever you finish a Long Rest, choose proficiency in one skill and one tool — your psionics load up whatever talents you need.' },
      { name: 'Githyanki Psionics', description: 'You know the Mage Hand cantrip (the hand is invisible); at 3rd level you gain Jump, and at 5th, Misty Step — each once per Long Rest, no components needed.' },
      { name: 'Psychic Resilience', description: 'You have Resistance to psychic damage.' },
    ],
  },
  githzerai: {
    name: 'Githzerai',
    description: 'Monks of Limbo who tamed chaos with the power of the mind. A githzerai’s calm is sturdier than fortress walls.',
    traits: [
      { name: 'Mental Discipline', description: 'You have advantage on saving throws against the Charmed and Frightened conditions.' },
      { name: 'Githzerai Psionics', description: 'You know the Mage Hand cantrip (the hand is invisible); at 3rd level you gain Shield, and at 5th, Detect Thoughts — each once per Long Rest.' },
      { name: 'Psychic Resilience', description: 'You have Resistance to psychic damage.' },
    ],
  },
};
