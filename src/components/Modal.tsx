import type { ReactNode } from 'react';
import { useT } from '../i18n/tr';
import { T_COMMON } from '../i18n/ui/common';

interface ModalProps {
  title?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
  xl?: boolean;
}

export function Modal({ title, onClose, children, wide, xl }: ModalProps) {
  const t = useT();
  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={`modal-box${wide ? ' modal-wide' : ''}${xl ? ' modal-xl' : ''}`}>
        <div className="row spread" style={{ marginBottom: 14 }}>
          {title ? <h3 className="modal-title">{title}</h3> : <span />}
          <button className="icon-btn" onClick={onClose} aria-label={t(T_COMMON.close)} style={{ fontSize: 20 }}>
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
