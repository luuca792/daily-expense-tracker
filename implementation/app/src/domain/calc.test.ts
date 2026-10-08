import { describe, expect, it } from 'vitest';
import { demoData } from './__fixtures__/sample';
import {
  activePeriod, categoryOf, chi, conLai, goalSegments, isReadOnly, livingCount, livingSpent, reserve, shares, soDu,
  sortPeriods, spentOn, thu, wealth, barColor,
} from './calc';
import { LIVING } from './types';

const data = demoData();
const get = (id: string) => data.periods.find((p) => p.id === id)!;
const sep = get('p-sep');

describe('sample data matches sample-data.md', () => {
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

describe('R4 reserve (per goal)', () => {
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

describe('R3 category of a deleted goal', () => {
  it('an expense pointing at a missing goal counts as untracked', () => {
    const p = structuredClone(sep);
    const e = p.expenses.find((x) => x.category === p.goals[0].id)!;
    e.category = 'gone';
    expect(categoryOf(p, e)).toBeNull();
    expect(livingSpent(p).untracked).toBe(250 + e.amount);
    expect(spentOn(p, 'gone')).toBe(0);
    expect(goalSegments(p).reduce((a, s) => a + s.amount, 0)).toBe(chi(p));
  });
  it('Sinh hoạt and existing goals are kept', () => {
    const e = sep.expenses.find((x) => x.category === LIVING)!;
    expect(categoryOf(sep, e)).toBe(LIVING);
  });
});

describe('R4 goal bar color', () => {
  it('under / on / over target', () => {
    expect([barColor(1, 2), barColor(2, 2), barColor(3, 2)]).toEqual(['yellow', 'green', 'red']);
  });
});

describe('R4.1 chart 2', () => {
  it('Sinh hoạt first, then goals in order, adding up to Chi', () => {
    const segs = goalSegments(sep);
    expect(segs.map((s) => s.amount)).toEqual([3100, 2600, 2000, 900, 582, 318]);
    expect(segs.reduce((a, s) => a + s.amount, 0)).toBe(chi(sep));
  });
});

describe('R1.3 order and R7.1 active period', () => {
  it('newest start first', () => {
    expect(sortPeriods(data.periods).map((p) => p.id)).toEqual(['p-oct', 'p-sep', 'p-dalat', 'p-jul']);
    expect(activePeriod(data)!.id).toBe('p-oct');
  });
  it('same start: created more recently first', () => {
    const a = { ...sep, id: 'a', createdAt: 1 };
    const b = { ...sep, id: 'b', createdAt: 2 };
    expect(sortPeriods([a, b]).map((p) => p.id)).toEqual(['b', 'a']);
  });
  it('only the active period can be changed', () => {
    expect(isReadOnly(data, get('p-oct'))).toBe(false);
    expect(isReadOnly(data, sep)).toBe(true);
  });
  it('no periods → no active period', () => {
    expect(activePeriod({ ...data, periods: [] })).toBeNull();
  });
});

describe('R7.2 total wealth and shares', () => {
  it('fund + active Số dư', () => {
    const w = wealth(data);
    expect([w.fund, w.balance, w.total]).toEqual([6000, 10255, 16255]);
    expect(w.shares).toEqual([37, 63]);
  });
  it('shares only when both parts > 0, never 0% or 100%', () => {
    expect(shares(100, -5)).toBeNull();
    expect(shares(0, 5)).toBeNull();
    expect(shares(1, 1000)).toEqual([1, 99]);
    expect(shares(1000, 1)).toEqual([99, 1]);
  });
});
