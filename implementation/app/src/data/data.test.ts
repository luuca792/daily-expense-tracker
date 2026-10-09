import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { demoData } from '../domain/__fixtures__/sample';
import { emptyData } from '../domain/types';
import { KEY, KvDb } from './db';
import { buildEnvelope, envelopeJson, exportFileName } from './export';
import { DataError, type Step, upgrade, validateData } from './migrations';
import { createRepository } from './repository';
import { TimeoutError } from './timeout';
import type { Data } from './schema/current';

let n = 0;
const dbs: KvDb[] = [];
/** A fresh database per test */
function freshDb() {
  const db = new KvDb(`test-${++n}`);
  dbs.push(db);
  return db;
}
afterEach(async () => {
  for (const db of dbs.splice(0)) await db.delete();
});

/** Test steps for a pretend v2 that adds `note` to the data */
const toV2: Step = { from: 1, run: (raw) => ({ ...(raw as object), schemaVersion: 2, note: '' }) };
const failing: Step = { from: 1, run: () => { throw new Error('boom'); } };
const v2 = { current: 2, validate: (raw: unknown) => raw as Data };

const errorOf = (f: () => unknown) => {
  try {
    f();
  } catch (e) {
    return e instanceof DataError ? e.reason : 'other';
  }
  return null;
};

describe('fixtures (plan §5)', () => {
  const fixtures = import.meta.glob('./__fixtures__/*.json', { eager: true, import: 'default' });
  it('there is a fixture for every released version', () => {
    expect(Object.keys(fixtures)).toContain('./__fixtures__/v1-sample.json');
  });
  for (const [name, raw] of Object.entries(fixtures)) {
    it(`${name} migrates and validates`, () => {
      expect(() => upgrade(raw)).not.toThrow();
    });
  }
});

describe('validation', () => {
  it('accepts the sample and empty data', () => {
    expect(validateData(demoData())).toBeTruthy();
    expect(validateData(emptyData())).toBeTruthy();
  });
  it('rejects broken data', () => {
    const bad = (f: (d: Data) => void) => {
      const d = demoData();
      f(d);
      return errorOf(() => validateData(d));
    };
    expect(bad((d) => (d.periods[0].expenses[0].amount = 1.5))).toBe('invalid'); // amounts are integers
    expect(bad((d) => (d.periods[0].expenses[0].date = '2026-9-1'))).toBe('invalid');
    expect(bad((d) => (d.periods[0].transfers.push({ id: 'x', dir: 'in', amount: 0, date: '2026-09-01', createdAt: 0 })))).toBe('invalid');
    expect(bad((d) => ((d.periods[0].goals[0] as { color: string }).color = 'purple'))).toBe('invalid');
    expect(bad((d) => delete (d as Partial<Data>).userName)).toBe('invalid');
  });
  it('keeps the object as stored (no keys dropped)', () => {
    const d = { ...emptyData(), extra: 1 };
    expect(validateData(d)).toBe(d);
  });
});

describe('upgrade (plan §4.3)', () => {
  it('current data passes unchanged', () => {
    const d = demoData();
    expect(upgrade(d)).toEqual({ data: d, from: 1 });
  });
  it('refuses data from a newer app, and data without a version', () => {
    expect(errorOf(() => upgrade({ ...emptyData(), schemaVersion: 2 }))).toBe('newer');
    expect(errorOf(() => upgrade({ periods: [] }))).toBe('invalid');
    expect(errorOf(() => upgrade(null))).toBe('invalid');
  });
  it('runs the steps without changing the input', () => {
    const d = emptyData();
    const r = upgrade(d, { ...v2, steps: [toV2] });
    expect(r.from).toBe(1);
    expect(r.data).toMatchObject({ schemaVersion: 2, note: '' });
    expect(d.schemaVersion).toBe(1);
  });
  it('a failing or missing step is a migration error', () => {
    expect(errorOf(() => upgrade(emptyData(), { ...v2, steps: [failing] }))).toBe('migration');
    expect(errorOf(() => upgrade(emptyData(), { ...v2, steps: [] }))).toBe('migration');
  });
});

describe('repository', () => {
  it('nothing stored → empty; save → load returns it', async () => {
    const repo = createRepository(freshDb());
    expect(await repo.load()).toEqual({ kind: 'empty' });
    const d = demoData();
    expect(await repo.save(d)).toBe('ok');
    expect(await repo.load()).toEqual({ kind: 'ok', data: d });
  });

  it('invalid data → error with the raw record; nothing written', async () => {
    const db = freshDb();
    await db.kv.put({ schemaVersion: 1, periods: 'oops' }, KEY.data);
    const r = await createRepository(db).load();
    expect(r).toMatchObject({ kind: 'error', reason: 'invalid', raw: { periods: 'oops' } });
    expect(await db.kv.get(KEY.data)).toEqual({ schemaVersion: 1, periods: 'oops' });
  });

  it('data from a newer app is refused and nothing is written', async () => {
    const db = freshDb();
    const newer = { ...emptyData(), schemaVersion: 2 };
    await db.kv.put(newer, KEY.data);
    expect(await createRepository(db).load()).toMatchObject({ kind: 'error', reason: 'newer' });
    expect(await db.kv.get(KEY.data)).toEqual(newer);
    expect(await db.kv.count()).toBe(1);
  });

  it('a migration writes the backup and the new data', async () => {
    const db = freshDb();
    const d = demoData();
    await db.kv.put(d, KEY.data);
    const r = await createRepository(db, { ...v2, steps: [toV2] }).load();
    expect(r).toMatchObject({ kind: 'ok', data: { schemaVersion: 2 } });
    expect(await db.kv.get(KEY.backup(1))).toEqual(d);
    expect(await db.kv.get(KEY.data)).toMatchObject({ schemaVersion: 2, note: '' });
  });

  it('a failing migration leaves the data untouched and writes no backup', async () => {
    const db = freshDb();
    const d = demoData();
    await db.kv.put(d, KEY.data);
    const r = await createRepository(db, { ...v2, steps: [failing] }).load();
    expect(r).toMatchObject({ kind: 'error', reason: 'migration', raw: d });
    expect(await db.kv.get(KEY.data)).toEqual(d);
    expect(await db.kv.get(KEY.backup(1))).toBeUndefined();
  });

  it('keeps the two most recent backups', async () => {
    const db = freshDb();
    await db.kv.bulkPut([{ old: 1 }, { old: 2 }], [KEY.backup(1), KEY.backup(2)]);
    await db.kv.put({ ...emptyData(), schemaVersion: 3 }, KEY.data);
    const to4: Step = { from: 3, run: (raw) => ({ ...(raw as object), schemaVersion: 4 }) };
    await createRepository(db, { current: 4, steps: [to4], validate: (raw) => raw as Data }).load();
    const keys = (await db.kv.toCollection().primaryKeys()).sort();
    expect(keys).toEqual(['backup-v2', 'backup-v3', 'data']);
  });

  it('rapid saves land in order', async () => {
    const db = freshDb();
    const repo = createRepository(db);
    const saves = Array.from({ length: 20 }, (_, i) => repo.save({ ...emptyData(), userName: `n${i}` }));
    await Promise.all(saves);
    expect(await db.kv.get(KEY.data)).toMatchObject({ userName: 'n19' });
  });

  it('a tab running an older app never overwrites newer data', async () => {
    const db = freshDb();
    const newer = { ...emptyData(), schemaVersion: 2 };
    await db.kv.put(newer, KEY.data);
    expect(await createRepository(db).save(emptyData())).toBe('newer');
    expect(await db.kv.get(KEY.data)).toEqual(newer);
  });

  /** The next `n` transactions never answer, like a storage connection that broke in the background */
  function hangNext(db: KvDb, n: number) {
    const real = db.transaction.bind(db) as (...a: unknown[]) => unknown;
    vi.spyOn(db, 'transaction').mockImplementation(((...a: unknown[]) =>
      n-- > 0 ? new Promise(() => undefined) : real(...a)) as unknown as KvDb['transaction']);
    return vi.spyOn(db, 'close');
  }

  it('a stuck save times out, reconnects and is tried once more', async () => {
    const db = freshDb();
    const close = hangNext(db, 1);
    const repo = createRepository(db, { timeoutMs: 20 });
    expect(await repo.save({ ...emptyData(), userName: 'Lan' })).toBe('ok');
    expect(close).toHaveBeenCalledWith({ disableAutoOpen: false });
    expect(await db.kv.get(KEY.data)).toMatchObject({ userName: 'Lan' });
  });

  it('a save stuck twice fails, and the next save still goes through', async () => {
    const db = freshDb();
    hangNext(db, 2);
    const repo = createRepository(db, { timeoutMs: 20 });
    await expect(repo.save({ ...emptyData(), userName: 'a' })).rejects.toBeInstanceOf(TimeoutError);
    expect(await repo.save({ ...emptyData(), userName: 'b' })).toBe('ok');
    expect(await db.kv.get(KEY.data)).toMatchObject({ userName: 'b' });
  });

  it('saves replaced while waiting behind a stuck one are skipped', async () => {
    const db = freshDb();
    hangNext(db, 1);
    const repo = createRepository(db, { timeoutMs: 20 });
    const saves = Array.from({ length: 5 }, (_, i) => repo.save({ ...emptyData(), userName: `n${i}` }));
    expect(await Promise.all(saves)).toEqual(['ok', 'ok', 'ok', 'ok', 'ok']);
    expect(await db.kv.get(KEY.data)).toMatchObject({ userName: 'n4' });
    // all five were queued before the first ran: only n4 is written (stuck once, then retried)
    expect(db.transaction).toHaveBeenCalledTimes(2);
  });

  it('suspend closes the connection after the queued saves; the next save opens a fresh one', async () => {
    const db = freshDb();
    const repo = createRepository(db);
    const close = vi.spyOn(db, 'close');
    const first = repo.save({ ...emptyData(), userName: 'a' });
    repo.suspend();
    expect(close).not.toHaveBeenCalled(); // the save in the queue goes first
    expect(await first).toBe('ok');
    await new Promise((r) => setTimeout(r, 0));
    expect(close).toHaveBeenCalledWith({ disableAutoOpen: false });
    expect(db.isOpen()).toBe(false);
    expect(await repo.save({ ...emptyData(), userName: 'b' })).toBe('ok');
    expect(await db.kv.get(KEY.data)).toMatchObject({ userName: 'b' });
  });

  it('a stuck boot load reconnects and loads', async () => {
    const db = freshDb();
    await db.kv.put(demoData(), KEY.data);
    hangNext(db, 1);
    vi.spyOn(db.kv, 'get').mockImplementationOnce(() => new Promise(() => undefined) as never);
    expect(await createRepository(db, { timeoutMs: 20 }).load()).toEqual({ kind: 'ok', data: demoData() });
  });

  it('last export date is kept outside the data', async () => {
    const repo = createRepository(freshDb());
    expect(await repo.getLastExportAt()).toBeNull();
    await repo.setLastExportAt(123);
    expect(await repo.getLastExportAt()).toBe(123);
    expect(await repo.load()).toEqual({ kind: 'empty' });
  });
});

describe('export (plan §4.6)', () => {
  const now = new Date(2026, 9, 8, 9, 30, 0);
  it('envelope round-trip: export → parse → migrate → same data', () => {
    const d = demoData();
    const env = JSON.parse(envelopeJson(buildEnvelope(d, now, '1.0.0')));
    expect(env).toMatchObject({ format: 'so-chi-tieu', schemaVersion: 1, appVersion: '1.0.0' });
    expect(env.exportedAt).toMatch(/^2026-10-08T09:30:00([+-]\d{2}:\d{2}|Z)$/);
    expect(upgrade(env.data).data).toEqual(d);
  });
  it('raw records without a version still export', () => {
    expect(buildEnvelope('garbage', now, '1.0.0')).toMatchObject({ schemaVersion: null, data: 'garbage' });
  });
  it('file name uses the local date', () => {
    expect(exportFileName(now)).toBe('so-chi-tieu-2026-10-08.json');
  });
});
