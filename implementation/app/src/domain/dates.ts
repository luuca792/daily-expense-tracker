import { addDays, format, parseISO } from 'date-fns';
import type { ISODate } from './types';

/**
 * Today as 'yyyy-MM-dd' in the local calendar (plan §3.3).
 * Never toISOString(): that is UTC, so in Vietnam (UTC+7) it returns yesterday before 7:00.
 */
export const todayISO = (now = new Date()): ISODate => format(now, 'yyyy-MM-dd');

/** `date` moved by `days` calendar days */
export const shiftDays = (date: ISODate, days: number): ISODate => format(addDays(parseISO(date), days), 'yyyy-MM-dd');

export const fmtDate = (d: ISODate) => format(parseISO(d), 'dd/MM/yyyy');
export const fmtShort = (d: ISODate) => format(parseISO(d), 'dd/MM');

/** R1.4 header dates: "01/09 → 30/09/2026"; the year is shown once when both dates share it. Open period: "01/10/2026 → " */
export function headerDates(start: ISODate, end: ISODate | null) {
  if (!end) return { text: `${fmtDate(start)} → `, open: true };
  const sameYear = start.slice(0, 4) === end.slice(0, 4);
  return { text: `${sameYear ? fmtShort(start) : fmtDate(start)} → ${fmtDate(end)}`, open: false };
}

/** Day group label "Thứ 4 · 30/09" (D40); Sunday is "Chủ nhật" */
export function dayLabel(date: ISODate) {
  const d = parseISO(date);
  const dow = d.getDay();
  return `${dow === 0 ? 'Chủ nhật' : `Thứ ${dow + 1}`} · ${format(d, 'dd/MM')}`;
}
