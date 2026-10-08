import { useEffect, useRef } from 'react';
import { useStore } from '../state/store';
import { useGhostExit } from './motion';

/** Hides after this long */
const TOAST_MS = 5000;

/** The one toast of the app. Hoàn tác only when the change can be undone (not for save errors or export). */
export function Toast() {
  const toast = useStore((s) => s.toast);
  return toast ? <ToastBox key={toast.key} text={toast.text} canUndo={toast.prev !== null} /> : null;
}

function ToastBox({ text, canUndo }: { text: string; canUndo: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useGhostExit(ref);
  const undo = useStore((s) => s.undo);
  const hide = useStore((s) => s.hideToast);
  useEffect(() => {
    const t = setTimeout(hide, TOAST_MS);
    return () => clearTimeout(t);
  }, [hide]);
  return (
    <div ref={ref} className="toast fixed-col">
      <div><span>{text}</span>{canUndo && <button onClick={undo}>Hoàn tác</button>}</div>
    </div>
  );
}
