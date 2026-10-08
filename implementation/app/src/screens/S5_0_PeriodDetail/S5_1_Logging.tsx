import { useNewIds } from '../../components/motion';
import { DayBox, ExpenseRow, IncomeRow, TransferRow } from '../../components/EntryRow';
import { groupByDay } from '../../domain/entries';
import { money } from '../../domain/money';
import { fundBalance } from '../../domain/savings';
import { Income, Period, Transfer } from '../../domain/types';
import { useData, useStore } from '../../state/store';
import type { SheetState } from './S5_0_PeriodDetail';

/** 5.1 Logging: Chi tiêu / Thu nhập toggle (remembered per period while the app is open, R5), entries by day (R3.3).
 *  Thu nhập lists incomes and savings transfers together; Gửi tiết kiệm on top (active period only). */
export function S5_1_Logging({ p, toggle, open, readOnly }: {
  p: Period; toggle: 'exp' | 'inc'; open: (s: SheetState) => void; readOnly: boolean;
}) {
  const d = useData();
  const setToggle = useStore((s) => s.setToggle);
  const large = d.settings.largeFrom;
  const incomeItems: (Income | Transfer)[] = [...p.incomes, ...p.transfers];
  // a just-saved entry flashes once
  const fresh = useNewIds([...p.expenses, ...incomeItems].map((x) => x.id));

  return (
    <>
      <div className={`seg ${toggle === 'inc' ? 'second' : ''}`}>
        <button className={toggle === 'exp' ? 'on' : ''} onClick={() => setToggle(p.id, 'exp')}>Chi tiêu ({p.expenses.length})</button>
        <button className={toggle === 'inc' ? 'on' : ''} onClick={() => setToggle(p.id, 'inc')}>Thu nhập ({incomeItems.length})</button>
      </div>

      <div key={toggle} className="stagger">
        {toggle === 'inc' && !readOnly && (
          <button className="savebtn" onClick={() => open({ k: 'transfer' })}>
            <span className="pig">🐷</span>
            <span className="grow"><div className="t1">Gửi tiết kiệm</div><div className="t2">Quỹ {money(fundBalance(d))}</div></span>
            <span className="go">＋</span>
          </button>
        )}

        {toggle === 'exp' && groupByDay(p.expenses).map((g) => (
          <DayBox key={g.date} date={g.date}>
            {g.items.map((e) => (
              <ExpenseRow key={e.id} p={p} e={e} large={large} fresh={fresh.has(e.id)} onClick={() => open({ k: 'expense', id: e.id })} />
            ))}
          </DayBox>
        ))}

        {toggle === 'inc' && groupByDay(incomeItems).map((g) => (
          <DayBox key={g.date} date={g.date}>
            {g.items.map((it) => 'dir' in it
              ? <TransferRow key={it.id} t={it} fresh={fresh.has(it.id)} onClick={() => open({ k: 'transfer', id: it.id })} />
              : <IncomeRow key={it.id} i={it} fresh={fresh.has(it.id)} onClick={() => open({ k: 'income', id: it.id })} />)}
          </DayBox>
        ))}
      </div>
    </>
  );
}
