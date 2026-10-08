import { useState } from 'react';
import { money, parseAmount } from '../domain/money';

/** Amount input: integer thousands with vi-VN grouping as you type; optional ± toggle (5.9, D60) */
export function AmountBox({ label, value, onChange, accent, allowNegative, autoFocus }: {
  label: string; value: number | null; onChange: (v: number | null) => void;
  accent?: 'green' | 'amber'; allowNegative?: boolean; autoFocus?: boolean;
}) {
  const [neg, setNeg] = useState((value ?? 0) < 0);
  const shown = value === null ? '' : money(Math.abs(value));
  return (
    <label className={`amt-box ${accent ?? ''}`}>
      <span className="s">{label}</span>
      {allowNegative && (
        <button type="button" className="sign" onClick={(e) => {
          e.preventDefault();
          setNeg(!neg);
          if (value !== null) onChange(-value);
        }}>{neg ? '−' : '+'}</button>
      )}
      <input
        inputMode="numeric"
        enterKeyHint="done"
        autoFocus={autoFocus}
        value={shown}
        onChange={(e) => onChange(parseAmount(e.target.value, neg))}
      />
    </label>
  );
}
