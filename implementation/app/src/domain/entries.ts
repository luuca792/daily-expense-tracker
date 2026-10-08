// R3 entries: expenses, incomes and savings transfers inside a period.
import { todayISO } from './dates';
import { newId } from './ids';
import type { Data, ISODate, Period } from './types';

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

// ---------- changes (store recipes) ----------
// Each change finds its period and item by id in the CURRENT data. If they are gone (deleted in another
// tab, plan §4.5), nothing happens. Saving returns the item's id, or null when nothing was saved.

const periodOf = (d: Data, periodId: string) => d.periods.find((p) => p.id === periodId);

export interface ExpenseInput { amount: number; category: string | null; description: string; date: ISODate }

/** 5.4 save: new (no id) or edit. R3.1: an untracked expense has no description. */
export function saveExpense(d: Data, periodId: string, input: ExpenseInput, id?: string, now = Date.now()): string | null {
  const p = periodOf(d, periodId);
  if (!p) return null;
  const fields = { ...input, description: input.category === null ? '' : input.description.trim() };
  if (id === undefined) {
    const e = { id: newId(), ...fields, createdAt: now };
    p.expenses.push(e);
    return e.id;
  }
  const e = p.expenses.find((x) => x.id === id);
  if (!e) return null;
  Object.assign(e, fields);
  return e.id;
}

export function removeExpense(d: Data, periodId: string, id: string) {
  const p = periodOf(d, periodId);
  if (p) p.expenses = p.expenses.filter((e) => e.id !== id);
}

export interface IncomeInput { amount: number; description: string; date: ISODate }

/** 5.9 save: new (no id) or edit. The amount may be negative (D60), never 0. */
export function saveIncome(d: Data, periodId: string, input: IncomeInput, id?: string, now = Date.now()): string | null {
  const p = periodOf(d, periodId);
  if (!p) return null;
  const fields = { ...input, description: input.description.trim() };
  if (id === undefined) {
    const i = { id: newId(), ...fields, createdAt: now };
    p.incomes.push(i);
    return i.id;
  }
  const i = p.incomes.find((x) => x.id === id);
  if (!i) return null;
  Object.assign(i, fields);
  return i.id;
}

export function removeIncome(d: Data, periodId: string, id: string) {
  const p = periodOf(d, periodId);
  if (p) p.incomes = p.incomes.filter((e) => e.id !== id);
}
