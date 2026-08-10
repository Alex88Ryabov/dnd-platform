import type { Character } from '../../model/types';
import { useStore } from '../../store/store';
import { ALIGNMENTS } from '../../data/core';

interface Props {
  character: Character;
}

export function SheetBio({ character }: Props) {
  const updateCharacter = useStore((s) => s.updateCharacter);

  const patch = (p: Partial<Character>) => {
    updateCharacter(character.id, (c) => ({ ...c, ...p }));
  };

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="grid-2">
        <section className="panel">
          <div className="section-title">О герое</div>
          <div className="col" style={{ gap: 10 }}>
            <label className="col" style={{ gap: 4 }}>
              <span className="muted small">Мировоззрение</span>
              <select value={character.alignment} onChange={(e) => patch({ alignment: e.target.value })}>
                {ALIGNMENTS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </label>
            <label className="col" style={{ gap: 4 }}>
              <span className="muted small">Внешность</span>
              <textarea
                rows={3}
                defaultValue={character.appearance}
                placeholder="Как выглядит герой…"
                onBlur={(e) => patch({ appearance: e.target.value })}
              />
            </label>
            <label className="col" style={{ gap: 4 }}>
              <span className="muted small">История</span>
              <textarea
                rows={6}
                defaultValue={character.backstory}
                placeholder="Откуда герой родом, о чём мечтает, кого любит и кого опасается…"
                onBlur={(e) => patch({ backstory: e.target.value })}
              />
            </label>
            <label className="col" style={{ gap: 4 }}>
              <span className="muted small">Заметки игрока</span>
              <textarea
                rows={4}
                defaultValue={character.notes}
                placeholder="Всё, что важно не забыть…"
                onBlur={(e) => patch({ notes: e.target.value })}
              />
            </label>
          </div>
        </section>

        <section className="panel">
          <div className="section-title">Летопись уровней</div>
          {character.levelLog.length === 0 ? (
            <div className="muted small">Записей пока нет.</div>
          ) : (
            <div className="col" style={{ gap: 10 }}>
              {[...character.levelLog].reverse().map((entry, i) => (
                <div key={i} style={{ borderLeft: '2px solid var(--gold-dim)', paddingLeft: 12 }}>
                  <div className="row" style={{ gap: 8 }}>
                    <b className="gold">Уровень {entry.level}</b>
                    <span className="small faint">{new Date(entry.date).toLocaleDateString('ru')}</span>
                  </div>
                  <ul className="small muted" style={{ paddingLeft: 18, marginTop: 4 }}>
                    {entry.notes.map((note, j) => (
                      <li key={j}>{note}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
