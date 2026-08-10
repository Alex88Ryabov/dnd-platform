import { useState } from 'react';
import type { LootResult, LootRichness, LootTier } from '../../engine/loot';
import { generateLoot } from '../../engine/loot';
import { ITEMS_BY_ID } from '../../engine/derive';
import { RARITY_INFO } from '../../data/core';
import { useStore } from '../../store/store';
import { uid } from '../../engine/dice';
import { toast } from '../../components/Toasts';
import { sfx } from '../../audio/sound';

const RICHNESS_CARDS: { id: LootRichness; icon: string; title: string; hint: string }[] = [
  { id: 'pocket', icon: '👛', title: 'Карманы врага', hint: 'мелочь с одного противника' },
  { id: 'chest', icon: '🧰', title: 'Сундук', hint: 'достойная находка' },
  { id: 'hoard', icon: '👑', title: 'Клад!', hint: 'сокровищница логова' },
];

const TIER_LABELS: Record<LootTier, string> = {
  1: 'Уровни 1–4',
  2: 'Уровни 5–10',
  3: 'Уровни 11–16',
  4: 'Уровни 17–20',
};

export function LootPanel() {
  const characters = useStore((s) => s.characters);
  const updateCharacter = useStore((s) => s.updateCharacter);
  const awardMoney = useStore((s) => s.awardMoney);

  const avgLevel = characters.length > 0
    ? characters.reduce((sum, c) => sum + c.level, 0) / characters.length
    : 1;
  const autoTier: LootTier = avgLevel >= 17 ? 4 : avgLevel >= 11 ? 3 : avgLevel >= 5 ? 2 : 1;

  const [tier, setTier] = useState<LootTier>(autoTier);
  const [richness, setRichness] = useState<LootRichness>('chest');
  const [loot, setLoot] = useState<LootResult | null>(null);
  const [receiverId, setReceiverId] = useState<string>('');

  const generate = () => {
    sfx.coin();
    setLoot(generateLoot(tier, richness));
  };

  const give = () => {
    if (!loot) {
      return;
    }
    const receiver = characters.find((c) => c.id === (receiverId || characters[0]?.id));
    if (!receiver) {
      return;
    }
    awardMoney(receiver.id, loot.money);
    if (loot.items.length > 0) {
      updateCharacter(receiver.id, (c) => ({
        ...c,
        inventory: [
          ...c.inventory,
          ...loot.items.map((item) => ({ uid: uid(), itemId: item.itemId, qty: item.qty, equipped: false })),
        ],
      }));
    }
    sfx.levelUp();
    toast('Добыча выдана!', `${receiver.name} прячет сокровища в рюкзак`, '💰');
    setLoot(null);
  };

  const coinsText = (l: LootResult) => {
    const parts: string[] = [];
    if (l.money.pp > 0) {
      parts.push(`${l.money.pp} платиновых`);
    }
    if (l.money.gp > 0) {
      parts.push(`${l.money.gp} золотых`);
    }
    if (l.money.sp > 0) {
      parts.push(`${l.money.sp} серебряных`);
    }
    if (l.money.cp > 0) {
      parts.push(`${l.money.cp} медных`);
    }
    return parts.length > 0 ? parts.join(', ') : 'ни монетки';
  };

  return (
    <div className="col" style={{ gap: 16 }}>
      <section className="panel">
        <div className="section-title">Генератор сокровищ</div>
        <div className="row-wrap" style={{ gap: 10, marginBottom: 14 }}>
          <span className="muted small">Сила партии:</span>
          {( [1, 2, 3, 4] as LootTier[]).map((t) => (
            <button
              key={t}
              className={`chip chip-clickable${tier === t ? ' chip-active' : ''}`}
              onClick={() => setTier(t)}
            >
              {TIER_LABELS[t]}
            </button>
          ))}
        </div>
        <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', maxWidth: 640 }}>
          {RICHNESS_CARDS.map((card) => (
            <button
              key={card.id}
              className="panel card-clickable center"
              style={{ padding: 18, outline: richness === card.id ? '2px solid var(--gold)' : 'none' }}
              onClick={() => setRichness(card.id)}
            >
              <div style={{ fontSize: 38 }}>{card.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, marginTop: 4 }}>{card.title}</div>
              <div className="small faint">{card.hint}</div>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <button className="btn btn-primary btn-lg pulse-ready" onClick={generate}>
            ✨ Что нашли герои?
          </button>
        </div>
      </section>

      {loot && (
        <section className="panel panel-ornate">
          <div className="script gold" style={{ fontSize: 22, marginBottom: 10 }}>{loot.flavor}</div>
          <div className="row" style={{ gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 26 }}>🪙</span>
            <b style={{ fontFamily: 'var(--font-display)', fontSize: 19 }}>{coinsText(loot)}</b>
          </div>
          {loot.items.length > 0 && (
            <div className="col" style={{ gap: 8 }}>
              {loot.items.map((entry, i) => {
                const item = ITEMS_BY_ID[entry.itemId];
                if (!item) {
                  return null;
                }
                const rarity = item.magic ? RARITY_INFO[item.magic.rarity] : null;
                return (
                  <div key={i} className={`row float-in float-in-${Math.min(4, i + 1)}`} style={{ gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{item.kind === 'magic' ? '🔮' : item.kind === 'treasure' ? '💎' : '📦'}</span>
                    <div>
                      <b style={{ color: rarity?.color ?? 'var(--parchment)' }}>
                        {item.name}{entry.qty > 1 ? ` ×${entry.qty}` : ''}
                      </b>
                      {rarity && <span className="small faint"> · {rarity.name}</span>}
                      <div className="small muted">{item.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="divider" />
          <div className="row-wrap" style={{ gap: 10 }}>
            <select value={receiverId} onChange={(e) => setReceiverId(e.target.value)}>
              {characters.length === 0 && <option value="">— нет героев —</option>}
              {characters.map((c) => (
                <option key={c.id} value={c.id}>{c.portrait.icon} {c.name}</option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={give} disabled={characters.length === 0}>
              🎁 Выдать герою
            </button>
            <button className="btn btn-ghost" onClick={generate}>🎲 Другая добыча</button>
          </div>
        </section>
      )}
    </div>
  );
}
