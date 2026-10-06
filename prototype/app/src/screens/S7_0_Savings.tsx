import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AmountBox, Header, Sheet } from '../components/ui';
import { fundBalance, fundIn, fundOut } from '../domain/calc';
import { fmtDate, money } from '../domain/format';
import { useData, useStore } from '../store/store';

export function S7_0_Savings() {
  const nav = useNavigate();
  const d = useData();
  const setToggle = useStore((s) => s.setToggle);
  const [baseSheet, setBaseSheet] = useState(false);

  // R6.2: newest date first; same date → most recently added first
  const rows = d.periods
    .flatMap((p) => p.transfers.map((t) => ({ t, p })))
    .sort((a, b) => (a.t.date !== b.t.date ? (a.t.date < b.t.date ? 1 : -1) : b.t.createdAt - a.t.createdAt));

  return (
    <>
      <Header title="Tiết kiệm" onBack={() => nav('/')} />
      <div className="page">
        <div className="sumc grad-amber" style={{ boxShadow: '0 6px 14px #f59e0b40' }}>
          <div>
            <div className="lbl" style={{ color: '#ffffffd9' }}>Quỹ tiết kiệm</div>
            <div className="big">{money(fundBalance(d))}</div>
          </div>
          <div className="right">
            <div>Gửi <b>+{money(fundIn(d))}</b></div>
            <div>Rút <b>−{money(fundOut(d))}</b></div>
          </div>
        </div>

        {d.baseSavings === null && (
          <button className="basebtn" onClick={() => setBaseSheet(true)}>
            <span className="pig">🏦</span><b style={{ flex: 1 }}>Số dư ban đầu</b><span className="go">＋</span>
          </button>
        )}

        {rows.map(({ t, p }) => (
          <button key={t.id} className="mcard" onClick={() => {
            setToggle(p.id, 'inc'); // R6.5
            nav(`/p/${p.id}/log`);
          }}>
            <span className="mnum save-tile">{t.dir === 'in' ? '📥' : '📤'}</span>
            <span className="body">
              <div className="name">{p.name}</div>
              <div className="s">{fmtDate(t.date)} · {t.dir === 'in' ? 'Gửi vào' : 'Rút ra'}</div>
            </span>
            {t.dir === 'in' ? <b className="inc">+{money(t.amount)}</b> : <b>−{money(t.amount)}</b>}
            <span className="arr">›</span>
          </button>
        ))}

        {d.baseSavings !== null && (
          <button className="mcard base" onClick={() => setBaseSheet(true)}>
            <span className="mnum save-tile">🏦</span>
            <span className="body"><div className="name">Số dư ban đầu</div></span>
            <b className="inc">+{money(d.baseSavings)}</b>
            <span className="arr" style={{ visibility: 'hidden' }}>›</span>
          </button>
        )}
      </div>
      {baseSheet && <S7_1_BaseSheet onClose={() => setBaseSheet(false)} />}
    </>
  );
}

/** 7.1 Base Savings (R6.7): delete and lower are always allowed */
function S7_1_BaseSheet({ onClose }: { onClose: () => void }) {
  const d = useData();
  const update = useStore((s) => s.update);
  const updateWithUndo = useStore((s) => s.updateWithUndo);
  const editing = d.baseSavings !== null;
  const [v, setV] = useState<number | null>(d.baseSavings);
  return (
    <Sheet title="Số dư ban đầu" onClose={onClose}>
      <AmountBox label="Số tiền" accent="amber" value={v} onChange={setV} autoFocus={!editing} />
      <button className="btn pri" style={{ marginTop: 12 }} disabled={!v || v <= 0} onClick={() => { update((dd) => { dd.baseSavings = v; }); onClose(); }}>Lưu</button>
      {editing && (
        <button className="text-danger" onClick={() => { updateWithUndo('Đã xóa', (dd) => { dd.baseSavings = null; }); onClose(); }}>🗑 Xóa</button>
      )}
    </Sheet>
  );
}
