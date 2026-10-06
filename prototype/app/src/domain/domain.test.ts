import { describe, expect, it } from 'vitest';
import { demoData } from '../store/seed';
import {
  activePeriod, chi, conLai, fundBalance, fundIn, fundOut, goalSegments, livingCount, livingSpent,
  removalAllowed, reserve, shares, soDu, sortPeriods, spentOn, thu, transferAllowed, wealth,
} from './calc';
import { defaultDate, groupByDay } from './entries';
import { buildPeriod, carryOver, defaultPrevious, entriesOutside, yearGroups } from './periods';
import { DEFAULT_SETTINGS, Period } from './types';

const data = demoData();
const get = (id: string) => data.periods.find((p) => p.id === id)!;
const sep = get('p-sep');

describe('seed matches sample-data.md', () => {
  it('period totals and entry counts', () => {
    const rows = [['p-oct', 10500, 245, 4], ['p-sep', 20000, 9500, 43], ['p-dalat', 2000, 3200, 18], ['p-jul', 19000, 8900, 38]] as const;
    for (const [id, t, c, n] of rows) {
      const p = get(id);
      expect([thu(p), chi(p), p.expenses.length + p.incomes.length + p.transfers.length]).toEqual([t, c, n]);
    }
  });
  it('Tháng 9 summary (R4)', () => {
    expect(soDu(sep)).toBe(10500);
    expect(reserve(sep)).toBe(400);
    expect(conLai(sep)).toBe(10100);
    expect(livingSpent(sep)).toEqual({ categorized: 2850, untracked: 250, total: 3100 });
    expect(sep.expenses.length).toBe(40);
    expect(livingCount(sep)).toBe(29);
    expect(sep.goals.map((g) => spentOn(sep, g.id))).toEqual([2600, 2000, 900, 582, 318]);
  });
  it('no large filler on 28–30/09', () => {
    expect(sep.expenses.filter((e) => e.date >= '2026-09-28').length).toBe(9);
  });
});

describe('R4 reserve', () => {
  it('marking an overspent goal done raises the reserve of the others', () => {
    const p = structuredClone(sep);
    p.goals[0].done = true; // Nhà ở 2.600 / 2.500
    expect(reserve(p)).toBe(500);
  });
  it('never below 0', () => {
    const p = structuredClone(sep);
    p.goals.forEach((g) => (g.target = 1));
    expect(reserve(p)).toBe(0);
  });
});

describe('R4.1 chart 2', () => {
  it('Sinh hoạt first, then goals in order, adding up to Chi', () => {
    const segs = goalSegments(sep);
    expect(segs.map((s) => s.amount)).toEqual([3100, 2600, 2000, 900, 582, 318]);
    expect(segs.reduce((a, s) => a + s.amount, 0)).toBe(chi(sep));
  });
});

describe('R1 periods', () => {
  it('R1.3 order and R7.1 active period', () => {
    expect(sortPeriods(data.periods).map((p) => p.id)).toEqual(['p-oct', 'p-sep', 'p-dalat', 'p-jul']);
    expect(activePeriod(data)!.id).toBe('p-oct');
  });
  it('R1.1 year groups', () => {
    expect(yearGroups(data.periods).map((g) => g.year)).toEqual([2026]);
  });
  it('R1.6 nearest previous period, tie → earlier', () => {
    expect(defaultPrevious(data.periods, '2026-11-01')!.id).toBe('p-oct');
    expect(defaultPrevious(data.periods, '2026-08-23')!.id).toBe('p-dalat'); // 9 days vs 9 days → earlier
    expect(defaultPrevious([], '2026-11-01')).toBeNull();
  });
  it('R1.8 carry-over, copied goals not done', () => {
    expect(carryOver(get('p-oct'))).toBe(10255);
    const p = buildPeriod({ name: 'Tháng 11/2026', start: '2026-11-01', end: null }, sep, DEFAULT_SETTINGS);
    expect(p.incomes).toMatchObject([{ amount: 10500, description: 'Còn lại từ tháng trước', date: '2026-11-01' }]);
    expect(p.goals.every((g) => !g.done)).toBe(true);
    expect(p.goals.length).toBe(5);
  });
  it('R1.8 negative carry-over; none when 0; D62 maximum from settings', () => {
    const neg = buildPeriod({ name: 'x', start: '2026-08-19', end: null }, get('p-dalat'), DEFAULT_SETTINGS);
    expect(neg.incomes[0].amount).toBe(-1200);
    const none = buildPeriod({ name: 'x', start: '2026-08-19', end: null }, null, { livingMax: 3000, largeFrom: 200 });
    expect(none.incomes).toEqual([]);
    expect(none.living.max).toBe(3000);
  });
  it('R3.5 entries outside new dates', () => {
    expect(entriesOutside(sep, '2026-09-01', '2026-09-29')).toBe(4);
    expect(entriesOutside(sep, '2026-09-01', null)).toBe(0);
  });
});

describe('R3 entries', () => {
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
  });
});

describe('R6 fund and R7 wealth', () => {
  it('R6.2 balance and totals', () => {
    expect([fundBalance(data), fundIn(data), fundOut(data)]).toEqual([6000, 7000, 2000]);
    const sepDeposit = sep.transfers[0].id;
    expect(fundBalance(data, sepDeposit)).toBe(3000);
    const dlWithdraw = get('p-dalat').transfers[0].id;
    expect(fundBalance(data, dlWithdraw)).toBe(8000);
  });
  it('R6.4 limits', () => {
    expect(transferAllowed(6000, 6000, 'out', 6000)).toBe(true);
    expect(transferAllowed(6000, 6000, 'out', 6001)).toBe(false);
    expect(transferAllowed(-500, -500, 'out', 1)).toBe(false);
    expect(transferAllowed(-500, -500, 'in', 100)).toBe(true); // raises a negative fund
    expect(transferAllowed(-100, 400, 'in', 50)).toBe(false); // lowering a deposit below 0
    expect(removalAllowed(-1, 3000)).toBe(false);
  });
  it('R7.2 total wealth and shares', () => {
    const w = wealth(data);
    expect([w.fund, w.balance, w.total]).toEqual([6000, 10255, 16255]);
    expect(w.shares).toEqual([37, 63]);
    expect(shares(100, -5)).toBeNull();
  });
});
