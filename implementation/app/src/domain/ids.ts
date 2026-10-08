/**
 * New id for any stored item (plan §3.2): a UUID, so data from different devices can be merged later.
 * crypto.randomUUID needs a secure context; on plain-http dev (phone on the LAN address) it falls back
 * to time + random. Ids are opaque strings: never parse them.
 */
export function newId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch {
      /* insecure context */
    }
  }
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
}
