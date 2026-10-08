import { useState } from 'react';
import { Sheet } from '../../components/Sheet';
import { cleanName, NAME_MAX } from '../../domain/types';
import { useData, useStore } from '../../state/store';

/** 2.1 Edit Name: saving an empty name changes nothing; an unchanged name isn't saved again */
export function S2_1_NameSheet({ onClose }: { onClose: () => void }) {
  const d = useData();
  const update = useStore((s) => s.update);
  const [name, setName] = useState(d.userName ?? '');
  const save = () => {
    const clean = cleanName(name);
    if (clean && clean !== d.userName) update((dd) => { dd.userName = clean; });
    onClose();
  };
  return (
    <Sheet title="Đổi tên" onClose={onClose}>
      <input
        className="input" autoFocus enterKeyHint="done" maxLength={NAME_MAX} value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="btn pri after-input" onClick={save}>Lưu</button>
    </Sheet>
  );
}
