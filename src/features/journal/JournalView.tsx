import { useState } from 'react';
import type { JournalEntry, NpcNote, Quest } from '../../model/types';
import { useStore } from '../../store/store';
import { toast } from '../../components/Toasts';

type JournalTab = 'entries' | 'quests' | 'npcs' | 'places' | 'reviews';

const ENTRY_KINDS: { id: JournalEntry['kind']; label: string; icon: string }[] = [
  { id: 'session', label: 'Игровая встреча', icon: '📖' },
  { id: 'event', label: 'Событие', icon: '⚡' },
  { id: 'note', label: 'Заметка', icon: '📝' },
];

const ATTITUDES: { id: NpcNote['attitude']; label: string; icon: string }[] = [
  { id: 'friend', label: 'Друг', icon: '💚' },
  { id: 'neutral', label: 'Нейтрален', icon: '💛' },
  { id: 'enemy', label: 'Враг', icon: '❤️‍🔥' },
];

export function JournalView() {
  const [tab, setTab] = useState<JournalTab>('entries');

  const tabs: { id: JournalTab; label: string }[] = [
    { id: 'entries', label: '📖 Записи' },
    { id: 'quests', label: '🗺️ Задания' },
    { id: 'npcs', label: '🧙 Персонажи мира' },
    { id: 'places', label: '🏰 Места' },
    { id: 'reviews', label: '⭐ Отзывы игроков' },
  ];

  return (
    <div className="col" style={{ gap: 16 }}>
      <h1 style={{ fontSize: 'clamp(26px, 6.5vw, 34px)' }}>Журнал кампании</h1>
      <div className="tab-row">
        {tabs.map((t) => (
          <button key={t.id} className={`tab-btn${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'entries' && <EntriesTab />}
      {tab === 'quests' && <QuestsTab />}
      {tab === 'npcs' && <NpcsTab />}
      {tab === 'places' && <PlacesTab />}
      {tab === 'reviews' && <ReviewsTab />}
    </div>
  );
}

function Stars({ value, onChange, size = 26 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  return (
    <div className="row" style={{ gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          style={{
            fontSize: size,
            cursor: onChange ? 'pointer' : 'default',
            filter: n <= value ? 'none' : 'grayscale(1) opacity(0.35)',
            transition: 'transform .12s',
          }}
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          onMouseEnter={(e) => {
            if (onChange) {
              (e.target as HTMLElement).style.transform = 'scale(1.25)';
            }
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.transform = 'none';
          }}
        >
          ⭐
        </button>
      ))}
    </div>
  );
}

function ReviewsTab() {
  const reviews = useStore((s) => s.reviews);
  const addReview = useStore((s) => s.addReview);
  const deleteReview = useStore((s) => s.deleteReview);
  const characters = useStore((s) => s.characters);

  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');

  const average = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const playerNames = [...new Set(characters.map((c) => c.playerName).filter(Boolean))];

  return (
    <div className="col" style={{ gap: 16 }}>
      <section className="panel panel-ornate">
        <div className="section-title">Как прошла игра?</div>
        <div className="col" style={{ gap: 10 }}>
          <div className="row-wrap" style={{ gap: 8 }}>
            <input
              placeholder="Кто оставляет отзыв (имя игрока)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              style={{ flex: 1, minWidth: 180, maxWidth: 300 }}
              list="review-authors"
            />
            <datalist id="review-authors">
              {playerNames.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
            <Stars value={rating} onChange={setRating} />
          </div>
          <textarea
            rows={2}
            placeholder="Что понравилось больше всего? Что было самым смешным или страшным?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div>
            <button
              className="btn btn-primary"
              disabled={!author.trim() && !text.trim()}
              onClick={() => {
                addReview({ author: author.trim() || 'Игрок', rating, text: text.trim() });
                setText('');
                toast('Отзыв записан!', 'Спасибо за впечатления', '⭐');
              }}
            >
              ⭐ Оставить отзыв
            </button>
          </div>
        </div>
      </section>

      {average && (
        <div className="row" style={{ gap: 10 }}>
          <span className="chip chip-active" style={{ fontSize: 15 }}>
            Средняя оценка кампании: {average} ⭐ · отзывов: {reviews.length}
          </span>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="empty-state panel">
          <span className="big-icon">⭐</span>
          После игры каждый может оставить отзыв — а через год будет интересно перечитать!
        </div>
      ) : (
        <div className="col" style={{ gap: 10 }}>
          {reviews.map((review) => (
            <section key={review.id} className="panel">
              <div className="row spread">
                <div className="row-wrap" style={{ gap: 10 }}>
                  <b className="script gold" style={{ fontSize: 19 }}>{review.author}</b>
                  <Stars value={review.rating} size={16} />
                  <span className="small faint">{new Date(review.ts).toLocaleDateString('ru')}</span>
                </div>
                <button className="icon-btn" onClick={() => deleteReview(review.id)}>🗑️</button>
              </div>
              {review.text && <div className="muted" style={{ marginTop: 6 }}>{review.text}</div>}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function EntriesTab() {
  const journal = useStore((s) => s.journal);
  const addJournalEntry = useStore((s) => s.addJournalEntry);
  const updateJournalEntry = useStore((s) => s.updateJournalEntry);
  const deleteJournalEntry = useStore((s) => s.deleteJournalEntry);

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [kind, setKind] = useState<JournalEntry['kind']>('session');

  const add = () => {
    if (!title.trim() && !text.trim()) {
      return;
    }
    addJournalEntry({ title: title.trim() || 'Без названия', text: text.trim(), kind });
    setTitle('');
    setText('');
    toast('Записано в летопись', undefined, '🪶');
  };

  return (
    <div className="col" style={{ gap: 16 }}>
      <section className="panel">
        <div className="section-title">Новая запись</div>
        <div className="col" style={{ gap: 10 }}>
          <div className="row-wrap" style={{ gap: 8 }}>
            {ENTRY_KINDS.map((k) => (
              <button
                key={k.id}
                className={`chip chip-clickable${kind === k.id ? ' chip-active' : ''}`}
                onClick={() => setKind(k.id)}
              >
                {k.icon} {k.label}
              </button>
            ))}
          </div>
          <input placeholder="Заголовок (например: Победа над гоблинами моста)" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea
            rows={4}
            placeholder="Что случилось в этот раз? Кого встретили, что нашли, над чем смеялись…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div>
            <button className="btn btn-primary" onClick={add}>🪶 Записать</button>
          </div>
        </div>
      </section>

      {journal.length === 0 ? (
        <div className="empty-state panel">
          <span className="big-icon">📜</span>
          Летопись пуста — самое время вписать первую главу!
        </div>
      ) : (
        <div className="col" style={{ gap: 12 }}>
          {journal.map((entry) => {
            const kindDef = ENTRY_KINDS.find((k) => k.id === entry.kind);
            return (
              <section key={entry.id} className="panel">
                <div className="row spread" style={{ alignItems: 'flex-start' }}>
                  <div className="row-wrap" style={{ gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{kindDef?.icon}</span>
                    <b style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--parchment)' }}>{entry.title}</b>
                    <span className="small faint">
                      {new Date(entry.ts).toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <button className="icon-btn" onClick={() => deleteJournalEntry(entry.id)}>🗑️</button>
                </div>
                <textarea
                  className="grow"
                  style={{ width: '100%', marginTop: 8, background: 'transparent', border: '1px solid transparent' }}
                  rows={Math.max(2, Math.min(9, entry.text.split('\n').length))}
                  defaultValue={entry.text}
                  onBlur={(e) => {
                    if (e.target.value !== entry.text) {
                      updateJournalEntry(entry.id, { text: e.target.value });
                    }
                  }}
                />
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function QuestsTab() {
  const quests = useStore((s) => s.quests);
  const addQuest = useStore((s) => s.addQuest);
  const updateQuest = useStore((s) => s.updateQuest);
  const deleteQuest = useStore((s) => s.deleteQuest);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('');

  const statusInfo: Record<Quest['status'], { label: string; color: string; icon: string }> = {
    active: { label: 'В работе', color: 'var(--gold-bright)', icon: '🗺️' },
    done: { label: 'Выполнено', color: 'var(--success)', icon: '🏆' },
    failed: { label: 'Провалено', color: 'var(--danger)', icon: '💨' },
  };

  return (
    <div className="col" style={{ gap: 16 }}>
      <section className="panel">
        <div className="section-title">Новое задание</div>
        <div className="col" style={{ gap: 10 }}>
          <input placeholder="Название (например: Найти пропавшего кота старосты)" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea rows={2} placeholder="Подробности задания" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="row-wrap" style={{ gap: 8 }}>
            <input placeholder="Награда (например: 50 зм и пирог)" value={reward} onChange={(e) => setReward(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
            <button
              className="btn btn-primary"
              disabled={!title.trim()}
              onClick={() => {
                addQuest({ title: title.trim(), description: description.trim(), status: 'active', reward: reward.trim() || undefined });
                setTitle('');
                setDescription('');
                setReward('');
                toast('Задание добавлено', undefined, '🗺️');
              }}
            >
              + Добавить
            </button>
          </div>
        </div>
      </section>

      {quests.length === 0 ? (
        <div className="empty-state panel">
          <span className="big-icon">🗺️</span>
          Заданий пока нет.
        </div>
      ) : (
        <div className="col" style={{ gap: 10 }}>
          {quests.map((quest) => {
            const info = statusInfo[quest.status];
            return (
              <section key={quest.id} className="panel" style={{ opacity: quest.status === 'active' ? 1 : 0.75 }}>
                <div className="row-wrap spread" style={{ gap: 8 }}>
                  <div className="row" style={{ gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{info.icon}</span>
                    <b style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: info.color, textDecoration: quest.status !== 'active' ? 'line-through' : 'none' }}>
                      {quest.title}
                    </b>
                  </div>
                  <div className="row-wrap" style={{ gap: 6 }}>
                    {(Object.keys(statusInfo) as Quest['status'][]).map((s) => (
                      <button
                        key={s}
                        className={`chip chip-clickable${quest.status === s ? ' chip-active' : ''}`}
                        onClick={() => updateQuest(quest.id, { status: s })}
                      >
                        {statusInfo[s].label}
                      </button>
                    ))}
                    <button className="icon-btn" onClick={() => deleteQuest(quest.id)}>🗑️</button>
                  </div>
                </div>
                {quest.description && <div className="muted small" style={{ marginTop: 6 }}>{quest.description}</div>}
                {quest.reward && <div className="small" style={{ marginTop: 4 }}><span className="gold">Награда:</span> <span className="muted">{quest.reward}</span></div>}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function NpcsTab() {
  const npcs = useStore((s) => s.npcs);
  const addNpc = useStore((s) => s.addNpc);
  const updateNpc = useStore((s) => s.updateNpc);
  const deleteNpc = useStore((s) => s.deleteNpc);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="col" style={{ gap: 16 }}>
      <section className="panel">
        <div className="section-title">Новый житель мира</div>
        <div className="row-wrap" style={{ gap: 8 }}>
          <input placeholder="Имя (например: Трактирщик Борин)" value={name} onChange={(e) => setName(e.target.value)} style={{ width: 240 }} />
          <input placeholder="Кто это и чем запомнился" value={description} onChange={(e) => setDescription(e.target.value)} style={{ flex: 1, minWidth: 220 }} />
          <button
            className="btn btn-primary"
            disabled={!name.trim()}
            onClick={() => {
              addNpc({ name: name.trim(), description: description.trim(), attitude: 'neutral' });
              setName('');
              setDescription('');
            }}
          >
            + Добавить
          </button>
        </div>
      </section>

      {npcs.length === 0 ? (
        <div className="empty-state panel">
          <span className="big-icon">🧙</span>
          Здесь будут жить все встреченные персонажи мира.
        </div>
      ) : (
        <div className="grid-cards">
          {npcs.map((npc) => (
            <section key={npc.id} className="panel">
              <div className="row spread">
                <b style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--parchment)' }}>{npc.name}</b>
                <button className="icon-btn" onClick={() => deleteNpc(npc.id)}>🗑️</button>
              </div>
              <div className="row" style={{ gap: 5, margin: '6px 0' }}>
                {ATTITUDES.map((a) => (
                  <button
                    key={a.id}
                    className={`chip chip-clickable${npc.attitude === a.id ? ' chip-active' : ''}`}
                    onClick={() => updateNpc(npc.id, { attitude: a.id })}
                  >
                    {a.icon} {a.label}
                  </button>
                ))}
              </div>
              <textarea
                style={{ width: '100%', background: 'transparent', border: '1px solid transparent' }}
                rows={2}
                defaultValue={npc.description}
                placeholder="Заметки…"
                onBlur={(e) => updateNpc(npc.id, { description: e.target.value })}
              />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function PlacesTab() {
  const places = useStore((s) => s.places);
  const addPlace = useStore((s) => s.addPlace);
  const updatePlace = useStore((s) => s.updatePlace);
  const deletePlace = useStore((s) => s.deletePlace);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="col" style={{ gap: 16 }}>
      <section className="panel">
        <div className="section-title">Новое место</div>
        <div className="row-wrap" style={{ gap: 8 }}>
          <input placeholder="Название (например: Деревня Тихие Холмы)" value={name} onChange={(e) => setName(e.target.value)} style={{ width: 260 }} />
          <input placeholder="Чем известно это место" value={description} onChange={(e) => setDescription(e.target.value)} style={{ flex: 1, minWidth: 220 }} />
          <button
            className="btn btn-primary"
            disabled={!name.trim()}
            onClick={() => {
              addPlace({ name: name.trim(), description: description.trim() });
              setName('');
              setDescription('');
            }}
          >
            + Добавить
          </button>
        </div>
      </section>

      {places.length === 0 ? (
        <div className="empty-state panel">
          <span className="big-icon">🏰</span>
          Карта мира ждёт первых открытий.
        </div>
      ) : (
        <div className="grid-cards">
          {places.map((place) => (
            <section key={place.id} className="panel">
              <div className="row spread">
                <b style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--parchment)' }}>🏰 {place.name}</b>
                <button className="icon-btn" onClick={() => deletePlace(place.id)}>🗑️</button>
              </div>
              <textarea
                style={{ width: '100%', marginTop: 6, background: 'transparent', border: '1px solid transparent' }}
                rows={2}
                defaultValue={place.description}
                placeholder="Заметки…"
                onBlur={(e) => updatePlace(place.id, { description: e.target.value })}
              />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
