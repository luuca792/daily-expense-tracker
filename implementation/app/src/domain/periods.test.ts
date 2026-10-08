import { describe, expect, it } from 'vitest';
import { demoData } from './__fixtures__/sample';
import { activePeriod, sortPeriods } from './calc';
import {
  buildPeriod, carryOver, closesActive, closingEnd, createPeriod, defaultOpenYear, deletePeriod, editPeriod,
  entriesOutside, normalizePeriods, yearGroups,
} from './periods';
import { Data, DEFAULT_SETTINGS, emptyData } from './types';

const data = demoData();
const get = (id: string) => data.periods.find((p) => p.id === id)!;
const sep = get('p-sep');

/** Plan §3.2: end is null exactly for the active period, a date for every other one */
function expectEndRule(d: Data) {
  const [active, ...rest] = sortPeriods(d.periods);
  if (active) expect(active.end).toBeNull();
  for (const p of rest) expect(p.end).not.toBeNull();
}

describe('R1.1 / R1.2 year groups', () => {
  it('grouped by start year, newest first', () => {
    expect(yearGroups(data.periods).map((g) => g.year)).toEqual([2026]);
    const dd = structuredClone(data);
    dd.periods[0].start = '2025-12-01';
    expect(yearGroups(dd.periods).map((g) => g.year)).toEqual([2026, 2025]);
  });
  it('current year open, else the newest', () => {
    expect(defaultOpenYear([2026, 2025], '2025-05-01')).toBe(2025);
    expect(defaultOpenYear([2025, 2024], '2026-05-01')).toBe(2025);
  });
});

describe('period lifecycle', () => {
  it('the sample data follows the end rule', () => expectEndRule(data));

  it('create closes the active period and carries its Số dư over', () => {
    const dd = structuredClone(data);
    const p = createPeriod(dd, { name: ' Tháng 11/2026 ', start: '2026-11-01' });
    expect(p.name).toBe('Tháng 11/2026');
    expect(dd.periods.find((x) => x.id === 'p-oct')!.end).toBe('2026-10-31');
    expect(activePeriod(dd)!.id).toBe(p.id);
    expect(p.end).toBeNull();
    expect(p.incomes[0].amount).toBe(10255);
    expectEndRule(dd);
  });

  it('the first period: nothing to carry over, Sinh hoạt maximum from settings (D62)', () => {
    const dd = emptyData();
    dd.settings.livingMax = 3000;
    const p = createPeriod(dd, { name: 'Tháng 10', start: '2026-10-01' });
    expect(p.incomes).toEqual([]);
    expect(p.goals).toEqual([]);
    expect(p.living.max).toBe(3000);
    expectEndRule(dd);
  });

  it('closing end is never before the last entry or the start', () => {
    const oct = get('p-oct');
    const last = [...oct.expenses, ...oct.incomes].map((e) => e.date).sort().at(-1)!;
    expect(closingEnd(oct, last)).toBe(last); // new period starts on the day of the last entry
    expect(closingEnd({ ...oct, expenses: [], incomes: [] }, '2026-10-01')).toBe('2026-10-01');
  });

  it('a past start date closes nothing; the mistake is undone by re-dating', () => {
    const dd = structuredClone(data);
    expect(closesActive(dd, '2026-09-15')).toBe(false);
    expect(closesActive(dd, '2026-10-01')).toBe(true);
    const p = createPeriod(dd, { name: 'x', start: '2026-09-15' });
    expect(activePeriod(dd)!.id).toBe('p-oct');
    expect(dd.periods.find((x) => x.id === 'p-oct')!.end).toBeNull();
    expect(p.end).toBe('2026-09-30'); // closed before Tháng 10 starts
    expectEndRule(dd);
    // re-dating the active period to before Tháng 9 flips the active period, and back again
    editPeriod(dd, 'p-oct', { name: 'Tháng 10/2026', start: '2026-08-31' });
    expect(activePeriod(dd)!.id).toBe(p.id);
    expect(p.end).toBeNull();
    expectEndRule(dd);
    editPeriod(dd, 'p-oct', { name: 'Tháng 10/2026', start: '2026-10-01' });
    expect(activePeriod(dd)!.id).toBe('p-oct');
    expect(dd.periods.find((x) => x.id === 'p-oct')!.end).toBeNull();
    expectEndRule(dd);
  });

  it('no active period: nothing to close', () => {
    expect(closesActive(emptyData(), '2026-10-01')).toBe(false);
  });

  it('deleting the active period reopens the one before it', () => {
    const dd = structuredClone(data);
    deletePeriod(dd, 'p-oct');
    expect(activePeriod(dd)!.id).toBe('p-sep');
    expect(activePeriod(dd)!.end).toBeNull();
    expectEndRule(dd);
    const dd2 = structuredClone(data);
    deletePeriod(dd2, 'p-dalat'); // a past period: nothing reopens
    expect(dd2.periods.find((x) => x.id === 'p-sep')!.end).toBe('2026-09-30');
    expectEndRule(dd2);
  });

  it('deleting the last period leaves no periods', () => {
    const dd = emptyData();
    const p = createPeriod(dd, { name: 'x', start: '2026-10-01' });
    deletePeriod(dd, p.id);
    expect(dd.periods).toEqual([]);
  });

  it('normalizePeriods is idempotent', () => {
    const dd = structuredClone(data);
    normalizePeriods(dd);
    expect(dd).toEqual(data);
  });
});

describe('R1.8 carry-over', () => {
  it('Số dư carried, goals copied with new ids and not done', () => {
    expect(carryOver(get('p-oct'))).toBe(10255);
    const p = buildPeriod({ name: 'Tháng 11/2026', start: '2026-11-01' }, sep, DEFAULT_SETTINGS);
    expect(p.incomes).toMatchObject([{ amount: 10500, description: 'Còn lại từ tháng trước', date: '2026-11-01' }]);
    expect(p.goals.every((g) => !g.done)).toBe(true);
    expect(p.goals.length).toBe(5);
    expect(p.goals.map((g) => g.id)).not.toEqual(sep.goals.map((g) => g.id));
    expect(p.living).toEqual(sep.living);
    expect(p.living).not.toBe(sep.living);
  });
  it('negative carry-over; none when 0', () => {
    const neg = buildPeriod({ name: 'x', start: '2026-08-19' }, get('p-dalat'), DEFAULT_SETTINGS);
    expect(neg.incomes[0].amount).toBe(-1200);
    const zero = structuredClone(sep);
    zero.incomes = [];
    zero.transfers = [];
    zero.expenses = [];
    expect(buildPeriod({ name: 'x', start: '2026-11-01' }, zero, DEFAULT_SETTINGS).incomes).toEqual([]);
  });
});

describe('R3.5 entries outside new dates', () => {
  it('counts expenses, incomes and transfers', () => {
    expect(entriesOutside(sep, '2026-09-01', '2026-09-29')).toBe(4);
    expect(entriesOutside(sep, '2026-09-01', null)).toBe(0);
    expect(entriesOutside(sep, '2026-09-02', null)).toBeGreaterThan(0);
  });
});
