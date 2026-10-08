// One Zustand store holding the whole Data in memory (plan §2.1). Screens change data only through
// update(recipe): the recipe runs on a copy of the CURRENT data, so a change made in another tab
// (replaced in here by autosave) is never overwritten by a sheet that was left open.
import { create } from 'zustand';
import { Data, emptyData } from '../domain/types';

export interface Toast {
  text: string;
  /** data before the change, for Hoàn tác; null = no undo (e.g. a save error) */
  prev: Data | null;
  key: number;
}

/** Where the current data came from. Only 'local' changes are saved (autosave.ts). */
export type Origin = 'boot' | 'local' | 'other-tab';

export interface Store {
  /** null = nothing stored yet → 1.0 Welcome */
  data: Data | null;
  origin: Origin;
  toast: Toast | null;
  /** 5.1 toggle per period, remembered while the app is open (R5) */
  toggles: Record<string, 'exp' | 'inc'>;
  /** epoch ms of the last export (6.0 Xuất dữ liệu), null = never */
  lastExportAt: number | null;

  /** after boot (main.tsx) */
  init: (data: Data | null, lastExportAt: number | null) => void;
  /** 1.0 Bắt đầu mới */
  start: () => void;
  /** change a copy of the data */
  update: (recipe: (d: Data) => void) => void;
  /** change and offer an undo toast */
  updateWithUndo: (text: string, recipe: (d: Data) => void) => void;
  undo: () => void;
  showToast: (text: string) => void;
  hideToast: () => void;
  setToggle: (periodId: string, v: 'exp' | 'inc') => void;
  /** another tab saved: take its data (not saved again) */
  replaceFromOtherTab: (data: Data) => void;
  setLastExportAt: (ms: number) => void;
}

const apply = (d: Data, recipe: (d: Data) => void) => {
  const next = structuredClone(d);
  recipe(next);
  return next;
};

export const useStore = create<Store>()((set, get) => ({
  data: null,
  origin: 'boot',
  toast: null,
  toggles: {},
  lastExportAt: null,

  init: (data, lastExportAt) => set({ data, lastExportAt, origin: 'boot', toast: null, toggles: {} }),
  start: () => set({ data: emptyData(), origin: 'local' }),
  update: (recipe) => set({ data: apply(get().data!, recipe), origin: 'local', toast: null }),
  updateWithUndo: (text, recipe) => {
    const prev = get().data!;
    set({ data: apply(prev, recipe), origin: 'local', toast: { text, prev, key: Date.now() } });
  },
  // Undo is just another save of the previous data (plan §4.5)
  undo: () => {
    const t = get().toast;
    if (t?.prev) set({ data: t.prev, origin: 'local', toast: null });
  },
  showToast: (text) => set({ toast: { text, prev: null, key: Date.now() } }),
  hideToast: () => set({ toast: null }),
  setToggle: (periodId, v) => set({ toggles: { ...get().toggles, [periodId]: v } }),
  // The undo toast is dropped: its `prev` predates the other tab's change
  replaceFromOtherTab: (data) => set({ data, origin: 'other-tab', toast: null }),
  setLastExportAt: (ms) => set({ lastExportAt: ms }),
}));

/** The app's data, for screens that are only rendered once data exists */
export const useData = () => useStore((s) => s.data!);
