import type { ReactNode } from 'react';
import { useT } from '../../i18n/tr';

const OPEN_HINT = { ru: 'открыть ▾', uk: 'відкрити ▾', en: 'open ▾' };

export function Section({ icon, title, children, open }: { icon: string; title: string; children: ReactNode; open?: boolean }) {
  const t = useT();
  return (
    <details className="panel" style={{ padding: '14px 18px' }} open={open}>
      <summary
        className="row"
        style={{ gap: 10, cursor: 'pointer', listStyle: 'none', fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, color: 'var(--parchment)' }}
      >
        <span style={{ fontSize: 22 }}>{icon}</span>
        {title}
        <span className="grow" />
        <span className="faint small">{t(OPEN_HINT)}</span>
      </summary>
      <div className="col small" style={{ gap: 8, paddingTop: 12, lineHeight: 1.6 }}>
        {children}
      </div>
    </details>
  );
}

export function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
      <span
        style={{
          minWidth: 24, height: 24, borderRadius: '50%', display: 'inline-flex',
          alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13,
          background: 'linear-gradient(180deg, var(--gold-bright), var(--gold-dim))', color: '#241a08',
        }}
      >
        {n}
      </span>
      <span className="muted">{children}</span>
    </div>
  );
}

export function Term({ t, children }: { t: string; children: ReactNode }) {
  return (
    <div><span className="gold">{t}</span> — <span className="muted">{children}</span></div>
  );
}
