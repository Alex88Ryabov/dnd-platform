import { useState } from 'react';
import type { Character, Recharge } from '../../model/types';
import type { DerivedStats } from '../../engine/derive';
import { CLASSES_BY_ID } from '../../data/classes';
import { SPECIES_BY_ID } from '../../data/species';
import { FEATS_BY_ID, FIGHTING_STYLES } from '../../data/feats';
import { useStore } from '../../store/store';
import { Modal } from '../../components/Modal';
import { toast } from '../../components/Toasts';

interface Props {
  character: Character;
  stats: DerivedStats;
}

export function SheetFeatures({ character, stats }: Props) {
  const updateCharacter = useStore((s) => s.updateCharacter);
  const [addingFeat, setAddingFeat] = useState(false);
  const [addingResource, setAddingResource] = useState(false);

  const classDef = CLASSES_BY_ID[character.classId];
  const species = SPECIES_BY_ID[character.speciesId];
  const subclass = classDef.subclasses.find((s) => s.id === character.subclassId);

  const classFeatures = classDef.features.filter((f) => f.level <= character.level);
  const subclassFeatures = (subclass?.features ?? []).filter((f) => f.level <= character.level);
  const all = [...classFeatures, ...subclassFeatures].sort((a, b) => a.level - b.level);

  const hasFightingStyle = classFeatures.some((f) => f.name === 'Боевой стиль')
    || character.fightingStyleId;

  return (
    <div className="col" style={{ gap: 16 }}>
      {hasFightingStyle && (
        <section className="panel">
          <div className="section-title">Боевой стиль</div>
          <div className="row-wrap" style={{ gap: 10 }}>
            <select
              value={character.fightingStyleId ?? ''}
              onChange={(e) => updateCharacter(character.id, (c) => ({ ...c, fightingStyleId: e.target.value || undefined }))}
            >
              <option value="">— не выбран —</option>
              {FIGHTING_STYLES.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            <span className="small muted grow">
              {character.fightingStyleId ? FEATS_BY_ID[character.fightingStyleId]?.description : 'Стиль влияет на атаки и КБ автоматически.'}
            </span>
          </div>
        </section>
      )}

      <section className="panel">
        <div className="section-title">Умения класса ({classDef.name}{subclass ? ` · ${subclass.name}` : ''})</div>
        <div className="col" style={{ gap: 4 }}>
          {all.map((feature, i) => (
            <details key={`${feature.name}-${i}`} style={{ borderBottom: '1px solid rgba(212,169,78,0.08)', padding: '6px 2px' }}>
              <summary className="row" style={{ gap: 10, cursor: 'pointer', listStyle: 'none' }}>
                <span className="chip" style={{ minWidth: 34, justifyContent: 'center' }}>{feature.level}</span>
                <b style={{ color: 'var(--parchment)' }}>{feature.name}</b>
              </summary>
              <div className="small muted" style={{ padding: '7px 4px 4px 46px' }}>{feature.description}</div>
            </details>
          ))}
        </div>
      </section>

      <div className="grid-2">
        <section className="panel">
          <div className="section-title">Черты расы: {species.name}</div>
          <div className="col" style={{ gap: 8 }}>
            {species.traits.map((trait) => (
              <div key={trait.name} className="small">
                <span className="gold">◆ {trait.name}.</span> <span className="muted">{trait.description}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="row spread">
            <div className="section-title" style={{ marginBottom: 0 }}>Черты героя</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setAddingFeat(true)}>+ Своя черта</button>
          </div>
          <div className="col" style={{ gap: 8, marginTop: 10 }}>
            {character.featIds.map((featId) => {
              const feat = FEATS_BY_ID[featId];
              if (!feat) {
                return null;
              }
              return (
                <div key={featId} className="small">
                  <span className="gold">★ {feat.name}.</span> <span className="muted">{feat.description}</span>
                </div>
              );
            })}
            {character.customFeats.map((feat, i) => (
              <div key={i} className="small row" style={{ gap: 6, alignItems: 'flex-start' }}>
                <span className="grow">
                  <span className="gold">★ {feat.name}.</span> <span className="muted">{feat.description}</span>
                </span>
                <button
                  className="icon-btn"
                  style={{ width: 24, height: 24 }}
                  onClick={() => updateCharacter(character.id, (c) => ({
                    ...c,
                    customFeats: c.customFeats.filter((_, idx) => idx !== i),
                  }))}
                >
                  ✕
                </button>
              </div>
            ))}
            {character.featIds.length === 0 && character.customFeats.length === 0 && (
              <div className="muted small">Пока нет черт.</div>
            )}
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="row spread">
          <div className="section-title" style={{ marginBottom: 0 }}>Свои ресурсы (домашние правила)</div>
          <button className="btn btn-ghost btn-sm" onClick={() => setAddingResource(true)}>+ Ресурс</button>
        </div>
        {character.customResources.length > 0 && (
          <div className="col" style={{ gap: 6, marginTop: 10 }}>
            {character.customResources.map((res) => (
              <div key={res.key} className="row spread small">
                <span>{res.name} — {res.max} исп.</span>
                <button
                  className="icon-btn"
                  onClick={() => updateCharacter(character.id, (c) => ({
                    ...c,
                    customResources: c.customResources.filter((r) => r.key !== res.key),
                  }))}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="small faint" style={{ marginTop: 8 }}>
          Отмечать использования можно на вкладке «Бой».
        </div>
      </section>

      <section className="panel">
        <div className="section-title">Владения</div>
        <div className="col small" style={{ gap: 6 }}>
          <div><span className="gold">Оружие:</span> <span className="muted">{classDef.weaponProficiencies}</span></div>
          <div><span className="gold">Доспехи:</span> <span className="muted">{classDef.armorTraining}</span></div>
          <div className="row" style={{ gap: 6 }}>
            <span className="gold">Инструменты:</span>
            <input
              className="grow"
              value={character.toolProficiencies}
              onChange={(e) => updateCharacter(character.id, (c) => ({ ...c, toolProficiencies: e.target.value }))}
            />
          </div>
          <div className="row" style={{ gap: 6 }}>
            <span className="gold">Языки:</span>
            <input
              className="grow"
              value={character.languages}
              onChange={(e) => updateCharacter(character.id, (c) => ({ ...c, languages: e.target.value }))}
            />
          </div>
        </div>
      </section>

      {addingFeat && (
        <CustomFeatModal
          onAdd={(name, description) => {
            updateCharacter(character.id, (c) => ({
              ...c,
              customFeats: [...c.customFeats, { name, description }],
            }));
            setAddingFeat(false);
            toast('Черта добавлена', name, '⭐');
          }}
          onClose={() => setAddingFeat(false)}
        />
      )}
      {addingResource && (
        <CustomResourceModal
          onAdd={(name, max, recharge) => {
            updateCharacter(character.id, (c) => ({
              ...c,
              customResources: [...c.customResources, {
                key: `custom-${Date.now()}`, name, max, used: 0, recharge,
              }],
            }));
            setAddingResource(false);
            toast('Ресурс добавлен', name, '💠');
          }}
          onClose={() => setAddingResource(false)}
        />
      )}
    </div>
  );
}

function CustomFeatModal({ onAdd, onClose }: { onAdd: (name: string, description: string) => void; onClose: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  return (
    <Modal title="Своя черта" onClose={onClose}>
      <div className="col" style={{ gap: 10 }}>
        <input autoFocus placeholder="Название черты" value={name} onChange={(e) => setName(e.target.value)} />
        <textarea placeholder="Что она делает" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" disabled={!name.trim()} onClick={() => onAdd(name.trim(), description.trim())}>
            Добавить
          </button>
        </div>
      </div>
    </Modal>
  );
}

function CustomResourceModal({ onAdd, onClose }: {
  onAdd: (name: string, max: number, recharge: Recharge) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [max, setMax] = useState(3);
  const [recharge, setRecharge] = useState<Recharge>('long');
  return (
    <Modal title="Свой ресурс" onClose={onClose}>
      <div className="col" style={{ gap: 10 }}>
        <input autoFocus placeholder="Название (например: Дыхание дракона)" value={name} onChange={(e) => setName(e.target.value)} />
        <label className="row" style={{ gap: 8 }}>
          <span className="muted small">Использований:</span>
          <input className="num-input" type="number" min={1} max={30} value={max} onChange={(e) => setMax(Math.max(1, Number(e.target.value) || 1))} />
        </label>
        <label className="row" style={{ gap: 8 }}>
          <span className="muted small">Восстановление:</span>
          <select value={recharge} onChange={(e) => setRecharge(e.target.value as Recharge)}>
            <option value="short">короткий отдых</option>
            <option value="long">долгий отдых</option>
            <option value="none">вручную</option>
          </select>
        </label>
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" disabled={!name.trim()} onClick={() => onAdd(name.trim(), max, recharge)}>
            Добавить
          </button>
        </div>
      </div>
    </Modal>
  );
}
