import { format, parseISO } from 'date-fns';
import { ISODate } from './types';

const nf = new Intl.NumberFormat('vi-VN');
const MINUS = '−';

/** Amounts are integers in thousands of đồng, vi-VN grouping: 10.500 (D48) */
export const money = (n: number) => (n < 0 ? MINUS : '') + nf.format(Math.abs(n));

/** "+20.000" / "−9.500" */
export const signed = (n: number) => (n < 0 ? MINUS : '+') + nf.format(Math.abs(n));

/** Always show a minus sign: "−60" (D49) */
export const minus = (n: number) => (n < 0 ? '+' : MINUS) + nf.format(Math.abs(n));

export const fmtDate = (d: ISODate) => format(parseISO(d), 'dd/MM/yyyy');
export const fmtShort = (d: ISODate) => format(parseISO(d), 'dd/MM');

/** R1.4: "01/09 → 30/09/2026" (header) */
export function headerDates(start: ISODate, end: ISODate | null) {
  if (!end) return { text: `${fmtDate(start)} → `, open: true };
  const sameYear = start.slice(0, 4) === end.slice(0, 4);
  return { text: `${sameYear ? fmtShort(start) : fmtDate(start)} → ${fmtDate(end)}`, open: false };
}
