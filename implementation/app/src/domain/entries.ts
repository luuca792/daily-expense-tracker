// R3 entries: expenses, incomes and savings transfers inside a period.
import { todayISO } from './dates';
import type { ISODate, Period } from './types';

/** Every entry of a period, whatever its kind */
export const allEntries = (p: Period) => [...p.expenses, ...p.incomes, ...p.transfers];

export const inPeriod = (p: Period, date: ISODate) => date >= p.start && (p.end === null || date <= p.end);

/** R3.2 default date of a new entry: today if inside the period, else the last added entry's date, else the start date */
export function defaultDate(p: Period, today = todayISO()): ISODate {
  if (inPeriod(p, today)) return today;
  const all = allEntries(p);
  if (all.length === 0) return p.start;
  return all.reduce((a, b) => (b.createdAt > a.createdAt ? b : a)).date;
}

/** R3.3: grouped by day, newest day first; inside a day, most recently added first */
export function groupByDay<T extends { date: ISODate; createdAt: number }>(items: T[]) {
  const sorted = [...items].sort((a, b) =>
    a.date !== b.date ? (a.date < b.date ? 1 : -1) : b.createdAt - a.createdAt,
  );
  const groups: { date: ISODate; items: T[] }[] = [];
  for (const it of sorted) {
    const last = groups[groups.length - 1];
    if (last && last.date === it.date) last.items.push(it);
    else groups.push({ date: it.date, items: [it] });
  }
  return groups;
}
