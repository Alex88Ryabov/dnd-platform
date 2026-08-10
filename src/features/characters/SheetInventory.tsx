import { useMemo, useState } from 'react';
import type { Character, InventoryItem, ItemKind, Money } from '../../model/types';
import type { DerivedStats } from '../../engine/derive';
import { ITEMS_BY_ID, itemName, resolveItem } from '../../engine/derive';
import { ITEMS } from '../../data/equipment';
import { RARITY_INFO } from '../../data/core';
import { useStore } from '../../store/store';
import { uid } from '../../engine/dice';
import { formulaRoll } from '../../engine/rolling';
import { toast } from '../../components/Toasts';
import { sfx } from '../../audio/sound';
import { Modal } from '../../components/Modal';

interface Props {
  character: Character;
  stats: DerivedStats;
}

const COIN_LABELS: { key: keyof Money; label: string; color: string }[] = [
  { key: 'pp', label: 'ПМ', color: '#c8d5e8' },
  { key: 'gp', label: 'ЗМ', color: '#f0c96c' },
  { key: 'ep', label: 'ЭМ', color: '#b8d0b0' },
  { key: 'sp', label: 'СМ', color: '#c0c0c8' },
  { key: 'cp', label: 'ММ', color: '#cb8a5a' },
];

const KIND_LABELS: Record<ItemKind, string> = {
  weapon: 'Оружие',
  armor: 'Доспех',
  shield: 'Щит',
  gear: 'Снаряжение',
  tool: 'Инструмент',
  consumable: 'Расходник',
  treasure: 'Сокровище',
  magic: 'Магический',
};

export function SheetInventory({ character, stats }: Props) {
  const updateCharacter = useStore((s) => s.updateCharacter);
  const [search, setSearch] = useState('');
  const [addingCustom, setAddingCustom] = useState(false);

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q.length < 2) {
      return [];
    }
    return ITEMS.filter((i) => i.name.toLowerCase().includes(q) || i.nameEn.toLowerCase().includes(q)).slice(0, 12);
  }, [search]);

  const addItem = (itemId: string) => {
    updateCharacter(character.id, (c) => {
      const existing = c.inventory.find((e) => e.itemId === itemId && !e.equipped);
      if (existing) {
        return {
          ...c,
          inventory: c.inventory.map((e) => (e.uid === existing.uid ? { ...e, qty: e.qty + 1 } : e)),
        };
      }
      return {
        ...c,
        inventory: [...c.inventory, { uid: uid(), itemId, qty: 1, equipped: false }],
      };
    });
    sfx.coin();
    setSearch('');
    toast('Добавлено в рюкзак', ITEMS_BY_ID[itemId]?.name, '🎒');
  };

  const patchEntry = (entryUid: string, patch: Partial<InventoryItem>) => {
    updateCharacter(character.id, (c) => ({
      ...c,
      inventory: c.inventory.map((e) => (e.uid === entryUid ? { ...e, ...patch } : e)),
    }));
  };

  const removeEntry = (entryUid: string) => {
    updateCharacter(character.id, (c) => ({
      ...c,
      inventory: c.inventory.filter((e) => e.uid !== entryUid),
    }));
  };

  const drink = (entry: InventoryItem) => {
    const item = resolveItem(entry);
    if (!item?.healing) {
      return;
    }
    const result = formulaRoll({ label: `Выпито: ${item.name}`, formula: item.healing, who: character.name });
    if (result) {
      updateCharacter(character.id, (c) => ({
        ...c,
        hpCurrent: Math.min(stats.hpMax, c.hpCurrent + result.total),
      }));
    }
    if (entry.qty > 1) {
      patchEntry(entry.uid, { qty: entry.qty - 1 });
    } else {
      removeEntry(entry.uid);
    }
  };

  const setCoin = (key: keyof Money, value: number) => {
    updateCharacter(character.id, (c) => ({
      ...c,
      money: { ...c.money, [key]: Math.max(0, value) },
    }));
  };

  const sorted = [...character.inventory].sort((a, b) => {
    const ea = resolveItem(a);
    const eb = resolveItem(b);
    const ka = a.equipped ? 0 : 1;
    const kb = b.equipped ? 0 : 1;
    if (ka !== kb) {
      return ka - kb;
    }
    return itemName(a).localeCompare(itemName(b), 'ru') || (ea?.id ?? '').localeCompare(eb?.id ?? '');
  });

  return (
    <div className="col" style={{ gap: 16 }}>
      <section className="panel">
        <div className="section-title">Кошелёк</div>
        <div className="row-wrap" style={{ gap: 12 }}>
          {COIN_LABELS.map(({ key, label, color }) => (
            <label key={key} className="row" style={{ gap: 6 }}>
              <span style={{
                width: 26, height: 26, borderRadius: '50%', display: 'inline-flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 10.5, fontWeight: 700,
                background: `radial-gradient(circle at 35% 30%, ${color}, ${color}55)`,
                color: '#241a08', border: '1px solid rgba(255,255,255,0.3)',
              }}
              >
                {label}
              </span>
              <input
                className="num-input"
                type="number"
                min={0}
                value={character.money[key]}
                onChange={(e) => setCoin(key, Number(e.target.value) || 0)}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-title">Рюкзак и экипировка</div>
        <div className="row-wrap" style={{ gap: 8, marginBottom: 12, position: 'relative' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <input
              style={{ width: '100%' }}
              placeholder="🔍 Найти предмет в каталоге (например: меч, зелье, верёвка)…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div
                className="panel"
                style={{
                  position: 'absolute', top: '105%', left: 0, right: 0, zIndex: 30,
                  maxHeight: 280, overflowY: 'auto', padding: 8,
                }}
              >
                {searchResults.map((item) => (
                  <button
                    key={item.id}
                    className="row spread"
                    style={{ width: '100%', padding: '7px 8px', borderRadius: 7, textAlign: 'left' }}
                    onMouseDown={() => addItem(item.id)}
                  >
                    <span>
                      <b style={{ color: item.magic ? RARITY_INFO[item.magic.rarity].color : 'var(--parchment)' }}>
                        {item.name}
                      </b>
                      <span className="small faint"> · {KIND_LABELS[item.kind]}</span>
                    </span>
                    <span className="small muted">{item.costGp} зм</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setAddingCustom(true)}>
            + Свой предмет
          </button>
        </div>

        {sorted.length === 0 ? (
          <div className="muted small">Рюкзак пуст. Найдите что-нибудь в каталоге выше!</div>
        ) : (
          <div className="table-wrap">
            <table className="nice">
              <thead>
                <tr>
                  <th>Предмет</th>
                  <th>Кол-во</th>
                  <th>Экип.</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((entry) => {
                  const item = resolveItem(entry);
                  const name = itemName(entry);
                  const rarityColor = item?.magic ? RARITY_INFO[item.magic.rarity].color : undefined;
                  const equippable = item ? ['weapon', 'armor', 'shield', 'magic'].includes(item.kind) : true;
                  return (
                    <tr key={entry.uid}>
                      <td>
                        <span title={item?.description ?? entry.custom?.description}>
                          <b style={{ color: rarityColor ?? 'var(--parchment)' }}>{name}</b>
                          {item?.magic?.attunement && (
                            <button
                              className="chip chip-clickable"
                              style={{ marginLeft: 8, ...(entry.attuned ? { color: 'var(--gold-bright)', borderColor: 'var(--border-strong)' } : {}) }}
                              title="Настройка на магический предмет"
                              onClick={() => patchEntry(entry.uid, { attuned: !entry.attuned })}
                            >
                              {entry.attuned ? '🔗 настроен' : 'настройка?'}
                            </button>
                          )}
                        </span>
                        {item?.weapon && (
                          <div className="small faint">
                            {item.weapon.damage} · {item.weapon.properties.join(', ') || 'без свойств'}
                          </div>
                        )}
                        {item?.armor && (
                          <div className="small faint">
                            КБ {item.armor.baseAC}{item.armor.dexCap === null ? ' + Лов' : item.armor.dexCap > 0 ? ` + Лов (макс. ${item.armor.dexCap})` : ''}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="row" style={{ gap: 4 }}>
                          <button className="icon-btn" style={{ width: 24, height: 24 }} onClick={() => (entry.qty > 1 ? patchEntry(entry.uid, { qty: entry.qty - 1 }) : removeEntry(entry.uid))}>−</button>
                          {entry.qty}
                          <button className="icon-btn" style={{ width: 24, height: 24 }} onClick={() => patchEntry(entry.uid, { qty: entry.qty + 1 })}>+</button>
                        </div>
                      </td>
                      <td>
                        {equippable && (
                          <input
                            type="checkbox"
                            checked={Boolean(entry.equipped)}
                            title="Экипировано (в руках или надето)"
                            onChange={(e) => patchEntry(entry.uid, { equipped: e.target.checked })}
                          />
                        )}
                      </td>
                      <td>
                        <div className="row" style={{ gap: 4, justifyContent: 'flex-end' }}>
                          {item?.healing && (
                            <button className="btn btn-ghost btn-sm" onClick={() => drink(entry)}>🧪 Выпить</button>
                          )}
                          <button className="icon-btn" title="Выбросить" onClick={() => removeEntry(entry.uid)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {addingCustom && (
        <CustomItemModal
          onAdd={(custom) => {
            updateCharacter(character.id, (c) => ({
              ...c,
              inventory: [...c.inventory, { uid: uid(), custom, qty: 1, equipped: false }],
            }));
            setAddingCustom(false);
            toast('Добавлено', custom.name, '🎒');
          }}
          onClose={() => setAddingCustom(false)}
        />
      )}
    </div>
  );
}

function CustomItemModal({ onAdd, onClose }: {
  onAdd: (custom: { name: string; kind: ItemKind; description?: string }) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [kind, setKind] = useState<ItemKind>('gear');
  const [description, setDescription] = useState('');

  return (
    <Modal title="Свой предмет" onClose={onClose}>
      <div className="col" style={{ gap: 10 }}>
        <input autoFocus placeholder="Название (например: Карта старого пирата)" value={name} onChange={(e) => setName(e.target.value)} />
        <select value={kind} onChange={(e) => setKind(e.target.value as ItemKind)}>
          {(Object.keys(KIND_LABELS) as ItemKind[]).map((k) => (
            <option key={k} value={k}>{KIND_LABELS[k]}</option>
          ))}
        </select>
        <textarea placeholder="Описание (необязательно)" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <button
            className="btn btn-primary"
            disabled={!name.trim()}
            onClick={() => onAdd({ name: name.trim(), kind, description: description.trim() || undefined })}
          >
            Добавить
          </button>
        </div>
      </div>
    </Modal>
  );
}
