// JSON export (plan §4.6). The envelope is identical in every version, so any exported file can be imported later
// through the same migration pipeline.
import { format } from 'date-fns';

export const EXPORT_FORMAT = 'so-chi-tieu';

export interface Envelope {
  format: typeof EXPORT_FORMAT;
  /** version of `data`; null only for a BootError export of a record without one */
  schemaVersion: number | null;
  /** local time with offset: "2026-10-08T09:30:00+07:00" */
  exportedAt: string;
  appVersion: string;
  data: unknown;
}

export function buildEnvelope(data: unknown, now = new Date(), appVersion = __APP_VERSION__): Envelope {
  const v = typeof data === 'object' && data !== null ? (data as { schemaVersion?: unknown }).schemaVersion : undefined;
  return {
    format: EXPORT_FORMAT,
    schemaVersion: typeof v === 'number' ? v : null,
    exportedAt: format(now, "yyyy-MM-dd'T'HH:mm:ssxxx"),
    appVersion,
    data,
  };
}

/** so-chi-tieu-yyyy-MM-dd.json (local date) */
export const exportFileName = (now = new Date()) => `so-chi-tieu-${format(now, 'yyyy-MM-dd')}.json`;

export const envelopeJson = (env: Envelope) => JSON.stringify(env, null, 2);

export type ExportResult = 'shared' | 'downloaded' | 'cancelled';

/**
 * Hand the file to the user: the share sheet where files can be shared (iPhone, Android: save to Files or Drive,
 * send on Zalo…), since plain downloads from a home-screen app are unreliable on iPhone; else a download link.
 * Closing the share sheet → 'cancelled' (the export date is then not updated).
 */
export async function exportData(data: unknown, now = new Date()): Promise<ExportResult> {
  const name = exportFileName(now);
  const file = new File([envelopeJson(buildEnvelope(data, now))], name, { type: 'application/json' });
  if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return 'shared';
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return 'cancelled';
      // share refused for another reason (e.g. no user gesture left): fall back to a download
    }
  }
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
  return 'downloaded';
}
