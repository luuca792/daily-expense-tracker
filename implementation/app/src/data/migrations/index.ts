// Migration pipeline (plan §4.3): raw stored JSON of any released version → current Data.
// Used on boot, and later by import, so every exported file can be read back.
import { CURRENT_VERSION, type Data } from '../schema/current';
import { dataSchema } from '../schema/zod';

/** One upgrade step: plain JSON of version `from` → plain JSON of version `from + 1`.
 *  Each step is typed against the FROZEN schema/vN.ts files and is never deleted. */
export interface Step {
  from: number;
  run: (raw: unknown) => unknown;
}

/** Ordered list. Add `{ from: 1, run: v1ToV2 }` (from ./v1_to_v2) here when schema v2 ships. */
export const STEPS: Step[] = [];

export type DataErrorReason = 'invalid' | 'newer' | 'migration';

/** Stored data that can't be opened: BootError shows it, nothing is written */
export class DataError extends Error {
  constructor(public reason: DataErrorReason, message: string, public cause?: unknown) {
    super(message);
    this.name = 'DataError';
  }
}

/** schemaVersion of raw JSON; anything without a whole version ≥ 1 is invalid */
export function readVersion(raw: unknown): number {
  const v = typeof raw === 'object' && raw !== null ? (raw as { schemaVersion?: unknown }).schemaVersion : undefined;
  if (typeof v !== 'number' || !Number.isInteger(v) || v < 1) throw new DataError('invalid', 'missing schemaVersion');
  return v;
}

export interface Options {
  steps?: Step[];
  current?: number;
  validate?: (raw: unknown) => Data;
}

/** zod check of the current version. The checked object is returned as it was (zod would drop unknown keys). */
export function validateData(raw: unknown): Data {
  const r = dataSchema.safeParse(raw);
  if (!r.success) throw new DataError('invalid', r.error.issues.slice(0, 3).map((i) => `${i.path.join('.')}: ${i.message}`).join('; '));
  return raw as Data;
}

/**
 * Raw JSON → current Data, all in memory: run every needed step on a copy, then validate.
 * Throws DataError: 'newer' (written by a newer app, plan §4.2 rule 3), 'migration' (a step failed
 * or is missing), 'invalid' (no version, or the result fails validation). The input is never changed.
 */
export function upgrade(raw: unknown, opts: Options = {}): { data: Data; from: number } {
  const { steps = STEPS, current = CURRENT_VERSION, validate = validateData } = opts;
  const from = readVersion(raw);
  if (from > current) throw new DataError('newer', `schemaVersion ${from} > ${current}`);
  let out: unknown = structuredClone(raw);
  for (let v = from; v < current; v++) {
    const step = steps.find((s) => s.from === v);
    if (!step) throw new DataError('migration', `no step from v${v}`);
    try {
      out = step.run(out);
    } catch (e) {
      throw new DataError('migration', `step v${v}→v${v + 1} failed`, e);
    }
    if (readVersion(out) !== v + 1) throw new DataError('migration', `step v${v} did not produce v${v + 1}`);
  }
  return { data: validate(out), from };
}
