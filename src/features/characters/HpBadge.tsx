import { useT } from '../../i18n/tr';
import { T_CHARS } from '../../i18n/ui/characters';

interface HpBadgeProps {
  current: number;
  max: number;
  temp?: number;
  flash?: 'damage' | 'heal' | null;
}

export function HpBadge({ current, max, temp = 0, flash }: HpBadgeProps) {
  const t = useT();
  const ratio = max > 0 ? Math.max(0, Math.min(1, current / max)) : 0;
  const color = ratio > 0.5
    ? 'linear-gradient(90deg, #4d9c47, #6fbf63)'
    : ratio > 0.25
      ? 'linear-gradient(90deg, #c08b2d, #e0b04a)'
      : 'linear-gradient(90deg, #a03327, #e25443)';
  return (
    <div className={`hp-bar${flash ? ` flash-${flash}` : ''}`}>
      <div className="hp-fill" style={{ width: `${ratio * 100}%`, background: color }} />
      <div className="hp-text">
        {current} / {max}
      </div>
      {temp > 0 && <div className="hp-temp-pill">{t(T_CHARS.tempHp, { n: temp })}</div>}
    </div>
  );
}
