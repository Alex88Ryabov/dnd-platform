import type { SkillId } from '../../model/types';
import { SKILLS } from '../../data/core';
import { useRules } from '../../i18n/rules';
import { useT } from '../../i18n/tr';
import { T_WIZARD } from '../../i18n/ui/wizard';

interface Props {
  // источник навыков: «Раса: Табакси», «Класс: Плут»
  title: string;
  granted?: SkillId[];
  options?: SkillId[];
  count?: number;
  optional?: boolean;
  chosen?: SkillId[];
  onToggle?: (skillId: SkillId) => void;
}

export function SkillPicker({ title, granted = [], options = [], count = 0, optional, chosen = [], onToggle }: Props) {
  const t = useT();
  const { abilityShort, skillNames } = useRules();

  return (
    <div className="panel" style={{ padding: 14 }}>
      <div className="section-title">{title}</div>
      {granted.length > 0 && (
        <div className="small">
          <span className="gold">{t(T_WIZARD.skillsGrantedLabel)}</span>{' '}
          <span className="muted">{granted.map((id) => skillNames[id]).join(', ')}</span>
        </div>
      )}
      {count > 0 && (
        <>
          <div className="small gold" style={{ margin: '10px 0 6px' }}>
            {t(T_WIZARD.skillsChooseLabel)}
            {optional && <span className="faint"> ({t(T_WIZARD.skillsOptional)})</span>}
          </div>
          <div className="row-wrap" style={{ gap: 8 }}>
            {options.map((skillId) => {
              const def = SKILLS.find((s) => s.id === skillId)!;
              const active = chosen.includes(skillId);
              return (
                <button
                  key={skillId}
                  className={`chip chip-clickable${active ? ' chip-active' : ''}`}
                  style={{ fontSize: 14.5, padding: '7px 14px' }}
                  onClick={() => onToggle?.(skillId)}
                >
                  {skillNames[skillId]} <span className="faint">({abilityShort[def.ability]})</span>
                </button>
              );
            })}
          </div>
          <div className="small faint" style={{ marginTop: 8 }}>
            {t(T_WIZARD.chosenOf, { a: chosen.length, b: count })}
          </div>
        </>
      )}
    </div>
  );
}
