// R4 per-period calculations, R1.3 order and R7 active period / total wealth. Nothing here is stored.
import { addDays, differenceInCalendarDays, format, parseISO } from 'date-fns';
import { todayISO } from './dates';
import { fundBalance, transferSigned } from './savings';
import { ColorKey, Data, Expense, ISODate, LIVING, Period } from './types';

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

// ---------- R4 · per-period calculations ----------

/** R4 Thu = incomes + withdrawals − deposits */
export const thu = (p: Period) => sum(p.incomes.map((i) => i.amount)) + sum(p.transfers.map(transferSigned));

/** R4 Chi = all expenses (categorized + untracked) */
export const chi = (p: Period) => sum(p.expenses.map((e) => e.amount));

/** R4 Số dư = Thu − Chi */
export const soDu = (p: Period) => thu(p) - chi(p);

/**
 * R3 category as counted: Sinh hoạt, a goal of this period, or null (untracked).
 * A category pointing at a goal that no longer exists counts as untracked (plan §3.2).
 */
export function categoryOf(p: Period, e: Expense): string | null {
  if (e.category === LIVING || e.category === null) return e.category;
  return p.goals.some((g) => g.id === e.category) ? e.category : null;
}

const onCategory = (p: Period, category: string | null) => p.expenses.filter((e) => categoryOf(p, e) === category);

export const spentOn = (p: Period, category: string | null) => sum(onCategory(p, category).map((e) => e.amount));

export const countOn = (p: Period, category: string | null) => onCategory(p, category).length;

/** R4 Sinh hoạt spent = Sinh hoạt + untracked (D47) */
export function livingSpent(p: Period) {
  const categorized = spentOn(p, LIVING);
  const untracked = spentOn(p, null);
  return { categorized, untracked, total: categorized + untracked };
}

export const livingCount = (p: Period) => countOn(p, LIVING) + countOn(p, null);

/**
 * R4 Dự trữ, per goal (plan §2.5): Σ max(target − spent, 0) over goals not done; Sinh hoạt excluded (D36, D59, D61).
 * Overspending one goal does not lower what the others still need.
 */
export function reserve(p: Period) {
  return sum(p.goals.filter((g) => !g.done).map((g) => Math.max(g.target - spentOn(p, g.id), 0)));
}

/** R4 Còn lại = Số dư − Dự trữ */
export const conLai = (p: Period) => soDu(p) - reserve(p);

export const entryCount = (p: Period) => p.expenses.length + p.incomes.length + p.transfers.length;

export type BarColor = 'yellow' | 'green' | 'red';
/** R4 goal bar color (D38): under target yellow, exactly on target green, over red */
export const barColor = (spent: number, target: number): BarColor =>
  spent < target ? 'yellow' : spent === target ? 'green' : 'red';

/** 5.2 totals over the goals (Sinh hoạt excluded) */
export const goalTotals = (p: Period) => ({
  spent: sum(p.goals.map((g) => spentOn(p, g.id))),
  target: sum(p.goals.map((g) => g.target)),
});

// ---------- R4.1 · chart 2 segments ----------
export interface Segment { key: string; name: string; color: ColorKey; amount: number }

/** R4.1: Sinh hoạt (incl. untracked) first, then goals in their order; empty segments dropped. Adds up to Chi. */
export function goalSegments(p: Period): Segment[] {
  const segs: Segment[] = [
    { key: LIVING, name: 'Sinh hoạt', color: p.living.color, amount: livingSpent(p).total },
    ...p.goals.map((g) => ({ key: g.id, name: g.name, color: g.color, amount: spentOn(p, g.id) })),
  ];
  return segs.filter((s) => s.amount > 0);
}

// ---------- 5.3 chart 1 · Sinh hoạt per day ----------

/**
 * Sinh hoạt spending (incl. untracked, D47) per calendar day of the period.
 * A closed period runs start → end; the active one runs to today (at least its start day).
 */
export function livingPerDay(p: Period, today = todayISO()): { date: ISODate; amount: number }[] {
  const endDay = p.end ?? (today > p.start ? today : p.start);
  const days = Math.max(differenceInCalendarDays(parseISO(endDay), parseISO(p.start)) + 1, 1);
  const sums = new Map<ISODate, number>();
  for (const e of p.expenses) {
    const c = categoryOf(p, e);
    if (c === LIVING || c === null) sums.set(e.date, (sums.get(e.date) ?? 0) + e.amount);
  }
  return Array.from({ length: days }, (_, i) => {
    const date = format(addDays(parseISO(p.start), i), 'yyyy-MM-dd');
    return { date, amount: sums.get(date) ?? 0 };
  });
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

/** Plan §2.5: only the active period can be changed; every other one is read-only history */
export const isReadOnly = (d: Data, p: Period) => activePeriod(d)?.id !== p.id;

/** R7.2: whole-percent shares that add up to 100; only when both parts > 0 */
export function shares(a: number, b: number): [number, number] | null {
  if (a <= 0 || b <= 0) return null;
  // kept within 1–99 so a part that is > 0 never shows as 0% (plan §2.5)
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
