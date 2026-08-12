import { useState } from 'react';
import { useStore } from '../../store/store';
import { useCatalog } from '../../i18n/catalog';
import { useT } from '../../i18n/tr';
import { T_CHARS } from '../../i18n/ui/characters';
import { T_COMMON } from '../../i18n/ui/common';
import { buildSampleParty } from '../../data/seed';
import { derive } from '../../engine/derive';
import { ClassEmblem } from '../../svg/icons';
import { toast } from '../../components/Toasts';
import { HpBadge } from './HpBadge';
import { PortraitBadge } from '../../components/PortraitBadge';
import { CharacterSheet } from './CharacterSheet';
import { CreationWizard } from './CreationWizard';
import { Confetti } from '../../components/Confetti';

export function CharactersView() {
  const characters = useStore((s) => s.characters);
  const selectedId = useStore((s) => s.selectedCharacterId);
  const selectCharacter = useStore((s) => s.selectCharacter);
  const deleteCharacter = useStore((s) => s.deleteCharacter);
  const addCharacter = useStore((s) => s.addCharacter);
  const [creating, setCreating] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const t = useT();
  const { classesById, speciesById } = useCatalog();

  const selected = characters.find((c) => c.id === selectedId);

  if (selected) {
    return (
      <>
        <Confetti />
        <CharacterSheet character={selected} onBack={() => selectCharacter(undefined)} />
      </>
    );
  }

  return (
    <div className="col" style={{ gap: 18 }}>
      <Confetti />
      <div className="row-wrap spread" style={{ gap: 10 }}>
        <h1 style={{ fontSize: 'clamp(26px, 6.5vw, 34px)' }}>{t(T_CHARS.title)}</h1>
        <button className="btn btn-primary" onClick={() => setCreating(true)}>
          {t(T_CHARS.createHero)}
        </button>
      </div>

      {characters.length === 0 && (
        <div className="panel center" style={{ padding: '44px 20px' }}>
          <span style={{ fontSize: 48 }}>🗡️</span>
          <h2 style={{ margin: '10px 0 6px' }}>{t(T_CHARS.nobodyYet)}</h2>
          <p className="muted" style={{ maxWidth: 460, margin: '0 auto 18px' }}>
            {t(T_CHARS.emptyHint)}
          </p>
          <div className="row-wrap" style={{ justifyContent: 'center' }}>
            <button className="btn btn-primary btn-lg pulse-ready" onClick={() => setCreating(true)}>
              {t(T_CHARS.createHero)}
            </button>
            <button
              className="btn btn-ghost btn-lg"
              onClick={() => {
                buildSampleParty().forEach((c) => addCharacter(c));
                selectCharacter(undefined);
                toast(t(T_CHARS.partyArrived), t(T_CHARS.partyAddedText), '🎉');
              }}
            >
              {t(T_CHARS.sampleParty)}
            </button>
          </div>
        </div>
      )}

      <div className="grid-cards">
        {characters.map((char) => {
          const stats = derive(char);
          const classDef = classesById[char.classId];
          return (
            <div
              key={char.id}
              className="panel card-clickable"
              style={{ borderTop: `3px solid ${classDef.color}` }}
              onClick={() => selectCharacter(char.id)}
            >
              <div className="row" style={{ gap: 12 }}>
                <PortraitBadge portrait={char.portrait} size={58} radius={15} />
                <div className="grow">
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, color: 'var(--parchment)' }}>
                    {char.name}
                  </div>
                  <div className="small muted row" style={{ gap: 6 }}>
                    <ClassEmblem classId={char.classId} size={15} color={classDef.color} />
                    {classDef.name} {t(T_COMMON.levelOf, { n: char.level })} · {speciesById[char.speciesId].name}
                  </div>
                  {char.playerName && (
                    <div className="small faint script">{t(T_CHARS.player, { name: char.playerName })}</div>
                  )}
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <HpBadge current={char.hpCurrent} max={stats.hpMax} temp={char.hpTemp} />
              </div>
              <div className="row spread" style={{ marginTop: 10 }}>
                <span className="chip">{t(T_CHARS.acChip, { n: stats.ac })}</span>
                <span className="chip">{t(T_CHARS.pbChip, { n: stats.pb })}</span>
                <button
                  className="icon-btn"
                  title={t(T_CHARS.deleteHero)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmingDelete(char.id);
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {confirmingDelete && (
        <ConfirmDelete
          name={characters.find((c) => c.id === confirmingDelete)?.name ?? ''}
          onCancel={() => setConfirmingDelete(null)}
          onConfirm={() => {
            deleteCharacter(confirmingDelete);
            setConfirmingDelete(null);
            toast(t(T_CHARS.heroRetired), undefined, '🕯️');
          }}
        />
      )}

      {creating && <CreationWizard onClose={() => setCreating(false)} />}
    </div>
  );
}

function ConfirmDelete({ name, onCancel, onConfirm }: { name: string; onCancel: () => void; onConfirm: () => void }) {
  const t = useT();
  return (
    <div className="modal-overlay" onMouseDown={(e) => {
      if (e.target === e.currentTarget) {
        onCancel();
      }
    }}
    >
      <div className="modal-box" style={{ maxWidth: 420 }}>
        <h3 className="modal-title">{t(T_CHARS.deleteQuestion)}</h3>
        <p className="muted" style={{ margin: '10px 0 18px' }}>
          {t(T_CHARS.deleteWarning, { name })}
        </p>
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onCancel}>{t(T_CHARS.keep)}</button>
          <button className="btn btn-danger" onClick={onConfirm}>{t(T_COMMON.delete)}</button>
        </div>
      </div>
    </div>
  );
}
