import { Data, Goal, LIVING, Period, Transfer } from './types';

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

// ---------- R4 · per-period calculations ----------

/** R6.3: deposit −, withdrawal + */
export const transferSigned = (t: Transfer) => (t.dir === 'in' ? -t.amount : t.amount);

/** R4 Thu = incomes + withdrawals − deposits */
export const thu = (p: Period) => sum(p.incomes.map((i) => i.amount)) + sum(p.transfers.map(transferSigned));

/** R4 Chi = all expenses (categorized + untracked) */
export const chi = (p: Period) => sum(p.expenses.map((e) => e.amount));

/** R4 Số dư = Thu − Chi */
export const soDu = (p: Period) => thu(p) - chi(p);

export const spentOn = (p: Period, category: string | null) =>
  sum(p.expenses.filter((e) => e.category === category).map((e) => e.amount));

export const countOn = (p: Period, category: string | null) =>
  p.expenses.filter((e) => e.category === category).length;

/** R4 Sinh hoạt spent = Sinh hoạt + untracked (D47) */
export function livingSpent(p: Period) {
  const categorized = spentOn(p, LIVING);
  const untracked = spentOn(p, null);
  return { categorized, untracked, total: categorized + untracked };
}

export const livingCount = (p: Period) => countOn(p, LIVING) + countOn(p, null);

/**
 * R4 Dự trữ: Σ max(target − spent, 0) per goal not done; Sinh hoạt excluded (D36, D59, D61).
 * Per goal (changed 2026-10-08): overspending one goal no longer lowers what the others still need.
 */
export function reserve(p: Period) {
  return sum(p.goals.filter((g) => !g.done).map((g) => Math.max(g.target - spentOn(p, g.id), 0)));
}

/** R4 Còn lại = Số dư − Dự trữ */
export const conLai = (p: Period) => soDu(p) - reserve(p);

export const entryCount = (p: Period) => p.expenses.length + p.incomes.length + p.transfers.length;

export type BarColor = 'yellow' | 'green' | 'red';
/** R4 goal bar color (D38) */
export const barColor = (spent: number, target: number): BarColor =>
  spent < target ? 'yellow' : spent === target ? 'green' : 'red';

export const goalTotals = (p: Period) => ({
  spent: sum(p.goals.map((g) => spentOn(p, g.id))),
  target: sum(p.goals.map((g) => g.target)),
});

// ---------- R4.1 · chart 2 segments ----------
export interface Segment { key: string; name: string; color: Goal['color']; amount: number }

export function goalSegments(p: Period): Segment[] {
  const segs: Segment[] = [
    { key: LIVING, name: 'Sinh hoạt', color: p.living.color, amount: livingSpent(p).total },
    ...p.goals.map((g) => ({ key: g.id, name: g.name, color: g.color, amount: spentOn(p, g.id) })),
  ];
  return segs.filter((s) => s.amount > 0);
}

// ---------- R6 · savings fund ----------
const allTransfers = (d: Data) => d.periods.flatMap((p) => p.transfers);

/** R6.2 "Gửi": Σ deposits over all periods (base not included) */
export const fundIn = (d: Data) => sum(allTransfers(d).filter((t) => t.dir === 'in').map((t) => t.amount));
export const fundOut = (d: Data) => sum(allTransfers(d).filter((t) => t.dir === 'out').map((t) => t.amount));

/** R6.2 balance = base + Σ deposits − Σ withdrawals; optionally without one transfer (R6.4) */
export function fundBalance(d: Data, excludeTransferId?: string) {
  const ts = allTransfers(d).filter((t) => t.id !== excludeTransferId);
  return (d.baseSavings ?? 0) + sum(ts.map((t) => -transferSigned(t)));
}

/**
 * R6.4: is saving this transfer allowed? `without` = fund balance without the edited entry.
 * Allowed if the fund after saving is ≥ 0, or not lower than now (it can be below 0 after the base
 * savings is lowered or deleted, R6.7; any edit that raises it is then allowed).
 */
export function transferAllowed(without: number, current: number, dir: 'in' | 'out', amount: number) {
  const after = without + (dir === 'in' ? amount : -amount);
  return removalAllowed(after, current);
}

/** R6.4 / R6.6: may an existing transfer (or a whole period's transfers) be removed? */
export function removalAllowed(after: number, current: number) {
  return after >= 0 || after >= current;
}

/** R6.6: fund balance if this period were deleted */
export function fundWithoutPeriod(d: Data, periodId: string) {
  return fundBalance({ ...d, periods: d.periods.filter((p) => p.id !== periodId) });
}

// ---------- R1.3 / R7 ----------

/** R1.3: start date newest first; same start → created more recently first */
export function sortPeriods(periods: Period[]) {
  return [...periods].sort((a, b) =>
    a.start !== b.start ? (a.start < b.start ? 1 : -1) : b.createdAt - a.createdAt,
  );
}

/** R7.1: always the first period in R1.3 order */
export const activePeriod = (d: Data): Period | null => sortPeriods(d.periods)[0] ?? null;

/** R7.2: whole-percent shares that add up to 100; only when both parts > 0 */
export function shares(a: number, b: number): [number, number] | null {
  if (a <= 0 || b <= 0) return null;
  // kept within 1–99 so a part that is > 0 never shows as 0%
  const pa = Math.min(99, Math.max(1, Math.round((a / (a + b)) * 100)));
  return [pa, 100 - pa];
}

/** R7.2 Tổng tài sản = fund + active period's Số dư */
export function wealth(d: Data) {
  const fund = fundBalance(d);
  const period = activePeriod(d);
  const balance = period ? soDu(period) : 0;
  return { fund, period, balance, total: fund + balance, shares: period ? shares(fund, balance) : null };
}
