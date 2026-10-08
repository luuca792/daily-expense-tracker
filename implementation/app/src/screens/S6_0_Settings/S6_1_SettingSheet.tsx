import { useState } from 'react';
import { AmountBox } from '../../components/AmountBox';
import { Sheet } from '../../components/Sheet';
import { Settings } from '../../domain/types';
import { useData, useStore } from '../../state/store';

/** 6.1 Edit Setting: one amount. Sinh hoạt maximum applies to new periods only (D62). */
export function S6_1_SettingSheet({ k, label, onClose }: { k: keyof Settings; label: string; onClose: () => void }) {
  const d = useData();
  const update = useStore((s) => s.update);
  const [v, setV] = useState<number | null>(d.settings[k]);
  return (
    <Sheet title={label} onClose={onClose}>
      <AmountBox label="Số tiền" value={v} onChange={setV} autoFocus />
      <button className="btn pri" disabled={v === null} onClick={() => {
        update((dd) => { dd.settings[k] = v!; });
        onClose();
      }}>Lưu</button>
    </Sheet>
  );
}
