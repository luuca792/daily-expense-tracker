import { useNewIds } from '../components/motion';
import { fundBalance } from '../domain/calc';
import { dayLabel, groupByDay } from '../domain/entries';
import { minus, money, signed } from '../domain/format';
import { PALETTE } from '../domain/palette';
import { Expense, Income, LIVING, Period, Transfer } from '../domain/types';
import { useData, useStore } from '../store/store';
import type { SheetState } from './S5_0_PeriodDetail';

/** Category name and color of an expense (null = untracked) */
export function categoryOf(p: Period, category: string | null) {
  if (category === null) return null;
  if (category === LIVING) return { name: 'Sinh hoạt', icon: p.living.icon, color: p.living.color };
  const g = p.goals.find((x) => x.id === category);
  return g ? { name: g.name, icon: g.icon, color: g.color } : null;
}

export function S5_1_Logging({ p, toggle, open }: { p: Period; toggle: 'exp' | 'inc'; open: (s: SheetState) => void }) {
  const d = useData();
  const setToggle = useStore((s) => s.setToggle);
  const large = d.settings.largeFrom;
  const incomeItems: (Income | (Transfer & { t: true }))[] = [...p.incomes, ...p.transfers.map((t) => ({ ...t, t: true as const }))];
  const fresh = useNewIds([...p.expenses, ...incomeItems].map((x) => x.id));
  const nw = (id: string) => (fresh.has(id) ? ' new' : '');

  return (
    <>
      <div className={`seg ${toggle === 'inc' ? 'second' : ''}`}>
        <button className={toggle === 'exp' ? 'on' : ''} onClick={() => setToggle(p.id, 'exp')}>Chi tiêu ({p.expenses.length})</button>
        <button className={toggle === 'inc' ? 'on' : ''} onClick={() => setToggle(p.id, 'inc')}>Thu nhập ({incomeItems.length})</button>
      </div>

      <div key={toggle} className="stagger">
      {toggle === 'inc' && (
        <button className="savebtn" onClick={() => open({ k: 'transfer' })}>
          <span className="pig">🐷</span>
          <span style={{ flex: 1 }}><div className="t1">Gửi tiết kiệm</div><div className="t2">Quỹ {money(fundBalance(d))}</div></span>
          <span className="go">＋</span>
        </button>
      )}

      {toggle === 'exp' &&
        groupByDay(p.expenses).map((g) => (
          <div className="daybox" key={g.date}>
            <div className="day">{dayLabel(g.date)}</div>
            {g.items.map((e) => <ExpenseRow key={e.id} p={p} e={e} large={large} fresh={fresh.has(e.id)} onClick={() => open({ k: 'expense', id: e.id })} />)}
          </div>
        ))}

      {toggle === 'inc' &&
        groupByDay(incomeItems).map((g) => (
          <div className="daybox" key={g.date}>
            <div className="day">{dayLabel(g.date)}</div>
            {g.items.map((it) =>
              'dir' in it ? (
                <button key={it.id} className={`it c-save${nw(it.id)}`} onClick={() => open({ k: 'transfer', id: it.id })}>
                  <span className="d">{it.dir === 'in' ? 'Gửi tiết kiệm' : 'Rút tiết kiệm'}</span>
                  <b>{it.dir === 'in' ? minus(it.amount) : signed(it.amount)}</b>
                </button>
              ) : (
                <button key={it.id} className={`it c-inc${nw(it.id)}`} onClick={() => open({ k: 'income', id: it.id })}>
                  <span className="d">{it.description}</span><b>{signed(it.amount)}</b>
                </button>
              ),
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function ExpenseRow({ p, e, large, fresh, onClick }: { p: Period; e: Expense; large: number; fresh: boolean; onClick: () => void }) {
  const nw = fresh ? ' new' : '';
  const cat = categoryOf(p, e.category);
  const hi = e.amount >= large; // R3.4
  if (!cat) {
    return (
      <button className={`it none${nw}`} onClick={onClick}>
        <span className="d">Không danh mục</span><b className={hi ? 'hi' : ''}>{minus(e.amount)}</b>
      </button>
    );
  }
  const c = PALETTE[cat.color];
  return (
    <button className={`it${nw}`} style={{ background: c.bg }} onClick={onClick}>
      <span className="d">{e.description}</span>
      <span className="tag" style={{ color: c.text }}>{cat.name}</span>
      <b className={hi ? 'hi' : ''}>{minus(e.amount)}</b>
    </button>
  );
}
