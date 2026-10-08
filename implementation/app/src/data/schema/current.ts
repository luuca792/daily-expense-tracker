// The schema version the app reads and writes. A new version changes these two re-exports (plan §4.3).
export * from './v1';
export type { DataV1 as Data } from './v1';
export { COLOR_KEYS_V1 as COLOR_KEYS } from './v1';
export const CURRENT_VERSION = 1;
