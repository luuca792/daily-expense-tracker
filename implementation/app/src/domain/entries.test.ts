import { describe, expect, it } from 'vitest';
import { demoData } from './__fixtures__/sample';
import { defaultDate, groupByDay, inPeriod } from './entries';
import { Period } from './types';

const data = demoData();
const get = (id: string) => data.periods.find((p) => p.id === id)!;
const sep = get('p-sep');

describe('R3 entries', () => {
  it('inside a period: open end has no limit', () => {
    expect(inPeriod(sep, '2026-09-01')).toBe(true);
    expect(inPeriod(sep, '2026-08-31')).toBe(false);
    expect(inPeriod(sep, '2026-10-01')).toBe(false);
    expect(inPeriod(get('p-oct'), '2030-01-01')).toBe(true);
  });
  it('R3.2 default date', () => {
    expect(defaultDate(get('p-oct'), '2026-10-05')).toBe('2026-10-05');
    expect(defaultDate(sep, '2026-10-05')).toBe('2026-09-30'); // last added entry
    const empty: Period = { ...sep, expenses: [], incomes: [], transfers: [] };
    expect(defaultDate(empty, '2026-10-05')).toBe('2026-09-01');
  });
  it('R3.3 newest day first, newest added first', () => {
    const g = groupByDay(sep.expenses);
    expect(g[0].date).toBe('2026-09-30');
    expect(g[0].items.map((e) => e.amount)).toEqual([60, 16, 51, 35]);
    const inc = groupByDay([...sep.incomes, ...sep.transfers]);
    expect(inc[0].items.map((e) => e.amount)).toEqual([3000, 21750]);
    expect(groupByDay([])).toEqual([]);
  });
});
