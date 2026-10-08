import { describe, expect, it } from 'vitest';
import { demoData } from './__fixtures__/sample';
import { fundBalance, fundIn, fundOut, fundWithoutPeriod, removalAllowed, transferAllowed } from './savings';

const data = demoData();
const get = (id: string) => data.periods.find((p) => p.id === id)!;

describe('R6 savings fund', () => {
  it('R6.2 balance and totals', () => {
    expect([fundBalance(data), fundIn(data), fundOut(data)]).toEqual([6000, 7000, 2000]);
    expect(fundBalance(data, get('p-sep').transfers[0].id)).toBe(3000);
    expect(fundBalance(data, get('p-dalat').transfers[0].id)).toBe(8000);
  });
  it('R6.7 no base counts as 0', () => {
    expect(fundBalance({ ...data, baseSavings: null })).toBe(fundIn(data) - fundOut(data));
  });
  it('R6.4 one check for deposits and withdrawals', () => {
    expect(transferAllowed(6000, 6000, 'out', 6000)).toBe(true);
    expect(transferAllowed(6000, 6000, 'out', 6001)).toBe(false);
    expect(transferAllowed(-500, -500, 'out', 1)).toBe(false);
    expect(transferAllowed(-500, -500, 'in', 100)).toBe(true); // raises a negative fund
    expect(transferAllowed(-100, 400, 'in', 50)).toBe(false); // lowering a deposit below 0
    // fund −3.000 after the base was deleted; the withdrawal of 3.000 is edited
    expect(transferAllowed(0, -3000, 'out', 1000)).toBe(true); // lowered: fund rises to −1.000
    expect(transferAllowed(0, -3000, 'out', 4000)).toBe(false); // raised: fund drops to −4.000
    expect(removalAllowed(-1, 3000)).toBe(false);
    expect(removalAllowed(-1, -5)).toBe(true);
  });
  it('R6.6 fund without a period', () => {
    expect(fundWithoutPeriod(data, 'p-sep')).toBe(3000);
    expect(fundWithoutPeriod(data, 'p-dalat')).toBe(8000);
  });
});
