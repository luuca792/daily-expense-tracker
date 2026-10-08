// dates.ts, money.ts, ids.ts, goals.ts and types.ts helpers
import { describe, expect, it } from 'vitest';
import { demoData } from './__fixtures__/sample';
import { dayLabel, headerDates, shiftDays, todayISO } from './dates';
import { deleteGoal } from './goals';
import { newId } from './ids';
import { minus, money, parseAmount, signed } from './money';
import { cleanName, emptyData, LIVING } from './types';

describe('dates', () => {
  it('today is the local calendar day, not UTC', () => {
    // 06:30 local on 8 Oct is still 8 Oct, whatever the time zone of the test machine
    expect(todayISO(new Date(2026, 9, 8, 6, 30))).toBe('2026-10-08');
    expect(todayISO(new Date(2026, 9, 8, 0, 0))).toBe('2026-10-08');
  });
  it('shiftDays crosses months and years', () => {
    expect(shiftDays('2026-10-01', -1)).toBe('2026-09-30');
    expect(shiftDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(shiftDays('2028-03-01', -1)).toBe('2028-02-29');
  });
  it('R1.4 header dates', () => {
    expect(headerDates('2026-09-01', '2026-09-30')).toEqual({ text: '01/09 → 30/09/2026', open: false });
    expect(headerDates('2025-12-15', '2026-01-14')).toEqual({ text: '15/12/2025 → 14/01/2026', open: false });
    expect(headerDates('2026-10-01', null)).toEqual({ text: '01/10/2026 → ', open: true });
  });
  it('D40 day label', () => {
    expect(dayLabel('2026-09-30')).toBe('Thứ 4 · 30/09');
    expect(dayLabel('2026-10-04')).toBe('Chủ nhật · 04/10');
  });
});

describe('money', () => {
  it('vi-VN grouping and signs', () => {
    expect(money(10500)).toBe('10.500');
    expect(money(-1200)).toBe('−1.200');
    expect(signed(20000)).toBe('+20.000');
    expect(signed(-9500)).toBe('−9.500');
    expect(minus(60)).toBe('−60');
  });
  it('parseAmount keeps digits only, max 9', () => {
    expect(parseAmount('1.700')).toBe(1700);
    expect(parseAmount('1.700', true)).toBe(-1700);
    expect(parseAmount('')).toBeNull();
    expect(parseAmount('abc')).toBeNull();
    expect(parseAmount('12345678901')).toBe(123456789);
  });
});

describe('ids', () => {
  it('unique strings', () => {
    const ids = new Set(Array.from({ length: 1000 }, newId));
    expect(ids.size).toBe(1000);
  });
});

describe('R2.3 delete goal', () => {
  it('its expenses move to Sinh hoạt', () => {
    const p = structuredClone(demoData().periods.find((x) => x.id === 'p-sep')!);
    const g = p.goals[0];
    const n = p.expenses.filter((e) => e.category === g.id).length;
    const living = p.expenses.filter((e) => e.category === LIVING).length;
    deleteGoal(p, g.id);
    expect(p.goals.find((x) => x.id === g.id)).toBeUndefined();
    expect(p.expenses.filter((e) => e.category === LIVING).length).toBe(living + n);
  });
});

describe('display name and empty data', () => {
  it('trimmed, max 30 characters; empty → null so the old name stays', () => {
    expect(cleanName('  Lan  ')).toBe('Lan');
    expect(cleanName('   ')).toBeNull();
    expect(cleanName('a'.repeat(40))).toHaveLength(30);
  });
  it('empty data has the current schema version and no name', () => {
    expect(emptyData()).toMatchObject({ schemaVersion: 1, periods: [], baseSavings: null, userName: null });
  });
});
