import type { FeatsL10n } from './types';

// Английский перевод черт (src/data/feats.ts).
export const FEATS_EN: FeatsL10n = {
  // --- Черты происхождения ---
  alert: {
    name: 'Alert',
    description: 'Add your Proficiency Bonus to Initiative rolls. After rolling Initiative, you can swap your result with a willing ally.',
  },
  crafter: {
    name: 'Crafter',
    description: 'Gain proficiency with three Artisan’s Tools of your choice, a 20% discount when buying equipment, and fast crafting of items during a rest.',
  },
  healer: {
    name: 'Healer',
    description: 'As an action with a Healer’s Kit, let a creature spend a Hit Die and regain Hit Points; reroll 1s on healing dice.',
  },
  lucky: {
    name: 'Lucky',
    description: 'Luck Points (Proficiency Bonus per day): spend them to give yourself advantage on a d20 Test or impose disadvantage on an attack roll against you.',
  },
  'magic-initiate-cleric': {
    name: 'Magic Initiate (Cleric)',
    description: 'Two cantrips from the Cleric spell list and one level 1 spell (once per day for free; you can also use spell slots). Spellcasting ability: Int, Wis, or Cha.',
  },
  'magic-initiate-druid': {
    name: 'Magic Initiate (Druid)',
    description: 'Two cantrips from the Druid spell list and one level 1 spell (once per day for free; you can also use spell slots). Spellcasting ability: Int, Wis, or Cha.',
  },
  'magic-initiate-wizard': {
    name: 'Magic Initiate (Wizard)',
    description: 'Two cantrips from the Wizard spell list and one level 1 spell (once per day for free; you can also use spell slots). Spellcasting ability: Int, Wis, or Cha.',
  },
  musician: {
    name: 'Musician',
    description: 'Gain proficiency with three Musical Instruments. After a rest, inspire allies (up to your Proficiency Bonus): you hand out Heroic Inspiration.',
  },
  'savage-attacker': {
    name: 'Savage Attacker',
    description: 'Once per turn when you hit with a weapon, you can roll its damage dice twice and use the better result.',
  },
  skilled: {
    name: 'Skilled',
    description: 'Gain proficiency in three skills or tools of your choice. You can take this feat more than once.',
  },
  'tavern-brawler': {
    name: 'Tavern Brawler',
    description: 'Your Unarmed Strike deals 1d4 + Strength; reroll 1s on its damage dice; proficiency with improvised weapons; once per turn, push the target 5 feet on a hit.',
  },
  tough: {
    name: 'Tough',
    description: 'Your Hit Point maximum increases by 2 for each level you have (and by another +2 whenever you gain a level).',
  },

  // --- Общие черты ---
  asi: {
    name: 'Ability Score Improvement',
    description: 'Increase one ability score by 2, or two ability scores by 1 (maximum 20).',
  },
  grappler: {
    name: 'Grappler',
    description: '+1 to Strength or Dexterity. Advantage on attack rolls against a creature you’re grappling; your Unarmed Strike can grapple at the same time; grappling a creature doesn’t slow you down.',
  },
  'great-weapon-master': {
    name: 'Great Weapon Master',
    description: '+1 to Strength. Once per turn, a hit with a Heavy weapon deals extra damage equal to your Proficiency Bonus. After a critical hit or reducing a foe to 0 Hit Points, make an extra attack as a bonus action.',
  },
  sharpshooter: {
    name: 'Sharpshooter',
    description: '+1 to Dexterity. Shoot within melee range without disadvantage and at long range without disadvantage; half and three-quarters cover don’t hinder your shots.',
  },
  sentinel: {
    name: 'Sentinel',
    description: '+1 to Strength or Dexterity. When your opportunity attack hits, the target’s Speed drops to 0; enemies provoke your opportunity attacks even when they Disengage; as a reaction, attack an enemy that hits your ally next to you.',
  },
  'polearm-master': {
    name: 'Polearm Master',
    description: '+1 to Strength or Dexterity. As a bonus action, strike with the weapon’s butt end (1d4); enemies provoke an opportunity attack when they enter your reach.',
  },
  'war-caster': {
    name: 'War Caster',
    description: '+1 to Int/Wis/Cha. Advantage on Concentration saving throws; perform somatic components with weapons in hand; cast a spell instead of making an opportunity attack.',
  },
  resilient: {
    name: 'Resilient',
    description: '+1 to a chosen ability score and proficiency in saving throws with that ability.',
  },
  'dual-wielder': {
    name: 'Dual Wielder',
    description: '+1 to Strength or Dexterity. Fight with two one-handed weapons even if they aren’t Light; make an extra attack with the second weapon as a bonus action once per turn.',
  },
  'crossbow-expert': {
    name: 'Crossbow Expert',
    description: '+1 to Dexterity. Ignore the Loading property and shoot within melee range without disadvantage; after attacking with a one-handed weapon, fire a Hand Crossbow as a bonus action.',
  },
  'defensive-duelist': {
    name: 'Defensive Duelist',
    description: '+1 to Dexterity. While holding a Finesse weapon, use your reaction to add your Proficiency Bonus to your AC against one melee attack.',
  },
  'mage-slayer': {
    name: 'Mage Slayer',
    description: '+1 to Strength or Dexterity. Your damage breaks Concentration with disadvantage on the save; when you fail an Int/Wis/Cha saving throw, you can succeed instead (once, recharges on a short rest).',
  },
  'inspiring-leader': {
    name: 'Inspiring Leader',
    description: '+1 to Wisdom or Charisma. After a rest, give a rousing speech: up to 6 allies gain Temporary Hit Points equal to your level + your Cha/Wis modifier.',
  },
  'keen-mind': {
    name: 'Keen Mind',
    description: '+1 to Intelligence. Proficiency (or Expertise) in one of: Arcana, History, Investigation, Nature, Religion. Take the Study action as a bonus action.',
  },
  actor: {
    name: 'Actor',
    description: '+1 to Charisma. Advantage on Deception and Performance while impersonating someone; mimic voices after a minute of listening.',
  },
  athlete: {
    name: 'Athlete',
    description: '+1 to Strength or Dexterity. Gain a Climb Speed equal to your Speed; stand up from prone with only 5 feet of movement; make running jumps after moving only 5 feet.',
  },
  charger: {
    name: 'Charger',
    description: '+1 to Strength or Dexterity. After you Dash, your first melee attack deals +1d8 damage or pushes the target 10 feet.',
  },
  chef: {
    name: 'Chef',
    description: '+1 to Constitution or Wisdom. Tasty food during a rest: +1d8 to healing from spent Hit Dice; treats grant Temporary Hit Points (Proficiency Bonus servings).',
  },
  crusher: {
    name: 'Crusher',
    description: '+1 to Strength or Constitution. Once per turn, a bludgeoning hit moves the target 5 feet; a bludgeoning critical hit gives everyone advantage on attack rolls against the target until your next turn.',
  },
  piercer: {
    name: 'Piercer',
    description: '+1 to Strength or Dexterity. Once per turn, reroll one piercing damage die; a piercing critical hit adds one extra damage die.',
  },
  slasher: {
    name: 'Slasher',
    description: '+1 to Strength or Dexterity. Once per turn, a slashing hit reduces the target’s Speed by 10 feet; a slashing critical hit gives the target disadvantage on attack rolls until your next turn.',
  },
  'elemental-adept': {
    name: 'Elemental Adept',
    description: '+1 to Int/Wis/Cha. Choose a damage type: your spells ignore resistance to it, and 1s on damage dice count as 2s. You can take this feat more than once.',
  },
  'fey-touched': {
    name: 'Fey-Touched',
    description: '+1 to Int/Wis/Cha. Misty Step and one level 1 Enchantment or Divination spell are always prepared; cast each once per day for free.',
  },
  'shadow-touched': {
    name: 'Shadow-Touched',
    description: '+1 to Int/Wis/Cha. Invisibility and one level 1 Illusion or Necromancy spell are always prepared; cast each once per day for free.',
  },
  'heavy-armor-master': {
    name: 'Heavy Armor Master',
    description: '+1 to Strength or Constitution. While wearing Heavy armor, incoming bludgeoning, piercing, and slashing damage is reduced by your Proficiency Bonus.',
  },
  'medium-armor-master': {
    name: 'Medium Armor Master',
    description: '+1 to Strength or Dexterity. While wearing Medium armor, add up to +3 from Dexterity to your AC instead of +2.',
  },
  'skill-expert': {
    name: 'Skill Expert',
    description: '+1 to any ability score. Gain proficiency in one skill and Expertise (double bonus) in one skill you’re proficient in.',
  },
  'spell-sniper': {
    name: 'Spell Sniper',
    description: '+1 to Int/Wis/Cha. The range of your attack-roll spells increases by 60 feet; half and three-quarters cover don’t hinder them; learn one attack cantrip.',
  },
  telekinetic: {
    name: 'Telekinetic',
    description: '+1 to Int/Wis/Cha. An invisible Mage Hand with no somatic components; as a bonus action, telekinetically shove a creature 5 feet (Strength saving throw).',
  },
  telepathic: {
    name: 'Telepathic',
    description: '+1 to Int/Wis/Cha. Speak telepathically to creatures within 60 feet; cast Detect Thoughts once per day for free.',
  },
  speedy: {
    name: 'Speedy',
    description: '+1 to Dexterity or Constitution. Speed +10 feet; Dash ignores Difficult Terrain; your movement doesn’t provoke opportunity attacks from creatures you’ve attacked.',
  },

  // --- Эпические дары ---
  'boon-combat-prowess': {
    name: 'Boon of Combat Prowess',
    description: '+1 to an ability score (up to 30). Once per turn, you can turn a missed attack into a hit.',
  },
  'boon-fate': {
    name: 'Boon of Fate',
    description: '+1 to an ability score (up to 30). When a creature near you makes a d20 Test, add or subtract 2d4 from the result (recharges after you roll Initiative or finish a rest).',
  },
  'boon-irresistible-offense': {
    name: 'Boon of Irresistible Offense',
    description: '+1 to Strength or Dexterity (up to 30). Your bludgeoning/piercing/slashing damage ignores resistance; a natural 20 on an attack adds damage equal to your ability score.',
  },
  'boon-spell-recall': {
    name: 'Boon of Spell Recall',
    description: '+1 to Int/Wis/Cha (up to 30). When you cast a spell of level 1–4, roll a d4: if it matches the spell’s level, the spell slot isn’t expended.',
  },
  'boon-night-spirit': {
    name: 'Boon of the Night Spirit',
    description: '+1 to an ability score (up to 30). While in Dim Light or Darkness: merge into shadow as a bonus action (resistance to all damage except psychic and radiant).',
  },

  // --- Боевые стили ---
  'fs-archery': {
    name: 'Archery',
    description: '+2 to attack rolls with ranged weapons.',
  },
  'fs-defense': {
    name: 'Defense',
    description: '+1 to AC while you wear armor.',
  },
  'fs-dueling': {
    name: 'Dueling',
    description: '+2 to damage while fighting with a single one-handed weapon (other hand empty or holding a Shield).',
  },
  'fs-great-weapon': {
    name: 'Great Weapon Fighting',
    description: 'On damage dice of two-handed weapons, 1s and 2s count as 3s.',
  },
  'fs-protection': {
    name: 'Protection',
    description: 'As a reaction while holding a Shield: impose disadvantage on an attack against a creature within 5 feet of you.',
  },
  'fs-two-weapon': {
    name: 'Two-Weapon Fighting',
    description: 'Add your ability modifier to the damage of the second attack when fighting with two weapons.',
  },
  durable: {
    name: 'Durable',
    description: '+1 Constitution. Advantage on Death Saving Throws; as a Bonus Action, expend a Hit Point Die and regain the rolled hit points.',
  },
  'weapon-master': {
    name: 'Weapon Master',
    description: '+1 Strength or Dexterity. Use the mastery property of one kind of Simple or Martial weapon you are proficient with; you can change the kind after a Long Rest.',
  },
  'martial-weapon-training': {
    name: 'Martial Weapon Training',
    description: '+1 Strength or Dexterity. Proficiency with all Martial weapons.',
  },
  'lightly-armored': {
    name: 'Lightly Armored',
    description: '+1 Strength or Dexterity. Training with Light armor and Shields.',
  },
  'moderately-armored': {
    name: 'Moderately Armored',
    description: '+1 Strength or Dexterity. Training with Medium armor. Requires Light Armor Training.',
  },
  'heavily-armored': {
    name: 'Heavily Armored',
    description: '+1 Strength or Constitution. Training with Heavy armor. Requires Medium Armor Training.',
  },
  'shield-master': {
    name: 'Shield Master',
    description: '+1 Strength. When you hit with a melee weapon, bash with your Shield: Strength save or the target is pushed 5 feet or knocked Prone (once per turn). As a Reaction with a Shield, take no damage on a successful Dexterity save.',
  },
  'mounted-combatant': {
    name: 'Mounted Combatant',
    description: '+1 Strength, Dexterity, or Wisdom. While mounted: advantage on attacks against smaller creatures near your mount; your mount takes no damage on a successful Dexterity save; you can take a hit aimed at your mount.',
  },
  observant: {
    name: 'Observant',
    description: '+1 Intelligence or Wisdom. Proficiency (or Expertise) in Insight, Investigation, or Perception; you can take the Search action as a Bonus Action.',
  },
  skulker: {
    name: 'Skulker',
    description: '+1 Dexterity. Blindsight 10 feet; advantage on Stealth checks for the Hide action in combat; a missed attack from hiding doesn’t reveal your position.',
  },
  poisoner: {
    name: 'Poisoner',
    description: '+1 Dexterity or Intelligence. Your Poison damage ignores resistance; proficiency with the Poisoner’s Kit and you can craft doses. As a Bonus Action, coat a weapon: Constitution save or 2d8 Poison damage and the Poisoned condition.',
  },
  'ritual-caster': {
    name: 'Ritual Caster',
    description: '+1 Intelligence, Wisdom, or Charisma. Level 1 ritual spells (as many as your Proficiency Bonus) are always prepared; once per Long Rest you can cast one at its normal casting time without a spell slot.',
  },
  'boon-dimensional-travel': {
    name: 'Boon of Dimensional Travel',
    description: '+1 to an ability score (max 30). Right after the Attack or Magic action, teleport up to 30 feet to an unoccupied space you can see.',
  },
  'boon-truesight': {
    name: 'Boon of Truesight',
    description: '+1 to an ability score (max 30). Truesight within 60 feet.',
  },
  'fs-blind-fighting': {
    name: 'Blind Fighting',
    description: 'Blindsight within 10 feet: you can see everything in that radius even while Blinded.',
  },
  'fs-interception': {
    name: 'Interception',
    description: 'As a Reaction, reduce the damage dealt to an ally within 5 feet by 1d10 + your Proficiency Bonus (you must hold a Shield or a weapon).',
  },
  'fs-thrown-weapon': {
    name: 'Thrown Weapon Fighting',
    description: '+2 to damage rolls when you hit with a Thrown weapon.',
  },
  'fs-unarmed': {
    name: 'Unarmed Fighting',
    description: 'Your Unarmed Strike deals 1d6 + Strength Bludgeoning damage (1d8 if your hands are free); at the start of your turn, deal 1d4 to a creature you have Grappled.',
  },
};
