import { ReactNode, useEffect, useRef, useState } from 'react';
import { fmtDate, money } from '../domain/format';
import { PALETTE } from '../domain/palette';
import { ColorKey, ISODate } from '../domain/types';
import { useStore } from '../store/store';
import { useGhostExit, useTween } from './motion';

export function Header({ title, sub, onBack, right }: { title: ReactNode; sub?: ReactNode; onBack?: () => void; right?: ReactNode }) {
  return (
    <div className="hd">
      {onBack ? (
        <button className="title tap" onClick={onBack} aria-label="Quay lại">
          <span className="back" aria-hidden>‹</span>
          <span>{title}{sub && <span className="hd-sub">{sub}</span>}</span>
        </button>
      ) : (
        <div className="title">
          <span>{title}{sub && <span className="hd-sub">{sub}</span>}</span>
        </div>
      )}
      {right}
    </div>
  );
}

export function Sheet({ title, onClose, children, stack }: { title: string; onClose: () => void; children: ReactNode; stack?: boolean }) {
  const dim = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  useGhostExit(dim, box);
  return (
    <>
      <div ref={dim} className={`dim ${stack ? 'stack' : ''}`} onClick={onClose} />
      <div ref={box} className={`sheet fixed-col ${stack ? 'stack' : ''}`} role="dialog" onKeyDown={(e) => {
        // Enter (keyboard "Done"/"Go") in a text or amount field presses this sheet's primary button (Lưu / Tạo kỳ),
        // if it is enabled; date and select fields are left alone
        const t = e.target as HTMLElement;
        if (e.key !== 'Enter' || t.tagName !== 'INPUT' || (t as HTMLInputElement).type === 'date') return;
        if (t.closest('.sheet') !== box.current) return;
        e.preventDefault();
        box.current?.querySelector<HTMLButtonElement>('.btn.pri:not(:disabled)')?.click();
      }}>
        <div className="grab" />
        <div className="sheet-hd"><b>{title}</b><button onClick={onClose} aria-label="Đóng">✕</button></div>
        {children}
      </div>
    </>
  );
}

export function Dialog({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  const dim = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  useGhostExit(dim, box);
  return (
    <>
      <div ref={dim} className="dim dlg" onClick={onClose} />
      <div ref={box} className="dialog fixed-col" role="alertdialog">{children}</div>
    </>
  );
}

/** Pencil for "edit" buttons (2.0 name): drawn in currentColor */
export function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 20h4L19 9l-4-4L4 16v4z" />
      <path d="M13.5 6.5l4 4" />
    </svg>
  );
}

/** Period tile icon (4.0, 3.0): a drawn calendar in the tile's text color, so it keeps contrast on any tile */
export function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  );
}

/** strong: tile tinted with the solid color at ~33% alpha instead of the pale bg (5.2 goal list) */
export function Ico({ icon, color, size = 'sm', strong }: { icon: string; color: ColorKey | null; size?: 'sm' | 'md' | 'lg'; strong?: boolean }) {
  if (color === null) return <i className={`ico ${size} none`}>?</i>;
  return <i className={`ico ${size}`} style={{ background: strong ? PALETTE[color].solid + '55' : PALETTE[color].bg }}>{icon}</i>;
}

/** Amount input: integer thousands with vi-VN grouping; optional sign toggle (5.9, D60) */
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
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, '').slice(0, 9);
          onChange(digits === '' ? null : (neg ? -1 : 1) * parseInt(digits, 10));
        }}
      />
    </label>
  );
}

/** "📅 dd/MM/yyyy ▾" over a native date input limited to [min, max] (R3.5) */
export function DateField({ value, min, max, onChange, clearable, bad }: {
  value: ISODate | null; min?: string; max?: string; onChange: (v: ISODate | null) => void; clearable?: boolean; bad?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className={`input date-field ${bad ? 'bad' : ''}`}>
      📅 {value ? fmtDate(value) : ''}
      {clearable && value ? (
        <button type="button" className="clear" onClick={() => onChange(null)} aria-label="Xóa ngày">✕</button>
      ) : (
        <span className="caret">▾</span>
      )}
      <input
        ref={ref}
        type="date"
        value={value ?? ''}
        min={min}
        max={max ?? undefined}
        onChange={(e) => onChange(e.target.value || (clearable ? null : value))}
        onClick={() => { try { ref.current?.showPicker(); } catch { /* not supported */ } }}
      />
    </div>
  );
}

/** SVG ring: segments as fractions of the full circle */
export function Ring({ segments, children }: { segments: { value: number; color: string }[]; children: ReactNode }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="ring-wrap">
      <svg viewBox="0 0 176 176" className="ring-anim">
        <circle cx="88" cy="88" r={r} fill="none" stroke="#f1f5f9" strokeWidth="18" />
        {segments.filter((s) => s.value > 0).map((s, i) => {
          const len = Math.min(s.value, 1 - offset) * c;
          const el = <circle key={i} cx="88" cy="88" r={r} fill="none" stroke={s.color} strokeWidth="18" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset * c} />;
          offset += s.value;
          return el;
        })}
      </svg>
      <div className="ring-center">{children}</div>
    </div>
  );
}

/** Money that counts to its new value (summary cards) */
export function AnimMoney({ value, fmt = money }: { value: number; fmt?: (v: number) => string }) {
  return <>{fmt(useTween(value))}</>;
}

export function Toast() {
  const toast = useStore((s) => s.toast);
  return toast ? <ToastBox key={toast.key} text={toast.text} /> : null;
}

function ToastBox({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGhostExit(ref);
  const undo = useStore((s) => s.undo);
  const hide = useStore((s) => s.hideToast);
  useEffect(() => {
    const t = setTimeout(hide, 5000);
    return () => clearTimeout(t);
  }, [hide]);
  return (
    <div ref={ref} className="toast fixed-col">
      <div><span>{text}</span><button onClick={undo}>Hoàn tác</button></div>
    </div>
  );
}

export function Field({ label, children, error }: { label: string; children: ReactNode; error?: string | null }) {
  return (
    <div className="field">
      <span className="lbl">{label}</span>
      {children}
      {error && <div className="err">{error}</div>}
    </div>
  );
}
