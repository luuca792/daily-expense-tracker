/** Ask the browser not to evict our storage when space runs low (plan §4.2 step 1). The answer is ignored. */
export async function requestPersist() {
  try {
    await navigator.storage?.persist?.();
  } catch {
    /* not supported or refused */
  }
}
