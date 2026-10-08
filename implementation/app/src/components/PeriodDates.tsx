import { fmtDate } from '../domain/dates';
import type { Period } from '../domain/types';

/** R1.4 on period tiles: "dd/MM/yyyy → dd/MM/yyyy", or "→ chưa kết thúc" for the active period */
export function PeriodDates({ p }: { p: Period }) {
  return (
    <div className="dates">
      {fmtDate(p.start)} → {p.end ? fmtDate(p.end) : <i>chưa kết thúc</i>}
    </div>
  );
}
