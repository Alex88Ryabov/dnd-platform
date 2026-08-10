import { useState } from 'react';
import type { Ability, Character, SkillId } from '../../model/types';
import { useStore } from '../../store/store';
import { ABILITIES, ABILITY_SHORT, PORTRAIT_ICONS, SKILLS } from '../../data/core';
import { CLASSES_BY_ID } from '../../data/classes';
import { dieAverage } from '../../engine/dice';
import { Modal } from '../../components/Modal';
import { PortraitBadge } from '../../components/PortraitBadge';
import { fileToPortraitImage } from '../../components/portraitUtil';
import { toast } from '../../components/Toasts';

interface Props {
  character: Character;
  onClose: () => void;
}

export function EditCharacterModal({ character, onClose }: Props) {
  const updateCharacter = useStore((s) => s.updateCharacter);

  const [name, setName] = useState(character.name);
  const [playerName, setPlayerName] = useState(character.playerName);
  const [icon, setIcon] = useState(character.portrait.icon);
  const [hue, setHue] = useState(character.portrait.hue);
  const [image, setImage] = useState(character.portrait.image);
  const [level, setLevel] = useState(character.level);
  const [subclassId, setSubclassId] = useState(character.subclassId ?? '');
  const [abilities, setAbilities] = useState<Record<Ability, number>>({ ...character.abilities });
  const [xp, setXp] = useState(character.xp);
  const [hpMaxBonus, setHpMaxBonus] = useState(character.hpMaxBonus);
  const [acOverrideOn, setAcOverrideOn] = useState(character.acOverride !== undefined);
  const [acOverride, setAcOverride] = useState(character.acOverride ?? 10);
  const [proficient, setProficient] = useState<SkillId[]>([...character.proficientSkills]);
  const [expertise, setExpertise] = useState<SkillId[]>([...character.expertiseSkills]);

  const save = () => {
    const classDef = CLASSES_BY_ID[character.classId];
    updateCharacter(character.id, (c) => {
      // при смене уровня добираем/убираем кости хитов (новые уровни — по среднему)
      let hpRolls = c.hpRolls;
      if (level > c.level) {
        hpRolls = [...c.hpRolls, ...Array.from({ length: level - c.level }, () => dieAverage(classDef.hitDie))];
      } else if (level < c.level) {
        hpRolls = c.hpRolls.slice(0, level);
      }
      return {
        ...c,
        name: name.trim() || c.name,
        playerName: playerName.trim(),
        portrait: { icon, hue, image },
        level,
        hpRolls,
        subclassId: subclassId || undefined,
        abilities: { ...abilities },
        xp: Math.max(0, xp),
        hpMaxBonus,
        acOverride: acOverrideOn ? acOverride : undefined,
        proficientSkills: proficient,
        expertiseSkills: expertise.filter((e) => proficient.includes(e)),
        updatedAt: new Date().toISOString(),
      };
    });
    toast('Сохранено', 'Лист персонажа обновлён', '✅');
    onClose();
  };

  const classDef = CLASSES_BY_ID[character.classId];

  return (
    <Modal title="Правка героя" onClose={onClose} wide>
      <div className="col" style={{ gap: 14 }}>
        <div className="grid-2">
          <label className="col" style={{ gap: 4 }}>
            <span className="muted small">Имя</span>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="col" style={{ gap: 4 }}>
            <span className="muted small">Игрок</span>
            <input value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
          </label>
        </div>

        <div className="row-wrap" style={{ gap: 10, alignItems: 'center' }}>
          <PortraitBadge portrait={{ icon, hue, image }} size={56} radius={14} />
          <label className="btn btn-ghost btn-sm" style={{ cursor: 'pointer' }}>
            📷 Своя картинка
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  try {
                    setImage(await fileToPortraitImage(file));
                  } catch {
                    toast('Не получилось', 'Не удалось прочитать картинку', '⚠️');
                  }
                }
                e.target.value = '';
              }}
            />
          </label>
          {image && (
            <button className="btn btn-ghost btn-sm" onClick={() => setImage(undefined)}>
              ✕ Убрать картинку
            </button>
          )}
        </div>
        <div className="row-wrap" style={{ gap: 6 }}>
          {PORTRAIT_ICONS.map((p) => (
            <button
              key={p}
              onClick={() => setIcon(p)}
              style={{
                fontSize: 20,
                width: 38,
                height: 38,
                borderRadius: 9,
                border: `2px solid ${icon === p ? 'var(--gold)' : 'transparent'}`,
                background: icon === p ? `hsl(${hue} 45% 24%)` : 'rgba(0,0,0,0.25)',
              }}
            >
              {p}
            </button>
          ))}
        </div>
        <input
          type="range"
          min={0}
          max={360}
          value={hue}
          onChange={(e) => setHue(Number(e.target.value))}
          style={{
            appearance: 'none', height: 12, borderRadius: 6, border: 'none', padding: 0, maxWidth: 380,
            background: 'linear-gradient(90deg, hsl(0 50% 45%), hsl(60 50% 45%), hsl(120 50% 45%), hsl(180 50% 45%), hsl(240 50% 45%), hsl(300 50% 45%), hsl(360 50% 45%))',
          }}
        />

        <div className="section-title">Характеристики</div>
        <div className="row-wrap" style={{ gap: 10 }}>
          {ABILITIES.map((a) => (
            <label key={a} className="col center" style={{ gap: 3 }}>
              <span className="small gold" style={{ fontWeight: 700 }}>{ABILITY_SHORT[a]}</span>
              <input
                className="num-input"
                type="number"
                min={1}
                max={30}
                value={abilities[a]}
                onChange={(e) => setAbilities({ ...abilities, [a]: Number(e.target.value) || 10 })}
              />
            </label>
          ))}
        </div>

        <div className="row-wrap" style={{ gap: 16 }}>
          <label className="row" style={{ gap: 6 }}>
            <span className="muted small">Уровень</span>
            <input
              className="num-input"
              type="number"
              min={1}
              max={20}
              value={level}
              onChange={(e) => setLevel(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
            />
          </label>
          {level >= classDef.subclassLevel && (
            <label className="row" style={{ gap: 6 }}>
              <span className="muted small">{classDef.subclassLabel}</span>
              <select value={subclassId} onChange={(e) => setSubclassId(e.target.value)}>
                <option value="">— не выбран —</option>
                {classDef.subclasses.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </label>
          )}
          <label className="row" style={{ gap: 6 }}>
            <span className="muted small">Опыт (XP)</span>
            <input className="num-input" style={{ width: 100 }} type="number" min={0} value={xp} onChange={(e) => setXp(Number(e.target.value) || 0)} />
          </label>
          <label className="row" style={{ gap: 6 }} title="Ручная прибавка к максимуму хитов (домашние правила, предметы)">
            <span className="muted small">Бонус к макс. хитам</span>
            <input className="num-input" type="number" value={hpMaxBonus} onChange={(e) => setHpMaxBonus(Number(e.target.value) || 0)} />
          </label>
          <label className="row" style={{ gap: 6 }}>
            <input type="checkbox" checked={acOverrideOn} onChange={(e) => setAcOverrideOn(e.target.checked)} />
            <span className="muted small">КБ вручную</span>
            {acOverrideOn && (
              <input className="num-input" type="number" min={1} value={acOverride} onChange={(e) => setAcOverride(Number(e.target.value) || 10)} />
            )}
          </label>
        </div>

        <div className="section-title">Владение навыками (★ — компетентность)</div>
        <div className="row-wrap" style={{ gap: 7 }}>
          {SKILLS.map((skill) => {
            const isProf = proficient.includes(skill.id);
            const isExp = expertise.includes(skill.id);
            return (
              <button
                key={skill.id}
                className={`chip chip-clickable${isProf ? ' chip-active' : ''}`}
                style={isExp ? { color: 'var(--gold-bright)', fontWeight: 700 } : undefined}
                title="Клик: нет → владение → компетентность → нет"
                onClick={() => {
                  if (!isProf) {
                    setProficient([...proficient, skill.id]);
                  } else if (!isExp) {
                    setExpertise([...expertise, skill.id]);
                  } else {
                    setProficient(proficient.filter((s) => s !== skill.id));
                    setExpertise(expertise.filter((s) => s !== skill.id));
                  }
                }}
              >
                {isExp ? '★ ' : ''}{skill.name}
              </button>
            );
          })}
        </div>

        <div className="row" style={{ justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn btn-ghost" onClick={onClose}>Отмена</button>
          <button className="btn btn-primary" onClick={save}>Сохранить</button>
        </div>
      </div>
    </Modal>
  );
}
