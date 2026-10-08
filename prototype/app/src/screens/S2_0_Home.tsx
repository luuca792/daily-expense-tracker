import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, PencilIcon, Sheet } from '../components/ui';
import { cleanName, NAME_MAX } from '../domain/types';
import { useData, useStore } from '../store/store';

export function S2_0_Home() {
  const nav = useNavigate();
  const d = useData();
  const [editing, setEditing] = useState(false);
  const hubs = [
    { to: '/overview', cls: 'grad-violet', icon: '📊', title: 'Tổng quan' },
    { to: '/periods', cls: 'grad-teal', icon: '✏️', title: 'Ghi chép' },
    { to: '/savings', cls: 'grad-amber', icon: '🐷', title: 'Tiết kiệm' },
  ];
  return (
    <>
      <Header
        title={
          <span className="hello">
            <span className="nm">Xin chào, {d.userName} 👋</span>
            <button className="pen" onClick={() => setEditing(true)} aria-label="Đổi tên"><PencilIcon /></button>
          </span>
        }
        right={<button className="icon-btn" onClick={() => nav('/settings')} aria-label="Cài đặt">⚙</button>}
      />
      <div className="page stagger">
        <div style={{ fontSize: 20, fontWeight: 700, margin: '4px 0 16px' }}>Bạn muốn làm gì?</div>
        {hubs.map((h) => (
          <button key={h.to} className={`hub ${h.cls}`} onClick={() => nav(h.to)}>
            <span className="hub-ic">{h.icon}</span>
            <span className="hub-t">{h.title}</span>
            <span className="hub-go">›</span>
          </button>
        ))}
      </div>
      {editing && <S2_1_NameSheet onClose={() => setEditing(false)} />}
    </>
  );
}

/** 2.1 Edit Name: an empty name saves nothing and the old name stays */
function S2_1_NameSheet({ onClose }: { onClose: () => void }) {
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
        onKeyDown={(e) => { if (e.key === 'Enter') save(); }}
      />
      <button className="btn pri" style={{ marginTop: 12 }} onClick={save}>Lưu</button>
    </Sheet>
  );
}
