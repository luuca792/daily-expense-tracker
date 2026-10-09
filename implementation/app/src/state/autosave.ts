// Saving (plan §4.5): every local change saves the whole Data, no debounce. Other tabs are told, and their
// saves are picked up here.
import type { StoreApi } from 'zustand';
import type { Repository } from '../data/repository';
import { onOtherTabSaved, postSaved } from '../data/tabs';
import type { Data } from '../domain/types';
import type { Store } from './store';

export const SAVE_FAILED_TEXT = 'Chưa lưu được dữ liệu';

export interface AutosaveDeps {
  repo: Repository;
  postSaved?: () => void;
  onOtherTabSaved?: (cb: () => void) => () => void;
  /** a newer app version runs in another tab: reload so this tab gets it too (the service worker serves it) */
  reload?: () => void;
  /** calls back when the app comes back to the foreground; returns the unsubscribe function */
  onVisible?: (cb: () => void) => () => void;
}

function onVisible(cb: () => void) {
  const listener = () => document.visibilityState === 'visible' && cb();
  document.addEventListener('visibilitychange', listener);
  return () => document.removeEventListener('visibilitychange', listener);
}

/** Starts saving; returns the stop function */
export function startAutosave(store: StoreApi<Store>, deps: AutosaveDeps) {
  const { repo, reload = () => location.reload() } = deps;
  const post = deps.postSaved ?? postSaved;
  const listen = deps.onOtherTabSaved ?? onOtherTabSaved;
  /** the last save failed: what's in memory isn't stored yet */
  let unsaved = false;

  const save = (data: Data) =>
    repo.save(data).then(
      (r) => {
        unsaved = false;
        if (r === 'newer') reload();
        else post();
      },
      // Storage full, blocked or not answering: the change stays in memory, and the next change (or coming back
      // to the app) saves everything again
      () => {
        unsaved = true;
        store.getState().showToast(SAVE_FAILED_TEXT);
      },
    );

  const unsubscribe = store.subscribe((s, prev) => {
    if (s.data === prev.data || s.origin !== 'local' || s.data === null) return;
    void save(s.data);
  });

  // Back to the foreground after a failed save: try again without waiting for the next change. Phones often
  // break the storage connection while the app is in the background; the retry opens a new one.
  const unvisible = (deps.onVisible ?? onVisible)(() => {
    const { data } = store.getState();
    if (unsaved && data) void save(data);
  });

  // Another tab saved: re-read through the full load (validation included). Data from a newer app → reload.
  const unlisten = listen(async () => {
    const r = await repo.load();
    if (r.kind === 'ok') store.getState().replaceFromOtherTab(r.data);
    else if (r.kind === 'error' && r.reason === 'newer') reload();
  });

  return () => {
    unsubscribe();
    unlisten();
    unvisible();
  };
}
