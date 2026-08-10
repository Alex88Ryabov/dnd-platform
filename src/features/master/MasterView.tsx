import { useState } from 'react';
import { useStore } from '../../store/store';
import { CombatTracker } from './CombatTracker';
import { BestiaryPanel } from './BestiaryPanel';
import { ChecksPanel } from './ChecksPanel';
import { LootPanel } from './LootPanel';
import { Modal } from '../../components/Modal';
import { toast } from '../../components/Toasts';
import { sfx } from '../../audio/sound';

type MasterTab = 'combat' | 'bestiary' | 'checks' | 'loot' | 'settings';

export function MasterView() {
  const [tab, setTab] = useState<MasterTab>('combat');
  const combatCount = useStore((s) => s.combat.combatants.length);

  const tabs: { id: MasterTab; label: string }[] = [
    { id: 'combat', label: `⚔️ Бой${combatCount > 0 ? ` (${combatCount})` : ''}` },
    { id: 'bestiary', label: '🐉 Бестиарий' },
    { id: 'checks', label: '🎯 Проверки' },
    { id: 'loot', label: '💰 Сокровища' },
    { id: 'settings', label: '⚙️ Кампания' },
  ];

  return (
    <div className="col" style={{ gap: 16 }}>
      <h1 style={{ fontSize: 34 }}>Экран мастера</h1>
      <div className="tab-row">
        {tabs.map((t) => (
          <button key={t.id} className={`tab-btn${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
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

  return (
    <div className="col" style={{ gap: 16 }}>
      <section className="panel panel-ornate">
        <div className="section-title">Сохранение прогресса</div>
        <p className="muted small" style={{ marginBottom: 12 }}>
          Игра сохраняется автоматически после каждого действия. Слоты ниже — контрольные точки:
          сохранитесь перед опасным подземельем и вернитесь, если что-то пойдёт не так.
          Кнопка «Сохранить копию» слева внизу дополнительно скачивает всё в файл.
        </p>
        <div className="row-wrap" style={{ gap: 8, marginBottom: 12 }}>
          <input
            style={{ flex: 1, minWidth: 200, maxWidth: 340 }}
            placeholder="Название (например: Перед логовом дракона)"
            value={slotName}
            onChange={(e) => setSlotName(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              saveSnapshot(slotName);
              setSlotName('');
              sfx.coin();
              toast('Точка сохранения создана', 'Прогресс можно вернуть в любой момент', '💾');
            }}
          >
            💾 Сохранить сейчас
          </button>
        </div>
        {snapshots.length === 0 ? (
          <div className="muted small">Пока нет ни одной контрольной точки.</div>
        ) : (
          <div className="col" style={{ gap: 8 }}>
            {snapshots.map((slot) => (
              <div key={slot.id} className="row spread" style={{ padding: '8px 12px', borderRadius: 9, background: 'rgba(0,0,0,0.22)' }}>
                <div>
                  <b style={{ color: 'var(--parchment)' }}>💾 {slot.name}</b>
                  <div className="small faint">
                    {new Date(slot.ts).toLocaleString('ru')} · героев: {slot.charactersCount}
                  </div>
                </div>
                <div className="row" style={{ gap: 6 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setRestoring(slot.id)}>↩️ Загрузить</button>
                  <button className="icon-btn" title="Удалить слот" onClick={() => deleteSnapshot(slot.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <div className="section-title">Правила кампании</div>
        <div className="col" style={{ gap: 10 }}>
          <label className="row" style={{ gap: 10 }}>
            <span className="muted small" style={{ width: 150 }}>Название кампании</span>
            <input
              className="grow"
              style={{ maxWidth: 340 }}
              value={settings.campaignName}
              onChange={(e) => updateSettings({ campaignName: e.target.value })}
            />
          </label>
          <div className="row" style={{ gap: 10 }}>
            <span className="muted small" style={{ width: 150 }}>Развитие героев</span>
            <label className="row" style={{ gap: 6 }}>
              <input type="radio" checked={settings.xpMode === 'xp'} onChange={() => updateSettings({ xpMode: 'xp' })} />
              по опыту (XP)
            </label>
            <label className="row" style={{ gap: 6 }}>
              <input type="radio" checked={settings.xpMode === 'milestone'} onChange={() => updateSettings({ xpMode: 'milestone' })} />
              по вехам истории
            </label>
          </div>
        </div>
      </section>

      {settings.xpMode === 'xp' && (
        <section className="panel">
          <div className="section-title">Выдать опыт всей партии</div>
          <div className="row-wrap" style={{ gap: 8 }}>
            <input
              className="num-input"
              style={{ width: 100 }}
              type="number"
              min={1}
              value={xpAmount}
              onChange={(e) => setXpAmount(Math.max(1, Number(e.target.value) || 1))}
            />
            <button
              className="btn btn-primary btn-sm"
              disabled={characters.length === 0}
              onClick={() => {
                awardXp(characters.map((c) => c.id), xpAmount);
                sfx.coin();
                toast('Опыт выдан', `Каждый герой получает ${xpAmount} XP`, '⭐');
              }}
            >
              ⭐ Выдать каждому
            </button>
            {[25, 50, 100, 300].map((v) => (
              <button key={v} className="chip chip-clickable" onClick={() => setXpAmount(v)}>{v}</button>
            ))}
          </div>
        </section>
      )}

      <section className="panel" style={{ borderColor: 'rgba(226,84,67,0.35)' }}>
        <div className="section-title" style={{ color: 'var(--danger)' }}>Опасная зона</div>
        <p className="muted small" style={{ marginBottom: 10 }}>
          Данные живут в этом браузере. Перед большими переменами сохраните копию
          (кнопка «Сохранить копию» слева внизу).
        </p>
        <button className="btn btn-danger btn-sm" onClick={() => setConfirmReset(true)}>
          🗑️ Стереть все данные
        </button>
      </section>

      {confirmReset && (
        <Modal title="Точно стереть всё?" onClose={() => setConfirmReset(false)}>
          <p className="muted" style={{ marginBottom: 16 }}>
            Исчезнут все герои, журнал, бой и история бросков. Верните их потом только из сохранённой копии.
          </p>
          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost" onClick={() => setConfirmReset(false)}>Отмена</button>
            <button
              className="btn btn-danger"
              onClick={() => {
                resetAll();
                setConfirmReset(false);
                toast('Летопись чиста', 'Все данные стёрты', '🕯️');
              }}
            >
              Стереть навсегда
            </button>
          </div>
        </Modal>
      )}

      {restoring && (
        <Modal title="Загрузить сохранение?" onClose={() => setRestoring(null)}>
          <p className="muted" style={{ marginBottom: 16 }}>
            Текущее состояние игры будет заменено данными из контрольной точки
            «{snapshots.find((s) => s.id === restoring)?.name}». Если текущий прогресс дорог —
            сначала сохраните его в новый слот.
          </p>
          <div className="row" style={{ justifyContent: 'flex-end', gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => setRestoring(null)}>Отмена</button>
            <button
              className="btn btn-primary"
              onClick={() => {
                const ok = restoreSnapshot(restoring);
                setRestoring(null);
                if (ok) {
                  sfx.levelUp();
                  toast('Сохранение загружено', 'Игра вернулась к контрольной точке', '↩️');
                } else {
                  toast('Не получилось', 'Слот повреждён', '⚠️');
                }
              }}
            >
              ↩️ Загрузить
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
