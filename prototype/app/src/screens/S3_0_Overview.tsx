import { useNavigate } from 'react-router-dom';
import { CalendarIcon, Header } from '../components/ui';
import { wealth } from '../domain/calc';
import { money } from '../domain/format';
import { useData } from '../store/store';
import { PeriodDates } from './S4_0_Periods';

export function S3_0_Overview() {
  const nav = useNavigate();
  const d = useData();
  const w = wealth(d); // R7.2
  return (
    <>
      <Header title="Tổng quan" onBack={() => nav('/')} />
      <div className="page">
        <div className="sum grad-violet">
          <div className="lbl" style={{ color: '#ffffffd9' }}>Tổng tài sản</div>
          <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.15 }}>{money(w.total)}</div>
          {w.shares && (
            <div className="wbar">
              <i style={{ width: `${w.shares[0]}%`, background: '#fbbf24' }} />
              <i style={{ width: `${w.shares[1]}%`, background: '#2dd4bf' }} />
            </div>
          )}
        </div>

        <div className="sec-lbl">Tiết kiệm</div>
        <button className="mcard" style={{ borderLeft: '5px solid #f59e0b' }} onClick={() => nav('/savings')}>
          <span className="mnum save-tile">🐷</span>
          <span className="body">
            <div className="name">Quỹ tiết kiệm</div>
            {w.shares && <div className="s">{w.shares[0]}%</div>}
          </span>
          <b style={{ fontSize: 16 }}>{money(w.fund)}</b><span className="arr">›</span>
        </button>

        {w.period && (
          <>
            <div className="sec-lbl">Kỳ đang theo dõi</div>
            <button className="mcard" style={{ borderLeft: '5px solid #14b8a6' }} onClick={() => nav(`/p/${w.period!.id}/log`)}>
              <span className="mnum"><CalendarIcon /></span>
              <span className="body">
                <div className="name">{w.period.name}</div>
                <PeriodDates p={w.period} />
                <div className="s">Số dư{w.shares && ` · ${w.shares[1]}%`}</div>
              </span>
              <b style={{ fontSize: 16 }}>{money(w.balance)}</b><span className="arr">›</span>
            </button>
          </>
        )}
      </div>
    </>
  );
}
