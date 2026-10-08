import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { fmtDate } from '../../domain/dates';
import { money } from '../../domain/money';
import { fundBalance, fundIn, fundOut, transferHistory } from '../../domain/savings';
import { useData, useStore } from '../../state/store';
import { S7_1_BaseSheet } from './S7_1_BaseSheet';

/** 7.0 Savings: fund card (Gửi / Rút totals), Số dư ban đầu button while there is none,
 *  every transfer newest first (R6.2), and the base at the bottom */
export function S7_0_Savings() {
  const nav = useNavigate();
  const d = useData();
  const setToggle = useStore((s) => s.setToggle);
  const [baseSheet, setBaseSheet] = useState(false);

  return (
    <>
      <Header title="Tiết kiệm" onBack={() => nav('/')} />
      <div className="page">
        <div className="sumc grad-amber amber-shadow">
          <div>
            <div className="lbl on-grad">Quỹ tiết kiệm</div>
            <div className="big">{money(fundBalance(d))}</div>
          </div>
          <div className="right">
            <div>Gửi <b>+{money(fundIn(d))}</b></div>
            <div>Rút <b>−{money(fundOut(d))}</b></div>
          </div>
        </div>

        {d.baseSavings === null && (
          <button className="basebtn" onClick={() => setBaseSheet(true)}>
            <span className="pig">🏦</span><b className="grow">Số dư ban đầu</b><span className="go">＋</span>
          </button>
        )}

        {transferHistory(d).map(({ t, p }) => (
          <button key={t.id} className="mcard" onClick={() => {
            setToggle(p.id, 'inc'); // R6.5: opens the period on Thu nhập, where the transfer is
            nav(`/periods/${p.id}/log`);
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
            <span className="arr hidden">›</span>
          </button>
        )}
      </div>
      {baseSheet && <S7_1_BaseSheet onClose={() => setBaseSheet(false)} />}
    </>
  );
}
