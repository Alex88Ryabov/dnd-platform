import { useState } from 'react';
import { useStore } from '../../store/store';
import { DragonHero, ClassEmblem } from '../../svg/icons';
import { CLASSES_BY_ID } from '../../data/classes';
import { SPECIES_BY_ID } from '../../data/species';
import { buildSampleParty } from '../../data/seed';
import { derive } from '../../engine/derive';
import { toast } from '../../components/Toasts';
import { sfx } from '../../audio/sound';
import { HpBadge } from '../characters/HpBadge';
import { PortraitBadge } from '../../components/PortraitBadge';

export function HomeView() {
  const characters = useStore((s) => s.characters);
  const journal = useStore((s) => s.journal);
  const quests = useStore((s) => s.quests);
  const rollLog = useStore((s) => s.rollLog);
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const addCharacter = useStore((s) => s.addCharacter);
  const setView = useStore((s) => s.setView);
  const selectCharacter = useStore((s) => s.selectCharacter);
  const [editingName, setEditingName] = useState(false);

  const addSample = () => {
    buildSampleParty().forEach((c) => addCharacter(c));
    selectCharacter(undefined);
    sfx.levelUp();
    toast('Партия прибыла!', 'Четыре героя-примера ждут на экране «Герои»', '🎉');
  };

  return (
    <div className="col" style={{ gap: 18 }}>
      <section className="panel panel-ornate" style={{ overflow: 'hidden' }}>
        <div className="row-wrap spread" style={{ alignItems: 'center', gap: 20 }}>
          <div style={{ maxWidth: 520, padding: '10px 0 10px 6px' }}>
            {editingName ? (
              <input
                autoFocus
                defaultValue={settings.campaignName}
                style={{ fontSize: 26, fontFamily: 'var(--font-display)', fontWeight: 700 }}
                onBlur={(e) => {
                  updateSettings({ campaignName: e.target.value.trim() || 'Летопись героев' });
                  setEditingName(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    (e.target as HTMLInputElement).blur();
                  }
                }}
              />
            ) : (
              <h1
                style={{ fontSize: 'clamp(28px, 4vw, 42px)', cursor: 'pointer' }}
                title="Нажми, чтобы переименовать кампанию"
                onClick={() => setEditingName(true)}
              >
                {settings.campaignName} <span className="faint" style={{ fontSize: 18 }}>✎</span>
              </h1>
            )}
            <p className="muted" style={{ marginTop: 8, fontSize: 17 }}>
              Ваша платформа для приключений по правилам D&D 2024: герои, кубы,
              бой и журнал кампании — всё в одном месте, и ничего не надо переписывать руками.
            </p>
            <div className="row-wrap" style={{ marginTop: 18 }}>
              {characters.length > 0 && (
                <button className="btn btn-primary btn-lg pulse-ready" onClick={() => setView('master')}>
                  ▶️ Начать игру
                </button>
              )}
              <button
                className={`btn ${characters.length > 0 ? 'btn-ghost' : 'btn-primary'} btn-lg`}
                onClick={() => {
                  setView('characters');
                  selectCharacter(undefined);
                }}
              >
                ⚔️ Герои
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => setView('dice')}>
                🎲 Кубики
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => setView('library')}>
                🎓 Как играть?
              </button>
            </div>
          </div>
          <div style={{ margin: '-10px 0 -24px auto', maxWidth: '100%' }}>
            <DragonHero size={330} className="hero-dragon" />
          </div>
        </div>
      </section>

      {characters.length === 0 ? (
        <section className="panel center" style={{ padding: '40px 20px' }}>
          <span style={{ fontSize: 46 }}>🏰</span>
          <h2 style={{ margin: '10px 0 6px' }}>Начнём приключение?</h2>
          <p className="muted" style={{ maxWidth: 480, margin: '0 auto 18px' }}>
            Создайте своего первого героя — мастер создания проведёт по шагам:
            класс, вид, предыстория, характеристики и снаряжение.
          </p>
          <div className="row-wrap" style={{ justifyContent: 'center' }}>
            <button
              className="btn btn-primary btn-lg pulse-ready"
              onClick={() => {
                setView('characters');
              }}
            >
              ✨ Создать первого героя
            </button>
            <button className="btn btn-ghost btn-lg" onClick={addSample}>
              🎁 Добавить партию-пример
            </button>
          </div>
        </section>
      ) : (
        <section>
          <div className="section-title">Отряд ({characters.length})</div>
          <div className="grid-cards">
            {characters.map((char) => {
              const stats = derive(char);
              const classDef = CLASSES_BY_ID[char.classId];
              return (
                <div
                  key={char.id}
                  className="panel card-clickable"
                  style={{ borderTop: `3px solid ${classDef.color}` }}
                  onClick={() => {
                    selectCharacter(char.id);
                    setView('characters');
                  }}
                >
                  <div className="row" style={{ gap: 12 }}>
                    <PortraitBadge portrait={char.portrait} size={52} radius={14} />
                    <div className="grow">
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--parchment)' }}>
                        {char.name}
                      </div>
                      <div className="small muted row" style={{ gap: 6 }}>
                        <ClassEmblem classId={char.classId} size={16} color={classDef.color} />
                        {classDef.name} {char.level} ур. · {SPECIES_BY_ID[char.speciesId].name}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <HpBadge current={char.hpCurrent} max={stats.hpMax} temp={char.hpTemp} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="grid-2">
        <section className="panel">
          <div className="section-title">Задания</div>
          {quests.filter((q) => q.status === 'active').length === 0 ? (
            <div className="muted small">Активных заданий нет — мастер может добавить их в Журнале.</div>
          ) : (
            <div className="col" style={{ gap: 8 }}>
              {quests.filter((q) => q.status === 'active').slice(0, 4).map((q) => (
                <div key={q.id} className="row" style={{ gap: 10 }}>
                  <span style={{ fontSize: 18 }}>🗺️</span>
                  <div>
                    <div style={{ fontWeight: 700 }}>{q.title}</div>
                    {q.reward && <div className="small faint">Награда: {q.reward}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="divider" />
          <div className="section-title">Последние записи</div>
          {journal.length === 0 ? (
            <div className="muted small">Журнал пока пуст. Всё важное из приключений — на вкладке «Журнал».</div>
          ) : (
            <div className="col" style={{ gap: 10 }}>
              {journal.slice(0, 3).map((entry) => (
                <div key={entry.id}>
                  <div className="row" style={{ gap: 8 }}>
                    <span>{entry.kind === 'session' ? '📖' : entry.kind === 'event' ? '⚡' : '📝'}</span>
                    <span style={{ fontWeight: 700 }}>{entry.title}</span>
                    <span className="small faint">{new Date(entry.ts).toLocaleDateString('ru')}</span>
                  </div>
                  <div className="small muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel">
          <div className="section-title">Свежие броски</div>
          {rollLog.length === 0 ? (
            <div className="muted small">Кости ещё не гремели. Загляните на вкладку «Кубы»!</div>
          ) : (
            <div className="col" style={{ gap: 7 }}>
              {rollLog.slice(0, 6).map((roll) => (
                <div key={roll.id} className="row spread small">
                  <span className="muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {roll.who ? `${roll.who}: ` : ''}{roll.label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: 17,
                      color: roll.crit === 'success' ? 'var(--gold-bright)' : roll.crit === 'fail' ? 'var(--danger)' : 'var(--parchment)',
                    }}
                  >
                    {roll.total}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
