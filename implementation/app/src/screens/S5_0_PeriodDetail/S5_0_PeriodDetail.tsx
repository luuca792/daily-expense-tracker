import { useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AnimMoney } from '../../components/AnimMoney';
import { BottomBar } from '../../components/BottomBar';
import { Header } from '../../components/Header';
import { PlusButton } from '../../components/PlusButton';
import { useBack } from '../../components/useBack';
import { chi, conLai, isReadOnly, soDu, thu } from '../../domain/calc';
import { headerDates } from '../../domain/dates';
import { signed } from '../../domain/money';
import { findPeriod } from '../../domain/periods';
import { Period } from '../../domain/types';
import { PERIOD_TABS, PeriodTab } from '../../routes';
import { useData, useStore } from '../../state/store';
import { S4_1_PeriodSheet } from '../S4_0_Periods/S4_1_PeriodSheet';
import { S4_2_DeletePeriod } from '../S4_0_Periods/S4_2_DeletePeriod';
import { S5_10_TransferSheet } from './S5_10_TransferSheet';
import { S5_1_Logging } from './S5_1_Logging';
import { S5_2_Goals } from './S5_2_Goals';
import { S5_3_Statistics } from './S5_3_Statistics';
import { S5_4_ExpenseSheet } from './S5_4_ExpenseSheet';
import { S5_6_GoalSheet } from './S5_6_GoalSheet';
import { S5_9_IncomeSheet } from './S5_9_IncomeSheet';

/** Which sheet or dialog is open over 5.0 */
export type SheetState =
  | { k: 'expense'; id?: string }
  | { k: 'income'; id?: string }
  | { k: 'transfer'; id?: string }
  | { k: 'goal'; id?: string } // id 'living' = Sinh hoạt mode, none = create mode
  | { k: 'edit-period' }
  | { k: 'delete-period' };

const TABS: readonly { key: PeriodTab; icon: string; label: string }[] = [
  { key: 'log', icon: '📝', label: 'Ghi chép' },
  { key: 'goals', icon: '🎯', label: 'Mục tiêu' },
  { key: 'stats', icon: '📊', label: 'Thống kê' },
];

/** R4 summary: Còn lại (big), Số dư, Thu, Chi */
function SummaryCard({ p }: { p: Period }) {
  return (
    <div className="sumc grad-teal">
      <div>
        <div className="lbl on-grad">Còn lại</div>
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

/** 5.0 Period Detail: summary card, the current tab, ＋ and the bottom bar. Tabs share one page (no page slide). */
export function S5_0_PeriodDetail() {
  const { id, tab } = useParams();
  const nav = useNavigate();
  // back returns to wherever 5.0 was opened from (4.0, 3.0, 7.0); opened directly → 4.0
  const back = useBack('/periods');
  const d = useData();
  const p = findPeriod(d, id);
  const toggle = useStore((s) => (id ? s.toggles[id] : undefined) ?? 'exp');
  const [sheet, setSheet] = useState<SheetState | null>(null);
  const [menu, setMenu] = useState(false);
  // tab content slides toward the side of the tab that was tapped
  const tabIdx = TABS.findIndex((t) => t.key === tab);
  const lastTab = useRef({ idx: tabIdx, dir: '' });
  if (lastTab.current.idx !== tabIdx) lastTab.current = { idx: tabIdx, dir: tabIdx > lastTab.current.idx ? 'from-r' : 'from-l' };

  // Period gone (deleted, also in another tab) → 4.0; unknown tab → Ghi chép
  if (!p) return <Navigate to="/periods" replace />;
  if (!PERIOD_TABS.includes(tab as PeriodTab)) return <Navigate to={`/periods/${p.id}/log`} replace />;

  const dates = headerDates(p.start, p.end);
  const close = () => setSheet(null);
  // Plan §2.5: only the active period can be changed; older periods are history: no ＋, no Gửi tiết kiệm,
  // entries and goals can't be opened, no Sửa kỳ. Xóa kỳ stays.
  const readOnly = isReadOnly(d, p);

  // R5: the ＋ action depends on the tab and the 5.1 toggle; none on Thống kê
  const plus = readOnly ? null : tab === 'log' ? () => setSheet({ k: toggle === 'exp' ? 'expense' : 'income' })
    : tab === 'goals' ? () => setSheet({ k: 'goal' }) : null;

  return (
    <>
      <Header
        onBack={back}
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
                  {!readOnly && <button onClick={() => { setMenu(false); setSheet({ k: 'edit-period' }); }}>Sửa kỳ</button>}
                  <button className="red" onClick={() => { setMenu(false); setSheet({ k: 'delete-period' }); }}>Xóa kỳ</button>
                </div>
              </>
            )}
          </div>
        }
      />
      <div className="page with-bar">
        <SummaryCard p={p} />
        <div key={tab} className={`tab-in ${lastTab.current.dir}${readOnly ? ' ro' : ''}`}>
          {tab === 'log' && <S5_1_Logging p={p} toggle={toggle} open={setSheet} readOnly={readOnly} />}
          {tab === 'goals' && <S5_2_Goals p={p} open={setSheet} />}
          {tab === 'stats' && <S5_3_Statistics p={p} />}
        </div>
      </div>

      {plus && <PlusButton onClick={plus} />}
      <BottomBar tabs={TABS} current={tab as PeriodTab} onSelect={(k) => nav(`/periods/${p.id}/${k}`, { replace: true })} />

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
