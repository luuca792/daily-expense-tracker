import { useState } from 'react';
import { cleanName, NAME_MAX } from '../domain/types';
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

/** 1.1 Your Name: shown instead of 2.0 whenever there is data but no display name (the first start) */
export function S1_1_YourName() {
  const update = useStore((s) => s.update);
  const [name, setName] = useState('');
  const clean = cleanName(name);
  const save = () => { if (clean) update((d) => { d.userName = clean; }); };
  return (
    <div className="welcome">
      <div className="welcome-top">
        <div className="logo">👋</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginTop: 14 }}>Xin chào! Bạn tên gì?</div>
      </div>
      <div style={{ padding: '28px 24px 0' }}>
        <input
          className="input" autoFocus enterKeyHint="done" maxLength={NAME_MAX} value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') save(); }}
        />
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ padding: '0 24px 32px' }}>
        <button className="btn pri" disabled={!clean} onClick={save}>Tiếp tục</button>
      </div>
    </div>
  );
}
