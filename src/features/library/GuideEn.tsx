import { Section, Step, Term } from './GuideBits';

// Tutorial: a simple guide to every part of the platform (English)
export function GuideEn() {
  return (
    <div className="col" style={{ gap: 12 }}>
      <section className="panel panel-ornate">
        <div className="section-title">Quick start — 3 steps</div>
        <div className="col" style={{ gap: 10 }}>
          <Step n={1}>
            Open <b>Heroes → “✨ Create a hero”</b>. The creation wizard walks you through:
            name → class → species → background → ability scores → skills → done!
            Each player creates their own hero (new heroes always start at level 1).
          </Step>
          <Step n={2}>
            An adult (or the most experienced player) becomes the <b>Game Master</b> — the storyteller.
            Their tools live on the <b>Master</b> tab: monsters, checks, combat, and treasure.
          </Step>
          <Step n={3}>
            The Master describes a scene, the players say what their heroes do, and the dice settle
            anything uncertain: tap a skill on a hero’s sheet — the roll happens by itself.
            Beat the monsters — the Master hands out XP and loot, and the heroes grow!
          </Step>
        </div>
      </section>

      <Section icon="🎲" title="How D&D is played (for beginners)" open>
        <div className="muted">
          D&D is a story game. The <b>Master</b> describes the world: “A dark cave looms before you,
          and it smells of smoke…”. The <b>players</b> speak for their heroes: “I’ll peek inside, quietly!”.
          When the outcome isn’t obvious, you roll a <b>d20</b> (a 20-sided die) and add the hero’s
          bonuses. Roll above the <b>Difficulty Class (DC)</b> — you did it! Below — you didn’t,
          and the story takes an unexpected turn.
        </div>
        <div className="muted">
          Rule number one: this game is about imagination and fun. The rules help,
          but the last word always belongs to the Master — and to a good story.
        </div>
      </Section>

      <Section icon="🏰" title="Home">
        <div className="muted">This is the party’s headquarters:</div>
        <div className="muted">• The campaign name — click it to rename (say, “The Mystery of Dragon Mountain”).</div>
        <div className="muted">• <b>“▶️ Start playing”</b> — jump straight to the Master screen.</div>
        <div className="muted">• Hero cards — quick access to the sheets; you can see who’s low on Hit Points.</div>
        <div className="muted">• Quests, fresh journal entries, and recent rolls — everything important at a glance.</div>
      </Section>

      <Section icon="🧙" title="Heroes: creating a character">
        <div className="muted">Click <b>“✨ Create a hero”</b> and follow the steps:</div>
        <Step n={1}><b>Name and emblem.</b> Invent a name, pick an emblem and crest color.</Step>
        <Step n={2}><b>Class</b> — how the hero fights: a fighter swings, a wizard casts, a cleric heals, a rogue sneaks… Each class has its own Hit Die and features.</Step>
        <Step n={3}><b>Species</b> — the hero’s bloodline: elf, dwarf, tabaxi, fairy… The “All species (44)” button opens the full list, and search helps find the right one. All the traits of the selected species appear below.</Step>
        <Step n={4}><b>Background</b> — who the hero used to be (a soldier, a sage, an entertainer…). It grants +2/+1 to abilities, two skills, and a feat.</Step>
        <Step n={5}><b>Ability scores.</b> Assign the numbers from the pool across six abilities — or hit “🎲 Roll 4d6” and trust your luck! Strength is for blows, Dexterity for dodging, Constitution for health, Intelligence/Wisdom/Charisma for magic and talking.</Step>
        <Step n={6}><b>Skills</b> — what the hero is especially good at. Spellcasters then pick their spells.</Step>
        <Step n={7}><b>Final.</b> Alignment, a few words of backstory — and the hero is ready! 🎉</Step>
        <div className="muted" style={{ marginTop: 4 }}>
          Don’t feel like inventing? On the empty Heroes screen there’s a <b>“🎁 Sample party”</b> button —
          four ready-made heroes to study, tweak, or delete.
        </div>
      </Section>

      <Section icon="📋" title="Heroes: the character sheet">
        <div className="muted">Open a hero — the portrait, Hit Points, and key numbers are at the top. The tabs below:</div>
        <div className="muted">• <b>⚔️ Combat</b> — manage Hit Points: type a number and hit “Damage” / “Heal” / “Temp HP”. Here you’ll also find conditions (Poisoned, Frightened…), exhaustion, class resources (Rage, Second Wind — the little diamonds; click to spend) and the attack table: 🎲 rolls to hit (⏫ with advantage, ⏬ with disadvantage), next to it the damage roll, 💥 — critical damage.</div>
        <div className="muted">• <b>🎯 Skills</b> — ability hexagons and the skill list. <b>Tap any of them — the die rolls itself</b> with the right bonus. A golden dot = proficiency.</div>
        <div className="muted">• <b>✨ Spells</b> (for casters) — the purple orbs are spell slots: click to spend, click a spent one to restore. “Cast” rolls the damage for you. “Edit list” — choose your prepared spells.</div>
        <div className="muted">• <b>🎒 Gear</b> — purse and backpack. Search the catalog for items; the “Equip” checkbox dons armor or takes a weapon in hand (it then shows up in attacks, and AC recalculates itself). Potions can be “🧪 Drunk”.</div>
        <div className="muted">• <b>📜 Features</b> — every class feature, species trait, and feat with descriptions.</div>
        <div className="muted">• <b>🪶 Story</b> — background, notes, and the chronicle of every level taken.</div>
        <div className="muted">
          Buttons at the top: <b>🔥 Short Rest</b> (spend Hit Dice to heal up),
          <b> 🌙 Long Rest</b> (restore everything), <b>✎ Edit</b> (fix any data by hand).
        </div>
      </Section>

      <Section icon="⬆️" title="Heroes: leveling up">
        <div className="muted">
          The Master awards XP after fights and adventures. When the XP bar fills up,
          the <b>“⬆ Level up”</b> button starts to glow. Click it:
        </div>
        <Step n={1}>The platform shows every new feature of the level.</Step>
        <Step n={2}>Roll your Hit Die (daring!) or take the average (safe) — health grows by itself, and Constitution is added automatically.</Step>
        <Step n={3}>At level 3 you pick a subclass; at 4/8/12/16 — ability scores or a feat. The platform offers the right choice itself.</Step>
        <div className="muted">At the end — fireworks 🎊 and an entry in the level chronicle. Nothing to copy over!</div>
      </Section>

      <Section icon="🎲" title="Dice">
        <div className="muted">
          A table for any roll: tap dice (d4–d100) to add them to the pool
          (right-click removes), tune the modifier, and hit <b>“ROLL!”</b>.
          A single d20 gets the “⏫ Advantage” mode (roll two, keep the higher)
          and “⏬ Disadvantage” (keep the lower).
        </div>
        <div className="muted">
          Quick buttons: a plain d20, 2d6, “4d6 drop lowest” (for ability scores).
          You can type your own formula: “3d6+2”. On the right — the evening’s roll history.
        </div>
        <div className="muted">A natural 20 is a critical success ✨ (on an attack the damage dice double — that’s what the 💥 button is for). A natural 1 is a critical fail…</div>
      </Section>

      <Section icon="👑" title="Master: combat step by step">
        <Step n={1}>Tab <b>Master → ⚔️ Combat</b>. Add the heroes with “+ All heroes”.</Step>
        <Step n={2}>Find monsters in the search bar (say, “goblin”), pick a quantity ×2–3 — initiative rolls itself.</Step>
        <Step n={3}>Hit <b>“▶️ Start combat!”</b> — combatants line up by initiative, and the finger 👉 shows whose turn it is.</Step>
        <Step n={4}>On their turn a combatant moves and acts (attack, spell…). A hit? Type the damage in their row and press ⚔️. <b>Hero damage comes off their sheets automatically</b>; healing 💚 puts it back.</Step>
        <Step n={5}>“⏭️ Next turn” passes the turn; rounds count themselves. A monster at zero HP gets crossed out.</Step>
        <Step n={6}><b>“🏁 End combat”</b> — the platform tallies XP for the defeated monsters and splits it between heroes. All that’s left is handing out the loot!</Step>
        <div className="muted">Attacking as a monster is easy: open it in the Bestiary — its attacks have clickable “🎲 +4” and damage.</div>
      </Section>

      <Section icon="🐉" title="Master: bestiary, checks, treasure">
        <div className="muted">• <b>🐉 Bestiary</b> — 54 creatures from a rat to an adult red dragon. The “CR” filter is the Challenge Rating: to start, pick monsters with CR no higher than the heroes’ level. A monster’s card has full stats with clickable rolls.</div>
        <div className="muted">• <b>🎯 Checks</b> — “the Master calls for a check”: choose who rolls, which skill, and the difficulty (10 — easy, 15 — medium, 20 — hard) → the platform rolls for everyone with their bonuses and shows who succeeded. Perfect for “everyone sneaks past the guards”.</div>
        <div className="muted">• <b>💰 Treasure</b> — the loot generator: “pockets” / “chest” / “hoard”. Click “Give to a hero” — the coins and items land in their inventory by themselves.</div>
        <div className="muted">• <b>⚙️ Campaign</b> — the game’s name, advancement mode (XP or story milestones), awarding XP to everyone at once, and <b>save slots</b>.</div>
      </Section>

      <Section icon="💾" title="Saves and moving your data">
        <div className="muted">
          Everything saves <b>automatically</b> after every click — just close the tab
          and come back later. Important: the data lives in the browser of a specific device.
        </div>
        <div className="muted">• <b>Checkpoints</b> (Master → Campaign): “💾 Save now” before a dangerous place — and “↩️ Load” if you want to go back.</div>
        <div className="muted">• <b>Moving to another device</b>: bottom left, “💾 Save backup” downloads a file with the whole game; on the other device press “📂 Load backup” and pick that file.</div>
        <div className="muted">• On the website each device has its own game: the Master’s laptop holds the shared one, and players can keep their sheets on tablets (or run everything on one screen).</div>
      </Section>

      <Section icon="📖" title="Journal and Library">
        <div className="muted">• <b>Journal</b> — the chronicle of your adventures: session entries (“We beat the bridge goblins!”), quests with statuses, world characters you’ve met (friend/enemy), and discovered places. Fill it in after every game — a year from now it’ll be priceless.</div>
        <div className="muted">• <b>Library</b> — all 44 species, 179 spells, and 151 items with search, plus a rules cheat sheet: what you can do on a turn, check difficulties, conditions, resting.</div>
      </Section>

      <Section icon="💡" title="Tips for the Game Master (mom or dad)">
        <div className="muted">• Start simple: “you stand at the entrance to a goblin cave; Granny Marta’s pie has been stolen”. One fight (2–3 goblins), one stealth check, one chest — a great first one-hour game.</div>
        <div className="muted">• Say “yes, and…”: if a kid invents a crazy plan — give it a chance and call for a check. Failure is fun too, as long as it moves the story.</div>
        <div className="muted">• Don’t look up rules mid-game — tap the skill on the sheet and the platform does the math. Disputed? The Master decides, the game goes on.</div>
        <div className="muted">• Reward more than combat: a clever conversation or a kind deed is worth the same 25–50 XP.</div>
        <div className="muted">• End on a cliffhanger — “and two red eyes flash in the darkness… we continue tomorrow!”</div>
      </Section>

      <Section icon="🔤" title="Mini glossary">
        <Term t="d20, d6…">dice with 20, 6… sides. “2d6” = roll two six-siders and add them up.</Term>
        <Term t="Hit Points (HP)">health. At 0 HP a hero falls unconscious and makes death saving throws.</Term>
        <Term t="AC">Armor Class — how hard you are to hit. Attack roll ≥ AC = a hit.</Term>
        <Term t="DC">the check’s difficulty. Roll ≥ DC = success.</Term>
        <Term t="Modifier">the hero’s bonus added to the die (+3 to Athletics and so on).</Term>
        <Term t="Advantage / disadvantage">roll two d20s and keep the higher / lower.</Term>
        <Term t="Saving throw">a defensive check: dodge the fire, resist the charm.</Term>
        <Term t="CR">a monster’s Challenge Rating — a guide for the Master.</Term>
        <Term t="Spell slot">a “charge” of magic. Out of slots — time to rest.</Term>
        <Term t="Short / Long Rest">an hour’s halt / a night’s sleep. A Long Rest restores everything.</Term>
      </Section>
    </div>
  );
}
