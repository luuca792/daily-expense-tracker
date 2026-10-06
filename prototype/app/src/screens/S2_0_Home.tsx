import { useNavigate } from 'react-router-dom';
import { Header } from '../components/ui';

export function S2_0_Home() {
  const nav = useNavigate();
  const hubs = [
    { to: '/overview', cls: 'grad-violet', icon: '📊', title: 'Tổng quan' },
    { to: '/periods', cls: 'grad-teal', icon: '✏️', title: 'Ghi chép' },
    { to: '/savings', cls: 'grad-amber', icon: '🐷', title: 'Tiết kiệm' },
  ];
  return (
    <>
      <Header title="Xin chào 👋" right={<button className="icon-btn" onClick={() => nav('/settings')} aria-label="Cài đặt">⚙</button>} />
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
    </>
  );
}
