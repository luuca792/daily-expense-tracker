import { Dialog } from '../../components/Dialog';
import { Ico } from '../../components/Ico';
import { countOn, spentOn } from '../../domain/calc';
import { removeGoal } from '../../domain/goals';
import { money } from '../../domain/money';
import type { Period } from '../../domain/types';
import { useStore } from '../../state/store';

/** 5.7 Delete Goal: its entries move to Sinh hoạt (R2.3); undo toast */
export function S5_7_DeleteGoal({ p, goalId, onCancel, onDeleted }: {
  p: Period; goalId: string; onCancel: () => void; onDeleted: () => void;
}) {
  const updateWithUndo = useStore((s) => s.updateWithUndo);
  const g = p.goals.find((x) => x.id === goalId);
  if (!g) return null;
  return (
    <Dialog onClose={onCancel}>
      <div className="ic">🗑</div>
      <div className="title">Xóa mục tiêu “{g.name}”?</div>
      <div className="move-box">
        <Ico icon={g.icon} color={g.color} />
        <span><b>{countOn(p, g.id)} khoản</b> ({money(spentOn(p, g.id))})</span>
        <span className="move-arrow">→</span>
        <Ico icon={p.living.icon} color={p.living.color} />
        <b>Sinh hoạt</b>
      </div>
      <div className="btn-row">
        <button className="btn" onClick={onCancel}>Hủy</button>
        <button className="btn danger" onClick={() => {
          updateWithUndo('Đã xóa mục tiêu', (d) => removeGoal(d, p.id, g.id));
          onDeleted();
        }}>Xóa</button>
      </div>
    </Dialog>
  );
}
