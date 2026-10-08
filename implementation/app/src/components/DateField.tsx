import { useRef } from 'react';
import { fmtDate } from '../domain/dates';
import type { ISODate } from '../domain/types';

/** "📅 dd/MM/yyyy ▾" over a native date input limited to [min, max] (R3.5) */
export function DateField({ value, min, max, onChange, bad }: {
  value: ISODate | null; min?: ISODate; max?: ISODate | null; onChange: (v: ISODate) => void; bad?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className={`input date-field ${bad ? 'bad' : ''}`}>
      📅 {value ? fmtDate(value) : ''}
      <span className="caret">▾</span>
      <input
        ref={ref}
        type="date"
        value={value ?? ''}
        min={min}
        max={max ?? undefined}
        // clearing the native picker keeps the old date: every date field here is required
        onChange={(e) => { if (e.target.value) onChange(e.target.value); }}
        onClick={() => { try { ref.current?.showPicker(); } catch { /* not supported */ } }}
      />
    </div>
  );
}
