import { useStore } from '../store/store';

export function S1_0_Welcome() {
  const start = useStore((s) => s.start);
  return (
    <div className="welcome">
      <div className="welcome-top">
        <div className="logo">₫</div>
        <div style={{ fontSize: 24, fontWeight: 800, marginTop: 14 }}>Sổ chi tiêu</div>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ padding: '0 24px 32px' }}>
        <button className="btn pri" onClick={start}>Bắt đầu mới</button>
      </div>
    </div>
  );
}
