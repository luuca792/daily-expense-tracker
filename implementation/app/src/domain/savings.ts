// R6 · savings fund. The fund is not stored: it is the base (Số dư ban đầu) plus every transfer of every period.
import { newId } from './ids';
import type { Data, ISODate, Period, Transfer } from './types';

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const allTransfers = (d: Data) => d.periods.flatMap((p) => p.transfers);

/** R6.3: effect on the period's Thu: deposit −, withdrawal + */
export const transferSigned = (t: Transfer) => (t.dir === 'in' ? -t.amount : t.amount);

/** R6.2 "Gửi": Σ deposits over all periods (base not included) */
export const fundIn = (d: Data) => sum(allTransfers(d).filter((t) => t.dir === 'in').map((t) => t.amount));
/** R6.2 "Rút": Σ withdrawals over all periods */
export const fundOut = (d: Data) => sum(allTransfers(d).filter((t) => t.dir === 'out').map((t) => t.amount));

/** R6.2 balance = base + Σ deposits − Σ withdrawals; optionally without one transfer (R6.4, editing it) */
export function fundBalance(d: Data, excludeTransferId?: string) {
  const ts = allTransfers(d).filter((t) => t.id !== excludeTransferId);
  return (d.baseSavings ?? 0) + sum(ts.map((t) => -transferSigned(t)));
}

/**
 * R6.4 (one check for deposits and withdrawals, plan §2.5): may this transfer be saved?
 * `without` = fund balance without the edited entry (= current balance for a new one).
 * Allowed if the fund after saving is ≥ 0, or not lower than now. The fund can be below 0 after
 * Số dư ban đầu is lowered or deleted (R6.7); any edit that raises it is then allowed.
 */
export function transferAllowed(without: number, current: number, dir: 'in' | 'out', amount: number) {
  const after = without + (dir === 'in' ? amount : -amount);
  return removalAllowed(after, current);
}

/** R6.4 / R6.6: may an existing transfer (or a whole period's transfers) be removed? Same rule as above. */
export function removalAllowed(after: number, current: number) {
  return after >= 0 || after >= current;
}

/** R6.6: fund balance if this period were deleted */
export function fundWithoutPeriod(d: Data, periodId: string) {
  return fundBalance({ ...d, periods: d.periods.filter((p) => p.id !== periodId) });
}

/** 7.0 list (R6.2): every transfer with its period, newest date first; same date → most recently added first */
export function transferHistory(d: Data): { t: Transfer; p: Period }[] {
  return d.periods
    .flatMap((p) => p.transfers.map((t) => ({ t, p })))
    .sort((a, b) => (a.t.date !== b.t.date ? (a.t.date < b.t.date ? 1 : -1) : b.t.createdAt - a.t.createdAt));
}

// ---------- changes (store recipes); a missing period or transfer (deleted in another tab) changes nothing ----------

export interface TransferInput { dir: 'in' | 'out'; amount: number; date: ISODate }

/** 5.10 save. The caller checks transferAllowed first (R6.4). Returns the id, or null. */
export function saveTransfer(d: Data, periodId: string, input: TransferInput, id?: string, now = Date.now()): string | null {
  const p = d.periods.find((x) => x.id === periodId);
  if (!p) return null;
  if (id === undefined) {
    const t = { id: newId(), ...input, createdAt: now };
    p.transfers.push(t);
    return t.id;
  }
  const t = p.transfers.find((x) => x.id === id);
  if (!t) return null;
  Object.assign(t, input);
  return t.id;
}

export function removeTransfer(d: Data, periodId: string, id: string) {
  const p = d.periods.find((x) => x.id === periodId);
  if (p) p.transfers = p.transfers.filter((t) => t.id !== id);
}
