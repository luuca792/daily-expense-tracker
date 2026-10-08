// App types = the current stored schema (plan §2.3). Totals are never stored; calc.ts computes them.
import type { Data, Settings } from '../data/schema/current';
import { CURRENT_VERSION } from '../data/schema/current';

export type {
  ColorKey, Data, Expense, Goal, Income, ISODate, Living, Period, Settings, Transfer,
} from '../data/schema/current';
export { COLOR_KEYS } from '../data/schema/current';

/** Category id of the default goal Sinh hoạt (R2.2). `null` = untracked (R3.1). */
export const LIVING = 'living';

export const DEFAULT_SETTINGS: Settings = { livingMax: 4000, largeFrom: 200 };

/** Data after 1.0 Bắt đầu mới: no periods, no name yet (→ 1.1) */
export function emptyData(): Data {
  return {
    schemaVersion: CURRENT_VERSION, settings: { ...DEFAULT_SETTINGS }, periods: [], baseSavings: null, userName: null,
  };
}

/** Display name: trimmed, at most NAME_MAX characters; empty → null (the caller keeps the old name) */
export const NAME_MAX = 30;
export function cleanName(raw: string): string | null {
  const n = raw.trim().slice(0, NAME_MAX);
  return n === '' ? null : n;
}
