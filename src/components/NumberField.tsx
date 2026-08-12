import type { ReactElement } from 'react';

interface NumberFieldProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  // ширина поля ввода; кнопки +/− добавляются к ней
  width?: number;
  ariaLabel?: string;
}

// Числовое поле с кнопками −/+: на телефоне тыкать по кнопкам проще, чем набирать
export function NumberField({ value, onChange, min, max, step = 1, width, ariaLabel }: NumberFieldProps): ReactElement {
  const clamp = (next: number): number => {
    let result = next;
    if (min !== undefined && result < min) {
      result = min;
    }
    if (max !== undefined && result > max) {
      result = max;
    }
    return result;
  };

  return (
    <span className="numfield">
      <button type="button" className="numfield-btn" aria-label="−" onClick={() => onChange(clamp(value - step))}>−</button>
      <input
        type="number"
        className="num-input"
        value={value}
        min={min}
        max={max}
        aria-label={ariaLabel}
        style={width !== undefined ? { width } : undefined}
        onChange={(e) => onChange(clamp(Number(e.target.value) || 0))}
      />
      <button type="button" className="numfield-btn" aria-label="+" onClick={() => onChange(clamp(value + step))}>+</button>
    </span>
  );
}
