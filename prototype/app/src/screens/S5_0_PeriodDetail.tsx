import { useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useGhostExit } from '../components/motion';
import { AnimMoney, Dialog, Header } from '../components/ui';
import { chi, conLai, fundWithoutPeriod, fundBalance, removalAllowed, soDu, thu } from '../domain/calc';
import { headerDates, signed } from '../domain/format';
import { findPeriod } from '../domain/periods';
import { Period } from '../domain/types';
import { useData, useStore } from '../store/store';
import { S4_1_PeriodSheet } from './S4_1_PeriodSheet';
import { S5_1_Logging } from './S5_1_Logging';
import { S5_2_Goals } from './S5_2_Goals';
import { S5_3_Statistics } from './S5_3_Statistics';
import { S5_4_ExpenseSheet } from './S5_4_ExpenseSheet';
import { S5_6_GoalSheet } from './S5_6_GoalSheet';
import { S5_9_IncomeSheet } from './S5_9_IncomeSheet';
import { S5_10_TransferSheet } from './S5_10_TransferSheet';

export type SheetState =
  | { k: 'expense'; id?: string }
  | { k: 'income'; id?: string }
  | { k: 'transfer'; id?: string }
  | { k: 'goal'; id?: string } // id 'living' = Sinh hoạt mode, none = create mode
  | { k: 'edit-period' }
  | { k: 'delete-period' };

const TABS = [
  { key: 'log', icon: '📝', label: 'Ghi chép' },
  { key: 'goals', icon: '🎯', label: 'Mục tiêu' },
  { key: 'stats', icon: '📊', label: 'Thống kê' },
] as const;

export function SummaryCard({ p }: { p: Period }) {
  return (
    <div className="sumc grad-teal">
      <div>
        <div className="lbl" style={{ color: '#ffffffcc' }}>Còn lại</div>
        <div className="big"><AnimMoney value={conLai(p)} /></div>
        <div className="bal">Số dư <AnimMoney value={soDu(p)} /></div>
      </div>
      <div className="right">
        <div>Thu <b><AnimMoney value={thu(p)} fmt={signed} /></b></div>
        <div>Chi <b>−<AnimMoney value={chi(p)} /></b></div>
      </div>
    </div>
  );
}

export function S5_0_PeriodDetail() {
  const { id, tab = 'log' } = useParams();
  const nav = useNavigate();
  const d = useData();
  const p = findPeriod(d, id);
  const toggle = useStore((s) => (id ? s.toggles[id] : undefined) ?? 'exp');
  const [sheet, setSheet] = useState<SheetState | null>(null);
  const [menu, setMenu] = useState(false);
  // tab content slides toward the side of the tab that was tapped
  const tabIdx = TABS.findIndex((t) => t.key === tab);
  const lastTab = useRef({ idx: tabIdx, dir: '' });
  if (lastTab.current.idx !== tabIdx) lastTab.current = { idx: tabIdx, dir: tabIdx > lastTab.current.idx ? 'from-r' : 'from-l' };
  if (!p) return <Navigate to="/periods" replace />;

  const dates = headerDates(p.start, p.end);
  const close = () => setSheet(null);

  // R5: the ＋ action depends on the tab and the toggle
  const plus = tab === 'log' ? () => setSheet({ k: toggle === 'exp' ? 'expense' : 'income' })
    : tab === 'goals' ? () => setSheet({ k: 'goal' }) : null;

  return (
    <>
      <Header
        // back returns to wherever 5.0 was opened from (4.0, 3.0, 7.0); opened directly (refresh, link: no earlier in-app entry, history idx 0) → 4.0
        onBack={() => (window.history.state?.idx > 0 ? nav(-1) : nav('/periods'))}
        title={p.name}
        sub={<>{dates.text}{dates.open && <i>chưa kết thúc</i>}</>}
        right={
          <div className="hd-actions">
            <button className="icon-btn" onClick={() => setMenu(true)} aria-label="Thêm">⋯</button>
            <button className="icon-btn" onClick={() => nav('/settings')} aria-label="Cài đặt">⚙</button>
            {menu && (
              <>
                <div className="menu-catch" onClick={() => setMenu(false)} />
                <div className="menu">
                  <button onClick={() => { setMenu(false); setSheet({ k: 'edit-period' }); }}>Sửa kỳ</button>
                  <button className="red" onClick={() => { setMenu(false); setSheet({ k: 'delete-period' }); }}>Xóa kỳ</button>
                </div>
              </>
            )}
          </div>
        }
      />
      <div className="page with-bar">
        <SummaryCard p={p} />
        <div key={tab} className={`tab-in ${lastTab.current.dir}`}>
          {tab === 'log' && <S5_1_Logging p={p} toggle={toggle} open={setSheet} />}
          {tab === 'goals' && <S5_2_Goals p={p} open={setSheet} />}
          {tab === 'stats' && <S5_3_Statistics p={p} />}
        </div>
      </div>

      {plus && <Fab onClick={plus} />}
      <nav className="tabbar fixed-col">
        {TABS.map((t) => (
          <button key={t.key} className={tab === t.key ? 'on' : ''} onClick={() => nav(`/p/${p.id}/${t.key}`, { replace: true })}>
            <i>{t.icon}</i>{t.label}
          </button>
        ))}
      </nav>

      {sheet?.k === 'expense' && <S5_4_ExpenseSheet p={p} id={sheet.id} onClose={close} />}
      {sheet?.k === 'income' && <S5_9_IncomeSheet p={p} id={sheet.id} onClose={close} />}
      {sheet?.k === 'transfer' && <S5_10_TransferSheet p={p} id={sheet.id} onClose={close} />}
      {sheet?.k === 'goal' && <S5_6_GoalSheet p={p} id={sheet.id} onClose={close} />}
      {sheet?.k === 'edit-period' && (
        <S4_1_PeriodSheet period={p} onClose={close} onDelete={() => setSheet({ k: 'delete-period' })} />
      )}
      {sheet?.k === 'delete-period' && <S4_2_DeletePeriod p={p} onClose={close} />}
    </>
  );
}

function Fab({ onClick }: { onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useGhostExit(ref);
  return <div ref={ref} className="fab-wrap fixed-col"><button className="fab" onClick={onClick} aria-label="Thêm">＋</button></div>;
}

/** 4.2 Delete Period: confirmation + undo (D61); refused if the fund would go below 0 (R6.6) */
function S4_2_DeletePeriod({ p, onClose }: { p: Period; onClose: () => void }) {
  const d = useData();
  const nav = useNavigate();
  const updateWithUndo = useStore((s) => s.updateWithUndo);
  const allowed = removalAllowed(fundWithoutPeriod(d, p.id), fundBalance(d));
  return (
    <Dialog onClose={onClose}>
      <div className="ic">🗑</div>
      <div className="title">Xóa kỳ “{p.name}”?</div>
      {!allowed && <div className="err" style={{ textAlign: 'center', marginTop: 8 }}>Vượt quá quỹ tiết kiệm</div>}
      <div className="btn-row">
        <button className="btn" onClick={onClose}>Hủy</button>
        <button className="btn danger" disabled={!allowed} onClick={() => {
          nav('/periods', { replace: true });
          updateWithUndo('Đã xóa kỳ', (dd) => { dd.periods = dd.periods.filter((x) => x.id !== p.id); });
        }}>Xóa</button>
      </div>
    </Dialog>
  );
}
