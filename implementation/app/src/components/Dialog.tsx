import { ReactNode, useRef } from 'react';
import { useGhostExit } from './motion';

/** Centered confirm dialog (4.2, 4.3, 5.7); tapping outside closes it */
export function Dialog({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  const dim = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  useGhostExit(dim, box);
  return (
    <>
      <div ref={dim} className="dim dlg" onClick={onClose} />
      <div ref={box} className="dialog fixed-col" role="alertdialog">{children}</div>
    </>
  );
}
