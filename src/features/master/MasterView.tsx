import { useRef, useState } from 'react';
import { useStore } from '../../store/store';
import { downloadBackup, importBackupFile } from '../../store/backup';
import { LANG_LOCALES, useLang } from '../../i18n/lang';
import { useT } from '../../i18n/tr';
import type { Tri } from '../../i18n/tr';
import { T_MASTER } from '../../i18n/ui/master';
import { T_COMMON } from '../../i18n/ui/common';
import { CombatTracker } from './CombatTracker';
import { BestiaryPanel } from './BestiaryPanel';
import { ChecksPanel } from './ChecksPanel';
import { LootPanel } from './LootPanel';
import { Modal } from '../../components/Modal';
import { NumberField } from '../../components/NumberField';
import { toast } from '../../components/Toasts';
import { sfx } from '../../audio/sound';

type MasterTab = 'combat' | 'bestiary' | 'checks' | 'loot' | 'settings';

export function MasterView() {
  const [tab, setTab] = useState<MasterTab>('combat');
  const combatCount = useStore((s) => s.combat.combatants.length);
  const t = useT();

  const tabs: { id: MasterTab; label: Tri; suffix?: string }[] = [
    { id: 'combat', label: T_MASTER.tabCombat, suffix: combatCount > 0 ? ` (${combatCount})` : '' },
    { id: 'bestiary', label: T_MASTER.tabBestiary },
    { id: 'checks', label: T_MASTER.tabChecks },
    { id: 'loot', label: T_MASTER.tabLoot },
    { id: 'settings', label: T_MASTER.tabSettings },
  ];

  return (
    <div className="col" style={{ gap: 16 }}>
      <h1 style={{ fontSize: 'clamp(26px, 6.5vw, 34px)' }}>{t(T_MASTER.title)}</h1>
      <div className="tab-row">
        {tabs.map((entry) => (
          <button key={entry.id} className={`tab-btn${tab === entry.id ? ' active' : ''}`} onClick={() => setTab(entry.id)}>
            {t(entry.label)}{entry.suffix ?? ''}
          </button>
        ))}
      </div>
      {tab === 'combat' && <CombatTracker />}
      {tab === 'bestiary' && <BestiaryPanel />}
      {tab === 'checks' && <ChecksPanel />}
      {tab === 'loot' && <LootPanel />}
      {tab === 'settings' && <CampaignSettings />}
    </div>
  );
}

function CampaignSettings() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const characters = useStore((s) => s.characters);
  const awardXp = useStore((s) => s.awardXp);
  const resetAll = useStore((s) => s.resetAll);
  const snapshots = useStore((s) => s.snapshots);
  const saveSnapshot = useStore((s) => s.saveSnapshot);
  const restoreSnapshot = useStore((s) => s.restoreSnapshot);
  const deleteSnapshot = useStore((s) => s.deleteSnapshot);
  const [xpAmount, setXpAmount] = useState(50);
  const [confirmReset, setConfirmReset] = useState(false);
  const [slotName, setSlotName] = useState('');
  const [restoring, setRestoring] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const lang = useLang();
  const t = useT();

  return (
    <div className="col" style={{ gap: 16 }}>
      <section className="panel panel-ornate">
        <div className="section-title">{t(T_MASTER.saveProgress)}</div>
        <p className="muted small" style={{ marginBottom: 12 }}>
          {t(T_MASTER.saveHint)}
        </p>
        <div className="row-wrap" style={{ gap: 8, marginBottom: 12 }}>
          <input
            style={{ flex: 1, minWidth: 200, maxWidth: 340 }}
            placeholder={t(T_MASTER.slotNamePh)}
            value={slotName}
            onChange={(e) => setSlotName(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              const fallback = t(T_MASTER.defaultSlotName, { date: new Date().toLocaleString(LANG_LOCALES[lang]) });
              saveSnapshot(slotName.trim() || fallback);
              setSlotName('');
              sfx.coin();
              toast(t(T_MASTER.snapshotSaved), t(T_MASTER.snapshotSavedText), '💾');
            }}
          >
            {t(T_MASTER.saveNow)}
          </button>
        </div>
        {snapshots.length === 0 ? (
          <div className="muted small">{t(T_MASTER.noSnapshots)}</div>
        ) : (
          <div className="col" style={{ gap: 8 }}>
            {snapshots.map((slot) => (
              <div key={slot.id} className="row-wrap spread" style={{ padding: '8px 12px', borderRadius: 9, background: 'rgba(0,0,0,0.22)' }}>
                <div>
                  <b style={{ color: 'var(--parchment)' }}>💾 {slot.name}</b>
                  <div className="small faint">
                    {new Date(slot.ts).toLocaleString(LANG_LOCALES[lang])} · {t(T_MASTER.heroesCount, { n: slot.charactersCount })}
                  </div>
                </div>
                <div className="row" style={{ gap: 6 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setRestoring(slot.id)}>{t(T_MASTER.loadBtn)}</button>
                  <button className="icon-btn" title={t(T_MASTER.deleteSlot)} onClick={() => deleteSnapshot(slot.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="divider" />
        <p className="muted small" style={{ marginBottom: 10 }}>
          {t(T_MASTER.fileCopyHint)}
        </p>
        <div className="row-wrap" style={{ gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={downloadBackup}>{t(T_MASTER.downloadFile)}</button>
          <button className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()}>{t(T_MASTER.loadFromFile)}</button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                importBackupFile(file);
              }
              e.target.value = '';
            }}
          />
        </div>
      </section>

      <section className="panel">
        <div className="section-title">{t(T_MASTER.campaignRules)}</div>
        <div className="col" style={{ gap: 10 }}>
          <label className="row-wrap" style={{ gap: 10 }}>
            <span className="muted small" style={{ width: 150 }}>{t(T_MASTER.campaignName)}</span>
            <input
              className="grow"
              style={{ maxWidth: 340, minWidth: 180 }}
              value={settings.campaignName}
              onChange={(e) => updateSettings({ campaignName: e.target.value })}
            />
          </label>
          <div className="row-wrap" style={{ gap: 10 }}>
            <span className="muted small" style={{ width: 150 }}>{t(T_MASTER.heroGrowthLabel)}</span>
            <label className="row" style={{ gap: 6 }}>
              <input type="radio" checked={settings.xpMode === 'xp'} onChange={() => updateSettings({ xpMode: 'xp' })} />
              {t(T_MASTER.byXp)}
            </label>
            <label className="row" style={{ gap: 6 }}>
              <input type="radio" checked={settings.xpMode === 'milestone'} onChange={() => updateSettings({ xpMode: 'milestone' })} />
              {t(T_MASTER.byMilestone)}
            </label>
          </div>
          <div className="row-wrap" style={{ gap: 10 }}>
            <span className="muted small" style={{ width: 150 }}>{t(T_MASTER.sounds)}</span>
            <label className="row" style={{ gap: 6 }}>
              <input
                type="checkbox"
                checked={settings.soundOn}
                onChange={(e) => updateSettings({ soundOn: e.target.checked })}
              />
              {settings.soundOn ? t(T_MASTER.soundsOn) : t(T_MASTER.soundsOff)}
            </label>
          </div>
          <div className="row-wrap" style={{ gap: 10 }}>
            <span className="muted small" style={{ width: 150 }}>{t(T_COMMON.language)}</span>
            <div className="lang-row" style={{ width: 180 }}>
              {(['ru', 'uk', 'en'] as const).map((code) => (
                <button
                  key={code}
                  className={`lang-btn${settings.lang === code ? ' active' : ''}`}
                  onClick={() => updateSettings({ lang: code })}
                >
                  {code === 'ru' ? 'Рус' : code === 'uk' ? 'Укр' : 'Eng'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {settings.xpMode === 'xp' && (
        <section className="panel">
          <div className="section-title">{t(T_MASTER.awardXpTitle)}</div>
          <div className="row-wrap" style={{ gap: 8 }}>
            <NumberField value={xpAmount} onChange={setXpAmount} min={1} width={70} />
            <button
              className="btn btn-primary btn-sm"
              disabled={characters.length === 0}
              onClick={() => {
                awardXp(characters.map((c) => c.id), xpAmount);
                sfx.coin();
                toast(t(T_MASTER.xpAwarded), t(T_MASTER.xpAwardedText, { n: xpAmount }), '⭐');
              }}
            >
              {t(T_MASTER.awardEach)}
            </button>
            {[25, 50, 100, 300].map((v) => (
              <button key={v} className="chip chip-clickable" onClick={() => setXpAmount(v)}>{v}</button>
            ))}
          </div>
        </section>
      )}

      <section className="panel" style={{ borderColor: 'rgba(226,84,67,0.35)' }}>
        <div className="section-title" style={{ color: 'var(--danger)' }}>{t(T_MASTER.dangerZone)}</div>
        <p className="muted small" style={{ marginBottom: 10 }}>
          {t(T_MASTER.dangerHint)}
        </p>
        <button className="btn btn-danger btn-sm" onClick={() => setConfirmReset(true)}>
          {t(T_MASTER.eraseAll)}
        </button>
      </section>

      {confirmReset && (
        <Modal title={t(T_MASTER.eraseConfirmTitle)} onClose={() => setConfirmReset(false)}>
          <p className="muted" style={{ marginBottom: 16 }}>
            {t(T_MASTER.eraseConfirmText)}
          </p>
          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost" onClick={() => setConfirmReset(false)}>{t(T_COMMON.cancel)}</button>
            <button
              className="btn btn-danger"
              onClick={() => {
                resetAll();
                setConfirmReset(false);
                toast(t(T_MASTER.chronicleClean), t(T_MASTER.allErased), '🕯️');
              }}
            >
              {t(T_MASTER.eraseForever)}
            </button>
          </div>
        </Modal>
      )}

      {restoring && (
        <Modal title={t(T_MASTER.restoreTitle)} onClose={() => setRestoring(null)}>
          <p className="muted" style={{ marginBottom: 16 }}>
            {t(T_MASTER.restoreText, { name: snapshots.find((s) => s.id === restoring)?.name ?? '' })}
          </p>
          <div className="row" style={{ justifyContent: 'flex-end', gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => setRestoring(null)}>{t(T_COMMON.cancel)}</button>
            <button
              className="btn btn-primary"
              onClick={() => {
                const ok = restoreSnapshot(restoring);
                setRestoring(null);
                if (ok) {
                  sfx.levelUp();
                  toast(t(T_MASTER.restored), t(T_MASTER.restoredText), '↩️');
                } else {
                  toast(t(T_MASTER.oops), t(T_MASTER.slotBroken), '⚠️');
                }
              }}
            >
              {t(T_MASTER.loadBtn)}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
