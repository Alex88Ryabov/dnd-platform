import { useEffect, useState } from 'react';

export interface ToastItem {
  id: number;
  icon?: string;
  title: string;
  text?: string;
}

let nextId = 1;
let listeners: ((items: ToastItem[]) => void)[] = [];
let items: ToastItem[] = [];

export function toast(title: string, text?: string, icon?: string) {
  const item: ToastItem = { id: nextId++, title, text, icon };
  items = [...items, item];
  listeners.forEach((l) => l(items));
  setTimeout(() => {
    items = items.filter((i) => i.id !== item.id);
    listeners.forEach((l) => l(items));
  }, 4200);
}

export function Toasts() {
  const [list, setList] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener = (next: ToastItem[]) => setList(next);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  if (list.length === 0) {
    return null;
  }
  return (
    <div className="toast-wrap">
      {list.map((item) => (
        <div key={item.id} className="toast">
          <div className="row" style={{ gap: 10 }}>
            {item.icon && <span style={{ fontSize: 22 }}>{item.icon}</span>}
            <div>
              <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--parchment)' }}>
                {item.title}
              </div>
              {item.text && <div className="small muted">{item.text}</div>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
