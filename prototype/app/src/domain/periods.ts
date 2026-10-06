import { differenceInCalendarDays, parseISO } from 'date-fns';
import { soDu, sortPeriods } from './calc';
import { Data, ISODate, LIVING, Period, Settings, uid } from './types';

export const CARRY_OVER_TEXT = 'Còn lại từ tháng trước';

/** R1.1 / R1.2: year groups by start year, newest first */
export function yearGroups(periods: Period[]) {
  const groups = new Map<number, Period[]>();
  for (const p of sortPeriods(periods)) {
    const y = Number(p.start.slice(0, 4));
    if (!groups.has(y)) groups.set(y, []);
    groups.get(y)!.push(p);
  }
  return [...groups.entries()].map(([year, list]) => ({ year, periods: list }));
}

/** R1.2: the current year is expanded; else the newest year with periods */
export function defaultOpenYear(years: number[], today: ISODate) {
  const cur = Number(today.slice(0, 4));
  return years.includes(cur) ? cur : years[0];
}

/**
 * R1.6 (D61): the period whose start is closest to the new start.
 * Tie → the earlier one; still tied → the most recently created.
 */
export function defaultPrevious(periods: Period[], start: ISODate | null): Period | null {
  if (periods.length === 0) return null;
  if (!start) return sortPeriods(periods)[0];
  const s = parseISO(start);
  return [...periods].sort((a, b) => {
    const da = Math.abs(differenceInCalendarDays(parseISO(a.start), s));
    const db = Math.abs(differenceInCalendarDays(parseISO(b.start), s));
    if (da !== db) return da - db;
    if (a.start !== b.start) return a.start < b.start ? -1 : 1;
    return b.createdAt - a.createdAt;
  })[0];
}

/** R1.8: the carry-over amount (0 → no entry) */
export const carryOver = (prev: Period | null) => (prev ? soDu(prev) : 0);

/** R1.6 + R1.8: build a new period from the form and the selected previous period */
export function buildPeriod(
  input: { name: string; start: ISODate; end: ISODate | null },
  prev: Period | null,
  settings: Settings,
  now = Date.now(),
): Period {
  const carry = carryOver(prev);
  return {
    id: uid(),
    name: input.name.trim(),
    start: input.start,
    end: input.end,
    createdAt: now,
    // D62: maximum copied from the previous period, else from 6.0
    living: prev ? { ...prev.living } : { max: settings.livingMax, icon: '🍜', color: 'orange' },
    // R1.6: goals copied, never "done" (R2.5)
    goals: prev ? prev.goals.map((g) => ({ ...g, id: uid(), done: false })) : [],
    expenses: [],
    incomes:
      carry !== 0
        ? [{ id: uid(), amount: carry, description: CARRY_OVER_TEXT, date: input.start, createdAt: now }]
        : [],
    transfers: [],
  };
}

/** R1.5 / R3.5: entries that would fall outside new dates */
export function entriesOutside(p: Period, start: ISODate, end: ISODate | null) {
  return [...p.expenses, ...p.incomes, ...p.transfers].filter(
    (e) => e.date < start || (end !== null && e.date > end),
  ).length;
}

/** R2.3: delete a goal, moving its entries to Sinh hoạt */
export function deleteGoal(p: Period, goalId: string) {
  p.goals = p.goals.filter((g) => g.id !== goalId);
  for (const e of p.expenses) if (e.category === goalId) e.category = LIVING;
}

export const findPeriod = (d: Data, id: string | undefined) => d.periods.find((p) => p.id === id);
