import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AmountBox, Header, Sheet } from '../components/ui';
import { money } from '../domain/format';
import { Settings } from '../domain/types';
import { useData, useStore } from '../store/store';

const ROWS: { section: string; key: keyof Settings; label: string }[] = [
  { section: '🍜 Sinh hoạt', key: 'livingMax', label: 'Mức sinh hoạt tối đa mong đợi' },
  { section: '⚠️ Cảnh báo', key: 'largeFrom', label: 'Tô màu khoản chi lớn từ' },
];

export function S6_0_Settings() {
  const nav = useNavigate();
  const d = useData();
  const [editing, setEditing] = useState<keyof Settings | null>(null);
  return (
    <>
      <Header title="Cài đặt" onBack={() => nav(-1)} />
      <div className="page">
        {ROWS.map((r) => (
          <div key={r.key}>
            <div className="set-sec">{r.section}</div>
            <div className="set">
              <button onClick={() => setEditing(r.key)}><span>{r.label}</span><span className="val">{money(d.settings[r.key])} ›</span></button>
            </div>
          </div>
        ))}
      </div>
      {editing && <S6_1_SettingSheet k={editing} label={ROWS.find((r) => r.key === editing)!.label} onClose={() => setEditing(null)} />}
    </>
  );
}

/** 6.1 Edit Setting */
function S6_1_SettingSheet({ k, label, onClose }: { k: keyof Settings; label: string; onClose: () => void }) {
  const d = useData();
  const update = useStore((s) => s.update);
  const [v, setV] = useState<number | null>(d.settings[k]);
  return (
    <Sheet title={label} onClose={onClose}>
      <AmountBox label="Số tiền" value={v} onChange={setV} autoFocus />
      <button className="btn pri" disabled={v === null} onClick={() => { update((dd) => { dd.settings[k] = v!; }); onClose(); }}>Lưu</button>
    </Sheet>
  );
}
