import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { CalendarIcon } from '../components/icons';
import { PeriodDates } from '../components/PeriodDates';
import { wealth } from '../domain/calc';
import { money } from '../domain/money';
import { useData } from '../state/store';

/** 3.0 Overview: R7.2 total wealth = savings fund + active period's Số dư, with shares when both are > 0 */
export function S3_0_Overview() {
  const nav = useNavigate();
  const d = useData();
  const w = wealth(d);
  return (
    <>
      <Header title="Tổng quan" onBack={() => nav('/')} />
      <div className="page">
        <div className="sum grad-violet">
          <div className="lbl">Tổng tài sản</div>
          <div className="sum-total">{money(w.total)}</div>
          {w.shares && (
            <div className="wbar">
              <i className="fund" style={{ width: `${w.shares[0]}%` }} />
              <i className="period" style={{ width: `${w.shares[1]}%` }} />
            </div>
          )}
        </div>

        <div className="sec-lbl">Tiết kiệm</div>
        <button className="mcard edge-amber" onClick={() => nav('/savings')}>
          <span className="mnum save-tile">🐷</span>
          <span className="body">
            <div className="name">Quỹ tiết kiệm</div>
            {w.shares && <div className="s">{w.shares[0]}%</div>}
          </span>
          <b className="big">{money(w.fund)}</b><span className="arr">›</span>
        </button>

        {w.period && (
          <>
            <div className="sec-lbl">Kỳ đang theo dõi</div>
            <button className="mcard edge-teal" onClick={() => nav(`/periods/${w.period!.id}/log`)}>
              <span className="mnum"><CalendarIcon /></span>
              <span className="body">
                <div className="name">{w.period.name}</div>
                <PeriodDates p={w.period} />
                <div className="s">Số dư{w.shares && ` · ${w.shares[1]}%`}</div>
              </span>
              <b className="big">{money(w.balance)}</b><span className="arr">›</span>
            </button>
          </>
        )}
      </div>
    </>
  );
}
