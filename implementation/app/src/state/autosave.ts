// Saving (plan §4.5): every local change saves the whole Data, no debounce. Other tabs are told, and their
// saves are picked up here.
import type { StoreApi } from 'zustand';
import type { Repository } from '../data/repository';
import { onOtherTabSaved, postSaved } from '../data/tabs';
import type { Store } from './store';

export const SAVE_FAILED_TEXT = 'Chưa lưu được dữ liệu';

export interface AutosaveDeps {
  repo: Repository;
  postSaved?: () => void;
  onOtherTabSaved?: (cb: () => void) => () => void;
  /** a newer app version runs in another tab: reload so this tab gets it too (the service worker serves it) */
  reload?: () => void;
}

/** Starts saving; returns the stop function */
export function startAutosave(store: StoreApi<Store>, deps: AutosaveDeps) {
  const { repo, reload = () => location.reload() } = deps;
  const post = deps.postSaved ?? postSaved;
  const listen = deps.onOtherTabSaved ?? onOtherTabSaved;

  const unsubscribe = store.subscribe((s, prev) => {
    if (s.data === prev.data || s.origin !== 'local' || s.data === null) return;
    repo.save(s.data).then(
      (r) => (r === 'newer' ? reload() : post()),
      // Storage full or blocked: the change stays in memory, and the next change saves everything again
      () => store.getState().showToast(SAVE_FAILED_TEXT),
    );
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
  };
}
