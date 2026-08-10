import type { Character } from '../../model/types';
import type { DerivedStats } from '../../engine/derive';
import { ABILITIES, ABILITY_NAMES, ABILITY_SHORT } from '../../data/core';
import { checkRoll } from '../../engine/rolling';
import { formatModifier } from '../../engine/dice';

interface Props {
  character: Character;
  stats: DerivedStats;
}

export function SheetAbilities({ character, stats }: Props) {
  return (
    <div className="col" style={{ gap: 16 }}>
      <section>
        <div className="section-title">Характеристики — нажмите, чтобы бросить проверку</div>
        <div className="ability-grid">
          {ABILITIES.map((a) => (
            <div
              key={a}
              className="ability-hex rollable"
              onClick={() => checkRoll({
                label: `Проверка: ${ABILITY_NAMES[a]}`,
                modifier: stats.mods[a],
                who: character.name,
              })}
            >
              <div className="ab-name">{ABILITY_SHORT[a]}</div>
              <div className="ab-mod">{formatModifier(stats.mods[a])}</div>
              <div className="ab-score">{character.abilities[a]}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid-2">
        <section className="panel">
          <div className="section-title">Спасброски</div>
          <div className="col" style={{ gap: 2 }}>
            {stats.saves.map((save) => (
              <div
                key={save.ability}
                className="skill-row"
                onClick={() => checkRoll({
                  label: `Спасбросок: ${ABILITY_NAMES[save.ability]}`,
                  modifier: save.bonus,
                  who: character.name,
                })}
              >
                <span className={`prof-dot${save.proficient ? ' prof' : ''}`} />
                <span className="grow">{ABILITY_NAMES[save.ability]}</span>
                <b style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>{formatModifier(save.bonus)}</b>
                <span className="faint small">🎲</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-title">Навыки</div>
          <div className="col" style={{ gap: 2 }}>
            {stats.skills.map((skill) => (
              <div
                key={skill.id}
                className="skill-row"
                title={skill.expertise ? 'Компетентность (двойной бонус)' : skill.proficient ? 'Владение' : undefined}
                onClick={() => checkRoll({
                  label: `Проверка: ${skill.name}`,
                  modifier: skill.bonus,
                  who: character.name,
                })}
              >
                <span className={`prof-dot${skill.expertise ? ' expert' : skill.proficient ? ' prof' : ''}`} />
                <span className="grow">
                  {skill.name} <span className="faint small">({ABILITY_SHORT[skill.ability]})</span>
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
