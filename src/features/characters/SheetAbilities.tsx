import type { Character } from '../../model/types';
import type { DerivedStats } from '../../engine/derive';
import { ABILITIES } from '../../data/core';
import { useRules } from '../../i18n/rules';
import { useT } from '../../i18n/tr';
import { T_SHEET } from '../../i18n/ui/sheet';
import { checkRoll } from '../../engine/rolling';
import { formatModifier } from '../../engine/dice';

interface Props {
  character: Character;
  stats: DerivedStats;
}

export function SheetAbilities({ character, stats }: Props) {
  const t = useT();
  const { abilityNames, abilityShort } = useRules();
  return (
    <div className="col" style={{ gap: 16 }}>
      <section>
        <div className="section-title">{t(T_SHEET.abilitiesTitle)}</div>
        <div className="ability-grid">
          {ABILITIES.map((a) => (
            <div
              key={a}
              className="ability-hex rollable"
              onClick={() => checkRoll({
                label: t(T_SHEET.checkLabel, { name: abilityNames[a] }),
                modifier: stats.mods[a],
                who: character.name,
              })}
            >
              <div className="ab-name">{abilityShort[a]}</div>
              <div className="ab-mod">{formatModifier(stats.mods[a])}</div>
              <div className="ab-score">{character.abilities[a]}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid-2">
        <section className="panel">
          <div className="section-title">{t(T_SHEET.savesTitle)}</div>
          <div className="col" style={{ gap: 2 }}>
            {stats.saves.map((save) => (
              <div
                key={save.ability}
                className="skill-row"
                onClick={() => checkRoll({
                  label: t(T_SHEET.saveLabel, { name: abilityNames[save.ability] }),
                  modifier: save.bonus,
                  who: character.name,
                })}
              >
                <span className={`prof-dot${save.proficient ? ' prof' : ''}`} />
                <span className="grow">{abilityNames[save.ability]}</span>
                <b style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>{formatModifier(save.bonus)}</b>
                <span className="faint small">🎲</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-title">{t(T_SHEET.skillsTitle)}</div>
          <div className="col" style={{ gap: 2 }}>
            {stats.skills.map((skill) => (
              <div
                key={skill.id}
                className="skill-row"
                title={skill.expertise ? t(T_SHEET.expertiseHint) : skill.proficient ? t(T_SHEET.proficiencyHint) : undefined}
                onClick={() => checkRoll({
                  label: t(T_SHEET.checkLabel, { name: skill.name }),
                  modifier: skill.bonus,
                  who: character.name,
                })}
              >
                <span className={`prof-dot${skill.expertise ? ' expert' : skill.proficient ? ' prof' : ''}`} />
                <span className="grow">
                  {skill.name} <span className="faint small">({abilityShort[skill.ability]})</span>
                </span>
                <b style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>{formatModifier(skill.bonus)}</b>
                <span className="faint small">🎲</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
