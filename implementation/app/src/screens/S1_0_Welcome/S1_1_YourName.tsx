import { useState } from 'react';
import { cleanName, NAME_MAX } from '../../domain/types';
import { useStore } from '../../state/store';

/** 1.1 Your Name: replaces 2.0 and every other page whenever there is data but no name (plan §2.5).
 *  Tiếp tục is disabled while the cleaned name is empty. */
export function S1_1_YourName() {
  const update = useStore((s) => s.update);
  const [name, setName] = useState('');
  const clean = cleanName(name);
  const save = () => {
    if (clean) update((d) => { d.userName = clean; });
  };
  return (
    <div className="welcome">
      <div className="welcome-top">
        <div className="logo">👋</div>
        <div className="welcome-title sm">Xin chào! Bạn tên gì?</div>
      </div>
      <div className="welcome-field">
        <input
          className="input" autoFocus enterKeyHint="done" maxLength={NAME_MAX} value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') save(); }}
        />
      </div>
      <div className="welcome-fill" />
      <div className="welcome-foot">
        <button className="btn pri" disabled={!clean} onClick={save}>Tiếp tục</button>
      </div>
    </div>
  );
}
