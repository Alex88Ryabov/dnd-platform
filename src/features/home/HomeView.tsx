import { useState } from 'react';
import { useStore } from '../../store/store';
import { DragonHero, ClassEmblem } from '../../svg/icons';
import { useCatalog } from '../../i18n/catalog';
import { LANGS, LANG_LABELS, LANG_LOCALES, useLang } from '../../i18n/lang';
import { useT } from '../../i18n/tr';
import { T_COMMON } from '../../i18n/ui/common';
import { T_HOME } from '../../i18n/ui/home';
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
  const lang = useLang();
  const t = useT();
  const { classesById, speciesById } = useCatalog();

  const addSample = () => {
    buildSampleParty().forEach((c) => addCharacter(c));
    selectCharacter(undefined);
    sfx.levelUp();
    toast(t(T_HOME.partyArrived), t(T_HOME.partyArrivedText), '🎉');
  };

  return (
    <div className="col" style={{ gap: 18 }}>
      <section className="panel panel-ornate" style={{ overflow: 'hidden' }}>
        <div className="lang-row lang-row-float" title={t(T_COMMON.language)}>
          {LANGS.map((code) => (
            <button
              key={code}
              className={`lang-btn${lang === code ? ' active' : ''}`}
              onClick={() => updateSettings({ lang: code })}
            >
              {LANG_LABELS[code]}
            </button>
          ))}
        </div>
        <div className="row-wrap spread" style={{ alignItems: 'center', gap: 20 }}>
          <div style={{ maxWidth: 520, padding: '10px 0 10px 6px' }}>
            {editingName ? (
              <input
                autoFocus
                defaultValue={settings.campaignName}
                style={{ fontSize: 26, fontFamily: 'var(--font-display)', fontWeight: 700 }}
                onBlur={(e) => {
                  updateSettings({ campaignName: e.target.value.trim() || t(T_HOME.defaultCampaign) });
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
                title={t(T_HOME.renameHint)}
                onClick={() => setEditingName(true)}
              >
                {settings.campaignName} <span className="faint" style={{ fontSize: 18 }}>✎</span>
              </h1>
            )}
            <p className="muted" style={{ marginTop: 8, fontSize: 17 }}>
              {t(T_HOME.tagline)}
            </p>
            <div className="row-wrap" style={{ marginTop: 18 }}>
              {characters.length > 0 && (
                <button className="btn btn-primary btn-lg pulse-ready" onClick={() => setView('master')}>
                  {t(T_HOME.startGame)}
                </button>
              )}
              <button
                className={`btn ${characters.length > 0 ? 'btn-ghost' : 'btn-primary'} btn-lg`}
                onClick={() => {
                  setView('characters');
                  selectCharacter(undefined);
                }}
              >
                {t(T_HOME.heroesBtn)}
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => setView('dice')}>
                {t(T_HOME.diceBtn)}
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => setView('library')}>
                {t(T_HOME.howToPlay)}
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
          <h2 style={{ margin: '10px 0 6px' }}>{t(T_HOME.startAdventure)}</h2>
          <p className="muted" style={{ maxWidth: 480, margin: '0 auto 18px' }}>
            {t(T_HOME.firstHeroHint)}
          </p>
          <div className="row-wrap" style={{ justifyContent: 'center' }}>
            <button
              className="btn btn-primary btn-lg pulse-ready"
              onClick={() => {
                setView('characters');
              }}
            >
              {t(T_HOME.createFirstHero)}
            </button>
            <button className="btn btn-ghost btn-lg" onClick={addSample}>
              {t(T_HOME.addSampleParty)}
            </button>
          </div>
        </section>
      ) : (
        <section>
          <div className="section-title">{t(T_HOME.party, { n: characters.length })}</div>
          <div className="grid-cards">
            {characters.map((char) => {
              const stats = derive(char);
              const classDef = classesById[char.classId];
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
                        {classDef.name} {t(T_COMMON.levelOf, { n: char.level })} · {speciesById[char.speciesId].name}
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
          <div className="section-title">{t(T_HOME.quests)}</div>
          {quests.filter((q) => q.status === 'active').length === 0 ? (
            <div className="muted small">{t(T_HOME.noQuests)}</div>
          ) : (
            <div className="col" style={{ gap: 8 }}>
              {quests.filter((q) => q.status === 'active').slice(0, 4).map((q) => (
                <div key={q.id} className="row" style={{ gap: 10 }}>
                  <span style={{ fontSize: 18 }}>🗺️</span>
                  <div>
                    <div style={{ fontWeight: 700 }}>{q.title}</div>
                    {q.reward && <div className="small faint">{t(T_HOME.reward, { r: q.reward })}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="divider" />
          <div className="section-title">{t(T_HOME.recentEntries)}</div>
          {journal.length === 0 ? (
            <div className="muted small">{t(T_HOME.emptyJournal)}</div>
          ) : (
            <div className="col" style={{ gap: 10 }}>
              {journal.slice(0, 3).map((entry) => (
                <div key={entry.id}>
                  <div className="row" style={{ gap: 8 }}>
                    <span>{entry.kind === 'session' ? '📖' : entry.kind === 'event' ? '⚡' : '📝'}</span>
                    <span style={{ fontWeight: 700 }}>{entry.title}</span>
                    <span className="small faint">{new Date(entry.ts).toLocaleDateString(LANG_LOCALES[lang])}</span>
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
          <div className="section-title">{t(T_HOME.recentRolls)}</div>
          {rollLog.length === 0 ? (
            <div className="muted small">{t(T_HOME.noRolls)}</div>
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
