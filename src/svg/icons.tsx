import type { ClassId } from '../model/types';

interface IconProps {
  size?: number;
  className?: string;
}

interface EmblemProps extends IconProps {
  classId: ClassId;
  color?: string;
}

// Эмблемы 12 классов — стилизованная линейная графика
export function ClassEmblem({ classId, size = 40, color = '#d4a94e', className }: EmblemProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: color,
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
  };
  switch (classId) {
    case 'barbarian':
      return (
        <svg {...common}>
          <path d="M14 8 L34 40 M34 8 L14 40" strokeWidth="2.6" />
          <path d="M10 12 C16 6 20 6 24 10 C20 14 16 14 10 12 Z" fill={color} fillOpacity="0.25" />
          <path d="M38 12 C32 6 28 6 24 10 C28 14 32 14 38 12 Z" fill={color} fillOpacity="0.25" />
          <path d="M10 36 C16 42 20 42 24 38 C20 34 16 34 10 36 Z" fill={color} fillOpacity="0.25" />
          <path d="M38 36 C32 42 28 42 24 38 C28 34 32 34 38 36 Z" fill={color} fillOpacity="0.25" />
        </svg>
      );
    case 'bard':
      return (
        <svg {...common}>
          <path d="M20 30 C12 30 8 36 12 40 C16 44 24 40 24 32 L24 12 C24 9 26 7 29 7 L38 5 L38 11 L29 13 C27 13 24 12 24 12" fill={color} fillOpacity="0.15" />
          <circle cx="17" cy="35" r="4.5" />
          <path d="M28 20 L34 18 M28 26 L34 24" strokeWidth="1.6" />
        </svg>
      );
    case 'cleric':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="9" fill={color} fillOpacity="0.18" />
          <path d="M24 4 L24 13 M24 35 L24 44 M4 24 L13 24 M35 24 L44 24" strokeWidth="2.8" />
          <path d="M10 10 L16 16 M38 10 L32 16 M10 38 L16 32 M38 38 L32 32" strokeWidth="1.7" />
          <path d="M24 18 L24 30 M19 22 L29 22" strokeWidth="2.4" />
        </svg>
      );
    case 'druid':
      return (
        <svg {...common}>
          <path d="M24 44 C24 30 26 16 40 8 C42 22 36 36 24 40" fill={color} fillOpacity="0.18" />
          <path d="M24 44 C24 32 22 20 8 12 C7 25 13 36 24 41" fill={color} fillOpacity="0.10" />
          <path d="M24 44 C24 30 27 17 40 8" />
          <path d="M24 44 C24 33 21 21 8 12" />
        </svg>
      );
    case 'fighter':
      return (
        <svg {...common}>
          <path d="M24 4 L28 10 L28 30 L24 36 L20 30 L20 10 Z" fill={color} fillOpacity="0.22" />
          <path d="M13 26 L35 26" strokeWidth="2.8" />
          <path d="M24 36 L24 44 M20 40 L28 40" strokeWidth="2.4" />
        </svg>
      );
    case 'monk':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="18" strokeDasharray="4 5" strokeWidth="1.6" />
          <path d="M15 28 C15 20 18 14 24 12 C30 14 33 20 33 28 C33 33 29 36 24 36 C19 36 15 33 15 28 Z" fill={color} fillOpacity="0.18" />
          <path d="M19 26 L19 20 M24 27 L24 18 M29 26 L29 20" strokeWidth="2.4" />
        </svg>
      );
    case 'paladin':
      return (
        <svg {...common}>
          <path d="M24 5 L38 10 L38 24 C38 34 32 40 24 43 C16 40 10 34 10 24 L10 10 Z" fill={color} fillOpacity="0.15" />
          <path d="M24 12 L24 32 M17 19 L31 19" strokeWidth="2.6" />
          <path d="M8 8 C4 14 4 20 7 24 M40 8 C44 14 44 20 41 24" strokeWidth="1.6" />
        </svg>
      );
    case 'ranger':
      return (
        <svg {...common}>
          <path d="M12 6 C24 14 24 34 12 42" strokeWidth="2.4" />
          <path d="M10 24 L40 24 M40 24 L32 18 M40 24 L32 30" strokeWidth="2.2" />
          <path d="M12 6 L10 24 L12 42" strokeWidth="1.4" />
        </svg>
      );
    case 'rogue':
      return (
        <svg {...common}>
          <path d="M24 4 L27 12 L27 30 L24 38 L21 30 L21 12 Z" fill={color} fillOpacity="0.22" />
          <path d="M16 15 C10 17 8 22 10 26 C14 24 16 21 17 17" fill={color} fillOpacity="0.12" />
          <path d="M32 15 C38 17 40 22 38 26 C34 24 32 21 31 17" fill={color} fillOpacity="0.12" />
          <path d="M18 34 L30 34" strokeWidth="2.6" />
          <path d="M24 38 L24 44" strokeWidth="2.2" />
        </svg>
      );
    case 'sorcerer':
      return (
        <svg {...common}>
          <path d="M24 44 C14 38 12 28 18 20 C17 26 20 29 23 30 C19 20 24 10 32 6 C28 14 32 16 34 22 C36 30 32 40 24 44 Z" fill={color} fillOpacity="0.2" />
          <circle cx="24" cy="33" r="3" fill={color} />
        </svg>
      );
    case 'warlock':
      return (
        <svg {...common}>
          <path d="M6 24 C12 15 18 11 24 11 C30 11 36 15 42 24 C36 33 30 37 24 37 C18 37 12 33 6 24 Z" fill={color} fillOpacity="0.14" />
          <circle cx="24" cy="24" r="6.5" fill={color} fillOpacity="0.35" />
          <circle cx="24" cy="24" r="2.4" fill={color} />
          <path d="M24 4 L24 8 M24 40 L24 44 M8 10 L11 13 M40 10 L37 13 M8 38 L11 35 M40 38 L37 35" strokeWidth="1.7" />
        </svg>
      );
    case 'wizard':
      return (
        <svg {...common}>
          <path d="M8 38 L24 38 L40 38 L40 12 C34 8 28 8 24 12 C20 8 14 8 8 12 Z" fill={color} fillOpacity="0.14" />
          <path d="M24 12 L24 38" strokeWidth="1.8" />
          <path d="M13 18 L19 18 M13 24 L19 24 M29 18 L35 18 M29 24 L35 24" strokeWidth="1.5" />
          <path d="M24 4 L25.2 7 L28 7.5 L25.8 9.4 L26.5 12.4 L24 10.8 L21.5 12.4 L22.2 9.4 L20 7.5 L22.8 7 Z" fill={color} stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}

export function D20Icon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" className={className}>
      <path d="M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z" />
      <path d="M12 2 L7 9.5 L3 7 M12 2 L17 9.5 L21 7 M7 9.5 L12 22 M17 9.5 L12 22 M7 9.5 L17 9.5" strokeWidth="1.1" />
    </svg>
  );
}

export function SwordsIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className={className}>
      <path d="M4 4 L14 14 M4 4 L4 8 M4 4 L8 4 M12 16 L16 12 M11 19 L15 15 M13 21 L19 15" />
      <path d="M20 4 L10 14 M20 4 L20 8 M20 4 L16 4 M12 16 L8 12 M13 19 L9 15 M11 21 L5 15" />
    </svg>
  );
}

export function HeroIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21 C5 16 8 14 12 14 C16 14 19 16 19 21" />
    </svg>
  );
}

export function BookIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 6 C10 4 7 3.5 4 4 L4 19 C7 18.5 10 19 12 21 C14 19 17 18.5 20 19 L20 4 C17 3.5 14 4 12 6 Z" />
      <path d="M12 6 L12 21" />
    </svg>
  );
}

export function CrownIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" className={className}>
      <path d="M3 8 L7 12 L12 5 L17 12 L21 8 L19 18 L5 18 Z" />
      <path d="M9 18 L9 15 M15 18 L15 15" strokeWidth="1.2" />
    </svg>
  );
}

export function CampfireIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className={className}>
      <path d="M12 3 C14 6 16 8 16 11 C16 14 14 16 12 16 C10 16 8 14 8 11 C8 9.5 8.7 8 10 6.5 C10 8.5 11 9.5 12 10 C11.5 8 11.5 5.5 12 3 Z" />
      <path d="M4 21 L20 17 M4 17 L20 21" />
    </svg>
  );
}

export function ChestIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" className={className}>
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <path d="M3 12 L21 12 M12 12 L12 16" />
      <path d="M3 8 C3 5.5 5 4 7.5 4 L16.5 4 C19 4 21 5.5 21 8" />
    </svg>
  );
}

export function ScrollIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 4 C4.9 4 4 4.9 4 6 C4 7.1 4.9 8 6 8 L8 8 L8 18 C8 19.6 9.4 21 11 21 L18 21 C19.6 21 21 19.6 21 18 L21 17 L11 17" />
      <path d="M8 4 L17 4 C18.1 4 19 4.9 19 6 L19 14" />
      <path d="M11 8.5 L16 8.5 M11 12 L16 12" strokeWidth="1.2" />
    </svg>
  );
}

// Большой декоративный дракон для главного экрана
export function DragonHero({ size = 340, className }: IconProps) {
  return (
    <svg width={size} height={size * 0.72} viewBox="0 0 400 288" fill="none" className={className}>
      <defs>
        <linearGradient id="drg-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0c96c" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#d4a94e" stopOpacity="0.55" />
          <stop offset="1" stopColor="#7b5ea7" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id="drg-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f0c96c" stopOpacity="0.28" />
          <stop offset="1" stopColor="#f0c96c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="150" r="140" fill="url(#drg-glow)" />
      <g style={{ transformOrigin: '200px 150px' }}>
        <circle cx="200" cy="150" r="122" stroke="#d4a94e" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 9" />
        <circle cx="200" cy="150" r="104" stroke="#d4a94e" strokeOpacity="0.4" strokeWidth="1.3" />
        <circle cx="200" cy="150" r="98" stroke="#d4a94e" strokeOpacity="0.2" strokeWidth="0.8" />
        <g stroke="#d4a94e" strokeOpacity="0.55" strokeWidth="1">
          <path d="M200 43 L206 53 L194 53 Z" fill="#d4a94e" fillOpacity="0.5" />
          <path d="M200 257 L206 247 L194 247 Z" fill="#d4a94e" fillOpacity="0.5" />
          <path d="M93 150 L103 144 L103 156 Z" fill="#d4a94e" fillOpacity="0.5" />
          <path d="M307 150 L297 144 L297 156 Z" fill="#d4a94e" fillOpacity="0.5" />
        </g>
      </g>
      <g stroke="url(#drg-body)" strokeWidth="3.4" strokeLinejoin="round" fill="none">
        <polygon points="200,72 267,110 267,190 200,228 133,190 133,110" fill="url(#drg-body)" fillOpacity="0.10" />
        <polygon points="200,96 244,124 244,178 200,204 156,178 156,124" strokeWidth="2" strokeOpacity="0.85" />
        <path d="M200 72 L200 96 M267 110 L244 124 M267 190 L244 178 M200 228 L200 204 M133 190 L156 178 M133 110 L156 124" strokeWidth="2" strokeOpacity="0.7" />
        <path d="M200 96 L244 178 L156 178 Z" strokeWidth="1.6" strokeOpacity="0.7" />
      </g>
      <text
        x="200"
        y="164"
        textAnchor="middle"
        fontFamily="Cormorant, Georgia, serif"
        fontSize="44"
        fontWeight="700"
        fill="#f0c96c"
        style={{ filter: 'drop-shadow(0 0 10px rgba(240,201,108,0.6))' }}
      >
        20
      </text>
      <g fill="#f0c96c">
        <circle cx="110" cy="80" r="2" opacity="0.8"><animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.6s" repeatCount="indefinite" /></circle>
        <circle cx="300" cy="96" r="2.4" opacity="0.7"><animate attributeName="opacity" values="0.7;0.15;0.7" dur="3.4s" repeatCount="indefinite" /></circle>
        <circle cx="322" cy="200" r="1.8" opacity="0.6"><animate attributeName="opacity" values="0.6;0.1;0.6" dur="2.2s" repeatCount="indefinite" /></circle>
        <circle cx="86" cy="160" r="1.6" opacity="0.7"><animate attributeName="opacity" values="0.7;0.2;0.7" dur="4s" repeatCount="indefinite" /></circle>
        <circle cx="256" cy="62" r="2.2" opacity="0.75"><animate attributeName="opacity" values="0.75;0.2;0.75" dur="3s" repeatCount="indefinite" /></circle>
        <circle cx="140" cy="236" r="1.7" opacity="0.6"><animate attributeName="opacity" values="0.6;0.15;0.6" dur="2.8s" repeatCount="indefinite" /></circle>
      </g>
    </svg>
  );
}
