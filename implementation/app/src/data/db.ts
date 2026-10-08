// IndexedDB through Dexie (plan §4.1): one key → value table. Dexie's own version stays 1 forever;
// format changes go through the app's schemaVersion and migrations/, never through Dexie versions.
import Dexie, { type Table } from 'dexie';

export const DB_NAME = 'so-chi-tieu';

/** Keys of the `kv` table */
export const KEY = {
  /** the whole Data object */
  data: 'data',
  /** epoch ms of the last export; outside `data`, so it is never exported or migrated */
  lastExportAt: 'lastExportAt',
  /** raw data just before migrating away from version n */
  backup: (n: number) => `backup-v${n}`,
} as const;

export class KvDb extends Dexie {
  kv!: Table<unknown, string>;
  constructor(name = DB_NAME) {
    super(name);
    this.version(1).stores({ kv: '' }); // outbound keys: put(value, key)
  }
}

let shared: KvDb | null = null;
/** The app's database, opened on first use */
export const getDb = () => (shared ??= new KvDb());
