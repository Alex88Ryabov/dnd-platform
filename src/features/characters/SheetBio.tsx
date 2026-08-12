import type { Character } from '../../model/types';
import { useStore } from '../../store/store';
import { ALIGNMENTS } from '../../data/core';
import { LANG_LOCALES, useLang } from '../../i18n/lang';
import { useRules } from '../../i18n/rules';
import { useT } from '../../i18n/tr';
import { T_SHEET } from '../../i18n/ui/sheet';

interface Props {
  character: Character;
}

export function SheetBio({ character }: Props) {
  const updateCharacter = useStore((s) => s.updateCharacter);
  const lang = useLang();
  const t = useT();
  const rules = useRules();

  const patch = (p: Partial<Character>) => {
    updateCharacter(character.id, (c) => ({ ...c, ...p }));
  };

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="grid-2">
        <section className="panel">
          <div className="section-title">{t(T_SHEET.aboutHero)}</div>
          <div className="col" style={{ gap: 10 }}>
            <label className="col" style={{ gap: 4 }}>
              <span className="muted small">{t(T_SHEET.alignment)}</span>
              {/* хранится всегда русская строка мировоззрения, показывается перевод по позиции */}
              <select value={character.alignment} onChange={(e) => patch({ alignment: e.target.value })}>
                {ALIGNMENTS.map((a, i) => (
                  <option key={a} value={a}>{rules.alignments[i]}</option>
                ))}
              </select>
            </label>
            <label className="col" style={{ gap: 4 }}>
              <span className="muted small">{t(T_SHEET.appearance)}</span>
              <textarea
                rows={3}
                defaultValue={character.appearance}
                placeholder={t(T_SHEET.appearancePh)}
                onBlur={(e) => patch({ appearance: e.target.value })}
              />
            </label>
            <label className="col" style={{ gap: 4 }}>
              <span className="muted small">{t(T_SHEET.story)}</span>
              <textarea
                rows={6}
                defaultValue={character.backstory}
                placeholder={t(T_SHEET.storyPh)}
                onBlur={(e) => patch({ backstory: e.target.value })}
              />
            </label>
            <label className="col" style={{ gap: 4 }}>
              <span className="muted small">{t(T_SHEET.playerNotes)}</span>
              <textarea
                rows={4}
                defaultValue={character.notes}
                placeholder={t(T_SHEET.notesPh)}
                onBlur={(e) => patch({ notes: e.target.value })}
              />
            </label>
          </div>
        </section>

        <section className="panel">
          <div className="section-title">{t(T_SHEET.levelChronicle)}</div>
          {character.levelLog.length === 0 ? (
            <div className="muted small">{t(T_SHEET.noEntries)}</div>
          ) : (
            <div className="col" style={{ gap: 10 }}>
              {[...character.levelLog].reverse().map((entry, i) => (
                <div key={i} style={{ borderLeft: '2px solid var(--gold-dim)', paddingLeft: 12 }}>
                  <div className="row" style={{ gap: 8 }}>
                    <b className="gold">{t(T_SHEET.levelEntry, { n: entry.level })}</b>
                    <span className="small faint">{new Date(entry.date).toLocaleDateString(LANG_LOCALES[lang])}</span>
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
