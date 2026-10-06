import { create } from 'zustand';
import { Data, emptyData } from '../domain/types';

interface Toast { text: string; prev: Data | null; key: number }

interface Store {
  /** null = no saved data → 1.0 Welcome */
  data: Data | null;
  toast: Toast | null;
  /** 5.1 toggle per period, remembered while the app is open (R5) */
  toggles: Record<string, 'exp' | 'inc'>;
  start: () => void;
  replace: (d: Data | null) => void;
  /** mutate a copy of the data */
  update: (recipe: (d: Data) => void) => void;
  /** mutate and offer an undo toast */
  updateWithUndo: (text: string, recipe: (d: Data) => void) => void;
  undo: () => void;
  hideToast: () => void;
  setToggle: (periodId: string, v: 'exp' | 'inc') => void;
}

// Prototype: data lives in memory only, so a page refresh starts over (main.tsx loads the sample data).
// The old saved copy (localStorage 'so-chi-tieu') is removed so it doesn't linger.
try { localStorage.removeItem('so-chi-tieu'); } catch { /* storage blocked */ }

export const useStore = create<Store>()(
    (set, get) => ({
      data: null,
      toast: null,
      toggles: {},
      start: () => set({ data: emptyData() }),
      replace: (d) => set({ data: d, toast: null, toggles: {} }),
      update: (recipe) => {
        const d = structuredClone(get().data!);
        recipe(d);
        set({ data: d, toast: null });
      },
      updateWithUndo: (text, recipe) => {
        const prev = get().data!;
        const d = structuredClone(prev);
        recipe(d);
        set({ data: d, toast: { text, prev, key: Date.now() } });
      },
      undo: () => {
        const t = get().toast;
        if (t?.prev) set({ data: t.prev, toast: null });
      },
      hideToast: () => set({ toast: null }),
      setToggle: (periodId, v) => set({ toggles: { ...get().toggles, [periodId]: v } }),
    }),
);

/** The app's data; screens are only rendered once data exists. */
export const useData = () => useStore((s) => s.data!);
