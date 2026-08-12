import { useState } from 'react';
import type { LootResult, LootRichness, LootTier } from '../../engine/loot';
import { generateLoot } from '../../engine/loot';
import { useCatalog } from '../../i18n/catalog';
import { useRules } from '../../i18n/rules';
import { useT } from '../../i18n/tr';
import type { Tri } from '../../i18n/tr';
import { T_MASTER } from '../../i18n/ui/master';
import { useStore } from '../../store/store';
import { uid } from '../../engine/dice';
import { toast } from '../../components/Toasts';
import { sfx } from '../../audio/sound';

const RICHNESS_CARDS: { id: LootRichness; icon: string; title: Tri; hint: Tri }[] = [
  { id: 'pocket', icon: '👛', title: T_MASTER.pocket, hint: T_MASTER.pocketHint },
  { id: 'chest', icon: '🧰', title: T_MASTER.chest, hint: T_MASTER.chestHint },
  { id: 'hoard', icon: '👑', title: T_MASTER.hoard, hint: T_MASTER.hoardHint },
];

const TIER_RANGES: Record<LootTier, string> = {
  1: '1–4',
  2: '5–10',
  3: '11–16',
  4: '17–20',
};

export function LootPanel() {
  const characters = useStore((s) => s.characters);
  const updateCharacter = useStore((s) => s.updateCharacter);
  const awardMoney = useStore((s) => s.awardMoney);
  const t = useT();
  const { itemsById } = useCatalog();
  const { rarityInfo } = useRules();

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
    toast(t(T_MASTER.lootGiven), t(T_MASTER.lootGivenText, { name: receiver.name }), '💰');
    setLoot(null);
  };

  const coinsText = (l: LootResult) => {
    const parts: string[] = [];
    if (l.money.pp > 0) {
      parts.push(t(T_MASTER.platinum, { n: l.money.pp }));
    }
    if (l.money.gp > 0) {
      parts.push(t(T_MASTER.gold, { n: l.money.gp }));
    }
    if (l.money.sp > 0) {
      parts.push(t(T_MASTER.silver, { n: l.money.sp }));
    }
    if (l.money.cp > 0) {
      parts.push(t(T_MASTER.copper, { n: l.money.cp }));
    }
    return parts.length > 0 ? parts.join(', ') : t(T_MASTER.coinsNone);
  };

  return (
    <div className="col" style={{ gap: 16 }}>
      <section className="panel">
        <div className="section-title">{t(T_MASTER.lootGen)}</div>
        <div className="row-wrap" style={{ gap: 10, marginBottom: 14 }}>
          <span className="muted small">{t(T_MASTER.partyPower)}</span>
          {([1, 2, 3, 4] as LootTier[]).map((tv) => (
            <button
              key={tv}
              className={`chip chip-clickable${tier === tv ? ' chip-active' : ''}`}
              onClick={() => setTier(tv)}
            >
              {t(T_MASTER.tierLabel, { r: TIER_RANGES[tv] })}
            </button>
          ))}
        </div>
        <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', maxWidth: 640 }}>
          {RICHNESS_CARDS.map((card) => (
            <button
              key={card.id}
              className="panel card-clickable center"
              style={{ padding: 18, outline: richness === card.id ? '2px solid var(--gold)' : 'none' }}
              onClick={() => setRichness(card.id)}
            >
              <div style={{ fontSize: 38 }}>{card.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, marginTop: 4 }}>{t(card.title)}</div>
              <div className="small faint">{t(card.hint)}</div>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <button className="btn btn-primary btn-lg pulse-ready" onClick={generate}>
            {t(T_MASTER.whatFound)}
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
                const item = itemsById[entry.itemId];
                if (!item) {
                  return null;
                }
                const rarity = item.magic ? rarityInfo[item.magic.rarity] : null;
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
              {characters.length === 0 && <option value="">{t(T_MASTER.noHeroes)}</option>}
              {characters.map((c) => (
                <option key={c.id} value={c.id}>{c.portrait.icon} {c.name}</option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={give} disabled={characters.length === 0}>
              {t(T_MASTER.giveHero)}
            </button>
            <button className="btn btn-ghost" onClick={generate}>{t(T_MASTER.otherLoot)}</button>
          </div>
        </section>
      )}
    </div>
  );
}
