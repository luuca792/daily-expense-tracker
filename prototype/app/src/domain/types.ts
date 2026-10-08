export type ISODate = string; // yyyy-MM-dd

/** Category id of the default goal Sinh hoạt (R2.2). `null` = untracked (R3.1). */
export const LIVING = 'living';

export type ColorKey =
  | 'orange' | 'blue' | 'pink' | 'violet' | 'green' | 'amber'
  | 'indigo' | 'slate' | 'red' | 'teal' | 'cyan' | 'lime';

export interface Goal {
  id: string;
  name: string;
  icon: string;
  color: ColorKey;
  target: number;
  done: boolean; // R2.5
}

export interface Living {
  max: number;
  icon: string;
  color: ColorKey;
}

export interface Expense {
  id: string;
  amount: number;
  /** LIVING, a goal id, or null for untracked spending */
  category: string | null;
  description: string;
  date: ISODate;
  createdAt: number;
}

export interface Income {
  id: string;
  amount: number; // may be negative (carry-over, D60)
  description: string;
  date: ISODate;
  createdAt: number;
}

export interface Transfer {
  id: string;
  dir: 'in' | 'out'; // in = Gửi vào (deposit), out = Rút ra (withdrawal)
  amount: number; // > 0
  date: ISODate;
  createdAt: number;
}

export interface Period {
  id: string;
  name: string;
  start: ISODate;
  end: ISODate | null;
  createdAt: number;
  living: Living;
  goals: Goal[];
  expenses: Expense[];
  incomes: Income[];
  transfers: Transfer[];
}

export interface Settings {
  livingMax: number;
  largeFrom: number;
}

export interface Data {
  schemaVersion: 1;
  settings: Settings;
  periods: Period[];
  baseSavings: number | null; // R6.7
  /** Display name shown on 2.0; null until asked on 1.1 (first start) */
  userName: string | null;
}

export const DEFAULT_SETTINGS: Settings = { livingMax: 4000, largeFrom: 200 };

export function emptyData(): Data {
  return { schemaVersion: 1, settings: { ...DEFAULT_SETTINGS }, periods: [], baseSavings: null, userName: null };
}

/** Display name: trimmed, at most NAME_MAX characters; empty → null (the caller keeps the old name) */
export const NAME_MAX = 30;
export function cleanName(raw: string): string | null {
  const n = raw.trim().slice(0, NAME_MAX);
  return n === '' ? null : n;
}

export function uid(): string {
  // crypto.randomUUID needs a secure context; the phone opens the LAN address over http.
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
