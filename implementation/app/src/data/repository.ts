// load() and save() (plan §4.2, §4.3, §4.5). The only reader and writer of the `data` record.
import { CURRENT_VERSION, type Data } from './schema/current';
import { KEY, KvDb, getDb } from './db';
import { DataError, type DataErrorReason, type Options, readVersion, upgrade } from './migrations';
import { withTimeout } from './timeout';

export type LoadResult =
  | { kind: 'empty' } // no data yet → 1.0 Welcome
  | { kind: 'ok'; data: Data }
  | { kind: 'error'; reason: DataErrorReason; message: string; raw: unknown }; // → BootError, nothing written

/** 'newer': the stored data was written by a newer app version in another tab; nothing was written */
export type SaveResult = 'ok' | 'newer';

/** Backups kept (`backup-vN`), most recent versions first */
const BACKUPS_KEPT = 2;

/**
 * A storage call that hasn't answered after this long counts as failed (plan §4.5). IndexedDB can stop answering
 * without an error (seen on phones after the app was in the background): without a limit, one stuck save
 * would hold up every later save in the queue and the user would keep typing into memory only.
 */
export const STORAGE_TIMEOUT_MS = 5000;

export function createRepository(db: KvDb = getDb(), opts: Options & { timeoutMs?: number } = {}) {
  const current = opts.current ?? CURRENT_VERSION;
  const timeoutMs = opts.timeoutMs ?? STORAGE_TIMEOUT_MS;
  let tail: Promise<unknown> = Promise.resolve();
  /** number of the newest save asked for; older saves still in the queue are skipped */
  let latest = 0;

  /**
   * Run a storage call with a time limit. If it fails or hangs: close the connection (Dexie opens a new one on the
   * next call) and try once more, then give up with the error. A stuck write that still lands later can't
   * overwrite a newer one: IndexedDB runs read-write transactions on the same store in the order they were
   * created, even across connections.
   */
  async function attempt<T>(op: () => PromiseLike<T>): Promise<T> {
    try {
      return await withTimeout(op(), timeoutMs);
    } catch {
      db.close({ disableAutoOpen: false });
      return withTimeout(op(), timeoutMs);
    }
  }

  /**
   * Boot load: read → refuse newer → migrate + validate in memory → if migrated, write the backup
   * of the untouched raw record and the new data in ONE transaction. Any failure writes nothing.
   */
  const load = () => attempt(loadOnce);

  async function loadOnce(): Promise<LoadResult> {
    const raw = await db.kv.get(KEY.data);
    if (raw === undefined) return { kind: 'empty' };
    let result: { data: Data; from: number };
    try {
      result = upgrade(raw, opts);
    } catch (e) {
      if (e instanceof DataError) return { kind: 'error', reason: e.reason, message: e.message, raw };
      throw e;
    }
    if (result.from < current) {
      await db.transaction('rw', db.kv, async () => {
        await db.kv.put(raw, KEY.backup(result.from));
        await db.kv.put(result.data, KEY.data);
        const backups = (await db.kv.toCollection().primaryKeys())
          .filter((k) => /^backup-v\d+$/.test(k))
          .sort((a, b) => Number(b.slice(8)) - Number(a.slice(8)));
        await db.kv.bulkDelete(backups.slice(BACKUPS_KEPT));
      });
    }
    return { kind: 'ok', data: result.data };
  }

  /**
   * Save the whole Data (plan §4.5). Writes go through a queue, so an older write never lands after a newer one.
   * Inside the transaction the stored version is checked: if another tab already runs a newer app and
   * migrated the data, this (older) tab must not overwrite it → 'newer'.
   * Every save writes the whole Data, so a save that a newer one has replaced while it waited is skipped ('ok'):
   * after a stuck save, the queue catches up with one write instead of one per change.
   */
  function save(data: Data): Promise<SaveResult> {
    const n = ++latest;
    const run = tail.then(() =>
      n !== latest
        ? ('ok' as const)
        : attempt(() =>
            db.transaction('rw', db.kv, async (): Promise<SaveResult> => {
              const stored = await db.kv.get(KEY.data);
              if (stored !== undefined && storedVersion(stored) > current) return 'newer';
              await db.kv.put(data, KEY.data);
              return 'ok';
            }),
          ),
    );
    tail = run.catch(() => undefined);
    return run;
  }

  /** The raw stored record, unchanged (BootError export, plan §4.4) */
  const readRaw = () => db.kv.get(KEY.data);

  async function getLastExportAt(): Promise<number | null> {
    const v = await attempt(() => db.kv.get(KEY.lastExportAt));
    return typeof v === 'number' ? v : null;
  }
  const setLastExportAt = (ms: number) => db.kv.put(ms, KEY.lastExportAt).then(() => undefined);

  return { load, save, readRaw, getLastExportAt, setLastExportAt };
}

function storedVersion(raw: unknown) {
  try {
    return readVersion(raw);
  } catch {
    return 0;
  }
}

export type Repository = ReturnType<typeof createRepository>;

let shared: Repository | null = null;
/** The app's repository on the app's database */
export const getRepository = () => (shared ??= createRepository());
