import { useRef } from 'react';
import type { ReactElement } from 'react';
import { useStore } from '../store/store';
import type { ViewId } from '../store/store';
import { downloadBackup, importBackupFile } from '../store/backup';
import { LANGS, LANG_LABELS, useLang } from '../i18n/lang';
import { useT } from '../i18n/tr';
import type { Tri } from '../i18n/tr';
import { T_COMMON } from '../i18n/ui/common';
import {
  BookIcon, CampfireIcon, CrownIcon, D20Icon, HeroIcon, ScrollIcon,
} from '../svg/icons';
import { sfx } from '../audio/sound';

const NAV: { id: ViewId; label: Tri; icon: (props: { size?: number; className?: string }) => ReactElement }[] = [
  { id: 'home', label: T_COMMON.navHome, icon: CampfireIcon },
  { id: 'characters', label: T_COMMON.navCharacters, icon: HeroIcon },
  { id: 'dice', label: T_COMMON.navDice, icon: D20Icon },
  { id: 'master', label: T_COMMON.navMaster, icon: CrownIcon },
  { id: 'journal', label: T_COMMON.navJournal, icon: BookIcon },
  { id: 'library', label: T_COMMON.navLibrary, icon: ScrollIcon },
];

export function Sidebar() {
  const view = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);
  const soundOn = useStore((s) => s.settings.soundOn);
  const updateSettings = useStore((s) => s.updateSettings);
  const lang = useLang();
  const t = useT();
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <D20Icon size={34} className="gold" />
        <div>
          <div className="sidebar-brand-name">{t(T_COMMON.brand)}</div>
          <div className="sidebar-brand-sub">D&D 2024</div>
        </div>
      </div>

      {NAV.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            className={`nav-btn${view === item.id ? ' active' : ''}`}
            onClick={() => {
              sfx.click();
              setView(item.id);
            }}
          >
            <Icon size={22} className="nav-icon" />
            <span className="nav-label">{t(item.label)}</span>
          </button>
        );
      })}

      <div className="grow" />

      <div className="sidebar-footer col" style={{ gap: 6 }}>
        <div className="lang-row" title={t(T_COMMON.language)}>
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
        <button
          className="nav-btn"
          onClick={() => updateSettings({ soundOn: !soundOn })}
          title={t(T_COMMON.soundHint)}
        >
          <span style={{ fontSize: 19, width: 22, textAlign: 'center' }}>{soundOn ? '🔔' : '🔕'}</span>
          {soundOn ? t(T_COMMON.soundOn) : t(T_COMMON.soundOff)}
        </button>
        <button className="nav-btn" onClick={downloadBackup} title={t(T_COMMON.saveBackupHint)}>
          <span style={{ fontSize: 19, width: 22, textAlign: 'center' }}>💾</span>
          {t(T_COMMON.saveBackup)}
        </button>
        <button
          className="nav-btn"
          onClick={() => fileRef.current?.click()}
          title={t(T_COMMON.loadBackupHint)}
        >
          <span style={{ fontSize: 19, width: 22, textAlign: 'center' }}>📂</span>
          {t(T_COMMON.loadBackup)}
        </button>
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
    </aside>
  );
}
