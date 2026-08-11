import { useRef } from 'react';
import type { ReactElement } from 'react';
import { useStore } from '../store/store';
import type { ViewId } from '../store/store';
import { downloadBackup, importBackupFile } from '../store/backup';
import {
  BookIcon, CampfireIcon, CrownIcon, D20Icon, HeroIcon, ScrollIcon,
} from '../svg/icons';
import { sfx } from '../audio/sound';

const NAV: { id: ViewId; label: string; icon: (props: { size?: number; className?: string }) => ReactElement }[] = [
  { id: 'home', label: 'Главная', icon: CampfireIcon },
  { id: 'characters', label: 'Герои', icon: HeroIcon },
  { id: 'dice', label: 'Кубики', icon: D20Icon },
  { id: 'master', label: 'Мастер', icon: CrownIcon },
  { id: 'journal', label: 'Журнал', icon: BookIcon },
  { id: 'library', label: 'Справочник', icon: ScrollIcon },
];

export function Sidebar() {
  const view = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);
  const soundOn = useStore((s) => s.settings.soundOn);
  const updateSettings = useStore((s) => s.updateSettings);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <D20Icon size={34} className="gold" />
        <div>
          <div className="sidebar-brand-name">Летопись Героев</div>
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
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}

      <div className="grow" />

      <div className="sidebar-footer col" style={{ gap: 6 }}>
        <button
          className="nav-btn"
          onClick={() => updateSettings({ soundOn: !soundOn })}
          title="Звуки включаются и выключаются здесь"
        >
          <span style={{ fontSize: 19, width: 22, textAlign: 'center' }}>{soundOn ? '🔔' : '🔕'}</span>
          {soundOn ? 'Звук вкл.' : 'Звук выкл.'}
        </button>
        <button className="nav-btn" onClick={downloadBackup} title="Скачать резервную копию всех данных">
          <span style={{ fontSize: 19, width: 22, textAlign: 'center' }}>💾</span>
          Сохранить копию
        </button>
        <button
          className="nav-btn"
          onClick={() => fileRef.current?.click()}
          title="Загрузить данные из файла резервной копии"
        >
          <span style={{ fontSize: 19, width: 22, textAlign: 'center' }}>📂</span>
          Загрузить копию
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
