import { ReactNode, useRef } from 'react';
import { useGhostExit } from './motion';

/** Bottom sheet. `stack`: opened on top of another sheet. */
export function Sheet({ title, onClose, children, stack }: {
  title: string; onClose: () => void; children: ReactNode; stack?: boolean;
}) {
  const dim = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  useGhostExit(dim, box);
  return (
    <>
      <div ref={dim} className={`dim ${stack ? 'stack' : ''}`} onClick={onClose} />
      <div ref={box} className={`sheet fixed-col ${stack ? 'stack' : ''}`} role="dialog" onKeyDown={(e) => {
        // Enter (keyboard "Done"/"Go") in a text or amount field presses this sheet's primary button (Lưu / Tạo kỳ),
        // if it is enabled; date fields are left alone
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

/** Labeled form field with an optional error line */
export function Field({ label, children, error }: { label: string; children: ReactNode; error?: string | null }) {
  return (
    <div className="field">
      <span className="lbl">{label}</span>
      {children}
      {error && <div className="err">{error}</div>}
    </div>
  );
}
