import { Dialog } from '../../components/Dialog';
import type { Period } from '../../domain/types';

/** 4.3 Close Period: creating a period with a start ≥ the active start closes the active one (read-only history) */
export function S4_3_ClosePeriod({ p, onCancel, onConfirm }: { p: Period; onCancel: () => void; onConfirm: () => void }) {
  return (
    <Dialog onClose={onCancel}>
      <div className="ic teal">🔒</div>
      <div className="title">Đóng kỳ “{p.name}”?</div>
      <div className="btn-row">
        <button className="btn" onClick={onCancel}>Hủy</button>
        <button className="btn pri" onClick={onConfirm}>Tạo kỳ</button>
      </div>
    </Dialog>
  );
}
