import type { Portrait } from '../model/types';

interface PortraitBadgeProps {
  portrait: Portrait;
  size?: number;
  radius?: number;
  fontSize?: number;
}

export function PortraitBadge({ portrait, size = 52, radius = 14, fontSize }: PortraitBadgeProps) {
  if (portrait.image) {
    return (
      <img
        src={portrait.image}
        alt=""
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          objectFit: 'cover',
          border: '1px solid var(--border-strong)',
          flexShrink: 0,
          boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: fontSize ?? size * 0.55,
        background: `linear-gradient(150deg, hsl(${portrait.hue} 45% 30%), hsl(${portrait.hue} 55% 16%))`,
        border: '1px solid var(--border-soft)',
        flexShrink: 0,
      }}
    >
      {portrait.icon}
    </div>
  );
}
