import { format, parseISO } from 'date-fns';
import { ISODate, Period } from './types';

export const todayISO = () => format(new Date(), 'yyyy-MM-dd');

export const inPeriod = (p: Period, date: ISODate) => date >= p.start && (p.end === null || date <= p.end);

/** R3.2: today if inside the period, else the last added entry's date, else the start date */
export function defaultDate(p: Period, today = todayISO()): ISODate {
  if (inPeriod(p, today)) return today;
  const all = [...p.expenses, ...p.incomes, ...p.transfers];
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

/** "Thứ 4 · 30/09" (D40) */
export function dayLabel(date: ISODate) {
  const d = parseISO(date);
  const dow = d.getDay();
  return `${dow === 0 ? 'Chủ nhật' : `Thứ ${dow + 1}`} · ${format(d, 'dd/MM')}`;
}
