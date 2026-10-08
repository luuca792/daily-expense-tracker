import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { PencilIcon } from '../../components/icons';
import { useData } from '../../state/store';
import { S2_1_NameSheet } from './S2_1_NameSheet';

const HUBS = [
  { to: '/overview', cls: 'grad-violet', icon: '📊', title: 'Tổng quan' },
  { to: '/periods', cls: 'grad-teal', icon: '✏️', title: 'Ghi chép' },
  { to: '/savings', cls: 'grad-amber', icon: '🐷', title: 'Tiết kiệm' },
];

/** 2.0 Home: greeting with ✎ (→ 2.1), ⚙ (→ 6.0) and the three hubs */
export function S2_0_Home() {
  const nav = useNavigate();
  const d = useData();
  const [editing, setEditing] = useState(false);
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
        <div className="home-q">Bạn muốn làm gì?</div>
        {HUBS.map((h) => (
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
