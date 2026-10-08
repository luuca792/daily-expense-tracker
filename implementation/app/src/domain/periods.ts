// R1 periods and their lifecycle (plan §2.5): one period at a time, `end` is set by the app, never typed.
import { activePeriod, soDu, sortPeriods } from './calc';
import { shiftDays } from './dates';
import { allEntries } from './entries';
import { newId } from './ids';
import { Data, ISODate, Period, Settings } from './types';

export const CARRY_OVER_TEXT = 'Còn lại từ tháng trước';

/** R1.1 / R1.2: year groups by start year, newest first (periods inside in R1.3 order) */
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

/** R1.8: the carry-over amount (0 → no entry) */
export const carryOver = (prev: Period | null) => (prev ? soDu(prev) : 0);

/** R1.6 + R1.8: build a new period from the form and the period it carries over from */
export function buildPeriod(
  input: { name: string; start: ISODate },
  prev: Period | null,
  settings: Settings,
  now = Date.now(),
): Period {
  const carry = carryOver(prev);
  return {
    id: newId(),
    name: input.name.trim(),
    start: input.start,
    end: null,
    createdAt: now,
    // D62: maximum copied from the previous period, else from 6.0
    living: prev ? { ...prev.living } : { max: settings.livingMax, icon: '🍜', color: 'orange' },
    // R1.6: goals copied with new ids, never "done" (R2.5)
    goals: prev ? prev.goals.map((g) => ({ ...g, id: newId(), done: false })) : [],
    expenses: [],
    incomes:
      carry !== 0
        ? [{ id: newId(), amount: carry, description: CARRY_OVER_TEXT, date: input.start, createdAt: now }]
        : [],
    transfers: [],
  };
}

/** Closing a period: end = the day before the new start, but never before its last entry or its own start */
export function closingEnd(p: Period, newStart: ISODate): ISODate {
  const last = allEntries(p).reduce((m, e) => (e.date > m ? e.date : m), p.start);
  const dayBefore = shiftDays(newStart, -1);
  return dayBefore > last ? dayBefore : last;
}

/**
 * Runs after every period create / edit / delete (plan §2.5): the active period (R7.1, newest start)
 * has end = null, and any other period still open is closed before the next newer period starts.
 * Periods that already have an end keep it. Start dates are free, so a mistake stays correctable:
 * re-dating a period back flips everything back.
 */
export function normalizePeriods(d: Data) {
  sortPeriods(d.periods).forEach((p, i, sorted) => {
    if (i === 0) p.end = null;
    else if (p.end === null) p.end = closingEnd(p, sorted[i - 1].start);
  });
}

/** True when a period starting on `start` would become the active one, and so close the current one (4.3) */
export const closesActive = (d: Data, start: ISODate) => {
  const a = activePeriod(d);
  return !!a && start >= a.start;
};

/** 4.1 Create: carries over the active period's Số dư (R1.8); a newer start closes the active period */
export function createPeriod(d: Data, input: { name: string; start: ISODate }, now = Date.now()): Period {
  const p = buildPeriod(input, activePeriod(d), d.settings, now);
  d.periods.push(p);
  normalizePeriods(d);
  return p;
}

/** R1.5 / R3.5: number of entries that would fall outside new dates (4.1 Edit refuses to save while > 0) */
export function entriesOutside(p: Period, start: ISODate, end: ISODate | null) {
  return allEntries(p).filter((e) => e.date < start || (end !== null && e.date > end)).length;
}

/** 4.1 Edit (active period only): name and start date. The caller checks entriesOutside first. */
export function editPeriod(d: Data, id: string, input: { name: string; start: ISODate }) {
  const p = findPeriod(d, id);
  if (!p) return;
  p.name = input.name.trim();
  p.start = input.start;
  normalizePeriods(d);
}

/** 4.2: delete a period; if it was the active one, the one before it becomes active and is reopened */
export function deletePeriod(d: Data, id: string) {
  d.periods = d.periods.filter((p) => p.id !== id);
  normalizePeriods(d);
}

export const findPeriod = (d: Data, id: string | undefined) => d.periods.find((p) => p.id === id);
