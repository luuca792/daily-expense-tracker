import { ReactNode } from 'react';

/** SVG ring chart (5.3): segments as fractions of the full circle, drawn clockwise from the top */
export function Ring({ segments, children }: { segments: { value: number; color: string }[]; children: ReactNode }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="ring-wrap">
      <svg viewBox="0 0 176 176" className="ring-anim">
        <circle cx="88" cy="88" r={r} fill="none" stroke="#f1f5f9" strokeWidth="18" />
        {segments.filter((s) => s.value > 0).map((s, i) => {
          // never past the full circle (a part over 100% is cut)
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
