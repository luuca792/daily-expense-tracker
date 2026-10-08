// Stored data, schema version 1 (plan §3.1).
// FROZEN at the first real release: after that, never edit this file. A format change adds v2.ts
// and a migration step (plan §4.3). Migrations import these types, so they must keep describing
// what version 1 really stored.

/** 'yyyy-MM-dd', local calendar day (plan §3.3) */
export type ISODate = string;

export const COLOR_KEYS_V1 = [
  'orange', 'blue', 'pink', 'violet', 'green', 'amber',
  'indigo', 'slate', 'red', 'teal', 'cyan', 'lime',
] as const;
export type ColorKey = (typeof COLOR_KEYS_V1)[number];

export interface Goal {
  id: string;
  name: string;
  icon: string;
  color: ColorKey;
  /** thousands of đồng, integer */
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
  /** 'living', a goal id, or null for untracked spending. A deleted goal's id counts as untracked (R3). */
  category: string | null;
  description: string;
  date: ISODate;
  /** epoch ms, only for ordering within a day */
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
  /** set by the app (plan §2.5): null exactly for the active period */
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

export interface DataV1 {
  schemaVersion: 1;
  settings: Settings;
  periods: Period[];
  baseSavings: number | null; // R6.7
  /** display name on 2.0; null until asked on 1.1 */
  userName: string | null;
}
