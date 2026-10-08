import { useStore } from '../../state/store';

/** 1.0 Welcome: shown while nothing is stored. Bắt đầu mới saves empty data → 1.1. */
export function S1_0_Welcome() {
  const start = useStore((s) => s.start);
  return (
    <div className="welcome">
      <div className="welcome-top">
        <div className="logo">₫</div>
        <div className="welcome-title">Sổ chi tiêu</div>
      </div>
      <div className="welcome-fill" />
      <div className="welcome-foot">
        <button className="btn pri" onClick={start}>Bắt đầu mới</button>
      </div>
    </div>
  );
}
