import { useState } from 'react';
import { AmountBox } from '../../components/AmountBox';
import { Sheet } from '../../components/Sheet';
import { useData, useStore } from '../../state/store';

/** 7.1 Base Savings (R6.7): must be > 0; lowering and deleting are always allowed (the fund may then go below 0) */
export function S7_1_BaseSheet({ onClose }: { onClose: () => void }) {
  const d = useData();
  const update = useStore((s) => s.update);
  const updateWithUndo = useStore((s) => s.updateWithUndo);
  const editing = d.baseSavings !== null;
  const [v, setV] = useState<number | null>(d.baseSavings);
  return (
    <Sheet title="Số dư ban đầu" onClose={onClose}>
      <AmountBox label="Số tiền" accent="amber" value={v} onChange={setV} autoFocus={!editing} />
      <button className="btn pri after-fields" disabled={!v || v <= 0} onClick={() => {
        update((dd) => { dd.baseSavings = v; });
        onClose();
      }}>Lưu</button>
      {editing && (
        <button className="text-danger" onClick={() => {
          updateWithUndo('Đã xóa', (dd) => { dd.baseSavings = null; });
          onClose();
        }}>🗑 Xóa</button>
      )}
    </Sheet>
  );
}
