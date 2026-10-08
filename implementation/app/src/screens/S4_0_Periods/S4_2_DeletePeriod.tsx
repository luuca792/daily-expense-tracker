import { useNavigate } from 'react-router-dom';
import { Dialog } from '../../components/Dialog';
import { deletePeriod } from '../../domain/periods';
import { fundBalance, fundWithoutPeriod, removalAllowed } from '../../domain/savings';
import type { Period } from '../../domain/types';
import { useData, useStore } from '../../state/store';

/** 4.2 Delete Period: confirm + undo toast (D61). Refused if it would push the fund lower below 0 (R6.6).
 *  Deleting the active period reopens the one before it (plan §2.5). */
export function S4_2_DeletePeriod({ p, onClose }: { p: Period; onClose: () => void }) {
  const d = useData();
  const nav = useNavigate();
  const updateWithUndo = useStore((s) => s.updateWithUndo);
  const allowed = removalAllowed(fundWithoutPeriod(d, p.id), fundBalance(d));
  return (
    <Dialog onClose={onClose}>
      <div className="ic">🗑</div>
      <div className="title">Xóa kỳ “{p.name}”?</div>
      {!allowed && <div className="err center">Vượt quá quỹ tiết kiệm</div>}
      <div className="btn-row">
        <button className="btn" onClick={onClose}>Hủy</button>
        <button className="btn danger" disabled={!allowed} onClick={() => {
          nav('/periods', { replace: true });
          updateWithUndo('Đã xóa kỳ', (dd) => deletePeriod(dd, p.id));
        }}>Xóa</button>
      </div>
    </Dialog>
  );
}
