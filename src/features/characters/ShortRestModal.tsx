import { useState } from 'react';
import type { Character } from '../../model/types';
import type { DerivedStats } from '../../engine/derive';
import { useStore } from '../../store/store';
import { applyShortRest, spendHitDice } from '../../engine/rest';
import { rollDie, formatModifier } from '../../engine/dice';
import { useT } from '../../i18n/tr';
import { T_SHEET } from '../../i18n/ui/sheet';
import { T_SPELLS } from '../../i18n/ui/spells';
import { T_COMMON } from '../../i18n/ui/common';
import { Modal } from '../../components/Modal';
import { toast } from '../../components/Toasts';
import { sfx } from '../../audio/sound';

interface Props {
  character: Character;
  stats: DerivedStats;
  onClose: () => void;
}

export function ShortRestModal({ character, stats, onClose }: Props) {
  const updateCharacter = useStore((s) => s.updateCharacter);
  const [rolled, setRolled] = useState<number[]>([]);
  const t = useT();

  const available = stats.hitDiceAvailable - rolled.length;

  const rollOne = () => {
    if (available <= 0) {
      return;
    }
    sfx.dice();
    setRolled([...rolled, rollDie(stats.hitDie)]);
  };

  const finish = () => {
    updateCharacter(character.id, (c) => {
      const afterDice = rolled.length > 0 ? spendHitDice(c, rolled) : c;
      return applyShortRest(afterDice);
    });
    const healed = rolled.reduce((sum, r) => sum + Math.max(0, r + stats.mods.con), 0);
    sfx.heal();
    toast(
      t(T_SPELLS.shortRestDone),
      rolled.length > 0 ? t(T_SPELLS.shortRestHealed, { n: healed }) : t(T_SPELLS.shortRestNoHeal),
      '🔥',
    );
    onClose();
  };

  return (
    <Modal title={t(T_SHEET.shortRest)} onClose={onClose}>
      <p className="muted small" style={{ marginBottom: 14 }}>
        {t(T_SPELLS.shortRestHint, { die: stats.hitDie, mod: formatModifier(stats.mods.con) })}
      </p>
      <div className="row-wrap" style={{ gap: 10 }}>
        <button className="btn btn-primary" onClick={rollOne} disabled={available <= 0}>
          {t(T_SPELLS.rollHitDie, { n: available })}
        </button>
      </div>
      {rolled.length > 0 && (
        <div className="panel" style={{ marginTop: 12, padding: 12 }}>
          <div className="row-wrap" style={{ gap: 8 }}>
            {rolled.map((r, i) => (
              <span key={i} className="chip chip-active result-pop" style={{ fontSize: 16 }}>
                d{stats.hitDie}: {r} {formatModifier(stats.mods.con)} = {Math.max(0, r + stats.mods.con)}
              </span>
            ))}
          </div>
          <div className="gold" style={{ marginTop: 8, fontWeight: 700 }}>
            {t(T_SPELLS.totalHealing, { n: rolled.reduce((s, r) => s + Math.max(0, r + stats.mods.con), 0) })}
          </div>
        </div>
      )}
      <div className="row" style={{ justifyContent: 'flex-end', marginTop: 16 }}>
        <button className="btn btn-ghost" onClick={onClose}>{t(T_COMMON.cancel)}</button>
        <button className="btn btn-primary" onClick={finish}>{t(T_SPELLS.endRest)}</button>
      </div>
    </Modal>
  );
}
