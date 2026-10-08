// Animation helpers (ported from the prototype). Enter animations are CSS; exits use ghost clones (useGhostExit).
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';

export const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/**
 * Exit animation without touching the call sites: when the element unmounts,
 * a clone stays on screen with the `leaving` class until its animation ends.
 */
export function useGhostExit(...refs: RefObject<HTMLElement>[]) {
  useLayoutEffect(() => {
    const nodes = refs.map((r) => r.current);
    return () => {
      const ghosts = nodes.filter((n): n is HTMLElement => !!n).map((n) => [n, n.cloneNode(true) as HTMLElement] as const);
      queueMicrotask(() => {
        // StrictMode re-runs effects without removing the DOM: no ghost then
        if (ghosts.some(([n]) => n.isConnected) || reducedMotion()) return;
        const host = document.querySelector('.app') ?? document.body;
        for (const [, g] of ghosts) {
          g.classList.add('leaving');
          g.setAttribute('aria-hidden', 'true');
          host.appendChild(g);
          const done = () => g.remove();
          g.addEventListener('animationend', (e) => { if (e.target === g) done(); });
          setTimeout(done, 400);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** A number that counts toward its new value instead of jumping */
export function useTween(value: number, ms = 450) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (from.current === value || reducedMotion()) { from.current = value; setShown(value); return; }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / ms);
      const v = a + (value - a) * (1 - Math.pow(1 - k, 3));
      from.current = v;
      setShown(k < 1 ? Math.round(v) : value);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return shown;
}

/** ids present at first render; later ids are new and get a highlight */
export function useNewIds(ids: string[]) {
  const seen = useRef<Set<string> | null>(null);
  if (seen.current === null) seen.current = new Set(ids);
  const fresh = new Set(ids.filter((id) => !seen.current!.has(id)));
  useEffect(() => { ids.forEach((id) => seen.current!.add(id)); });
  return fresh;
}
