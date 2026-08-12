import { useMemo, useState } from 'react';
import type { Ability, Character } from '../../model/types';
import { useStore } from '../../store/store';
import type { AsiDecision } from '../../engine/levelup';
import { applyLevelUp, previewLevelUp } from '../../engine/levelup';
import { ABILITIES } from '../../data/core';
import { CLASSES_BY_ID } from '../../data/classes';
import { useCatalog } from '../../i18n/catalog';
import { useLang } from '../../i18n/lang';
import { useRules } from '../../i18n/rules';
import { useT } from '../../i18n/tr';
import { T_WIZARD } from '../../i18n/ui/wizard';
import { rollDie } from '../../engine/dice';
import { Modal } from '../../components/Modal';
import { fireConfetti } from '../../components/Confetti';
import { toast } from '../../components/Toasts';
import { sfx } from '../../audio/sound';

interface Props {
  character: Character;
  onClose: () => void;
}

type Phase = 'preview' | 'hp' | 'subclass' | 'asi' | 'style' | 'done';

export function LevelUpWizard({ character, onClose }: Props) {
  const updateCharacter = useStore((s) => s.updateCharacter);
  const lang = useLang();
  const t = useT();
  const { classesById, feats, featsById, fightingStyles } = useCatalog();
  const { abilityNames } = useRules();
  const preview = useMemo(() => previewLevelUp(character), [character, lang]);

  const [phase, setPhase] = useState<Phase>('preview');
  const [hpGain, setHpGain] = useState<number | null>(null);
  const [hpMode, setHpMode] = useState<'roll' | 'avg'>('avg');
  const [rolling, setRolling] = useState(false);
  const [subclassId, setSubclassId] = useState<string | null>(null);
  const [asiMode, setAsiMode] = useState<'asi' | 'asi2' | 'feat'>('asi');
  const [asiFirst, setAsiFirst] = useState<Ability>('str');
  const [asiSecond, setAsiSecond] = useState<Ability>('con');
  const [featId, setFeatId] = useState('tough');
  const [styleId, setStyleId] = useState('');
  const [summary, setSummary] = useState<string[]>([]);

  if (!preview) {
    return null;
  }

  const classDef = classesById[character.classId];
  // признак нового боевого стиля проверяем по русскому каталогу — в переводах имя другое
  const gainsStyle = CLASSES_BY_ID[character.classId].features
    .some((f) => f.level === preview.newLevel && f.name === 'Боевой стиль')
    && !character.fightingStyleId;

  const phaseOrder: Phase[] = [
    'preview',
    'hp',
    ...(preview.needsSubclass ? ['subclass' as Phase] : []),
    ...(preview.isAsi ? ['asi' as Phase] : []),
    ...(gainsStyle ? ['style' as Phase] : []),
  ];

  const goNextFrom = (current: Phase) => {
    const idx = phaseOrder.indexOf(current);
    const next = phaseOrder[idx + 1];
    if (next) {
      setPhase(next);
    } else {
      finish();
    }
  };

  const finish = () => {
    const asi: AsiDecision | undefined = preview.isAsi
      ? asiMode === 'asi'
        ? { kind: 'asi', first: asiFirst, second: asiSecond }
        : asiMode === 'asi2'
          ? { kind: 'asi2', first: asiFirst }
          : { kind: 'feat', featId }
      : undefined;

    let notes: string[] = [];
    updateCharacter(character.id, (c) => {
      const next = applyLevelUp(c, {
        hpGain: hpGain ?? preview.avgHp,
        hpMode,
        subclassId: subclassId ?? undefined,
        asi,
      });
      const styled = styleId ? { ...next, fightingStyleId: styleId } : next;
      notes = styled.levelLog[styled.levelLog.length - 1]?.notes ?? [];
      return styled;
    });
    setSummary(notes);
    setPhase('done');
    fireConfetti();
    sfx.levelUp();
    toast(t(T_WIZARD.levelUpToast, { n: preview.newLevel }), t(T_WIZARD.levelUpToastText, { name: character.name }), '🌟');
  };

  const doRollHp = () => {
    setRolling(true);
    sfx.dice();
    setTimeout(() => {
      const result = rollDie(preview.hitDie);
      setHpGain(result);
      setHpMode('roll');
      setRolling(false);
    }, 850);
  };

  return (
    <Modal
      title={phase === 'done' ? undefined : t(T_WIZARD.luTitle, { n: preview.newLevel })}
      onClose={onClose}
      wide
    >
      {phase === 'preview' && (
        <div className="col" style={{ gap: 14 }}>
          <div className="center">
            <div className="faint small" style={{ letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              {t(T_WIZARD.reachesLevel, { cls: classDef.name })}
            </div>
            <div className="levelup-number levelup-banner">{preview.newLevel}</div>
          </div>
          {preview.features.length + preview.subclassFeatures.length > 0 ? (
            <div className="panel" style={{ padding: 16 }}>
              <div className="section-title">{t(T_WIZARD.whatsNew)}</div>
              <div className="col" style={{ gap: 10 }}>
                {[...preview.features, ...preview.subclassFeatures].map((f, i) => (
                  <div key={i} className={`float-in float-in-${Math.min(4, i + 1)}`}>
                    <b className="gold">✦ {f.name}.</b>{' '}
                    <span className="muted small">{f.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="muted center small">{t(T_WIZARD.quietLevel)}</div>
          )}
          {preview.spellNotes.length > 0 && (
            <div className="panel" style={{ padding: 14 }}>
              {preview.spellNotes.map((note, i) => (
                <div key={i} className="small"><span className="gold">✨</span> <span className="muted">{note}</span></div>
              ))}
            </div>
          )}
          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <button className="btn btn-primary btn-lg" onClick={() => setPhase('hp')}>
              {t(T_WIZARD.forward)}
            </button>
          </div>
        </div>
      )}

      {phase === 'hp' && (
        <div className="col" style={{ gap: 16 }}>
          <div className="section-title">{t(T_WIZARD.newHp)}</div>
          <p className="muted small">
            {t(T_WIZARD.hpChoiceHint, { die: preview.hitDie, avg: preview.avgHp })}
          </p>
          <div className="row-wrap" style={{ gap: 14, justifyContent: 'center' }}>
            <button
              className={`panel card-clickable center ${hpMode === 'roll' && hpGain !== null ? 'panel-ornate' : ''}`}
              style={{ padding: 22, minWidth: 190 }}
              onClick={doRollHp}
            >
              <div className={rolling ? 'rolling' : ''} style={{ fontSize: 44 }}>🎲</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, marginTop: 6 }}>
                {t(T_WIZARD.rollHitDieBtn, { n: preview.hitDie })}
              </div>
              {hpMode === 'roll' && hpGain !== null && !rolling && (
                <div className="result-pop gold glow-gold" style={{ fontSize: 34, fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                  {hpGain}
                </div>
              )}
              <div className="small faint">{t(T_WIZARD.riskLuck)}</div>
            </button>
            <button
              className={`panel card-clickable center ${hpMode === 'avg' ? 'panel-ornate' : ''}`}
              style={{ padding: 22, minWidth: 190 }}
              onClick={() => {
                setHpMode('avg');
                setHpGain(preview.avgHp);
                sfx.click();
              }}
            >
              <div style={{ fontSize: 44 }}>⚖️</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, marginTop: 6 }}>
                {t(T_WIZARD.average, { n: preview.avgHp })}
              </div>
              <div className="small faint">{t(T_WIZARD.calmPath)}</div>
            </button>
          </div>
          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <button
              className="btn btn-primary"
              disabled={hpGain === null && hpMode !== 'avg'}
              onClick={() => {
                if (hpGain === null) {
                  setHpGain(preview.avgHp);
                }
                goNextFrom('hp');
              }}
            >
              {t(T_WIZARD.nextBtn)}
            </button>
          </div>
        </div>
      )}

      {phase === 'subclass' && (
        <div className="col" style={{ gap: 14 }}>
          <div className="section-title">{t(T_WIZARD.subclassTime, { label: classDef.subclassLabel })}</div>
          <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))' }}>
            {classDef.subclasses.map((sub) => (
              <div
                key={sub.id}
                className="panel card-clickable"
                style={{ outline: subclassId === sub.id ? '2px solid var(--gold)' : 'none' }}
                onClick={() => setSubclassId(sub.id)}
              >
                <b style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--parchment)' }}>{sub.name}</b>
                <div className="small muted" style={{ margin: '6px 0' }}>{sub.description}</div>
                {sub.features.filter((f) => f.level === preview.newLevel).map((f) => (
                  <div key={f.name} className="small">
                    <span className="gold">✦ {f.name}.</span> <span className="muted">{f.description}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" disabled={!subclassId} onClick={() => goNextFrom('subclass')}>
              {t(T_WIZARD.nextBtn)}
            </button>
          </div>
        </div>
      )}

      {phase === 'asi' && (
        <div className="col" style={{ gap: 14 }}>
          <div className="section-title">{t(T_WIZARD.heroGrowth)}</div>
          <div className="col" style={{ gap: 10 }}>
            <label className="row" style={{ gap: 8 }}>
              <input type="radio" checked={asiMode === 'asi'} onChange={() => setAsiMode('asi')} />
              <span>{t(T_WIZARD.asiPlusOneTwo)}</span>
            </label>
            {asiMode === 'asi' && (
              <div className="row-wrap" style={{ gap: 10, paddingLeft: 26 }}>
                <select value={asiFirst} onChange={(e) => setAsiFirst(e.target.value as Ability)}>
                  {ABILITIES.map((a) => (
                    <option key={a} value={a}>{abilityNames[a]} ({character.abilities[a]})</option>
                  ))}
                </select>
                <select value={asiSecond} onChange={(e) => setAsiSecond(e.target.value as Ability)}>
                  {ABILITIES.filter((a) => a !== asiFirst).map((a) => (
                    <option key={a} value={a}>{abilityNames[a]} ({character.abilities[a]})</option>
                  ))}
                </select>
              </div>
            )}
            <label className="row" style={{ gap: 8 }}>
              <input type="radio" checked={asiMode === 'asi2'} onChange={() => setAsiMode('asi2')} />
              <span>{t(T_WIZARD.asiPlusTwo)}</span>
            </label>
            {asiMode === 'asi2' && (
              <div style={{ paddingLeft: 26 }}>
                <select value={asiFirst} onChange={(e) => setAsiFirst(e.target.value as Ability)}>
                  {ABILITIES.map((a) => (
                    <option key={a} value={a}>{abilityNames[a]} ({character.abilities[a]})</option>
                  ))}
                </select>
              </div>
            )}
            <label className="row" style={{ gap: 8 }}>
              <input type="radio" checked={asiMode === 'feat'} onChange={() => setAsiMode('feat')} />
              <span>{t(T_WIZARD.asiFeat)}</span>
            </label>
            {asiMode === 'feat' && (
              <div className="col" style={{ gap: 8, paddingLeft: 26 }}>
                <select value={featId} onChange={(e) => setFeatId(e.target.value)}>
                  {feats.filter((f) => f.category !== 'fightingStyle' && f.id !== 'asi' && !character.featIds.includes(f.id)).map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
                <div className="small muted">{featsById[featId]?.description}</div>
              </div>
            )}
          </div>
          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" onClick={() => goNextFrom('asi')}>{t(T_WIZARD.nextBtn)}</button>
          </div>
        </div>
      )}

      {phase === 'style' && (
        <div className="col" style={{ gap: 14 }}>
          <div className="section-title">{t(T_WIZARD.newStyle)}</div>
          <div className="col" style={{ gap: 8 }}>
            {fightingStyles.map((f) => (
              <label key={f.id} className="row" style={{ gap: 8, alignItems: 'flex-start' }}>
                <input type="radio" checked={styleId === f.id} onChange={() => setStyleId(f.id)} style={{ marginTop: 4 }} />
                <span><b>{f.name}.</b> <span className="muted small">{f.description}</span></span>
              </label>
            ))}
          </div>
          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" disabled={!styleId} onClick={() => goNextFrom('style')}>
              {t(T_WIZARD.finishArrow)}
            </button>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="center col" style={{ gap: 14, padding: '10px 0' }}>
          <div className="levelup-banner">
            <div className="script gold" style={{ fontSize: 30 }}>{character.name}</div>
            <div className="levelup-number">{preview.newLevel}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--parchment)', letterSpacing: '0.1em' }}>
              {t(T_WIZARD.levelTaken)}
            </div>
          </div>
          <div className="panel" style={{ padding: 16, textAlign: 'left', maxWidth: 480, margin: '0 auto' }}>
            {summary.map((note, i) => (
              <div key={i} className={`small float-in float-in-${Math.min(4, i + 1)}`}>
                <span className="gold">◆</span> <span className="muted">{note}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-primary btn-lg" onClick={onClose}>
            {t(T_WIZARD.toAdventure)}
          </button>
        </div>
      )}
    </Modal>
  );
}
