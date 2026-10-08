import { describe, expect, it } from 'vitest';
import { demoData } from '../store/seed';
import {
  activePeriod, chi, conLai, fundBalance, fundIn, fundOut, goalSegments, livingCount, livingSpent,
  removalAllowed, reserve, shares, soDu, sortPeriods, spentOn, thu, transferAllowed, wealth,
} from './calc';
import { defaultDate, groupByDay } from './entries';
import {
  buildPeriod, carryOver, closesActive, closingEnd, createPeriod, deletePeriod, entriesOutside, normalizePeriods, yearGroups,
} from './periods';
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
    expect(reserve(sep)).toBe(500); // Nhà ở is 100 over; the other goals still need 500
    expect(conLai(sep)).toBe(10000);
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
  it('overspending one goal does not lower the others', () => {
    const p = structuredClone(sep);
    p.goals[0].target = 1; // Nhà ở far over target
    expect(reserve(p)).toBe(500);
  });
  it('a done goal reserves nothing', () => {
    const p = structuredClone(sep);
    p.goals[1].done = true;
    expect(reserve(p)).toBe(500 - Math.max(p.goals[1].target - spentOn(p, p.goals[1].id), 0));
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
  it('create closes the active period and carries its Số dư over', () => {
    const dd = structuredClone(data);
    const p = createPeriod(dd, { name: 'Tháng 11/2026', start: '2026-11-01' });
    expect(dd.periods.find((x) => x.id === 'p-oct')!.end).toBe('2026-10-31');
    expect(activePeriod(dd)!.id).toBe(p.id);
    expect(p.end).toBeNull();
    expect(p.incomes[0].amount).toBe(10255);
  });
  it('closing end is never before the last entry or the start', () => {
    const oct = get('p-oct');
    const last = [...oct.expenses, ...oct.incomes].map((e) => e.date).sort().at(-1)!;
    expect(closingEnd(oct, last)).toBe(last); // new period starts on the day of the last entry
    expect(closingEnd({ ...oct, expenses: [], incomes: [] }, '2026-10-01')).toBe('2026-10-01');
  });
  it('a past start date closes nothing; the mistake can be undone by re-dating', () => {
    const dd = structuredClone(data);
    expect(closesActive(dd, '2026-09-15')).toBe(false);
    expect(closesActive(dd, '2026-10-01')).toBe(true);
    const p = createPeriod(dd, { name: 'x', start: '2026-09-15' });
    expect(activePeriod(dd)!.id).toBe('p-oct');
    expect(dd.periods.find((x) => x.id === 'p-oct')!.end).toBeNull();
    expect(p.end).toBe('2026-09-30'); // closed before Tháng 10 starts
    // editing the active period's start to before Tháng 9 flips the active period, and back again
    const oct = dd.periods.find((x) => x.id === 'p-oct')!;
    oct.start = '2026-08-31';
    normalizePeriods(dd);
    expect(activePeriod(dd)!.id).toBe(p.id);
    expect(p.end).toBeNull();
    oct.start = '2026-10-01';
    normalizePeriods(dd);
    expect(activePeriod(dd)!.id).toBe('p-oct');
    expect(oct.end).toBeNull();
  });
  it('deleting the active period reopens the one before it', () => {
    const dd = structuredClone(data);
    deletePeriod(dd, 'p-oct');
    expect(activePeriod(dd)!.id).toBe('p-sep');
    expect(activePeriod(dd)!.end).toBeNull();
    const dd2 = structuredClone(data);
    deletePeriod(dd2, 'p-dalat'); // a past period: nothing reopens
    expect(dd2.periods.find((x) => x.id === 'p-sep')!.end).toBe('2026-09-30');
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
    // fund −3.000 after the base was deleted; the withdrawal of 3.000 is edited
    expect(transferAllowed(0, -3000, 'out', 1000)).toBe(true); // lowered: fund rises to −1.000
    expect(transferAllowed(0, -3000, 'out', 4000)).toBe(false); // raised: fund drops to −4.000
    expect(removalAllowed(-1, 3000)).toBe(false);
  });
  it('R7.2 total wealth and shares', () => {
    const w = wealth(data);
    expect([w.fund, w.balance, w.total]).toEqual([6000, 10255, 16255]);
    expect(w.shares).toEqual([37, 63]);
    expect(shares(100, -5)).toBeNull();
    expect(shares(1, 1000)).toEqual([1, 99]); // never 0% while both parts > 0
    expect(shares(1000, 1)).toEqual([99, 1]);
  });
});

describe('display name', () => {
  it('trimmed, max 30 characters; empty → null so the old name stays', async () => {
    const { cleanName } = await import('./types');
    expect(cleanName('  Lan  ')).toBe('Lan');
    expect(cleanName('   ')).toBeNull();
    expect(cleanName('a'.repeat(40))).toHaveLength(30);
  });
});
