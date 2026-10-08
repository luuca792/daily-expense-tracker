import { useRef } from 'react';
import { useGhostExit } from './motion';

/** Floating ＋ above the 5.0 bottom bar (R5: its action depends on the tab and the 5.1 toggle) */
export function PlusButton({ onClick }: { onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useGhostExit(ref);
  return (
    <div ref={ref} className="fab-wrap fixed-col">
      <button className="fab" onClick={onClick} aria-label="Thêm">＋</button>
    </div>
  );
}
