// load() and save() (plan §4.2, §4.3, §4.5). The only reader and writer of the `data` record.
import { CURRENT_VERSION, type Data } from './schema/current';
import { KEY, KvDb, getDb } from './db';
import { DataError, type DataErrorReason, type Options, readVersion, upgrade } from './migrations';

export type LoadResult =
  | { kind: 'empty' } // no data yet → 1.0 Welcome
  | { kind: 'ok'; data: Data }
  | { kind: 'error'; reason: DataErrorReason; message: string; raw: unknown }; // → BootError, nothing written

/** 'newer': the stored data was written by a newer app version in another tab; nothing was written */
export type SaveResult = 'ok' | 'newer';

/** Backups kept (`backup-vN`), most recent versions first */
const BACKUPS_KEPT = 2;

export function createRepository(db: KvDb = getDb(), opts: Options = {}) {
  const current = opts.current ?? CURRENT_VERSION;
  let tail: Promise<unknown> = Promise.resolve();

  /**
   * Boot load: read → refuse newer → migrate + validate in memory → if migrated, write the backup
   * of the untouched raw record and the new data in ONE transaction. Any failure writes nothing.
   */
  async function load(): Promise<LoadResult> {
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
   */
  function save(data: Data): Promise<SaveResult> {
    const run = tail.then(() =>
      db.transaction('rw', db.kv, async (): Promise<SaveResult> => {
        const stored = await db.kv.get(KEY.data);
        if (stored !== undefined && storedVersion(stored) > current) return 'newer';
        await db.kv.put(data, KEY.data);
        return 'ok';
      }),
    );
    tail = run.catch(() => undefined);
    return run;
  }

  /** The raw stored record, unchanged (BootError export, plan §4.4) */
  const readRaw = () => db.kv.get(KEY.data);

  async function getLastExportAt(): Promise<number | null> {
    const v = await db.kv.get(KEY.lastExportAt);
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
