// Store recipes: saveX / removeX in entries.ts, goals.ts, savings.ts, plus livingPerDay and transferHistory
import { describe, expect, it } from 'vitest';
import { demoData } from './__fixtures__/sample';
import { livingPerDay } from './calc';
import { removeExpense, removeIncome, saveExpense, saveIncome } from './entries';
import { categoryDisplay, removeGoal, saveGoal, saveLiving } from './goals';
import { fundBalance, removeTransfer, saveTransfer, transferHistory } from './savings';
import { LIVING } from './types';

const fresh = () => demoData();
const oct = (d: ReturnType<typeof demoData>) => d.periods.find((p) => p.id === 'p-oct')!;

describe('expenses', () => {
  it('add at the end, edit in place, remove', () => {
    const d = fresh();
    const id = saveExpense(d, 'p-oct', { amount: 50, category: LIVING, description: ' Phở ', date: '2026-10-02' }, undefined, 123)!;
    const e = oct(d).expenses.at(-1)!;
    expect(e).toEqual({ id, amount: 50, category: LIVING, description: 'Phở', date: '2026-10-02', createdAt: 123 });
    saveExpense(d, 'p-oct', { amount: 60, category: LIVING, description: 'Bún', date: '2026-10-03' }, id);
    expect(oct(d).expenses.find((x) => x.id === id)).toMatchObject({ amount: 60, description: 'Bún', createdAt: 123 });
    removeExpense(d, 'p-oct', id);
    expect(oct(d).expenses.find((x) => x.id === id)).toBeUndefined();
  });
  it('R3.1 untracked has no description', () => {
    const d = fresh();
    const id = saveExpense(d, 'p-oct', { amount: 5, category: null, description: 'x', date: '2026-10-02' })!;
    expect(oct(d).expenses.find((x) => x.id === id)!.description).toBe('');
  });
  it('a period or entry deleted in another tab: nothing happens', () => {
    const d = fresh();
    const before = structuredClone(d);
    expect(saveExpense(d, 'gone', { amount: 5, category: null, description: '', date: '2026-10-02' })).toBeNull();
    expect(saveExpense(d, 'p-oct', { amount: 5, category: null, description: '', date: '2026-10-02' }, 'gone')).toBeNull();
    removeExpense(d, 'gone', 'x');
    expect(d).toEqual(before);
  });
});

describe('incomes', () => {
  it('negative amounts are kept; descriptions trimmed', () => {
    const d = fresh();
    const id = saveIncome(d, 'p-oct', { amount: -100, description: ' Nợ ', date: '2026-10-02' })!;
    expect(oct(d).incomes.find((x) => x.id === id)).toMatchObject({ amount: -100, description: 'Nợ' });
    removeIncome(d, 'p-oct', id);
    expect(oct(d).incomes.find((x) => x.id === id)).toBeUndefined();
  });
});

describe('goals', () => {
  it('new goal at the end, not done; toggle done; Sinh hoạt fields', () => {
    const d = fresh();
    const id = saveGoal(d, 'p-oct', { name: ' Quà ', icon: '🎁', color: 'pink', target: 300 })!;
    expect(oct(d).goals.at(-1)).toEqual({ id, name: 'Quà', icon: '🎁', color: 'pink', target: 300, done: false });
    saveGoal(d, 'p-oct', { name: 'Quà', icon: '🎁', color: 'pink', target: 300 }, id, true);
    expect(oct(d).goals.at(-1)!.done).toBe(true);
    saveLiving(d, 'p-oct', { icon: '🍚', color: 'teal', max: 5000 });
    expect(oct(d).living).toEqual({ icon: '🍚', color: 'teal', max: 5000 });
  });
  it('removeGoal moves entries to Sinh hoạt; category display', () => {
    const d = fresh();
    const p = oct(d);
    const id = saveGoal(d, 'p-oct', { name: 'Quà', icon: '🎁', color: 'pink', target: 300 })!;
    const eid = saveExpense(d, 'p-oct', { amount: 10, category: id, description: '', date: '2026-10-02' })!;
    expect(categoryDisplay(p, id)).toEqual({ name: 'Quà', icon: '🎁', color: 'pink' });
    removeGoal(d, 'p-oct', id);
    expect(p.expenses.find((e) => e.id === eid)!.category).toBe(LIVING);
    expect(categoryDisplay(p, id)).toBeNull();
    expect(categoryDisplay(p, null)).toBeNull();
    expect(categoryDisplay(p, LIVING)!.name).toBe('Sinh hoạt');
  });
});

describe('transfers', () => {
  it('save changes the fund; remove; history order', () => {
    const d = fresh();
    const before = fundBalance(d);
    const id = saveTransfer(d, 'p-oct', { dir: 'out', amount: 500, date: '2026-10-03' })!;
    expect(fundBalance(d)).toBe(before - 500);
    expect(transferHistory(d)[0].t.id).toBe(id);
    removeTransfer(d, 'p-oct', id);
    expect(fundBalance(d)).toBe(before);
    const h = transferHistory(d).map((x) => x.t.date);
    expect([...h].sort().reverse()).toEqual(h);
  });
});

describe('5.3 Sinh hoạt per day', () => {
  it('closed period: every day start → end, sums Sinh hoạt + untracked', () => {
    const sep = demoData().periods.find((p) => p.id === 'p-sep')!;
    const days = livingPerDay(sep);
    expect(days.length).toBe(30);
    expect(days[0].date).toBe('2026-09-01');
    expect(days.reduce((a, x) => a + x.amount, 0)).toBe(3100);
  });
  it('active period runs to today; a start in the future is one day', () => {
    const p = oct(fresh());
    expect(livingPerDay(p, '2026-10-05').length).toBe(5);
    expect(livingPerDay(p, '2026-09-20').length).toBe(1);
  });
});
